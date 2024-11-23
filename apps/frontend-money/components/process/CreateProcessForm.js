import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { fetchSkills } from '../../services/skills';
import { createSkill } from '../../services/skills';
import { createProcess } from '../../services/process';
import { deleteProcess } from '../../services/process';
import { createOrGetSkill } from '../../services/skills/actions/createOrGetSkill';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css'; // Importa los estilos de Quill

// Importación dinámica de CreatableAsyncSelect con SSR desactivado
const CreatableAsyncSelect = dynamic(
  () => import('react-select/async-creatable').then(mod => mod.default),
  { ssr: false }
);

// Importación dinámica de ReactQuill para evitar problemas con SSR
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

/**
 * Componente para crear un nuevo proceso de kairo
 * @component
 * @returns {JSX.Element} Formulario para crear un nuevo proceso
 */
const CreateProcessForm = () => {
  const router = useRouter();
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
    jobRequirements: ''
  });

  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [skillOptions, setSkillOptions] = useState([]);

  useEffect(() => {
    setIsClient(true);
    loadInitialSkills();
  }, []);

  const loadInitialSkills = async () => {
    try {
      const skills = await fetchSkills();
      setSkillOptions(skills);
    } catch (error) {
      console.error('Error al cargar habilidades iniciales:', error);
    }
  };

  /**
   * Maneja los cambios en los campos del formulario
   * @function handleInputChange
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e - Evento de cambio
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Maneja los cambios en el editor WYSIWYG
   * @function handleEditorChange
   * @param {string} value - Contenido del editor
   * @param {string} field - Campo a actualizar
   */
  const handleEditorChange = (value, field) => {
    setFormData({ ...formData, [field]: value });
  };

  /**
   * Maneja los cambios en el multi-select de habilidades
   * @function handleSkillsChange
   * @param {Array<{value: string, label: string}>} selectedOptions - Opciones seleccionadas
   * @param {string} skillType - Tipo de habilidad ('mandatorySkills' o 'optionalSkills')
   */
  const handleSkillsChange = (selectedOptions, skillType) => {
    setFormData(prevData => ({
      ...prevData,
      [skillType]: selectedOptions || []
    }));
  };

  /**
   * Maneja el envío del formulario
   * @function handleSubmit
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const processData = {
        ...formData,
        requiredSkills: formData.requiredSkills.map(skill => ({
          value: skill.value,
          label: skill.label,
          level: 3
        })),
        optionalSkills: formData.optionalSkills.map(skill => ({
          value: skill.value,
          label: skill.label,
          level: 1
        }))
      };

      const createdProcess = await createProcess(processData);
      router.push(`/process/${createdProcess.id}`);
    } catch (error) {
      console.error('Error al crear el proceso:', error);
      alert('Hubo un error al crear el proceso. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Carga las opciones de habilidades
   * @function loadOptions
   * @param {string} inputValue - Valor ingresado por el usuario
   * @returns {Promise<Array<{value: string, label: string}>>} Opciones filtradas
   */
  const loadOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 2) return [];
    const filteredOptions = skillOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    return filteredOptions;
  }, [skillOptions]);

  /**
   * Maneja la creación de una nueva habilidad
   * @function handleCreateSkill
   * @param {string} inputValue - Valor ingresado por el usuario
   * @returns {Promise<Object|null>} Nueva opción de habilidad o null si hay un error
   */
  const handleCreateSkill = async (inputValue) => {
    try {
      const skill = await createOrGetSkill(inputValue);
      const newOption = { 
        value: skill.id,
        label: skill.name 
      };
      
      // Verificar si la habilidad ya está en las opciones
      const skillExists = skillOptions.some(option => option.value === skill.id);
      
      if (!skillExists) {
        setSkillOptions(prevOptions => [...prevOptions, newOption]);
      }
      
      toast.success(`Habilidad "${skill.name}" ${skillExists ? 'seleccionada' : 'agregada'} correctamente`);
      return newOption;
    } catch (error) {
      console.error('Error al crear/obtener habilidad:', error);
      toast.error(`Error: ${error.message}`);
      return null;
    }
  };

  // Traducciones personalizadas para CreatableAsyncSelect
  const customSelectMessages = {
    create: 'Crear',
    createOption: (inputValue) => `Crear "${inputValue}"`,
    noOptions: 'No hay opciones',
    loadingMessage: () => 'Cargando...',
  };

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-xl shadow-primary/5 text-dark-blue">
      <h2 className="text-2xl font-bold text-primary">Crear Nuevo Proceso</h2>
      <p className="font-semibold">Especifica los detalles del proceso de kairo</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            color="primary"
            variant="bordered"
            type="text"
            name="name"
            placeholder="Nombre del proceso"
            value={formData.name}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            color="primary"
            variant="bordered"
            type="text"
            name="position"
            placeholder="Posición"
            value={formData.position}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            color="primary"
            variant="bordered"
            type="text"
            name="area"
            placeholder="Área"
            value={formData.area}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <select            
            color="primary"
            variant="bordered"
            name="modality"
            value={formData.modality}
            onChange={handleInputChange}
            className="border p-2 rounded"
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
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="col-span-3 grid grid-cols-2 gap-4 mb-6"> {/* Aumentar margen inferior */}
        <p className="col-span-12 font-semibold">Indíca la duración del proceso de kairo</p>

          <div>
            <label htmlFor="start_date" className="block text-gray-700 text-sm font-bold mb-2">
              Fecha de inicio
            </label>
            <input
              color="primary"
              variant="bordered"
              lang="es"
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-gray-700 text-sm font-bold mb-2">
              Fecha de término
            </label>
            <input
              color="primary"
              variant="bordered"
              lang="es"
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        </div>

        <div className="col-span-3 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requiredSkills">
              Clasificaciones financieras
            </label>
            {isClient && (
              <CreatableAsyncSelect
                isMulti
                cacheOptions
                defaultOptions={skillOptions}
                loadOptions={loadOptions}
                onCreateOption={async (inputValue) => {
                  const newOption = await handleCreateSkill(inputValue);
                  if (newOption) {
                    handleSkillsChange([...formData.requiredSkills, newOption], 'requiredSkills');
                  }
                }}
                onChange={(selectedOptions) => handleSkillsChange(selectedOptions, 'requiredSkills')}
                placeholder="Selecciona o escribe para agregar..."
                formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
                noOptionsMessage={() => 'No hay opciones'}
                loadingMessage={() => 'Cargando...'}
              />
            )}
          </div>
          {/* <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="optionalSkills">
              Habilidades opcionales
            </label>
            {isClient && (
              <CreatableAsyncSelect
                isMulti
                cacheOptions
                defaultOptions={skillOptions}
                loadOptions={loadOptions}
                onCreateOption={async (inputValue) => {
                  const newOption = await handleCreateSkill(inputValue);
                  if (newOption) {
                    handleSkillsChange([...formData.optionalSkills, newOption], 'optionalSkills');
                  }
                }}
                onChange={(selectedOptions) => handleSkillsChange(selectedOptions, 'optionalSkills')}
                placeholder="Selecciona o escribe para agregar..."
                formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
                noOptionsMessage={() => 'No hay opciones'}
                loadingMessage={() => 'Cargando...'}
              />
            )}
          </div> */}
        </div>

        {/* <div className="mb-4 mt-4">
          <label htmlFor="jobFunctions" className="block text-gray-700 text-sm font-bold mb-2">
            Funciones del Cargo
          </label>
          <ReactQuill
            value={formData.jobFunctions}
            onChange={(value) => handleEditorChange(value, 'jobFunctions')} 
            className="border p-2 rounded w-full"
            placeholder="Describa las funciones del cargo"
            style={{ height: '200px', marginBottom: '50px' }}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['clean']
              ]
            }}
          />
        </div> */}

        {/* <div className="mb-4">
          <label htmlFor="jobRequirements" className="block text-gray-700 text-sm font-bold mb-2">
            Requerimientos del Cargo
          </label>
          <ReactQuill
            value={formData.jobRequirements}
            onChange={(value) => handleEditorChange(value, 'jobRequirements')}
            className="border p-2 rounded w-full"
            placeholder="Describa los requerimientos del cargo"
            style={{ height: '200px', marginBottom: '50px' }}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['clean']
              ]
            }}
          />
        </div> */}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear Proceso'}
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CreateProcessForm;
