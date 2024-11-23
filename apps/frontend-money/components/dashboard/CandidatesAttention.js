import { TbMoneybag } from 'react-icons/tb';
import { FaArrowDown } from 'react-icons/fa';

export default function CandidatesAttention() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-CL', { year: 'numeric', month: 'long' });

  const principal = { title: 'Balance', value: -280_000, date: formattedDate }

  const stats = [
    { title: 'Ingresos', value: 1_000_000, icon: <TbMoneybag className="text-green-500" /> },
    { title: 'Gastos', value: -1_280_000, icon: <FaArrowDown className="text-red-500" /> },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  }

  return (
    <div className="p-4 space-y-2 bg-white rounded-lg shadow-xl shadow-primary/5">
      <div className="flex flex-wrap justify-center m-4 mt-8">
        <div className="flex flex-col items-center">
          <p className="text-md text-neutral-500">{principal.date}</p>
          <p className="text-3xl font-bold text-dark-blue">{formatCurrency(principal.value)}</p>
          <p className="text-md text-neutral-600">{principal.title}</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-around p-4 g-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            {stat.icon}
            <p className="text-2xl font-bold text-dark-blue">{formatCurrency(stat.value)}</p>
            <p className="text-sm text-neutral-600">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
