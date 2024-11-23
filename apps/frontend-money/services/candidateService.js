import { supabase } from '../lib/supabaseClient';

/**
 * @typedef {Object} CandidateSkill
 * @property {string} name - Nombre de la habilidad
 * @property {string} level - Nivel de experiencia
 * @property {number} years - Años de experiencia
 */

/**
 * @typedef {Object} Candidate
 * @property {string} id - ID único del candidato
 * @property {string} name - Nombre completo
 * @property {string} email - Correo electrónico
 * @property {string} phone - Teléfono
 * @property {string} status - Estado actual
 * @property {number} ai_score - Puntuación IA
 * @property {string} linkedin_url - URL de LinkedIn
 * @property {string} experience - Experiencia laboral
 * @property {string} match_feedback - Retroalimentación del match
 * @property {CandidateSkill[]} skills - Habilidades del candidato
 */

/**
 * Estados válidos para un candidato
 * @type {string[]}
 */
export const VALID_CANDIDATE_STATUSES = [
  'Postulado',
  'Entrevistado',
  'Seleccionado',
  'Rechazado',
  'Evaluación interna',
  'En revisión TM/TL',
  'Solicitud de entrevista'
];

/**
 * Obtiene la lista de candidatos desde Supabase
 * @async
 * @function fetchCandidates
 * @returns {Promise<Candidate[]>} Lista de candidatos
 * @throws {Error} Si hay un error al obtener los candidatos
 */
export const fetchCandidates = async () => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
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
    console.error('Error al obtener candidatos:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de un candidato en Supabase
 * @async
 * @function updateCandidateStatus
 * @param {string} id - ID del candidato
 * @param {string} newStatus - Nuevo estado del candidato
 * @returns {Promise<void>}
 * @throws {Error} Si hay un error al actualizar el estado del candidato o si el estado no es válido
 */
export const updateCandidateStatus = async (id, newStatus) => {
  if (!VALID_CANDIDATE_STATUSES.includes(newStatus)) {
    throw new Error(`Estado no válido: ${newStatus}`);
  }

  try {
    const { error } = await supabase
      .from('candidates')
      .update({ status: newStatus, update_date: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error al actualizar el estado del candidato:', error);
    throw error;
  }
};

/**
 * Obtiene los datos completos de un candidato por su ID
 * @async
 * @function fetchCandidateById
 * @param {string} id - ID del candidato
 * @returns {Promise<Candidate>} Datos completos del candidato
 * @throws {Error} Si hay un error en la consulta o el candidato no existe
 */
export async function fetchCandidateById(id) {
  try {
    // Obtener datos básicos del candidato
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single();

    if (candidateError) throw new Error(`Error al obtener candidato: ${candidateError.message}`);
    if (!candidate) throw new Error('Candidato no encontrado');

    // Obtener habilidades del candidato
    const { data: skills, error: skillsError } = await supabase
      .from('candidate_skills')
      .select(`
        level,
        skills (
          id,
          name
        )
      `)
      .eq('candidate_id', id);

    if (skillsError) throw new Error(`Error al obtener habilidades: ${skillsError.message}`);

    // Formatear las habilidades
    const formattedSkills = skills.map(skill => ({
      name: skill.skills.name,
      level: skill.level,
      years: 0 // TODO: Agregar campo years a la tabla si es necesario
    }));

    return {
      ...candidate,
      applicationDate: formatDateForUI(candidate.created_at),
      updateDate: formatDateForUI(candidate.update_date),
      interviewDate: formatDateForUI(candidate.interview_date),
      skills: formattedSkills
    };
  } catch (error) {
    console.error('Error en fetchCandidateById:', error);
    throw error;
  }
}

/**
 * Formatea una fecha para mostrar en la UI
 * @function formatDateForUI
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
const formatDateForUI = (date) => {
  if (!date) return 'No disponible';
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';
  
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(dateObj).replace(/\./g, ':');
};
