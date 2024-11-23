import Head from 'next/head'
import Layout from '../components/Layout'
import ActionButtons from '../components/dashboard/ActionButtons'
import KPISection from '../components/dashboard/KPISection'
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
        <title>Dashboard - ATS con OpenAI</title>
        <meta
          name="description"
          content="Dashboard principal del Applicant Tracking System powered by OpenAI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* <ActionButtons /> */}
        <KPISection />
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          <RecentCandidates />
          <div className="space-y-4">
            <CandidatesAttention />
            {/* <AutomaticMessages /> */}
          </div>
        </div>
      </main>
    </Layout>
  )
}
