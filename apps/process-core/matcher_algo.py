import re
import os
import openai
from fastapi import HTTPException

# Configuración de OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# @REFACTOR: para que acá haga la recomendación financiera
async def calculate_match_score(resume: str, job_description: str) -> dict:
 
    print(f"\n calculate_match_score resume : {resume}")
    print("::::::::::::::::::::::::::::::::::::::::::::::")
    print(f"\n calculate_match_score job_description : {job_description}")


    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente que compara currículums con descripciones de trabajo, tu mayor propósito es encontrar la información mas exacta que coincida con el candidato. Puedes extraer sus habilidades o skills, para saber si coinciden con la descripción de trabajo, y tener su email que siempre cumpla con: '[\w\.-]+@[\w\.-]+\.\w{2,4}' la anterior expresión regular. Proporciona una puntuación numérica del 1 al 100.   "},
                {"role": "user", "content": f"Currículum: {resume}\nDescripción del trabajo: {job_description} \nProporciona una puntuación del 1 al 100, seguida de una breve explicación de por qué le diste esa puntuación. La puntuación debe ser solo un número."}
            ]
        )
        full_response   = response['choices'][0]['message']['content'].strip()
        score_match     = re.search(r'\b(\d+)\b', full_response)
        score           = int(score_match.group(1)) if score_match else 0
        explanation     = re.sub(r'^\d+\s*[:.-]\s*', '', full_response).strip()
        
        print("::::::::::::::::::::::::::::::::::::::::::::::")
        print(f"\n OPENAI score : {score}")
        print(f"\n OPENAI explanation : {explanation}")



        return {"match_score": score, "explanation": explanation}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
