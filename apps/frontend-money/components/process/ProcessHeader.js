import { Chip } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-toastify'
import { useProcess } from '../../context/ProcessContext'
import { fetchAllProductsInfo, fetchProductInfo } from '../../services/banks/queries'
import { updateProcess } from '../../services/process/actions'
import { deleteProcess } from '../../services/process/actions/deleteProcess'
import JobDetailsAccordion from '../modals/JobDetailsAccordion'
import Button from '../ui/Button'
import UploadModal from '../UploadModal'
import { CreditCard } from './CreditCard'


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

  // 


  useEffect(() => {
    const getProduct = async () => {
      if (!process?.id) {
        console.warn('⚠️ No process ID available')
        return
      }

      try {
        const productData = await fetchProductInfo(process.id)
        setProductInfo(productData)

        console.log('🏦 Product Data:', {
          processId: process.id,
          productData,
          type: typeof productData,
          keys: Object.keys(productData || {})
        })
      } catch (error) {
        console.error('❌ Error getting product:', {
          error,
          processId: process.id
        })
      }
    }

    getProduct()
  }, [process?.id])


  const [productInfo, setProductInfo] = useState(null);

  // useEffect(() => {
  //   const getProduct = async () => {
  //     try {
  //       const productData = await fetchProductInfo();
  //       setProductInfo(productData);
  //     } catch (error) {
  //       console.error('❌ Error getting product:', error);
  //     }
  //   };

  //   getProduct();
  // }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }


  // Ahora puedes acceder a productInfo en cualquier parte del componente
  const cupoTotal = productInfo?.cupo_total || 0;
  const caeRotativo = productInfo?.cae_rotativo || 0;
  const cupoUtilizado = productInfo?.cupo_utilizado || 0;
  const nombreTitular = productInfo?.nombre_titular || 'Santiago F';
  const numeroTarjeta = productInfo?.numero_tarjeta || 'XXXX';
  const cupoDisponible = productInfo?.cupo_disponible || 0;
  const caeAvanceCuotas = productInfo?.cae_avance_cuotas || 0;
  const caeCompraCuotas = productInfo?.cae_compra_cuotas || 0;
  const fechaPagarHasta = productInfo?.fecha_pagar_hasta
    ? new Date(productInfo.fecha_pagar_hasta).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    : new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const montoMinimoPagar = formatCurrency(productInfo?.monto_minimo_pagar) || 0;
  const fechaEstadoCuenta = productInfo?.fecha_estado_cuenta ? new Date(productInfo.fecha_pagar_hasta).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    : new Date(2024, 9, 24).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const montoTotalFacturado = formatCurrency(productInfo?.monto_total_facturado || 0);
  const cupoTotalAvanceEfectivo = formatCurrency(productInfo?.cupo_total_avance_efectivo) || 0;
  const cupoUtilizadoAvanceEfectivo = productInfo?.cupo_utilizado_avance_efectivo || 0;
  const tasasInteresVigenteRotativo = productInfo?.tasas_interes_vigente_rotativo || 0;
  const cupoDisponibleAvanceEfectivo = formatCurrency(productInfo?.cupo_disponible_avance_efectivo) || 0;
  const tasasInteresVigenteAvanceCuotas = productInfo?.tasas_interes_vigente_avance_cuotas || 0;
  const tasasInteresVigenteCompraCuotas = productInfo?.tasas_interes_vigente_compra_cuotas || 0;
  const fechaTopePago = new Date(2024, 11, 5).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });









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

  const alerts = [
    {
      icon: '😱',
      text: 'El uso de tus tarjetas está al límite y estás generando intereses.'
    },
    {
      icon: '⚖️',
      text: 'Reduce gastos en restaurantes y busca alternativas de transporte.'
    },
    {
      icon: '👍',
      text: 'Pagaste un monto considerable a la tarjeta de forma anticipada.'
    }
  ]

  const groups = [
    {
      icon: '🏡',
      percentaje: 26,
      amount: 151_466,
      title: 'Escenciales',
      description: 'Necesidades básicas, salud, seguros',
    },
    {
      icon: '🍿',
      percentaje: 67.5,
      amount: 392_604,
      title: 'Ocio',
      description: 'Restaurantes, entretenimiento, viajes',
    },
    {
      icon: '🪴',
      percentaje: 6.5,
      amount: 37_379,
      title: 'Inversiones',
      description: 'Servicios digitales, negocios',
    },
  ]

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
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <p className='text-bold text-xl font-bold'>Estado de cuenta</p>
            <div className='flex flex-row gap-2'>
              <span className='font-bold'>{fechaEstadoCuenta}</span>
              -
              <span className='font-bold'>{fechaPagarHasta}</span>
            </div>
          </div>
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
        <div className='flex flex-row p-6 gap-12 border-1 border-gray-100 rounded-md m-2'>
          {alerts.map((alert, index) => (
            <div className='flex flex-col'>
              {alert.icon}
              <p>{alert.text}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div className='row-span-2'>
            <CreditCard process={process} nombreTitular={nombreTitular} numeroTarjeta={numeroTarjeta} cupoTotal={cupoTotal} cupoUtilizado={cupoUtilizado} cupoDisponible={cupoDisponible} />
          </div>
          <div className="rounded-md border-1 border-gray-300 col-span-1 px-8 py-4 place-content-center">
            <div>
              <span class="font-bold text-2xl">{fechaTopePago},</span> <span className="font-bold text-2xl text-gray-500">2024</span>
              <p>Fecha tope de pago</p>
            </div>
          </div>
          <div className="rounded-md border-1 border-gray-300 col-span-1 px-8 py-4 place-content-center">
            <div>
              <span className="font-bold text-2xl">{montoTotalFacturado}</span>
              <p>Deuda total</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-md border-1 border-gray-300 col-span-1 px-8 py-4 place-content-center">
            <div>
              <span className="font-bold text-2xl">{montoMinimoPagar}</span>
              <p>Compras realizadas</p>
            </div>
          </div>
          <div className="rounded-md border-1 border-gray-300 col-span-1 px-8 py-4 place-content-center">
            <div>
              <span className="font-bold text-2xl">{cupoTotalAvanceEfectivo}</span>
              <p>Pagos a la tarjeta</p>
            </div>
          </div>
          <div className="rounded-md border-1 border-gray-300 col-span-1 px-8 py-4 place-content-center">
            <div>
              <span className="font-bold text-2xl">{cupoDisponibleAvanceEfectivo}</span>
              <p>Intereses y cobros extra</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row border-1 border-gray-300 rounded-md justify-around p-4">
          {groups.map((group) => (
            <div className='flex flex-col'>
              <span className="text-gray-600">{group.icon} {group.percentaje}%</span>
              <p className='text-2xl font-bold'>{formatCurrency(group.amount)}</p>
              <p className='text-gray-700'>{group.title}</p>
              <p className='text-gray-700'>{group.description}</p>
            </div>
          ))}
        </div>

        {/* @TODO: Codigo para deprecar */}

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
      </div >
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