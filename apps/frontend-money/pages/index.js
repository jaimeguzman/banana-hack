import Head from 'next/head'
import Layout from '../components/Layout'
import ActionButtons from '../components/dashboard/ActionButtons'
import KPISection from '../components/dashboard/KPISection'
import PaymentsInformation from '../components/dashboard/PaymentsInformation'
import RecentCandidates from '../components/dashboard/RecentCandidates'
import CandidatesAttention from '../components/dashboard/CandidatesAttention'
import AutomaticMessages from '../components/dashboard/AutomaticMessages'

/**
 * Página principal del dashboard
 * @returns {JSX.Element} Componente de la página principal
 */
export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Kairo - Simplifica tus finanzas, humanizando las fiananzas</title>
        <meta
          name="description"
          content="Humanizar las finanzas partiendo por leer lo imporatente."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>

        <KPISection />

        {/* <div className="mt-8 space-y-6">
          <PaymentsInformation />
        </div> */}
        
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          {/* <CandidatesAttention /> */}
          <div className="space-y-4">
          {/* <RecentCandidates /> */}
          </div>
        </div>
      </main>
    </Layout>
  )
}
