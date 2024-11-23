import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFiles } from '../services/api'; // Asegúrate de actualizar este import
import { FiX, FiTrash2 } from 'react-icons/fi';
import { useProcess } from '../context/ProcessContext';
import { useRouter } from 'next/router';
import { Spinner } from '@nextui-org/react'; // Importamos Spinner de NextUI
import { toast } from 'react-hot-toast';

/**
 * @typedef {Object} UploadModalProps
 * @property {boolean} isOpen - Indica si el modal está abierto o cerrado
 * @property {Function} onClose - Función para cerrar el modal
 * @property {Function} onUpload - Función que se ejecuta después de una carga exitosa
 * @property {Function} onUpload - Función que se ejecuta después de una carga exitosa
 */

/**
 * Componente de modal para subir archivos PDF y compararlos con una descripción de trabajo
 * @component
 * @param {UploadModalProps} props - Propiedades del componente
 * @returns {JSX.Element|null} Componente UploadModal o null si está cerrado
 */
const UploadModal = ({ isOpen, onClose, onUpload, jobDescription, reloadCandidates }) => {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { process, setCandidates } = useProcess();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar si el proceso está definido en el contexto
    if (!process || !process.id) {
      console.error('\n\n\n\nProceso no está definido en el contexto');
      // Obtener el ID del proceso de la URL
      const { id } = router.query;
      if (id) {
        console.log('ID del proceso obtenido de la URL:', id);
        // Aquí podrías actualizar el contexto con este ID si es necesario
      } else {
        console.error('No se pudo obtener el ID del proceso de la URL');
      }
    } else {
      // console.log('Proceso obtenido del contexto:', process);
    }
  }, [process, router.query]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      // console.log('Archivos aceptados:', acceptedFiles);
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    },
  });

  /**
   * Maneja la subida de archivos y el cálculo de coincidencia
   * @async
   * @function handleUpload
   */
  const handleUpload = async () => {
    if (files.length === 0) {
      setErrorMessage('Por favor, selecciona al menos un archivo PDF.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      
      const uploadProcessId = process?.id || router.query.id;
      if (!uploadProcessId) throw new Error('No se pudo obtener el ID del proceso');
      
      formData.append('process_id', uploadProcessId);
      // console.log('Tipo de process_id:', typeof uploadProcessId);
      // console.log('Valor de process_id:', uploadProcessId);

      const result = await uploadFiles(formData);
      
      // Esperar a que se complete la carga y luego recargar
      if (reloadCandidates) {
        await reloadCandidates();
      }
      
      toast.success('Archivos procesados correctamente');
      onClose();
    } catch (error) {
      console.error('Error al procesar archivos:', error);
      toast.error('Error al procesar los archivos');
    } finally {
      setIsLoading(false);
      setFiles([]);
    }
  };

  /**
   * Elimina un archivo de la lista de archivos seleccionados
   * @function removeFile
   * @param {string} fileName - Nombre del archivo a eliminar
   */
  const removeFile = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  /**
   * Elimina todos los archivos de la lista de archivos seleccionados
   * @function clearFiles
   */
  const clearFiles = () => {
    setFiles([]);
    setErrorMessage('');
  };

  if (!isOpen) {
    return null;
  }



  /**
   * Obtiene el mensaje de error según el tipo de error
   * @function getErrorMessage
   * @param {Object} error - Objeto de error
   * @returns {string} Mensaje de error
   */
  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'file-invalid-type':
        return 'Tipo de archivo no válido. Por favor, sube solo archivos PDF.';
      case 'file-too-large':
        return `El archivo es demasiado grande. El tamaño máximo permitido es 5MB.`;
      default:
        return `Error: ${error.message}`;
    }
  };

  /**
   * Trunca el nombre del archivo si es muy largo
   * @function truncateFileName
   * @param {string} fileName - Nombre del archivo
   * @param {number} [maxLength=50] - Longitud máxima permitida
   * @returns {string} Nombre del archivo truncado
   */
  const truncateFileName = (fileName, maxLength = 50) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop();
    const nameWithoutExtension = fileName.slice(0, -(extension.length + 1));
    return `${nameWithoutExtension.slice(0, maxLength - 3 - extension.length)}...${extension}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" style={{zIndex: 1000}}>
      <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto relative">
        {/* Overlay del Loader */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg z-10">
            <div className="text-center">
              <Spinner size="lg" color="primary" />
              <p className="mt-2 text-gray-600">Procesando archivos...</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Subir Estado de Cuenta Tarjeta de Crédito</h2>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-8 mb-4 cursor-pointer h-48 flex items-center justify-center">
          <input {...getInputProps()} />
          <p className="text-center">Arrastra y suelta archivos PDF aquí, o haz clic para seleccionar archivos</p>
        </div>
        {files.length > 0 && (
          <>
            <ul className="mb-4">
              {files.map(file => (
                <li key={file.name} className="flex items-center justify-between py-2">
                  <span>{truncateFileName(file.name)}</span>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label={`Eliminar archivo ${file.name}`}
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mb-4">
              <button
                onClick={clearFiles}
                className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <FiTrash2 className="mr-2" />
                Limpiar todos
              </button>
            </div>
          </>
        )}
        {errorMessage && (
          <p className="text-red-500 mb-4">{errorMessage}</p>
        )}
        {fileRejections.length > 0 && (
          <ul className="text-red-500 mb-4">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.path} className="mb-2">
                {truncateFileName(file.path)}
                <br />
                <strong>{errors.map(e => getErrorMessage(e)).join(', ')}</strong>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end items-center mt-4">
          <button 
            onClick={onClose} 
            className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            disabled={isLoading} // Deshabilitamos durante la carga
          >
            Cancelar
          </button>
          <button 
            onClick={handleUpload} 
            className={`px-4 py-2 bg-green-500 text-white rounded transition duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
            }`}
            disabled={isLoading} // Deshabilitamos durante la carga
          >
            {isLoading ? 'Procesando...' : 'Subir y Procesar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
