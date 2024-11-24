import { Fragment, useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { Button } from '@nextui-org/react'
import UserMenu from './UserMenu'
import Link from 'next/link'
import ModalContinue from './modals/ModalContinue'
import { useRouter } from 'next/router'
import { fetchAllProcesses } from '../services/process/queries'

/**
 * @typedef {Object} NavbarProps
 * @property {boolean} isMenuOpen - Estado del menú de usuario
 * @property {Function} setIsMenuOpen - Función para actualizar el estado del menú
 */

/**
 * Componente de navegación principal
 * @component
 * @returns {JSX.Element} Componente Navbar
 */
export default function Navbar() {
  const [modalContinue, setModalContinue] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lastProcessId, setLastProcessId] = useState(null)
  const router = useRouter()

  // Obtener el último proceso al montar el componente
  useEffect(() => {
    const getLastProcess = async () => {
      try {
        const processes = await fetchAllProcesses()
        if (processes && processes.length > 0) {
          setLastProcessId(processes[0].id) // Asumimos que vienen ordenados
        }
      } catch (error) {
        console.error('Error al obtener el último proceso:', error)
      }
    }
    getLastProcess()
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  /**
   * Navega a la página de tarjetas (último proceso)
   * @function
   */
  const handleCardsClick = () => {
    if (lastProcessId) {
      router.push(`/process/${lastProcessId}`)
    } else {
      router.push('/process-create')
    }
  }

  return (
    <Fragment>
      <nav className="p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 pt-5">
            <Link 
              href="/"
              className="flex items-center gap-2 text-primary hover:bg-gray-100 transition-all px-4 py-2 rounded-lg text-lg"
            >

              <span className="font-medium">Análisis</span>
            </Link>
            <button
              onClick={handleCardsClick}
              className="flex items-center gap-2 text-primary hover:bg-gray-100 transition-all px-4 py-2 rounded-lg text-lg"
            >

              <span className="font-medium">Tarjetas</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="light"
              className="!p-0 !rounded-3xl"
              isIconOnly
              onClick={() => setModalContinue(true)}
            >
              <Icon icon="ph:bell-duotone" className="text-3xl text-primary" />
            </Button>
            <div className="relative">
              <Button 
                variant="light" 
                className="!p-0 !rounded-3xl" 
                isIconOnly 
                onClick={toggleMenu}
              >
                <Icon icon="ph:user-circle-gear-duotone" className="text-3xl text-primary" />
              </Button>
              {isMenuOpen && <UserMenu />}
            </div>
          </div>
        </div>
      </nav>
      <ModalContinue visible={modalContinue} setVisible={setModalContinue} />
    </Fragment>
  )
}
