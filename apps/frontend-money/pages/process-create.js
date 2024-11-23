import Head from 'next/head'
import Layout from '../components/Layout'
import CreateProcessForm from '../components/process/CreateProcessForm'
import Link from 'next/link'

export default function ProcessCreate() {
  return (
    <Layout>
      <Head>
        <title>Crear Nuevo Proceso</title>
        <meta name="description" content="Crear un nuevo proceso de reclutamiento" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mb-4">
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            ← Volver al inicio
          </Link>
        </div>
        <CreateProcessForm />
      </main>
    </Layout>
  )
}
