# app/routers.py
import logging
import os
import re
from typing import List, Optional

import boto3
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from supabase import Client, create_client

from prompts.suggest_recomendation import suggest_recomendation
from utils import (
    extract_bank_document,
    insert_candidate_to_supabase,
    insert_suggestion_to_supabase,
)

 

# Cargar variables de entorno
load_dotenv()


# Configuración del enrutador y logger
upload_router = APIRouter()
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


# Cliente S3 solo se usa en modo producción
s3 = None
if os.getenv("MODE_UPLOAD_DEBUG") != "true":
    s3 = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_S3"),
        aws_secret_access_key=os.getenv("AWS_SECRET_KEY_S3"),
    )


def clean_html_text(html_content: str) -> str:
    """
    Limpia el contenido HTML y retorna solo el texto plano.

    Args:
        html_content (str): Texto con formato HTML.

    Returns:
        str: Texto limpio sin etiquetas HTML.
    """
    if not html_content:
        return ""

    # Eliminar el HTML usando BeautifulSoup
    soup = BeautifulSoup(html_content, "html.parser")
    clean_text = soup.get_text(separator=" ")

    # Limpieza adicional
    clean_text = re.sub(r"\s+", " ", clean_text)  # Elimina espacios múltiples
    clean_text = clean_text.strip()  # Elimina espacios al inicio y final

    return clean_text


async def get_history(process_id: str, user_id: str) -> Optional[str]:
    """
    Recupera la descripción del trabajo desde Supabase para un proceso específico.

    Args:
        process_id (str): UUID del proceso.

    Returns:
        Optional[str]: Descripción del trabajo combinada o None si no se encuentra.

    Raises:
        HTTPException: Si hay un error al recuperar los datos o el proceso no existe.
    """
    try:
        response = (
            supabase.table("candidates")
            .select("client, product, movements, interests")
            .eq("process_id", process_id)
            .eq("user_id", user_id)
            .execute()
        )

        if not response.data or len(response.data) == 0:
            return None

        process_data = response.data[-1]
        return process_data
    except Exception as e:
        logger.error(f"Error al recuperar descripción del trabajo: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Error al recuperar la descripción del trabajo"
        )


async def upload_to_s3(file_content: bytes, filename: str) -> str:
    """
    Sube un archivo a Amazon S3 y devuelve la URL del archivo.

    Args:
        file_content (bytes): Contenido del archivo en bytes.
        filename (str): Nombre del archivo para almacenarlo en S3.

    Returns:
        str: URL del archivo subido en S3.

    Raises:
        HTTPException: Si hay un error al subir el archivo a S3.
    """
    try:
        bucket_name = os.getenv("AWS_S3_BUCKET_NAME")
        s3.put_object(Bucket=bucket_name, Key=filename, Body=file_content)
        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{filename}"
        return s3_url
    except Exception as e:
        logger.error(f"Error al subir archivo a S3: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al subir el archivo a S3")


@upload_router.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    process_id: str = Form(...),
    user_id: str = Form(...),
):
    """
    Recibe múltiples archivos PDF y un ID de proceso, procesa los CVs y guarda la información en Supabase.

    Args:
        files (List[UploadFile]): Lista de archivos PDF subidos.
        process_id (str): UUID del proceso al que se asociarán los candidatos.

    Returns:
        JSONResponse: Respuesta con la información procesada de los CVs.
    """
    try:
        logger.info(f"Iniciando proceso de carga para el proceso: {process_id}")
        print(f"Iniciando proceso de carga para el proceso: {process_id}")

        if not process_id or process_id == "undefined":
            raise HTTPException(status_code=400, detail="ID de proceso no válido")

        results = []
        for file in files:
            if not file.filename.endswith(".pdf"):
                raise HTTPException(
                    status_code=400, detail=f"El archivo {file.filename} no es un PDF."
                )

            content = await file.read()

            client, product, movements, interests = extract_bank_document(content)

            # Subir a S3 si no está en modo debug
            s3_url = None
            if os.getenv("MODE_UPLOAD_DEBUG") != "true":
                s3_url = await upload_to_s3(content, file.filename)

            # @TODO: cada vez que se inserta debería guardarse la url del objeto PDF de s3

            insert_candidate_to_supabase(
                process_id,
                user_id=user_id,
                client=client,
                product=product,
                movements=movements,
                interests=interests,
            )

            # Obtener descripción del trabajo
            history = await get_history(process_id, user_id)
            logger.info(f"EL JOB DESCRIPTION del proceso: {history}")
            print(f"EL JOB DESCRIPTION del proceso: {history}")

            if history:
                suggestion = suggest_recomendation(history)
                insert_suggestion_to_supabase(process_id, suggestion)
            else:
                suggestion = "Estado de cuenta de Hussam Sufan: Cupo utilizado: $558,786. Cupo disponible: -$8,786. Gastos recurrentes en restaurantes, movilidad y supermercados. Uso de tarjeta al límite, generando intereses. Recomendación: reducir gastos en restaurantes y buscar alternativas de movilidad para mejorar salud financiera."

            results.append(
                {
                    "filename": file.filename,
                    "size": len(content),
                    "suggestion": suggestion,
                    # "ai_score": match_result["match_score"],
                    # "match_feedback": match_result["explanation"] # ,  "s3_url": s3_url
                }
            )

        return JSONResponse(content={"processed_files": results})

    except HTTPException as he:
        logger.error(f"Error HTTP: {str(he)}", exc_info=True)
        raise he
    except Exception as e:
        logger.error(f"Error en upload_files: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Error al procesar los archivos: {str(e)}"
        )
