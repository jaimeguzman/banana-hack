import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import CandidateDetails from '../../components/candidates/CandidateDetails';
import { fetchCandidateById } from '../../services/candidateService';

/**
 * Página de detalles del candidato
 * @component
 */
const CandidatePage = ({ candidate, error }) => {
  const router = useRouter();

  // Manejo de estados de carga y error
  if (router.isFallback) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          >
            Volver
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CandidateDetails candidate={candidate} />
    </Layout>
  );
};

/**
 * Obtiene los datos del candidato en el servidor
 * @function getServerSideProps
 * @param {Object} context - Contexto de la solicitud
 * @param {Object} context.params - Parámetros de la ruta
 * @param {string} context.params.id - ID del candidato
 * @returns {Promise<Object>} Propiedades del componente
 */
export async function getServerSideProps({ params }) {
  try {
    const candidate = await fetchCandidateById(params.id);
    return { 
      props: { 
        candidate,
        error: null
      } 
    };
  } catch (error) {
    console.error('Error al obtener datos del candidato:', error);
    return { 
      props: { 
        candidate: null,
        error: error.message
      } 
    };
  }
}

export default CandidatePage;
