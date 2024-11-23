import { supabase } from '../../lib/supabaseClient'

/**
 * Obtiene todos los bancos desde Supabase
 * @async
 * @function fetchBanks
 * @returns {Promise<Array>} Lista de bancos
 * @throws {Error} Error al obtener los bancos
 */
export const fetchBanks = async () => {
  try {
    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching banks:', error)
    throw error
  }
}
