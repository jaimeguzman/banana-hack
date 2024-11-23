import { supabase } from '../../../lib/supabaseClient';

/**
 * Crea una nueva habilidad o retorna una existente
 * @async
 * @function createOrGetSkill
 * @param {string} skillName - Nombre de la habilidad
 * @returns {Promise<{id: string, name: string}>} Habilidad creada o existente
 */
export const createOrGetSkill = async (skillName) => {
  try {
    // Primero buscar si la habilidad ya existe
    const { data: existingSkills, error: searchError } = await supabase
      .from('skills')
      .select('id, name')
      .ilike('name', skillName)
      .limit(1);

    if (searchError) throw searchError;

    // Si la habilidad existe, retornarla
    if (existingSkills && existingSkills.length > 0) {
      return existingSkills[0];
    }

    // Si no existe, crear nueva habilidad
    const { data: newSkill, error: createError } = await supabase
      .from('skills')
      .insert({ name: skillName })
      .select()
      .single();

    if (createError) throw createError;

    return newSkill;
  } catch (error) {
    console.error('Error en createOrGetSkill:', error);
    throw error;
  }
};
