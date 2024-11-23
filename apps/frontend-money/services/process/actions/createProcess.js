import { supabase } from '../../../lib/supabaseClient';

/**
 * @typedef {Object} ProcessSkill
 * @property {string} label - Nombre de la habilidad
 * @property {string} name - Nombre alternativo de la habilidad
 * @property {number} level - Nivel de la habilidad
 */

/**
 * @typedef {Object} ProcessData
 * @property {string} name - Nombre del proceso
 * @property {string} area - Área del proceso
 * @property {string} requested_by - Solicitante del proceso
 * @property {string} position - Posición del proceso
 * @property {Array<ProcessSkill>} requiredSkills - Habilidades requeridas
 * @property {Array<ProcessSkill>} optionalSkills - Habilidades opcionales
 * @property {string} start_date - Fecha de inicio del proceso (ISO string)
 * @property {string|null} end_date - Fecha de fin del proceso (ISO string o null)
 * @property {string} modality - Modalidad del proceso
 * @property {string} status - Estado del proceso
 * @property {string} created_by - Usuario que crea el proceso
 * @property {string} jobFunctions - Funciones del cargo
 * @property {string} jobRequirements - Requerimientos del cargo
 */

/**
 * Crea un nuevo proceso en la base de datos
 * @async
 * @function createProcess
 * @param {ProcessData} processData - Datos del proceso a crear
 * @returns {Promise<Object>} El proceso creado
 * @throws {Error} Si hay un error al crear el proceso
 */
export const createProcess = async (processData) => {
  try {
    console.log('Datos recibidos en createProcess:', processData);

    const { requiredSkills, optionalSkills, jobFunctions, jobRequirements, ...rest } = processData;
    
    // Validar que las habilidades sean arrays
    const validRequiredSkills = Array.isArray(requiredSkills) ? requiredSkills : [];
    const validOptionalSkills = Array.isArray(optionalSkills) ? optionalSkills : [];
    
    // 1. Crear el proceso base
    const { data: process, error } = await supabase
      .from('processes')
      .insert({
        ...rest,
        job_functions: jobFunctions,
        job_requirements: jobRequirements
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Procesar las habilidades si existen
    await processSkills(process.id, validRequiredSkills, validOptionalSkills);

    return process;
  } catch (error) {
    console.error('Error en createProcess:', error);
    throw error;
  }
};

/**
 * Procesa y asocia las habilidades a un proceso
 * @async
 * @function processSkills
 * @private
 * @param {string} processId - ID del proceso
 * @param {Array<ProcessSkill>} requiredSkills - Habilidades requeridas
 * @param {Array<ProcessSkill>} optionalSkills - Habilidades opcionales
 */
const processSkills = async (processId, requiredSkills, optionalSkills) => {
  const allSkills = [...requiredSkills, ...optionalSkills];
  
  if (allSkills.length === 0) return;

  // Crear las habilidades
  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .insert(allSkills.map(skill => ({ 
      name: skill.label || skill.name 
    })))
    .select();

  if (skillsError) throw skillsError;

  // Crear las asociaciones proceso-habilidad
  const processSkills = [
    ...requiredSkills.map(skill => ({
      process_id: processId,
      skill_id: skills.find(s => s.name === (skill.label || skill.name)).id,
      level: skill.level || 3,
      is_required: true,
      is_optional: false
    })),
    ...optionalSkills.map(skill => ({
      process_id: processId,
      skill_id: skills.find(s => s.name === (skill.label || skill.name)).id,
      level: skill.level || 1,
      is_required: false,
      is_optional: true
    }))
  ];

  if (processSkills.length > 0) {
    const { error: processSkillsError } = await supabase
      .from('process_skills')
      .insert(processSkills);

    if (processSkillsError) throw processSkillsError;
  }
};
