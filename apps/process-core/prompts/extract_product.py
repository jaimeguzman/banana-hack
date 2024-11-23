import openai


def extract_product(text: str) -> dict:
    # Prompt para OpenAI: Datos del cliente
    system_prompt = """
        eres experto analizando finanzas.
        vas a extraer los datos de un cliente desde un pdf, el pdf es un estado de cuenta de la tarjeta de credito.

        toma solo las cuentas nacionales. No trabajas con cuentas internacionales y no trabajas con cuentas o movimientos en dolares.

        identifica los datos que identifiquen al producto, por ejemplo:
        fecha_estado_cuenta, pagar_hasta, total_facturado, minimo_pagar, cupo total, cupo utilizado, cupo disponible, 
        
        Si es que aplican las tasas de interes o cae:
        tasas_interes_vigente_rotativo, tasas_interes_vigente compra_en_cuotas,tasas interes_vigente  avance_en_cuotas, cae rotativo, cae compra en cuotas.
        (Ten en cuenta que esto puede cambiar dependiendo del banco)

        Responde en este formato JSON con las siguientes keys, idealmente sigue este ejemplo:
        {
        "producto": {
        "prop1": "valor1",
        "prop2": "valor2"
        }
        }
        donde la key "producto" es para identificar toda la información del producto.
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

    product = tc_data.get("producto", {})

    # Crear diccionario final
    result = {
        "nombre_titular": product.get("nombre_titular", "No encontrado"),
        "numero_tarjeta": product.get("numero_tarjeta", "No encontrado"),
        "fecha_estado_cuenta": product.get("fecha_estado_cuenta", "No encontrado"),
        "cupo_total": product.get("cupo_total", "No encontrado"),
        "cupo_utilizado": product.get("cupo_utilizado", "No encontrado"),
        "cupo_disponible": product.get("cupo_disponible", "No encontrado"),
        "cupo_total_avance_efectivo": product.get(
            "cupo_total_avance_efectivo", "No encontrado"
        ),
        "cupo_utilizado_avance_efectivo": product.get(
            "cupo_utilizado_avance_efectivo", "No encontrado"
        ),
        "cupo_disponible_avance_efectivo": product.get(
            "cupo_disponible_avance_efectivo", "No encontrado"
        ),
        "tasas_interes_vigente_rotativo": product.get(
            "tasas_interes_vigente_rotativo", "No encontrado"
        ),
        "tasas_interes_vigente_compra_cuotas": product.get(
            "tasas_interes_vigente_compra_cuotas", "No encontrado"
        ),
        "tasas_interes_vigente_avance_cuotas": product.get(
            "tasas_interes_vigente_avance_cuotas", "No encontrado"
        ),
        "cae_rotativo": product.get("cae_rotativo", "No encontrado"),
        "cae_compra_cuotas": product.get("cae_compra_cuotas", "No encontrado"),
        "cae_avance_cuotas": product.get("cae_avance_cuotas", "No encontrado"),
        "fecha_pagar_hasta": product.get("fecha_pagar_hasta", "No encontrado"),
        "monto_total_facturado": product.get("monto_total_facturado", "No encontrado"),
        "monto_minimo_pagar": product.get("monto_minimo_pagar", "No encontrado"),
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
