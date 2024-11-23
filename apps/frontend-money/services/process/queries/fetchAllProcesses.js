import { supabase } from '../../../lib/supabaseClient';
import { handleError } from '../../utils/errorHandler';

/**
 * @typedef {Object} Process
 * @property {string} id - ID único del proceso
 * @property {string} name - Nombre del proceso
 * @property {string} status - Estado del proceso
 * @property {string} created_by - Usuario que creó el proceso
 * @property {string} requested_by - Usuario que solicitó el proceso
 * @property {string} area - Área del proceso
 * @property {string} modality - Modalidad del proceso
 * @property {string} start_date - Fecha de inicio del proceso
 * @property {string} end_date - Fecha de finalización del proceso
 */

/**
 * Obtiene todos los procesos de la tabla 'processes' en Supabase.
 * @async
 * @function fetchAllProcesses
 * @returns {Promise<Array<Process>>} Una promesa que resuelve a un array de objetos de proceso.
 * @throws {Error} Si hay un error al obtener los procesos.
 */
export const fetchAllProcesses = async () => {
  try {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error, 'Error al obtener los procesos');
  }
};
