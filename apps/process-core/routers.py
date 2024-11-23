# app/routers.py
import re
import os
import logging
import boto3
from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import List, Optional
from supabase import create_client, Client
from utils import extract_bank_document, calculate_match_score, insert_candidate_to_supabase
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from typing import Optional

# @TODO esto se debe recuperar de la base de datos.
# Descripción del trabajo
JOB_DESCRIPTION = """
Job functions
Cooperar en el planteamiento y diseño de aplicaciones base web orientadas a dispositivos móviles y escritorio.
Desarrollar sistemas web tipo Single Page Application.
Realizar animaciones complejas de elementos web, utilizando estándares de tecnologías web.
Contribuir en el modelamiento, implementación y mantención de estructuras de diseño orientadas a la Interfaz (UI) y a la usabilidad (UX).
Qualifications and requirements
Conocimientos en lenguajes de programación Javascript/Typescript.
Experiencia en tecnologías web HTML, CSS, SCSS.
Experiencia demostrable trabajando con algún framework de desarrollo web en Javascript (por ejemplo Angular, React, Vue.JS, entre otros).
Conocimiento en uso e implementación de API REST.
Experiencia en desarrollo de aplicaciones y páginas web responsivas (Responsive).
Conocimiento en uso de almacenamientos permanentes y temporales de navegadores web como cookies, sesiones, local storage, etc.
Experiencia utilizando frameworks de diseño tales como Bootstrap o Material Design.
Experiencia demostrable realizando e implementando animaciones de elementos web en HTML5 y CSS3.
Manejo básico de GIT para versión de código.
"""

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
        's3',
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_S3"),
        aws_secret_access_key=os.getenv("AWS_SECRET_KEY_S3")
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
    soup = BeautifulSoup(html_content, 'html.parser')
    clean_text = soup.get_text(separator=' ')
    
    # Limpieza adicional
    clean_text = re.sub(r'\s+', ' ', clean_text)  # Elimina espacios múltiples
    clean_text = clean_text.strip()  # Elimina espacios al inicio y final
    
    return clean_text


async def get_job_description(process_id: str) -> Optional[str]:
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
        response = supabase.table('processes') \
            .select('job_functions, job_requirements') \
            .eq('id', process_id) \
            .execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=404,
                detail=f"Proceso con ID {process_id} no encontrado"
            )

        process_data = response.data[0]
        # Limpiar HTML de los campos
        job_functions = clean_html_text(process_data.get('job_functions', ''))
        job_requirements = clean_html_text(process_data.get('job_requirements', ''))
        
 
        
        # Combina las funciones y requisitos del trabajo
        return f"""
        Job functions:
        {job_functions}

        Qualifications and requirements:
        {job_requirements}
        """
    except Exception as e:
        logger.error(f"Error al recuperar descripción del trabajo: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error al recuperar la descripción del trabajo"
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
async def upload_files(files: List[UploadFile] = File(...), process_id: str = Form(...), user_id: str = Form(...)):
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

        # Obtener descripción del trabajo
        job_description = await get_job_description(process_id)
        logger.info(f"EL JOB DESCRIPTION del proceso: {job_description}")
        print(f"EL JOB DESCRIPTION del proceso: {job_description}")


        results = []
        for file in files:
            if not file.filename.endswith(".pdf"):
                raise HTTPException(status_code=400, detail=f"El archivo {file.filename} no es un PDF.")

            content = await file.read()


            
            # TODO: Modo de depuración activado. Desactivar antes de pasar a producción.
            if os.getenv("DEBUG_EXTRACT_INFO_PDF", "false").lower() == "true":
                # Valores de prueba cuando debug está activado
                cv_info = {
                    "nombre": "Cartola de Prueba",
                    "email": "user@example.com",
                    "telefono": "+56 9 1234 5678",
                    "experiencia": "Experiencia de prueba en varias emrpesass",
                    "educacion": "Ingeniería Comercial",
                    "habilidades": ["JavaScript", "React", "Node.js", "Python"]
                }
                match_result = {
                    "match_score": 0,
                    "explanation": "mode debug"
                }
            else:
                cv_info = extract_bank_document(content)

                # 
                # match_result = await calculate_match_score(
                #     cv_info["experiencia"], 
                #     job_description
                # )


            # Subir a S3 si no está en modo debug
            s3_url = None
            if os.getenv("MODE_UPLOAD_DEBUG") != "true":
                s3_url = await upload_to_s3(content, file.filename)

            # @TODO: cada vez que se inserta debería guardarse la url del objeto PDF de s3

            # Insertar datos en Supabase
            # Se debe REFACTOR 
            # APENAS ESTE OK EL JSON SE DEBE INSERTAR EN LA BASE DE DATOS
            print(f"s3_url: {s3_url}")
            insert_candidate_to_supabase(process_id, client=cv_info, user_id=user_id)


            results.append({
                "filename": file.filename,
                "size": len(content),
                "cv_info": cv_info
                # "ai_score": match_result["match_score"],
                # "match_feedback": match_result["explanation"] # ,  "s3_url": s3_url
            })

        return JSONResponse(content={"processed_files": results})

    except HTTPException as he:
        logger.error(f"Error HTTP: {str(he)}", exc_info=True)
        raise he
    except Exception as e:
        logger.error(f"Error en upload_files: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Error al procesar los archivos: {str(e)}"
            )