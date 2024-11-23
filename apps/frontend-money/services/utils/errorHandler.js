/**
 * Maneja errores de forma consistente en la aplicación
 * @function handleError
 * @param {Error} error - Error original
 * @param {string} message - Mensaje de error personalizado
 * @returns {Error} Error formateado
 */
export const handleError = (error, message) => {
  console.error(`${message}:`, error);
  return new Error(`${message}: ${error.message}`);
};
