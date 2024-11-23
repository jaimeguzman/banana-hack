# app/utils.py
import os
import re
import io
import openai
import logging
from fastapi import HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv

import PyPDF2
from matcher_algo import calculate_match_score
from prompts.extract_client import extract_client


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

        # Llamada a OpenAI
        """ response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.3,
            max_tokens=800
        )

        # Imprimir respuesta cruda de OpenAI
        print("\n" + "="*50)
        print("RESPUESTA CRUDA DE OPENAI:")
        print("-"*50)
        # print(response.choices[0].message.content)
        print("="*50 + "\n")

        # Procesar respuesta
        tc_data = eval(response.choices[0].message.content)

        # Debug de tc_data
        print("\n" + "="*50)
        print("DATOS EXTRAÍDOS (BANK DOCUMENT):")
        print("-"*50)
        for key, value in tc_data.items():
            print(f"{key}: {value}")
        print("="*50 + "\n")



        # Validar y limpiar teléfono
        phone = tc_data.get('phone', '')
        if phone and not phone.startswith('+'):
            phone = f"+{phone}"

 

        # Crear diccionario final
        result = {
            "nombre_banco": tc_data.get('bank_name', 'No encontrado'),
            "numero_cuenta": tc_data.get('account_number', 'No encontrado'),
            "titular": tc_data.get('account_holder', 'No encontrado'),
            "tipo_cuenta": tc_data.get('account_type', 'No encontrado'),
            "texto_completo": text
        }

        # Debug del resultado final
        print("\n" + "="*50)
        print("RESULTADO FINAL PROCESADO:")
        print("-"*50)
        for key, value in result.items():
            if key == "texto_completo":
                print(f"{key}: [TEXTO COMPLETO OMITIDO]")
            else:
                print(f"{key}: {value}")
        print("="*50 + "\n") """

        result = extract_client(text)

        return result

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


def insert_candidate_to_supabase(process_id: str, client: dict, user_id: str) -> None:
    """
    Inserta la información del candidato en la base de datos de Supabase.

    Args:
        cv_info (dict): Información extraída del CV.
        match_result (dict): Resultado del cálculo de coincidencia.
        process_id (str): UUID del proceso.

    Raises:
        HTTPException: Si hay un error en la inserción de datos.
    """
    try:
        candidate_data = {
            "process_id": process_id,
            "status": "Postulado",
            "client": client,
            "user_id": user_id,
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
