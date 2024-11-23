import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
// import {  fetchSkills } from '../../services/processService';
import { fetchSkills } from '../../services/skills'
// Modular refactor
import { createSkill } from '../../services/skills'
import { updateProcess } from '../../services/process/actions'
import { fetchProcessById } from '../../services/process/queries/fetchProcessById'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css'
import { createOrGetSkill } from '../../services/skills/actions/createOrGetSkill'

const CreatableAsyncSelect = dynamic(
  () => import('react-select/async-creatable').then((mod) => mod.default),
  { ssr: false },
)

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

/**
 * Componente para editar un proceso existente
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} props.processId - ID del proceso a editar
 */
const EditProcessForm = ({ processId }) => {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    position: '',
    requiredSkills: [],
    optionalSkills: [],
    start_date: '',
    end_date: '',
    modality: 'Presencial',
    status: 'Activo',
    requested_by: '',
    created_by: 'admin',
    jobFunctions: '',
    jobRequirements: '',
  })
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [skillOptions, setSkillOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadProcess = async () => {
    try {
      setIsLoading(true)
      const processData = await fetchProcessById(processId)
      setFormData((prevData) => ({
        ...prevData,
        name: processData.name || '',
        area: processData.area || '',
        position: processData.position || '',
        modality: processData.modality || 'Presencial',
        status: processData.status || 'Activo',
        requested_by: processData.requested_by || '',
        created_by: processData.created_by || 'admin',
        start_date: processData.start_date ? processData.start_date.split('T')[0] : '',
        end_date: processData.end_date ? processData.end_date.split('T')[0] : '',
        requiredSkills: processData.requiredSkills || [],
        optionalSkills: processData.optionalSkills || [],
        jobFunctions: processData.job_functions || '',
        jobRequirements: processData.job_requirements || '',
      }))
    } catch (error) {
      console.error('Error al cargar el proceso:', error)
      toast.error('Error al cargar el proceso')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (processId) {
      loadProcess()
    }
  }, [processId])

  useEffect(() => {
    setIsClient(true)
    loadInitialSkills()
  }, [])

  const loadInitialSkills = async () => {
    try {
      const skills = await fetchSkills()
      // Eliminar duplicados basados en el ID
      const uniqueSkills = Array.from(new Map(skills.map((skill) => [skill.value, skill])).values())
      setSkillOptions(uniqueSkills)
    } catch (error) {
      console.error('Error al cargar habilidades iniciales:', error)
      toast.error('Error al cargar las habilidades')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedProcess = await updateProcess(processId, {
        ...formData,
        requiredSkills: formData.requiredSkills.map((skill) => ({
          skill_id: skill.value,
          level: 3,
          is_required: true,
          is_optional: false,
        })),
        optionalSkills: formData.optionalSkills.map((skill) => ({
          skill_id: skill.value,
          level: 1,
          is_required: false,
          is_optional: true,
        })),
      })

      toast.success('Proceso actualizado exitosamente')
      await loadProcess()
    } catch (error) {
      console.error('Error al actualizar el proceso:', error)
      toast.error(`Error al actualizar el proceso: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Maneja los cambios en el editor WYSIWYG
   * @function handleEditorChange
   * @param {string} value - Contenido del editor
   * @param {string} field - Campo a actualizar
   */
  const handleEditorChange = (value, field) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }))
  }

  /**
   * Maneja los cambios en los campos del formulario
   * @function handleInputChange
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e - Evento de cambio
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  /**
   * Maneja los cambios en el multi-select de habilidades
   * @function handleSkillsChange
   * @param {Array<{value: string, label: string}>} selectedOptions - Opciones seleccionadas
   * @param {string} skillType - Tipo de habilidad ('requiredSkills' o 'optionalSkills')
   */
  const handleSkillsChange = (selectedOptions, skillType) => {
    setFormData((prevData) => ({ ...prevData, [skillType]: selectedOptions || [] }))
  }

  /**
   * Carga las opciones de habilidades para el select
   * @function loadOptions
   * @param {string} inputValue - Texto ingresado para filtrar
   * @returns {Promise<Array>} Opciones de habilidades filtradas
   */
  const loadOptions = useCallback(async (inputValue) => {
    try {
      const skills = await fetchSkills(inputValue)
      return skills.map((skill) => ({
        value: skill.id,
        label: skill.name,
      }))
    } catch (error) {
      console.error('Error al cargar las habilidades:', error)
      return []
    }
  }, [])

  /**
   * Maneja la creación de una nueva habilidad
   * @function handleCreateSkill
   * @param {string} inputValue - Valor ingresado por el usuario
   * @returns {Promise<Object|null>} Nueva opción de habilidad o null si hay un error
   */
  const handleCreateSkill = async (inputValue) => {
    try {
      const skill = await createOrGetSkill(inputValue)
      const newOption = {
        value: skill.id,
        label: skill.name,
      }

      // Verificar si la habilidad ya está en las opciones
      const skillExists = skillOptions.some((option) => option.value === skill.id)

      if (!skillExists) {
        setSkillOptions((prevOptions) => [...prevOptions, newOption])
      }

      toast.success(
        `Habilidad "${skill.name}" ${skillExists ? 'seleccionada' : 'agregada'} correctamente`,
      )
      return newOption
    } catch (error) {
      console.error('Error al crear/obtener habilidad:', error)
      toast.error(`Error: ${error.message}`)
      return null
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-xl shadow-primary/5 text-dark-blue">
      <h2 className="text-2xl font-bold text-primary">Editar Proceso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre del proceso"
            value={formData.name}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Posición"
            value={formData.position}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="area"
            placeholder="Área"
            value={formData.area}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="modality"
            value={formData.modality}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="Presencial">Presencial</option>
            <option value="Remoto">Remoto</option>
            <option value="Híbrido">Híbrido</option>
          </select>
          <input
            type="text"
            name="requested_by"
            placeholder="Solicitado por"
            value={formData.requested_by}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Fecha de inicio</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Fecha de término</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Habilidades requeridas
            </label>
            {isClient && (
              <CreatableAsyncSelect
                isMulti
                cacheOptions
                defaultOptions={skillOptions}
                loadOptions={loadOptions}
                value={formData.requiredSkills}
                onChange={(selectedOptions) =>
                  handleSkillsChange(selectedOptions, 'requiredSkills')
                }
                onCreateOption={async (inputValue) => {
                  const newOption = await handleCreateSkill(inputValue)
                  if (newOption) {
                    handleSkillsChange([...formData.requiredSkills, newOption], 'requiredSkills')
                  }
                }}
                placeholder="Selecciona o escribe para agregar..."
                formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
                noOptionsMessage={() => 'No hay opciones'}
                loadingMessage={() => 'Cargando...'}
              />
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Habilidades opcionales
            </label>
            {isClient && (
              <CreatableAsyncSelect
                isMulti
                cacheOptions
                defaultOptions={skillOptions}
                loadOptions={loadOptions}
                value={formData.optionalSkills}
                onChange={(selectedOptions) =>
                  handleSkillsChange(selectedOptions, 'optionalSkills')
                }
                onCreateOption={async (inputValue) => {
                  const newOption = await handleCreateSkill(inputValue)
                  if (newOption) {
                    handleSkillsChange([...formData.optionalSkills, newOption], 'optionalSkills')
                  }
                }}
                placeholder="Selecciona o escribe para agregar..."
                formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
                noOptionsMessage={() => 'No hay opciones'}
                loadingMessage={() => 'Cargando...'}
              />
            )}
          </div>
        </div>
        <div className="mt-4 mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">Funciones del Cargo</label>
          <ReactQuill
            value={formData.jobFunctions}
            onChange={(value) => handleEditorChange(value, 'jobFunctions')}
            className="w-full p-2 border rounded"
            placeholder="Describa las funciones del cargo"
            style={{ height: '200px', marginBottom: '50px' }}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean'],
              ],
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Requerimientos del Cargo
          </label>
          <ReactQuill
            value={formData.jobRequirements}
            onChange={(value) => handleEditorChange(value, 'jobRequirements')}
            className="w-full p-2 border rounded"
            placeholder="Describa los requerimientos del cargo"
            style={{ height: '200px', marginBottom: '50px' }}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean'],
              ],
            }}
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2 text-white transition-colors bg-green-500 rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProcessForm
