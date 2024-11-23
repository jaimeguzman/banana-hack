import { supabase } from '../../../lib/supabaseClient';

/**
 * @typedef {Object} DeleteProcessResponse
 * @property {boolean} success - Indica si la eliminación fue exitosa
 * @property {string} [error] - Mensaje de error si la eliminación falló
 */

/**
 * Elimina un proceso y sus relaciones asociadas
 * @async
 * @function deleteProcess
 * @param {string} id - ID del proceso a eliminar
 * @returns {Promise<DeleteProcessResponse>} Resultado de la operación
 */
export const deleteProcess = async (id) => {
  try {
    // 1. Primero eliminamos las relaciones en process_skills
    const { error: skillsError } = await supabase
      .from('process_skills')
      .delete()
      .eq('process_id', id);

    if (skillsError) {
      throw new Error('Error al eliminar las habilidades del proceso: ' + skillsError.message);
    }

    // 2. Luego eliminamos el proceso
    const { error: processError } = await supabase
      .from('processes')
      .delete()
      .eq('id', id);

    if (processError) {
      throw new Error('Error al eliminar el proceso: ' + processError.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Error en deleteProcess:', error);
    return {
      success: false,
      error: error.message
    };
  }
};


