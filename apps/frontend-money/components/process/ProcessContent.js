import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../Layout';
import ProcessHeader from './ProcessHeader';
import CandidateTable from '../CandidateTable';
import { useProcess } from '../../context/ProcessContext';
import { fetchCandidatesByProcessId } from '../../services/processService';
import { fetchProcessById } from '../../services/process/queries/fetchProcessById';

/**
 * Componente que muestra el contenido de un proceso de reclutamiento
 * @component
 * @returns {JSX.Element} Componente ProcessContent
 */
export default function ProcessContent() {
  const router = useRouter();
  const { id } = router.query;
  const { process, setProcess, candidates, setCandidates, loading, setLoading } = useProcess();

  const reloadCandidates = async () => {
    if (id) {
      try {
        const candidatesData = await fetchCandidatesByProcessId(id);
        setCandidates(candidatesData);
      } catch (error) {
        console.error('Error al recargar candidatos:', error);
      }
    }
  };

  useEffect(() => {
    const loadProcessData = async () => {
      if (id) {
        try {
          setLoading(true);
          const [processData, candidatesData] = await Promise.all([
            fetchProcessById(id),
            fetchCandidatesByProcessId(id)
          ]);
          setProcess(processData);
          setCandidates(candidatesData);
        } catch (error) {
          console.error('Error al cargar los datos del proceso:', error);
          router.push('/404');
        } finally {
          setLoading(false);
        }
      }
    };

    loadProcessData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{process?.name || 'Proceso'} - powered by OpenAI</title>
        <meta name="description" content={`Detalles del proceso ${process?.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* <div className="mb-4">
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            ← Volver al inicio
          </Link>
        </div> */}
        <ProcessHeader reloadCandidates={reloadCandidates} />
        <CandidateTable />
      </main>
    </Layout>
  );
}
