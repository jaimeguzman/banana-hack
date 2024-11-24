import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import UploadModal from '../UploadModal'
import { deleteProcess } from '../../services/process/actions/deleteProcess'
import { updateProcess } from '../../services/process/actions'
import { useProcess } from '../../context/ProcessContext'
import toast from 'react-toastify'
import JobDetailsAccordion from '../modals/JobDetailsAccordion'
import Button from '../ui/Button'
import { Icon } from '@iconify/react'
import { Chip } from '@nextui-org/react'
import Link from 'next/link'
import { fetchProductInfo, fetchAllProductsInfo } from '../../services/banks/queries';


/**
 * Componente que muestra la cabecera de un proceso de reclutamiento.
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.process - Datos del proceso.
 * @param {Function} props.onProcessUpdate - Función para actualizar el proceso en el componente padre.
 * @returns {JSX.Element} Elemento JSX que representa la cabecera del proceso.
 */
const ProcessHeader = ({ reloadCandidates }) => {
  const router = useRouter()
  const { process, setProcess } = useProcess()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [productsInfo, setProductsInfo] = useState([])

  useEffect(() => {
    const loadAllProductsInfo = async () => {
      console.log('🔍 Debug - Starting loadAllProductsInfo')
      console.log('📌 process?.id:', process?.id)

      try {
        if (process?.id) {
          const data = await fetchAllProductsInfo()
          console.log('✅ Raw data received:', data)

          // Filtramos y parseamos los productos de manera segura
          const processProducts = data
            .filter(item => item.process_id === process.id)
            .map(item => {
              try {
                // Intentamos parsear el JSON si es string
                const parsedProduct = item.product && typeof item.product === 'string' 
                  ? JSON.parse(item.product) 
                  : item.product

                return {
                  ...item,
                  product: parsedProduct || {}
                }
              } catch (parseError) {
                console.error('Error parsing product JSON:', parseError)
                return {
                  ...item,
                  product: {}
                }
              }
            })
            .filter(item => item.product && Object.keys(item.product).length > 0)

          console.log('✅ Processed products:', processProducts)
          setProductsInfo(processProducts)
        }
      } catch (error) {
        console.error('❌ Error loading products info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAllProductsInfo()
  }, [process?.id])

  // Calculamos totales y obtenemos las fechas
  // @TODO - Acá debe ir la logica para calcular los totales, pero 
  // se debe dejar un calculo que permita ir por movimiento y no por todos.
  const { totals, fechas } = productsInfo.reduce((acc, curr) => {
    const product = curr.product || {}
    return {
      totals: {
        cupoTotal: acc.totals.cupoTotal + (Number(product.cupo_total) || 0),
        cupoUtilizado: acc.totals.cupoUtilizado + (Number(product.cupo_utilizado) || 0),
        cupoDisponible: acc.totals.cupoDisponible + (Number(product.cupo_disponible) || 0)
      },
      fechas: {
        estado: product.fecha_estado_cuenta || acc.fechas.estado,
        pago: product.fecha_pagar_hasta || acc.fechas.pago
      }
    }
  }, { 
    totals: { cupoTotal: 0, cupoUtilizado: 0, cupoDisponible: 0 },
    fechas: { estado: '', pago: '' }
  })
  // EOL @TODO esto se debe evitar registrar mas de un movimiento.

  const handleOption = async (option) => {
    try {
      let updatedProcess
      switch (option) {
        case 'edit':
          // Redirigir a la página de edición usando el ID del proceso actual
          router.push(`/process/edit/${process.id}`)
          return
        case 'finish':
          updatedProcess = await updateProcess(process.id, { status: 'Finalizado' })
          break
        case 'delete':
          setShowDeleteModal(true)
          return
      }
      if (updatedProcess) {
        setProcess(updatedProcess)
      }
    } catch (error) {
      console.error('Error al ejecutar la acción:', error)
      toast?.error('Error al ejecutar la acción')
    }
  }
  // @TODO - Eliminar 
  const handleDelete = async () => {
    try {
      await deleteProcess(process.id)
      router.push('/') // Redirigir a la página principal después de eliminar
    } catch (error) {
      console.error('Error al eliminar el proceso:', error)
    }
    setShowDeleteModal(false)
  }

  if (process.loading) {
    return (
      <div className="p-4 mb-4 bg-white shadow-md">
        <div className="flex space-x-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1 py-1 space-y-4">
            <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="w-5/6 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {isModalOpen && (
        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reloadCandidates={reloadCandidates}
        />
      )}
      <div className="flex flex-col gap-3 p-4 mb-4 mt-[45px] bg-white rounded-lg shadow-xl shadow-primary/5 text-dark-blue">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <Icon icon="ph:caret-left-bold" className="text-2xl" />
            </Link>
            <div className="flex items-center gap-2">
              <Icon icon="ic:twotone-credit-card" className="text-2xl text-success-500" />
              <h1 className="text-2xl font-bold text-dark-blue">{process.name}</h1>
              <Chip classNames={{ content: 'text-white' }} color="success">
                {process.status}
              </Chip>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              color="primary"
              className="font-semibold relative overflow-hidden w-64"
              onClick={() => {
                if (process.status !== 'Finalizado') {
                  setIsModalOpen(true)
                }
              }}
              isDisabled={process.status === 'Finalizado'}
            >
              <span className="relative z-10">Subir cartolas</span>
              <span className="absolute inset-0 animate-ripple-1 bg-white/30"></span>
              <span className="absolute inset-0 animate-ripple-2 bg-white/30"></span>
              <span className="absolute inset-0 animate-ripple-3 bg-white/30"></span>
            </Button>
          </div>
        </div>
        {/*  */
        
        }

        <div className="bg-white rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className=" inline">Inicio de facturación: </h2>
              <p className="text-lg inline">{fechas.estado || ''} - Fecha de pago: {fechas.pago || ''}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Disponible Total</p>
              <p className="text-2xl font-semibold">
                ${totals.cupoDisponible.toLocaleString('es-CL')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Utilizado Total</p>
                <p className="text-xl font-semibold">
                  ${totals.cupoUtilizado.toLocaleString('es-CL')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Cupo Total</p>
                <p className="text-xl font-semibold">
                  ${totals.cupoTotal.toLocaleString('es-CL')}
                </p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-black h-2 rounded-full" 
                style={{ 
                  width: `${Math.min(100, (totals.cupoUtilizado / totals.cupoTotal) * 100 || 0)}%` 
                }} 
              />
            </div>

          </div>
        </div>
        
        {/* @TODO: Codigo para deprecar */}

        {/* <div className="grid grid-cols-3 text-base">
          <div className="space-y-1">
            <p>
              <strong>Solicitado por:</strong> {process.requested_by}
            </p>
            <p>
              <strong>Área:</strong> {process.area}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>Modalidad:</strong> {process.modality}
            </p>
            <p>
              <strong>Inicio:</strong> {formatDate(process.start_date)}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>Creado por:</strong> {process.created_by}
            </p>
            <p>
              <strong>Término:</strong> {formatDate(process.end_date)}
            </p>
          </div>
        </div> */}
        <JobDetailsAccordion
          process={process}
        />
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Categorías:</h3>
          <div className="flex flex-wrap items-center gap-1">
            {process.requiredSkills && process.requiredSkills.length > 0 ? (
              process.requiredSkills.map((skill) => (
                <Chip key={skill.value} color="primary" variant="dot">
                  {skill.label}
                </Chip>
              ))
            ) : (
              <Chip color="primary" variant="dot">
                No Especificada
              </Chip>
            )}
          </div>
        </div>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
            <div className="relative p-5 mx-auto bg-white border rounded-md shadow-lg top-20 w-96">
              <h3 className="mb-4 text-lg font-bold">¿Estás seguro de eliminar este proceso?</h3>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ProcessHeader

/**
 * Formatea una fecha ISO a un formato más legible
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
const formatDate = (dateString) => {
  if (!dateString) return 'No especificado'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}