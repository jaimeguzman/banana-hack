import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

/**
 * @typedef {Object} FinancialData
 * @property {string} userName - Nombre del usuario desde la sesión
 * @property {Object} alerts - Alertas de salud financiera
 * @property {Object} stats - Estadísticas principales
 * @property {Object} categories - Categorías de gastos
 */

/**
 * Componente que muestra el dashboard financiero principal
 * @returns {JSX.Element} Componente de dashboard
 */
export default function KPISection() {
  const [userName, setUserName] = useState('Usuario')

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('userSession'))
      setUserName(user?.email?.split('@')?.[0] ?? 'Usuario')
    } catch (error) {
      console.error('Error al obtener el nombre de usuario:', error)
      setUserName('Usuario')
    }
  }, [])

  // TODO: Conectar con el backend para obtener datos reales
  const financialData = {
    alerts: [
      {
        icon: '😱',
        text: 'Queremos ayudarte a ordenar y entender tu salud financiera. El uso de tus tarjetas está al límite y estás generando intereses.'
      }
    ],
    stats: {
      totalDebt: 558786,
      interests: 1524,
      availableCredit: -8786
    },
    categories: [
      {
        icon: '🏠',
        percentage: 26,
        amount: 151466,
        title: 'Total esenciales',
        subtitle: 'Necesidades básicas, salud, seguros'
      },
      {
        icon: '🍿',
        percentage: 67.5,
        amount: 392604,
        title: 'Total ocio',
        subtitle: 'Restaurantes, entretenimiento, viajes'
      },
      {
        icon: '🌱',
        percentage: 6.5,
        amount: 37379,
        title: 'Total inversiones',
        subtitle: 'Servicios digitales, negocios'
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-500 text-2xl mb-4">Hola {userName || 'que alegría volver a verte'} ! </h2>
        <h1 className="text-4xl font-bold">Así está tu salud financiera</h1>
      </div>

      <div className="bg-white rounded-xl p-6">
        <div className="space-y-4">
          {financialData.alerts.map((alert, index) => (
            <HealthIndicator key={index} icon={alert.icon} text={alert.text} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          amount={financialData.stats.totalDebt}
          label="Deuda total de todas las tarjetas"
        />
        <StatCard
          amount={financialData.stats.interests}
          label="Intereses y cobros de todas las tarjetas"
        />
        <StatCard
          amount={financialData.stats.availableCredit}
          label="Total cupo disponible"
          negative
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financialData.categories.map((category, index) => (
          <CategoryCard key={index} {...category} />
        ))}
      </div>
    </div>
  )
}

function HealthIndicator({ icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-2xl">{icon}</span>
      <p className="text-gray-700">{text}</p>
    </div>
  )
}

function StatCard({ amount, label, negative }) {
  const formattedAmount = new Intl.NumberFormat('es-CL').format(Math.abs(amount))
  
  return (
    <div className="bg-white p-6 rounded-xl">
      <h3 className={`text-2xl font-bold ${negative ? 'text-red-500' : ''}`}>
        ${negative ? '-' : ''}{formattedAmount}
      </h3>
      <p className="text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function CategoryCard({ icon, percentage, amount, title, subtitle }) {
  const formattedAmount = new Intl.NumberFormat('es-CL').format(amount)
  
  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          {percentage}%
        </span>
      </div>
      <h3 className="text-2xl font-bold">${formattedAmount}</h3>
      <p className="font-medium">{title}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  )
}
