import React from 'react'
import { Icon } from '@iconify/react'

/**
 * @typedef {Object} PaymentData
 * @property {Object} periodo - Información del período
 * @property {Object} resumen - Resumen de pagos
 * @property {Object} montos - Montos y totales
 */

/**
 * Componente que muestra información de pagos y facturación
 * @returns {JSX.Element} Componente de información de pagos
 */
export default function PaymentsInformation() {
  // TODO: Conectar con el backend para obtener datos reales
  const paymentData = {
    periodo: {
      inicio: '20 oct',
      fin: '19 nov',
      año: '2024',
      utilizado: 5920862,
      disponible: 9138,
      cupoTotal: 5930000
    },
    resumen: {
      fechaPago: '5 nov, 2024',
      totalPagar: 5837845,
      desglose: {
        comprasPeriodo: 391189,
        interesesCobros: 113656,
        facturadoAnterior: 5622035,
        pagosTarjeta: 289035
      }
    }
  }

  return (
    <div className="flex gap-4">
      {/* Tarjeta izquierda - Período */}
      <div className="w-1/2 p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-gray-500 mb-1">Periodo de facturación</h2>
            <p className="text-lg">
              {paymentData.periodo.inicio} - {paymentData.periodo.fin},{' '}
              <span className="text-gray-500">{paymentData.periodo.año}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Icon icon="ph:caret-left-bold" className="text-xl" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Icon icon="ph:caret-right-bold" className="text-xl" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <AmountRow label="Utilizado" value={paymentData.periodo.utilizado} />
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '99%' }} />
          </div>
          <div className="flex justify-between">
            <AmountRow label="Disponible" value={paymentData.periodo.disponible} />
          </div>
          <AmountRow label="Cupo total" value={paymentData.periodo.cupoTotal} />
        </div>
      </div>

      {/* Tarjeta derecha - Resumen */}
      <div className="w-1/2 p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex justify-between mb-6">
          <h2>Fecha a pagar</h2>
          <p className="text-right">
            5 nov, <span className="text-gray-500">2024</span>
          </p>
        </div>

        <div className="space-y-4">
          <AmountRow 
            label="Total facturado a pagar" 
            value={paymentData.resumen.totalPagar} 
            bold
          />
          <div className="pt-4 space-y-4 border-t">
            <AmountRow 
              label="Compras del periodo" 
              value={paymentData.resumen.desglose.comprasPeriodo} 
              light
            />
            <AmountRow 
              label="Intereses y cobros" 
              value={paymentData.resumen.desglose.interesesCobros} 
              light
            />
            <AmountRow 
              label="Facturado anterior" 
              value={paymentData.resumen.desglose.facturadoAnterior} 
              light
            />
            <AmountRow 
              label="Pagos a la tarjeta" 
              value={paymentData.resumen.desglose.pagosTarjeta} 
              light
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente para mostrar una fila con label y monto
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del monto
 * @param {number} props.value - Valor monetario
 * @param {boolean} [props.bold] - Si debe mostrarse en negrita
 * @param {boolean} [props.light] - Si debe mostrarse en gris claro
 */
function AmountRow({ label, value, bold, light }) {
  return (
    <div className="flex justify-between items-center">
      <p className={light ? 'text-gray-500' : ''}>{label}</p>
      <p className={bold ? 'font-semibold' : ''}>
        ${value.toLocaleString()}
      </p>
    </div>
  )
}
