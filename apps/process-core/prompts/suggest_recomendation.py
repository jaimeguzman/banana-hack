import openai


def suggest_recomendation(text: str) -> dict:
    """
    podemos basarnos en la funcion `calculate_match_score` del matcher_algo.py (ctrl+f para encontrarla)
    """

    # Prompt para OpenAI: Datos del cliente
    system_prompt = """
        Adjunto mi estado de cuenta para que analices mis finanzas personales. Por favor, identifica cuáles transacciones son recurrentes y cuáles son puntuales, y clasifícalas en categorías como supermercados, movilidad, entretenimiento, restaurantes, combustible, salud, entre otras. Evalúa si estoy utilizando mi tarjeta de crédito de manera responsable en relación al cupo disponible, indicando si estoy al límite, tengo capacidad de ahorro o estoy generando intereses por sobregiros o pagos mínimos. Si incluyo varios estados de cuenta, analiza mi historial de pagos, señalando si he pagado al día o si estoy acumulando intereses. Finalmente, proporciona recomendaciones específicas para optimizar mi uso de la tarjeta, reducir gastos innecesarios y mejorar mi salud financiera en general.
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

    intereses = tc_data.get("intereses", {})

    # Crear diccionario final
    result = {
        "intereses": intereses.get("intereses", "No encontrado"),
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
