import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

/**
 * Componente de botón para volver a la página anterior
 * @component
 * @returns {JSX.Element} Botón de volver
 */
const BackButton = () => {
  const router = useRouter();

  /**
   * Maneja el clic en el botón para volver a la página anterior
   * @function handleBack
   */
  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="text-blue-500 hover:text-blue-600 flex items-center mb-4"
      aria-label="Volver a la página anterior"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      Volver
    </button>
  );
};

/**
 * Componente que muestra los detalles de un candidato
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.candidate - Datos del candidato
 * @returns {JSX.Element} Componente de detalles del candidato
 */
const CandidateDetails = ({ candidate }) => {
  const [imageError, setImageError] = useState(false);

  /**
   * Maneja el error de carga de la imagen del candidato
   * @function handleImageError
   */
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <BackButton />
      <div className="flex items-center mb-6">
        <div className="relative w-16 h-16 mr-4">
          <Image
            src={!imageError ? (candidate.avatarUrl || '/default-avatar.png') : '/mi-perfil-avatar.png'}
            alt={candidate.name}
            width={64}
            height={64}
            className="rounded-full object-cover"
            onError={handleImageError}
            priority={true}
            quality={75}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{candidate.name}</h1>
          <p className="text-gray-600">{candidate.position}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Información de contacto</h2>
          <p>Correo: {candidate.email}</p>
          <p>Teléfono: {candidate.phone || 'No disponible'}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Detalles de la postulación</h2>
          <p className="mb-2">
            <span className="font-medium">Fecha de postulación:</span>{' '}
            <span className="text-gray-700">{candidate.applicationDate}</span>
          </p>
          <p className="mb-2">
            <span className="font-medium">Última actualización:</span>{' '}
            <span className="text-gray-700">{candidate.updateDate}</span>
          </p>
          <p>
            <span className="font-medium">Estado:</span>{' '}
            <span className="text-gray-700">{candidate.status}</span>
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Resumen CV</h2>
        <p>Experiencia total: {candidate.totalExperience} años</p>
        <table className="w-full mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Lenguaje / Framework</th>
              <th className="py-2 px-4 text-left">Experiencia</th>
              <th className="py-2 px-4 text-left">Años de experiencia</th>
            </tr>
          </thead>
          <tbody>
            {candidate.skills.map((skill, index) => (
              <tr key={index}>
                <td className="py-2 px-4">{skill.name}</td>
                <td className="py-2 px-4">{skill.level}</td>
                <td className="py-2 px-4">{skill.years}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {candidate.technicalTestLink && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Enlace prueba técnica</h2>
          <a href={candidate.technicalTestLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Ver prueba técnica
          </a>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;
