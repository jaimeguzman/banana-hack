import openai


def suggest_recomendation(history: dict) -> dict:
    history_str = str(history)

    # Prompt para OpenAI: Datos del cliente
    system_prompt = """
        Adjunto mi estado de cuenta para que analices mis finanzas personales. Por favor, identifica cuáles transacciones son recurrentes y cuáles son puntuales, y clasifícalas en categorías como supermercados, movilidad, entretenimiento, restaurantes, combustible, salud, entre otras. Evalúa si estoy utilizando mi tarjeta de crédito de manera responsable en relación al cupo disponible, indicando si estoy al límite, tengo capacidad de ahorro o estoy generando intereses por sobregiros o pagos mínimos. Si incluyo varios estados de cuenta, analiza mi historial de pagos, señalando si he pagado al día o si estoy acumulando intereses. Finalmente, proporciona recomendaciones específicas para optimizar mi uso de la tarjeta, reducir gastos innecesarios y mejorar mi salud financiera en general. resume en 100 carácteres.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": history_str},
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

    return response.choices[0].message.content
