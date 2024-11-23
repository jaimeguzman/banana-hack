import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { fetchCandidates } from '../services/mockCandidatesApi'
import { Icon } from '@iconify/react'
import { Progress } from '@nextui-org/react'
import Dropdown from './ui/Dropdown'
import Select from 'react-select'
import Link from 'next/link'

const CandidateTable = () => {
  const [activeTab, setActiveTab] = useState('candidates')
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    /**
     * Carga los candidatos desde la API
     * @async
     * @function loadCandidates
     */
    const loadCandidates = async () => {
      try {
        const data = await fetchCandidates()
        setCandidates(data)
      } catch (error) {
        console.error('Error al cargar los candidatos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCandidates()
  }, [])

  /**
   * Actualiza el estado de un candidato
   * @function handleStatusChange
   * @param {string} candidateId - El ID del candidato
   * @param {string} newStatus - El nuevo estado del candidato
   */
  const handleStatusChange = (candidateId, newStatus) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate,
      ),
    )
    // TODO: Implementar la actualización del estado en el backend
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'primary'
  }

  const statusOptions = ['En revisión', 'Descartado', 'Solicitud de entrevista', 'Sin respuesta']

  const handleOptionClick = (option, candidateId) => {
    switch (option) {
      case 'ver':
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
  }

  return (
    <div className="-mt-2 overflow-hidden bg-white rounded-lg shadow-xl shadow-primary/5">
      {/* Tabs de navegación */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 px-4 transition-colors font-semibold ${
            activeTab === 'candidates' ? 'bg-primary text-white' : 'text-neutral-600'
          }`}
          onClick={() => setActiveTab('candidates')}
        >
          <div className="flex items-center justify-center gap-2">
            <span>Candidatos</span>
            <Icon icon="ic:twotone-group" className="text-xl" />
          </div>
        </button>
        <button
          className={`flex-1 py-2 px-4 transition-colors font-semibold ${
            activeTab === 'history' ? 'bg-primary text-white' : 'text-neutral-600'
          }`}
          onClick={() => setActiveTab('history')}
        >
          <div className="flex items-center justify-center gap-2">
            <span>Historial</span>
            <Icon icon="iconamoon:clock-duotone" className="text-xl" />
          </div>
        </button>
      </div>
      {/* Tabla de candidatos */}
      {activeTab === 'candidates' && (
        <table className="w-full text-dark-blue">
          <thead>
            <tr className="bg-white">
              <th className={styles.th}></th>
              <th className="py-2 pr-4 text-left">Nombre Candidato</th>
              <th className={styles.th}>Fecha Actualización</th>
              <th className={styles.th}>Fecha Entrevista</th>
              <th className={styles.th}>Prefiltro AI</th>
              <th className={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-4 text-center">
                  Cargando candidatos...
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => {
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
                  <tr key={candidate.id}>
                    <td className="pl-4">
                      <Dropdown items={dropdownItems} />
                    </td>
                    <td className="px-0">
                      <div className="flex items-center gap-2">
                        {candidate.linkedinUrl ? (
                          <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <Icon icon="devicon:linkedin" />
                          </a>
                        ) : (
                          <Icon icon="devicon:linkedin" className="grayscale opacity-30" />
                        )}
                        <Link href={`/candidates/${candidate.id}`}>
                          <span className="text-primary hover:brightness-75">{candidate.name}</span>
                        </Link>
                      </div>
                    </td>
                    <td className={styles.td}>{candidate.updateDate}</td>
                    <td className={styles.td}>{candidate.interviewDate}</td>
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
                        options={statusOptions.map((status) => ({ value: status, label: status }))}
                        className="w-full"
                        classNamePrefix="react-select"
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      )}
      {/* Contenido del historial */}
      {activeTab === 'history' && (
        <div className="p-4">
          <p>Contenido del historial aquí</p>
          <strong>Sección en construcción</strong>
        </div>
      )}
    </div>
  )
}

export default CandidateTable

const styles = {
  th: 'px-4 py-2 text-left font-semibold',
  td: 'px-4 py-2',
}
