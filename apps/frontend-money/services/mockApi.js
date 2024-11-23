// apps/ats-ui/services/mockApi.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;


/**
 * Realiza la carga de archivos al servidor FastAPI.
 * 
 * @param {Array} files - Lista de archivos a subir.
 * @returns {Promise<Object>} - Respuesta del servidor con los archivos subidos o un error si ocurre algún problema.
 */
export const uploadFiles = async (files) => {
  const formData = new FormData();

  // Añadir cada archivo al objeto FormData
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await fetch('http://127.0.0.1:8000/upload/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error en la subida de archivos');
    }

    const data = await response.json();
    console.log('Archivos subidos exitosamente:', data);
    
    return {
      success: true,
      message: 'Archivos cargados exitosamente',
      uploadedFiles: data.uploaded_files.map(file => ({
        name: file.filename,
        size: file.size,
        type: 'application/pdf'
      }))
    };
    
  } catch (error) {
    console.error('Error al subir archivos:', error);
    return {
      success: false,
      message: 'Error al subir archivos',
      error: error.message
    };
  }
};