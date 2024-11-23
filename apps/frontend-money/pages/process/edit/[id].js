import React from 'react';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import EditProcessForm from '../../../components/process/EditProcessForm';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProcessProvider } from '../../../context/ProcessContext';

/**
 * Página para editar un proceso existente
 * @component
 */
export default function EditProcess() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <ProcessProvider>
      <Layout>
        <Head>
          <title>Editar Proceso</title>
          <meta name="description" content="Editar un proceso de reclutamiento existente" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className="mb-4">
            <Link href={`/process/${id}`} className="text-blue-500 hover:text-blue-600">
              ← Volver al proceso
            </Link>
          </div>
          <EditProcessForm processId={id} />
        </main>
      </Layout>
    </ProcessProvider>
  );
}
