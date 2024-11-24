import { Icon } from '@iconify/react'

/**
 * @typedef {Object} CardData
 * @property {string} cardNumber - Número de tarjeta
 * @property {string} bank - Nombre del banco
 * @property {number} totalIntereses - Total de intereses y cobros
 * @property {Object} detalles - Desglose de intereses
 */

/**
 * Componente que muestra el resumen de tarjeta de crédito
 * @returns {JSX.Element} Componente de resumen de tarjeta
 */
export default function KPISection() {
  // TODO: Conectar con el backend para obtener los datos reales
  const cardData = {
    cardNumber: '4687',
    bank: 'Banco Falabella',
    bankType: 'CMR',
    totalIntereses: 113656,
    detalles: {
      facturaciones: 104340,
      impuestos: 3233,
      mora: 6083
    }
  }

  return (
    <div className="flex gap-4 mt-[60px]">
      {/* Tarjeta izquierda */}
      <div className="w-2/3 p-6 bg-gray-100 rounded-lg">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700">{cardData.bankType}</h3>
            <p className="text-sm text-gray-500">{cardData.bank}</p>
          </div>
          <button className="px-3 py-1 text-sm text-gray-600 bg-white rounded-lg">
            Editar
          </button>
        </div>
        <p className="mt-8 text-xl">*{cardData.cardNumber}</p>
      </div>

      {/* Resumen derecho */}
      <div className="w-2/3 p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex justify-between pb-4 mb-4 border-b">
          <h2 className="text-base font-medium">Total de intereses y cobros</h2>
          <p className="text-base font-semibold">${cardData.totalIntereses.toLocaleString()}</p>
        </div>
        
        <div className="space-y-4">
          <DetailRow 
            label="Interés por facturaciones aplazadas"
            value={cardData.detalles.facturaciones}
          />
          <DetailRow 
            label="Impuestos por compras en cuotas"
            value={cardData.detalles.impuestos}
          />
          <DetailRow 
            label="Interés por demora en pagar"
            value={cardData.detalles.mora}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Componente para mostrar una fila de detalle
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del detalle
 * @param {number} props.value - Valor monetario
 */
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">${value.toLocaleString()}</p>
    </div>
  )
}
