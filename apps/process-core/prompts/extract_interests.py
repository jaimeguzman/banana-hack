import openai


def extract_interests(text: str) -> dict:
    # Prompt para OpenAI: Datos del cliente
    system_prompt = """
        eres experto analizando finanzas.

        te adjunto un estado de cuenta de la tarjeta de credito.

        necesito que analices todos los movimientos asociados a los intereses.

        no trabajas con cuentas al extranjeno, solo con cuentas nacionales. Solo con monedas CLP.

        busca valores como cargos, comisiones, impuestos y abonos.

        *Sin comentarios*
        Por favor, responde siempre con un JSON que siga esta estructura exacta:
        {
            "categoria": [
                {"nombre": "string", "total": "integer"},
            ]
        }
        el json serán todos los movimientos asociados a cada categoría.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text},
        ],
        temperature=0.2,
        max_tokens=800,
    )
    # Imprimir respuesta cruda de OpenAI
    print("\n" + "=" * 50)
    print("RESPUESTA CRUDA DE OPENAI:")
    print("-" * 50)
    print(response.choices[0].message.content)
    print("=" * 50 + "\n")

    # Procesar respuesta
    tc_data = eval(response.choices[0].message.content)

    # Debug de tc_data
    print("\n" + "=" * 50)
    print("DATOS EXTRAÍDOS (BANK DOCUMENT):")
    print("-" * 50)
    for key, value in tc_data.items():
        print(f"{key}: {value}")
    print("=" * 50 + "\n")

    # Crear diccionario final
    movimientos = tc_data

    result = movimientos

    # Debug del resultado final
    print("\n" + "=" * 50)
    print("RESULTADO FINAL PROCESADO:")
    print("-" * 50)
    for key, value in result.items():
        if key == "texto_completo":
            print(f"{key}: [TEXTO COMPLETO OMITIDO]")
        else:
            print(f"{key}: {value}")
    print("=" * 50 + "\n")

    return result
