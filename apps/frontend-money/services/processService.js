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
      .select('id, name, update_date, interview_date, ai_score, status, linkedin_url')
      .eq('process_id', processId)
      .order('update_date', { ascending: false });

    if (error) throw error;

    return data.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      updateDate: candidate.update_date,
      interviewDate: candidate.interview_date,
      aiScore: candidate.ai_score,
      status: candidate.status,
      linkedinUrl: candidate.linkedin_url
    }));
  } catch (error) {
    console.error('Error al obtener los candidatos del proceso:', error);
    throw error;
  }
};






 
