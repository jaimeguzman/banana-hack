export default function RecentCandidates() {
  // TODO: Conectar con el backend para obtener los datos reales
  const candidates = [
    { name: 'Jorge Guzman', position: 'CEO', company: 'LatamMarket' },
    { name: 'Julian Guzman', position: 'Software Developer', company: 'LatamMarket' },
    { name: 'Ivan Carrasco', position: 'Java Developer', company: 'LatamMarket' },
    { name: 'Christopher Sierra', position: 'Java Developer', company: 'LatamMarket' },
    { name: 'Fernando Garcia', position: 'Java Developer', company: 'LatamMarket' },
  ]
  return (
    <div className="p-4 bg-white rounded-lg shadow-xl shadow-primary/5">
      <h2 className="mb-2 text-xl font-bold text-primary">Últimas postulaciones</h2>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index} className="mb-2">
            <p className="font-semibold text-dark-blue">{candidate.name}</p>
            <p className="text-sm text-neutral-600">
              {candidate.position} - {candidate.company}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
