import openai


def extract_client(text: str) -> dict:
    # Prompt para OpenAI: Datos del cliente
    system_prompt = """
        eres experto analizando finanzas.
        vas a extraer los datos de un cliente desde un pdf, el pdf es un estado de cuenta de la tarjeta de credito.

        toma solo las cuentas nacionales. No trabajas con cuentas internacionales y no trabajas con cuentas o movimientos en dolares.

        identifica los datos que identifiquen al cliente, por ejemplo; nombre, rut.

        Responde en este formato JSON con las siguientes keys:
        {
        "cliente": {
        "prop1": "valor1",
        "prop2": "valor2"
        }
        }
        donde la key "cliente" es para identificar toda la información de cliente.
        las keys son en minusculas y sin espacios.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text},
        ],
        temperature=0.2,
        max_tokens=800,
        response_format={"type": "json_object"},
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

    client = tc_data.get("cliente", {})

    # Crear diccionario final
    result = {
        "name": client.get("nombre", "No encontrado"),
        "rut": client.get("rut", "No encontrado"),
    }

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
