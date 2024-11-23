import { supabase } from '../../../lib/supabaseClient';

/**
 * Obtiene un proceso específico con sus habilidades
 * @async
 * @function fetchProcessById
 * @param {string} id - ID del proceso
 * @returns {Promise<Object>} Proceso con sus habilidades
 */
export const fetchProcessById = async (id) => {
  try {
    const { data: process, error: processError } = await supabase
      .from('processes')
      .select(`
        *,
        process_skills!left (
          id,
          level,
          is_required,
          is_optional,
          skills!left (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (processError) throw processError;

    return formatProcessData(process);
  } catch (error) {
    console.error('Error al obtener el proceso:', error);
    throw error;
    // throw handleError(error, 'Error al obtener el proceso');
  }
};

/**
 * Formatea los datos del proceso para el frontend
 * @private
 * @function formatProcessData
 * @param {Object} process - Datos crudos del proceso
 * @returns {Object} Proceso formateado
 */
const formatProcessData = (process) => {
  const processSkills = process.process_skills || [];

  const requiredSkills = processSkills
    .filter(ps => ps && ps.is_required)
    .map(ps => ({
      value: ps.skills.id,
      label: ps.skills.name,
      level: ps.level
    }));

  const optionalSkills = processSkills
    .filter(ps => ps && ps.is_optional)
    .map(ps => ({
      value: ps.skills.id,
      label: ps.skills.name,
      level: ps.level
    }));

  return {
    ...process,
    requiredSkills,
    optionalSkills
  };
};
