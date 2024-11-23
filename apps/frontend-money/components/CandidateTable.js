import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { updateCandidateStatus, VALID_CANDIDATE_STATUSES } from '../services/candidateService'
import Select from 'react-select'
import Link from 'next/link'
import { FaLinkedin } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useProcess } from '../context/ProcessContext'
import { Progress } from '@nextui-org/react'
import Dropdown from './ui/Dropdown'
import { Icon } from '@iconify/react'
import { updateProcessCount } from '../services/process/actions/updateProcessCount';


/**
 * Componente CandidateTable
 *
 * Este componente muestra una tabla con la lista de candidatos y permite realizar acciones sobre ellos.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.candidates - Lista de candidatos a mostrar
 * @param {string} props.processId - ID del proceso actual
 * @param {string} props.processStatus - Estado actual del proceso
 * @param {Function} props.onCandidateStatusChange - Función para actualizar el estado de un candidato
 */
const CandidateTable = () => {
  const { candidates, process, setCandidates } = useProcess()
  const [activeTab, setActiveTab] = useState('candidates')
  const [showOptions, setShowOptions] = useState(null)
  const optionsRef = useRef(null)
  const router = useRouter()






  useEffect(() => {
    /**
     * Maneja el cierre del menú de opciones al hacer clic fuera de él
     * @function handleClickOutside
     * @param {Event} event - El evento de clic
     */
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Actualiza el estado de un candidato y muestra una notificación
   * @function handleStatusChange
   * @param {string} candidateId - El ID del candidato
   * @param {string} newStatus - El nuevo estado del candidato
   */
  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      await updateCandidateStatus(candidateId, newStatus)
      const updatedCandidates = candidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate,
      )
      setCandidates(updatedCandidates)
      toast.success(`Estado actualizado a: ${newStatus}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.error('Error al actualizar el estado del candidato:', error)
      toast.error('Error al actualizar el estado del candidato', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'primary'
  }

  /**
   * Maneja las acciones del menú de opciones
   * @function handleOptionClick
   * @param {string} option - La opción seleccionada ('ver', 'agendar', 'historial')
   * @param {string} candidateId - El ID del candidato
   * @description
   * - 'ver': Redirige a la página de detalles del candidato
   * - 'agendar': (TODO) Implementar lógica para agendar una entrevista
   * - 'historial': (TODO) Implementar lógica para ver el historial del candidato
   * @todo Conectar con el backend para las acciones de 'agendar' e 'historial'
   */
  const handleOptionClick = (option, candidateId) => {
    console.log("entra po ctmmmm")
    console.log(`Opción seleccionada: ${option} para el candidato ${candidateId}`);
    switch (option) {
      case 'ver':
        console.log('Redirigiendo a:', `/candidates/${candidateId}`);
        router.push(`/candidates/${candidateId}`)
        break
      case 'agendar':
        // TODO: Implementar la lógica para agendar una entrevista
        console.log('Agendar entrevista para el candidato', candidateId)
        break
      case 'historial':
        // TODO: Implementar la lógica para ver el historial del candidato
        console.log('Ver historial del candidato', candidateId)
        break
      default:
        console.log('Opción no reconocida')
    }
    setShowOptions(null);
  }

  /**
   * Determina el color y el espaciado del ícono de LinkedIn basado en la presencia de la URL
   * @function getLinkedInIconStyle
   * @param {string|null} url - La URL de LinkedIn del candidato
   * @returns {Object} Un objeto con las clases CSS para el color y el espaciado del ícono
   */
  const getLinkedInIconStyle = (url) => {
    return {
      color: url ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300',
      spacing: url ? 'mr-2' : 'mr-3'
    };
  };

  /**
   * Formatea la fecha en un formato legible
   * @function formatDate
   * @param {string} dateString - La fecha en formato ISO
   * @returns {string} La fecha formateada
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Actualizar el proceso padre cuando cambian los candidatos
  useEffect(() => {
    if (process?.id) {
      const updateCount = async () => {
        try {
          await updateProcessCount(process.id, candidates.length)
        } catch (error) {
          console.error('Error al actualizar el contador:', error)
        }
      }

      updateCount()
    }
  }, [candidates.length, process?.id])

  // Actualizar el proceso padre cuando cambian los candidatos
  useEffect(() => {
    if (process?.id) {
      const updateCount = async () => {
        try {
          await updateProcessCount(process.id, candidates.length);
        } catch (error) {
          console.error('Error al actualizar el contador:', error);
        }
      };
      
      updateCount();
    }
  }, [candidates.length, process?.id]);

  return (
    <div className="-mt-2 overflow-hidden bg-white rounded-lg shadow-xl shadow-primary/5">
      {/* Tabs de navegación eliminadas */}
      {/* Contenedor con altura mínima */}
      <div className="min-h-[400px] overflow-auto">
        {/* Tabla de candidatos */}
        <table className="w-full text-dark-blue">
          <thead>
            <tr className="bg-white">
              <th className={styles.th}></th>
              <th className="py-2 pl-0 pr-2 text-left">Tipo de Movimiento</th>
              <th className="py-2 pl-0 pr-2 text-left">Fecha Actualización</th>
              <th className={styles.th}>Prefiltro AI</th>
              <th className={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => {
              // console.log(candidate)
              const dropdownItems = [
                {
                  label: 'Ver',
                  onClick: () => handleOptionClick('ver', candidate.id),
                },
                {
                  label: 'Agendar',
                  onClick: () => handleOptionClick('agendar', candidate.id),
                },
                {
                  label: 'Historial',
                  onClick: () => handleOptionClick('historial', candidate.id),
                },
              ]
              return (
                <tr key={candidate.id} className="border-b hover:bg-gray-50">
                  <td className="pl-4">
                    <Dropdown items={dropdownItems} />
                  </td>
                  <td className="px-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/candidates/${candidate.id}`}>
                        <span className="text-primary hover:brightness-75">{candidate.name}</span>
                      </Link>
                    </div>
                  </td>
                  <td className={styles.td}>{formatDate(candidate.updateDate)}</td>
                  <td className={styles.td}>{formatDate(candidate.interviewDate)}</td>
                  <td className={styles.td}>
                    <Progress
                      color={getScoreColor(candidate.aiScore)}
                      value={candidate.aiScore}
                    />
                    <span className="text-xs">{candidate.aiScore}%</span>
                  </td>
                  <td className={styles.td}>
                    <Select
                      value={{ value: candidate.status, label: candidate.status }}
                      onChange={(selectedOption) =>
                        handleStatusChange(candidate.id, selectedOption.value)
                      }
                      options={VALID_CANDIDATE_STATUSES.map((status) => ({
                        value: status,
                        label: status,
                      }))}
                      className="w-full"
                      classNamePrefix="react-select"
                      isDisabled={process?.status === 'Finalizado'}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CandidateTable

const styles = {
  th: 'py-2 pl-0 pr-2 text-left font-semibold',
  td: 'pl-0 pr-4 py-2',
}
