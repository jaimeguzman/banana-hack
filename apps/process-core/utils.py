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
def extract_cv_info(file_content: bytes) -> dict:
    """
    Extrae información estructurada de un CV usando OpenAI.

    Args:
        file_content (bytes): Contenido del archivo PDF en bytes.

    Returns:
        dict: Información estructurada del CV incluyendo datos personales y experiencia.

    Raises:
        HTTPException: Si hay errores en la extracción o procesamiento del PDF.
    """
    try:
        # Extraer texto del PDF
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = "".join(page.extract_text() for page in pdf_reader.pages)
        
        print("\n" + "="*50)
        print("TEXTO EXTRAÍDO DEL PDF:")
        print("-"*50)
        print(text[:500] + "...")  # Primeros 500 caracteres
        print("="*50 + "\n")

        # Prompt para OpenAI
        system_prompt = """
        Eres un experto en análisis de CVs. Extrae la siguiente información del CV proporcionado:
        1. Nombre completo de la persona
        2. Email
        3. Número de teléfono (con código de país si está disponible)
        4. URL de LinkedIn o username
        5. Resumen de las últimas 3 experiencias profesionales (máximo 100 palabras por experiencia)

        Responde en formato JSON con las siguientes keys:
        {
            "name": "nombre completo",
            "email": "email@ejemplo.com",
            "phone": "+56912345678",
            "linkedin_url": "https://www.linkedin.com/in/username",
            "experience": "resumen de experiencias"
        }
        """

        # Llamada a OpenAI
        response = openai.ChatCompletion.create(
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
        print(response.choices[0].message.content)
        print("="*50 + "\n")

        # Procesar respuesta
        cv_data = eval(response.choices[0].message.content)

        # Debug de cv_data
        print("\n" + "="*50)
        print("DATOS EXTRAÍDOS (cv_data):")
        print("-"*50)
        for key, value in cv_data.items():
            print(f"{key}: {value}")
        print("="*50 + "\n")

        # Procesar URL de LinkedIn
        linkedin_url = cv_data.get('linkedin_url', '')
        if linkedin_url and not linkedin_url.startswith('http'):
            linkedin_url = f"https://www.linkedin.com/in/{linkedin_url}"

        # Validar y limpiar teléfono
        phone = cv_data.get('phone', '')
        if phone and not phone.startswith('+'):
            phone = f"+{phone}"

        # Procesar experiencia
        experience = cv_data.get('experience', {})
        if isinstance(experience, dict):
            experience_text = "\n\n".join([
                f"{key}: {value}" 
                for key, value in experience.items()
            ])
        else:
            experience_text = str(experience)

        # Crear diccionario final
        result = {
            "nombre": cv_data.get('name', 'No encontrado'),
            "email": cv_data.get('email', 'No encontrado'),
            "telefono": phone or 'No encontrado',
            "linkedin_url": linkedin_url or 'No encontrado',
            "experiencia": experience_text or 'No encontrado',
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
        print("="*50 + "\n")

        return result

    except Exception as e:
        print("\n" + "="*50)
        print("ERROR EN EXTRACCIÓN:")
        print("-"*50)
        print(f"Tipo de error: {type(e).__name__}")
        print(f"Mensaje de error: {str(e)}")
        print("="*50 + "\n")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar el CV: {str(e)}"
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
    numbers = re.sub(r'\D', '', phone)
    
    # Validar longitud mínima (código país + número)
    if len(numbers) < 8:
        return ""
        
    # Si no tiene código de país y es número válido, asumir +56
    if not phone.startswith('+'):
        return f"+56{numbers}"
        
    return f"+{numbers}"

def insert_candidate_to_supabase(cv_info: dict, match_result: dict, process_id: str) -> None:
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
            "name": cv_info["nombre"],
            "email": cv_info["email"],
            "phone": cv_info.get("telefono", "No encontrado"),
            "linkedin_url": cv_info.get("linkedin_url", "No encontrado"),
            "experience": cv_info["experiencia"],
            "ai_score": match_result["match_score"],
            "status": "Postulado",
            "match_feedback": match_result["explanation"]
        }

        # Log para debugging
        logger.debug(f"Insertando candidato con datos: {candidate_data}")

        response = supabase.table("candidates").insert(candidate_data).execute()
        
        if hasattr(response, 'error') and response.error is not None:
            raise HTTPException(
                status_code=500,
                detail=f"Error al insertar en Supabase: {response.error}"
            )

    except Exception as e:
        logger.error(f"Error al insertar candidato: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al insertar candidato: {str(e)}"
        )