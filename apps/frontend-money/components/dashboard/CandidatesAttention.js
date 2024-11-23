import { GiPayMoney } from "react-icons/gi";
import { TbMoneybag } from 'react-icons/tb';

export default function CandidatesAttention() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-CL', { year: 'numeric', month: 'long' });

  const income = 1_000_000;
  const expenses = -1_280_000;
  const balance = income + expenses;

  const principal = { date: formattedDate, title: 'Balance', value: balance }

  const stats = [
    { icon: <TbMoneybag className="text-4xl" />, title: 'Ingresos', value: income },
    { icon: <GiPayMoney className="text-4xl" />, title: 'Gastos', value: expenses },
  ];

  const categories = [
    { icon: <TbMoneybag className="text-3xl" />, name: 'Básico', value: -1_000_000 },
    { icon: <TbMoneybag className="text-3xl" />, name: 'Alimentos', value: -10_000 },
    { icon: <TbMoneybag className="text-3xl" />, name: 'Transporte', value: -50_000 },
    { icon: <TbMoneybag className="text-3xl" />, name: 'Entretenimiento', value: -30_000 },
    { icon: <TbMoneybag className="text-3xl" />, name: 'Salud', value: -100_000 }
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  }

  return (
    <div className="p-4 space-y-2 bg-white rounded-lg shadow-xl shadow-primary/5">
      <div className="flex flex-wrap justify-center m-4">
        <div className="flex flex-col items-center">
          <p className="text-md text-neutral-500">{principal.date}</p>
          <p className="text-4xl font-bold text-dark-blue">{formatCurrency(principal.value)}</p>
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
      <div className="flex flex-col p-4 m-4 g-4">
        <h2 className="text-lg font-normal text-neutral-600">Categorías</h2>
        {categories.map((category, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_0.75fr] items-center p-4">
            <div className="flex flex-row items-center">
              {category.icon}
              <p className="text-lg font-normal text-dark-blue ml-2">{category.name}</p>
            </div>
            <div>
              <progress max={Math.abs(expenses)} value={Math.abs(category.value)} className="mx-4 rounded-md"></progress>
            </div>
            <div>
              <p className="text-lg font-bold text-dark-blue text-right">{formatCurrency(category.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
