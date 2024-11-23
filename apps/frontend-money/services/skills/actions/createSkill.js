import { supabase } from '../../../lib/supabaseClient';

/**
 * Crea una nueva habilidad en la base de datos
 * @async
 * @function createSkill
 * @param {string} skillName - Nombre de la nueva habilidad
 * @returns {Promise<Object>} La habilidad creada
 * @throws {Error} Si hay un error al crear la habilidad
 */
export const createSkill = async (skillName) => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .insert({ name: skillName })
      .select()
      .single();

    if (error) throw error;
    if (!data || !data.name) {
      throw new Error('La habilidad creada no tiene un nombre válido');
    }

    return data;
  } catch (error) {
    console.error('Error al crear habilidad:', error);
    throw error;
  }
};
