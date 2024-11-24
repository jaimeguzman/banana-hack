# app/utils.py
import io
import logging
import os
import re

import openai
import PyPDF2
from dotenv import load_dotenv
from fastapi import HTTPException
from supabase import Client, create_client

from matcher_algo import calculate_match_score
from prompts.extract_client import extract_client
from prompts.extract_interests import extract_interests
from prompts.extract_movements import extract_movements
from prompts.extract_product import extract_product

# Cargar las variables desde el archivo .env
load_dotenv()

# Configuración del logger
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


# Configuración de OpenAI y Supabase
openai.api_key = os.getenv("OPENAI_API_KEY")
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

"""
Extrae información estructurada de un archivo PDF de CV.

Args:
file_content (bytes): Contenido del archivo PDF en bytes.

Returns:
dict: Diccionario con la información extraída del CV.
"""


def extract_bank_document(file_content: bytes) -> dict:
    try:
        # Extraer texto del PDF
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = "".join(page.extract_text() for page in pdf_reader.pages)

        print("\n" + "=" * 50)
        print("TEXTO EXTRAÍDO DEL PDF:")
        print("-" * 50)
        print(text[:1000] + "...")  # Primeros 500 caracteres
        print("=" * 50 + "\n")

        # Prompt para OpenAI
        system_prompt = """
            eres experto analizando finanzas.
            vas a extraer desde un pdf, un estado de cuenta de la tarjeta de credito.

            necesito que analices todos los movimientos asociados a una transacción.
            vas a extraer 3 campos. fechas, el nombre de la transaccion (descripcion) y el monto de la transaccion (cargos).

            luego, vas a clasificar las descripciones en categorias como titulo principal y vas a sumar todos los movimientos asociados. 

            por ejemplo, si en el archivo encuentras: shell, copec, petrobras, aramco o similares, tendras que crear la categoria "combustible" y sumar todos los montos de las bencineras. 

            otro ejemplo, si aparece uber, cabify, didi o similares, tendrás que crear la categoria "movilidad" y sumar todas las transacciones asociadas. 

            y así con todas las categorias que encuentres. las más comunes son: supermercados, restaurantes, movilidad, combustible, entretenimiento, salud. considera otras relevantes.

            Responde en formato JSON con las siguientes keys:
            {
            "json1": {
                "id": 1,
                "nombre": "JSON 1",
                "datos": {
                "prop1": "valor1",
                "prop2": "valor2"
                }
            },
            "json2": {
                "id": 2,
                "nombre": "JSON 2",
                "datos": {
                "prop1": "valorA",
                "prop2": "valorB"
                }
            },
            "json3": {
                "id": 3,
                "nombre": "JSON 3",
                "datos": {
                "prop1": "valorX",
                "prop2": "valorY"
                }
            }
            }
            donde json1 es para identificar toda la información de cliente, json información del producto como : fecha_estado_cuenta, pagar_hasta, total_facturado, minimo_pagar, cupo total, cupo utilizado, cupo disponible, tasas interes_vigente rotativo, tasas interes_vigente compra_en_cuotas,tasas interes_vigente  avance_en_cuotas, cae rotativo, cae compra en cuotas. json 3 serán todos los movimientos asociados a cada categoría.

        """

        client = extract_client(text)
        product = extract_product(text)
        movements = extract_movements(text)
        interests = extract_interests(text)

        return client, product, movements, interests

    except Exception as e:
        print("\n" + "=" * 50)
        print("ERROR EN EXTRACCIÓN:")
        print("-" * 50)
        print(f"Tipo de error: {type(e).__name__}")
        print(f"Mensaje de error: {str(e)}")
        print("=" * 50 + "\n")
        raise HTTPException(
            status_code=500, detail=f"Error al procesar el CV: {str(e)}"
        )


def validate_phone_number(phone: str) -> str:
    """
    Valida y formatea números de teléfono.

    Args:
        phone (str): Número de teléfono a validar.

    Returns:
        str: Número de teléfono formateado o string vacío si es inválido.
    """
    # Eliminar caracteres no numéricos
    numbers = re.sub(r"\D", "", phone)

    # Validar longitud mínima (código país + número)
    if len(numbers) < 8:
        return ""

    # Si no tiene código de país y es número válido, asumir +56
    if not phone.startswith("+"):
        return f"+56{numbers}"

    return f"+{numbers}"


def insert_suggestion_to_supabase(process_id: str, suggestion: str) -> None:
    try:
        # La suggestion se guarda en la tabla de procesos
        print(f"suggestion: {suggestion}")
        process_data = {
            "id": process_id,
            "suggestion": suggestion,
        }

        # Log para debugging
        logger.debug(f"Insertando sugerencia con datos: {process_data}")

        response = (
            supabase.table("processes")
            .update({"suggestion": suggestion})
            .eq("id", process_id)
            .execute()
        )

        if hasattr(response, "error") and response.error is not None:
            raise HTTPException(
                status_code=500,
                detail=f"Error al insertar en Supabase: {response.error}",
            )

    except Exception as e:
        logger.error(f"Error al insertar proceso: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error al insertar candidato: {str(e)}"
        )


def insert_candidate_to_supabase(
    process_id: str, user_id: str, client: dict, product: dict, movements: dict, interests: dict
) -> None:
    """
    Inserta la información del candidato en la base de datos de Supabase.

    Args:
        process_id (dict): kairo relacionado.
        match_result (dict): Resultado del cálculo de coincidencia.
        process_id (str): UUID del proceso.

    Raises:
        HTTPException: Si hay un error en la inserción de datos.
    """
    try:
        candidate_data = {
            "process_id": process_id,
            "user_id": user_id,
            "status": "Postulado",
            "client": client,
            "product": product,
            "movements": movements,
            "interests": interests,
        }

        # Log para debugging
        logger.debug(f"Insertando candidato con datos: {candidate_data}")

        response = supabase.table("candidates").insert(candidate_data).execute()

        if hasattr(response, "error") and response.error is not None:
            raise HTTPException(
                status_code=500,
                detail=f"Error al insertar en Supabase: {response.error}",
            )

    except Exception as e:
        logger.error(f"Error al insertar candidato: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error al insertar candidato: {str(e)}"
        )
