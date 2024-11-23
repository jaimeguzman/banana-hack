import { Icon } from '@iconify/react'

/**
 * Componente de sección de KPIs
 * @returns {JSX.Element} Componente de sección de KPIs
 */
export default function KPISection() {
  // TODO: Conectar con el backend para obtener los datos reales
  const kpis = {
    procesosActivos: 12,
    procesosFinalizados: 40,
    candidatosEvaluados: 1200,
    entrevistasPendientes: 17,
    postulacionesTotales: 12000,
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl shadow-primary/5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <KPIItem
          icon="ph:tag-chevron-duotone"
          label="Procesos Activos"
          value={kpis.procesosActivos}
        />
        <KPIItem
          icon="line-md:circle-twotone-to-confirm-circle-twotone-transition"
          label="Procesos Finalizados"
          value={kpis.procesosFinalizados}
          classNames={{
            icon: '!text-lime-500',
          }}
        />
        <KPIItem
          icon="tabler:progress-check"
          label="Candidatos Evaluados"
          value={kpis.candidatosEvaluados}
        />
        <KPIItem
          icon="tabler:progress-alert"
          label="Entrevistas Pendientes"
          value={kpis.entrevistasPendientes}
          classNames={{
            icon: '!text-warning',
          }}
        />
        <KPIItem
          icon="material-symbols:arrow-upload-progress-rounded"
          label="Postulaciones Totales"
          value={kpis.postulacionesTotales}
        />
      </div>
    </div>
  )
}

/**
 * Componente de item de KPI individual
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del KPI
 * @param {number} props.value - Valor del KPI
 * @returns {JSX.Element} Componente de item de KPI
 */
function KPIItem({ label, value, icon, classNames = {} }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon icon={icon} className={`text-4xl text-primary ${classNames?.icon}`} />
      <b className="text-2xl text-dark-blue">{value}</b>
      <p className="text-sm text-neutral-600">{label}</p>
    </div>
  )
}
