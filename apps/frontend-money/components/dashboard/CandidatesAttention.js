export default function CandidatesAttention() {
  const stats = [
    { title: 'Entrevistados', value: 10 },
    { title: 'Pendientes', value: 5 },
    { title: 'Total', value: 15 },
  ]
  return (
    <div className="p-4 space-y-2 bg-white rounded-lg shadow-xl shadow-primary/5">
      <h2 className="text-xl font-bold text-primary">Candidatos</h2>
      <div className="grid grid-cols-12">
        {stats.map((stat, index) => (
          <div key={index} className="col-span-6 md:col-span-4">
            <p className="text-sm text-neutral-600">{stat.title}</p>
            <p className="text-2xl font-bold text-dark-blue">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
