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
export const fetchProductInfo = async () => {
  try {
    const userSession = localStorage.getItem('userSession');
    const user = JSON.parse(userSession);

    const { data, error } = await supabase
      .from('candidates')
      .select(`
        id,
        process_id,
        product
      `)      
      .eq('user_id', user.username)
      .single()

    if (error) throw error
    console.log('\n\n📦 Product info:', data.product)
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
  console.log('🔍 Debug - fetchAllProductsInfo called')
  
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select(`
        id,
        process_id,
        product
      `)

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    console.log('✅ All products data received:', data)
    return data
  } catch (error) {
    console.error('❌ Error in fetchAllProductsInfo:', error)
    throw error
  }
}