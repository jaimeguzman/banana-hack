import { supabase } from '../lib/supabaseClient';


/**
 * Obtiene los candidatos asociados a un proceso
 * @async
 * @function fetchCandidatesByProcessId
 * @param {string} processId - ID del proceso
 * @returns {Promise<Array>} Lista de candidatos asociados al proceso
 * @throws {Error} Si hay un error al obtener los candidatos
 */
export const fetchCandidatesByProcessId = async (processId) => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('id, movements')
      .eq('process_id', processId)
      .order('update_date', { ascending: false });

    if (error) throw error;

    return data.map(candidate => ({
      id: candidate.id,
      movements: candidate.movements,
    }));
  } catch (error) {
    console.error('Error al obtener los candidatos del proceso:', error);
    throw error;
  }
};

export const normalizeCandidateData = (candidates) => {
  let movements = []
  candidates.forEach((candidate) => {
    movements.push(candidate.movements);
  });

  const cleanedData = movements.filter(
    (item) => item !== null && !(typeof item === "object" && Object.keys(item).length === 0)
  );

  let categoriesTotals = {}
  cleanedData.forEach((movement) => {
    // Función para calcular la suma total de una categoría
    const calculateCategoryTotal = (category) => {
      return category.reduce((sum, item) => sum + item.total, 0);
    };

    for (const [category, items] of Object.entries(movement)) {
      categoriesTotals[category] = calculateCategoryTotal(items);
    }
  });

  // DE ANTEMANO PIDO DISCULPAS POR ESTA FUNCION, NO ME GUSTA COMO QUEDO, 
  // PERO EN EL CONTEXTO DE HACKATHON TODO VALE DX
  return Object.entries(categoriesTotals).map(([category, total]) => ({ category, total }));
};
