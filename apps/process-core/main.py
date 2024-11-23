# main.py
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from mangum import Mangum
from routers import upload_router

load_dotenv()

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

app = FastAPI(title="Lambda Function API", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "https://develop.dxgbdvng7cbh1.amplifyapp.com",
                   "https://develop.dxgbdvng7cbh1.amplifyapp.com/login" ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Incluir rutas de `upload_router`
app.include_router(upload_router)

@app.get("/")
async def root():
    """Endpoint de prueba para verificar el funcionamiento del servidor."""
    return {"message": "Hello Kairo"}

# Adaptador para AWS Lambda
handler = Mangum(app, lifespan="off")