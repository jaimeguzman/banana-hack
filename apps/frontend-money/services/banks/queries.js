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

// ... existing code ...

/**
 * Obtiene la información del producto de un candidato específico
 * 
 */
export const fetchProductInfo = async (candidateId) => {
  try {



    const { data, error } = await supabase
      .from('candidates')
      .select('product')
      .eq('id', candidateId)
      .single()

    if (error) throw error
    return data.product
  } catch (error) {
    console.error('Error fetching product info:', error)
    throw error
  }
}

/**
 * Obtiene la información del producto de todos los candidatos
 * @async
 * @function fetchAllProductsInfo
 * @returns {Promise<Array>} Lista de información de productos
 * @throws {Error} Error al obtener la información
 */
export const fetchAllProductsInfo = async () => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('id, product')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching all products info:', error)
    throw error
  }
}