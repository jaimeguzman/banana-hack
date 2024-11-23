import { supabase } from '../../../lib/supabaseClient';

/**
 * Actualiza el contador de candidatos de un proceso
 * @async
 * @param {string} processId - ID del proceso a actualizar
 * @param {number} count - Número de candidatos
 * @returns {Promise<void>}
 */
export const updateProcessCount = async (processId, count) => {
  const { error } = await supabase
    .from('processes')
    .update({ candidates_count: count })
    .eq('id', processId);

  if (error) throw error;
};