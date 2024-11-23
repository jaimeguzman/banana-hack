import Link from 'next/link'
import Button from '../ui/Button'

export default function ActionButtons() {
  const actions = [
    {
      title: 'Procesos activos',
      href: '/procesos-activos',
    },
    {
      title: 'Ir al último proceso',
      href: '/ultimo-proceso',
    },
    {
      title: 'Calendario',
      href: '/calendario',
    },
  ]
  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow-xl shadow-primary/5">
      <h2 className="mb-3 text-xl font-bold text-primary">Acciones rápidas</h2>
      <div className="flex flex-col flex-wrap space-y-2 md:space-y-0 md:flex-row md:space-x-3">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Button>{action.title}</Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
