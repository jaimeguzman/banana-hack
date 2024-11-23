import { v4 as uuidv4 } from 'uuid';

/**
 * Simula un retraso en la respuesta de la API
 * @param {number} ms - Milisegundos de retraso
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @typedef {Object} Candidate
 * @property {string} id - ID único del candidato
 * @property {string} name - Nombre completo del candidato
 * @property {string} updateDate - Fecha de última actualización
 * @property {string} interviewDate - Fecha de entrevista programada
 * @property {number} aiScore - Puntuación de la evaluación por IA
 * @property {string} status - Estado actual del candidato en el proceso
 * @property {string} linkedinUrl - URL del perfil de LinkedIn del candidato
 */

/** @type {Candidate[]} */
let candidates = [
  { 
    id: uuidv4(), 
    name: 'Iván Carrasco', 
    updateDate: '15-10-2024 19:21', 
    interviewDate: 'dd-mm-aaaa --:--', 
    aiScore: 0, 
    status: 'Evaluación interna',
    linkedinUrl: 'https://www.linkedin.com/'
  },
  { id: uuidv4(), name: 'Carlos León', updateDate: '15-10-2024 19:21', interviewDate: 'dd-mm-aaaa --:--', aiScore: 0, status: 'Evaluación interna', linkedinUrl: 'https://www.linkedin.com/' },
  { id: uuidv4(), name: 'Bastian Bastias Sanchez', updateDate: '15-10-2024 19:21', interviewDate: 'dd-mm-aaaa --:--', aiScore: 100, status: 'En revisión TM/TL', linkedinUrl: '' },
  { id: uuidv4(), name: 'Christopher Sierra', updateDate: '15-10-2024 19:21', interviewDate: 'dd-mm-aaaa --:--', aiScore: 66, status: 'Solicitud de entrevista', linkedinUrl: '' },
  { id: uuidv4(), name: 'Fernando Garcia', updateDate: '15-10-2024 19:21', interviewDate: 'dd-mm-aaaa --:--', aiScore: 100, status: 'En revisión TM/TL', linkedinUrl: '' },
];

/**
 * Obtiene la lista de candidatos
 * @async
 * @returns {Promise<Candidate[]>} Lista de candidatos
 */
export const fetchCandidates = async () => {
  await delay(500); // Simula un retraso de red
  return candidates;
};

/**
 * Agrega un nuevo candidato
 * @async
 * @param {Omit<Candidate, 'id'>} candidate - Datos del nuevo candidato
 * @returns {Promise<Candidate>} Candidato agregado con ID generado
 */
export const addCandidate = async (candidate) => {
  await delay(500);
  const newCandidate = { ...candidate, id: uuidv4() };
  candidates.push(newCandidate);
  return newCandidate;
};

/**
 * Actualiza los datos de un candidato existente
 * @async
 * @param {string} id - ID del candidato a actualizar
 * @param {Partial<Candidate>} updates - Datos a actualizar
 * @returns {Promise<Candidate>} Candidato actualizado
 * @throws {Error} Si el candidato no se encuentra
 */
export const updateCandidate = async (id, updates) => {
  await delay(500);
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Candidato no encontrado');
  }
  candidates[index] = { ...candidates[index], ...updates };
  return candidates[index];
};

/**
 * Elimina un candidato
 * @async
 * @param {string} id - ID del candidato a eliminar
 * @returns {Promise<void>}
 * @throws {Error} Si el candidato no se encuentra
 */
export const deleteCandidate = async (id) => {
  await delay(500);
  const initialLength = candidates.length;
  candidates = candidates.filter(c => c.id !== id);
  if (candidates.length === initialLength) {
    throw new Error('Candidato no encontrado');
  }
};

/**
 * Obtiene un candidato por su ID
 * @async
 * @param {string} id - ID del candidato
 * @returns {Promise<Candidate>} Datos del candidato
 * @throws {Error} Si el candidato no se encuentra
 */
export const getCandidateById = async (id) => {
  await delay(500);
  const candidate = candidates.find(c => c.id === id);
  if (!candidate) {
    throw new Error('Candidato no encontrado');
  }
  return candidate;
};
