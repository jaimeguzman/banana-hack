import { supabase } from '../../../lib/supabaseClient';

/**
 * Obtiene todas las habilidades únicas de la base de datos.
 * @async
 * @function fetchSkills
 * @returns {Promise<Array<{value: string, label: string}>>} Una promesa que resuelve a un array de objetos de habilidades.
 * @throws {Error} Si hay un error al obtener las habilidades.
 */
export const fetchSkills = async () => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('id, name');

    if (error) throw error;

    // Formatear para react-select
    return data.map(skill => ({ 
      value: skill.id,  // Ahora usamos el ID como value
      label: skill.name 
    }));
  } catch (error) {
    console.error('Error al obtener habilidades:', error);
    throw error;
  }
};
