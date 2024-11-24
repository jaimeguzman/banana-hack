import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { fetchAllProcesses } from '../services/process/queries'
import { Select, SelectItem, Spinner } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import Button from '../components/ui/Button'
import Logo from './Logo'
/**
 * Componente Sidebar
 *
 * Este componente muestra la barra lateral con la navegación de la aplicación.
 *
 * @component
 */
const Sidebar = () => {
  const [processes, setProcesses] = useState([])
  const [filteredProcesses, setFilteredProcesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ anchorKey: 'Todos' });
  const router = useRouter()

  useEffect(() => {
    const loadProcesses = async () => {
      try {
        const data = await fetchAllProcesses()
        setProcesses(data)
        setFilteredProcesses(data)
      } catch (error) {
        console.error('Error al cargar los procesos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProcesses()
  }, []);

  useEffect(() => {
    if (!processes.length) return;
    
    if (filter.anchorKey === 'Todos') {
      setFilteredProcesses(processes);
    } else {
      const filtered = processes.filter((process) => process.status === filter.anchorKey);
      setFilteredProcesses(filtered);
    }
  }, [filter, processes]);

  /**
   * Redirige a la página de creación de un nuevo proceso
   */
  const handleNewProcess = () => {
    router.push('/process-create')
  }

  const statusArray = [
    { key: 'Todos', label: 'Mostrar todos' },
    { key: 'Activo', label: 'Activos' },
    { key: 'Finalizado', label: 'Finalizados' },
  ]

  return (
    <aside className="w-92 min-h-screen overflow-y-auto text-gray-800 bg-white">
      <div className="flex flex-col gap-8 p-6">
        <Logo />
        <Button
          variant="solid"
          onClick={handleNewProcess}
          endContent={<Icon icon="fluent:add-12-filled" className="mt-1 text-base" />}
          className="w-full"
        >
          Nuevo Kairo
        </Button>
        <Select
          color="primary"
          variant="bordered"
          defaultSelectedKeys={['Todos']}
          selectedKeys={[filter.anchorKey]}
          onSelectionChange={(keys) => setFilter({ anchorKey: Array.from(keys)[0] })}
          aria-labelledby="status"
          classNames={{
            value: 'text-gray-800',
            trigger: 'bg-white border-gray-300',
          }}
        >
          {statusArray.map((status) => (
            <SelectItem key={status.key} value={status.key}>
              {status.label}
            </SelectItem>
          ))}
        </Select>
        {loading ? (
          <div className="flex justify-center mt-3">
            <Spinner color="primary" />
          </div>
        ) : (
          <div className="flex flex-col space-y-1">
            {filteredProcesses.map((process) => (
              <Link
                href={`/process/${process.id}`}
                key={process.id}
                className="p-2 transition-colors rounded-lg hover:bg-gray-100 group"
              >
                <div className="flex items-center gap-1 mb-1">
                  <Icon
                    icon={
                      process.candidates_count > 0 ? 'ph:tag-chevron-duotone' : 'ph:tag-chevron'
                    }
                    className="transition-colors group-hover:text-primary"
                  />
                  <h3 className="font-semibold">{process.name}</h3>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Transacciones</p>
                  {process.candidates_count > 0 && (
                    <p className="flex items-center gap-1">
                      {process.candidates_count}
                      {/* icon="ic:outline-library-books" */}
                      <Icon icon="ic:outline-account-balance" className="text-lg group-hover:text-success" />
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar