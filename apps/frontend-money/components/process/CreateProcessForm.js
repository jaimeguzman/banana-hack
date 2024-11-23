import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { fetchSkills } from '../../services/skills';
import { createSkill } from '../../services/skills';
import { createProcess } from '../../services/process';
import { deleteProcess } from '../../services/process';
import { createOrGetSkill } from '../../services/skills/actions/createOrGetSkill';
import { fetchBanks } from '../../services/banks/queries';
import { Select, SelectItem } from '@nextui-org/react';

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
 * Select de bancos simplificado
 * @param {Object} props
 * @param {Array} props.banks - Lista de bancos desde Supabase
 * @param {Function} props.onChange - Función para manejar cambios
 * @param {string} props.value - Valor seleccionado
 */
const BankSelect = ({ banks, onChange, value }) => (
  <div className="form-group">
    <label htmlFor="bank" className="block text-gray-700 text-sm font-bold mb-2">
      Selecciona un banco
    </label>
    <select
      id="bank"
      name="name"
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
      required
    >
      <option value="" disabled>Selecciona un banco</option>
      {banks.map((bank) => (
        <option key={bank.id} value={bank.name}>
          {bank.name} - {bank.tipo}
        </option>
      ))}
    </select>
  </div>
);

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
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    setIsClient(true);
    loadInitialSkills();
    loadBanks();
  }, []);

  const loadInitialSkills = async () => {
    try {
      const skills = await fetchSkills();
      setSkillOptions(skills);
    } catch (error) {
      console.error('Error al cargar habilidades iniciales:', error);
    }
  };

  // SI 
  const loadBanks = async () => {
    try {
      const banksData = await fetchBanks();
      setBanks(banksData);
    } catch (error) {
      console.error('Error loading banks:', error);
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
   */
  const loadOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 2) return [];
    const filteredOptions = skillOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    return filteredOptions;
  }, [skillOptions]);

 
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



          <BankSelect 
            banks={banks}
            value={formData.name}
            onChange={handleInputChange}
          />
          <select            
            color="primary"
            variant="bordered"
            name="typeProduct"
            className="border p-2 rounded"
            placeholder="Seleccion Producto"
            defaultValue=""
            required
          >
            <option value="" disabled>Seleccion Producto</option>
            <option value="CreditCard">Tarjeta de Credito</option>
            <option value="DebitCard" disabled>Tarjeta de Debito</option>
            <option value="WalletCard" disabled>Billetera Virtual</option>
          </select>


 
 
 
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

        </div>

 

     

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
