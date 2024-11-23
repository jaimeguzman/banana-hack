import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Asegúrate de que esta URL coincida con tu backend

/**
 * Sube archivos al servidor y procesa los CVs.
 * @param {FormData} formData - Datos del formulario que contienen los archivos y el process_id.
 * @returns {Promise<Object>} Resultado del procesamiento de los archivos.
 * @throws {Error} Si hay un error en la solicitud.
 */
export const uploadFiles = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("::::::::::: response::::::::::::");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('\n\nError en la solicitud de carga:', error.response?.data || error.message);
    throw error;
  }
};
