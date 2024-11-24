export const CreditCard = ({ process, nombreTitular, numeroTarjeta, cupoTotal, cupoUtilizado, cupoDisponible }) => {
    return (
        <div className="flex flex-col gap-2 bg-gray-200 rounded-lg p-6">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-dark-blue">{process.name}</h1>
                    <p className="text-md font-bold text-gray-600">{nombreTitular}</p>
                </div>
                <h1 className="text-2xl font-bold text-dark-blue">{numeroTarjeta}</h1>
            </div>
            <div className="flex flex-row justify-between">
                <span className="text-gray-600">Cupo total</span>
                <span className="text-gray-800 text-bold">{cupoTotal}</span>
            </div>
            <div className="flex w-full">
                <div className="bg-red-400 h-2 rounded-full" style={{ width: `${Math.min(100, (cupoUtilizado / cupoTotal) * 100 || 0)}%` }}>
                </div>
            </div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col text-left">
                    <span className="text-gray-800">{cupoUtilizado}</span>
                    <span className="text-gray-600">Utilizado</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-red-400">{cupoDisponible}</span>
                    <span className="text-gray-600">Disponible</span>
                </div>
            </div>
        </div >
    );
}
