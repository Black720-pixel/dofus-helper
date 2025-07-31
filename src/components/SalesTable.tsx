import React from 'react';
import { SaleItem } from '../types';
import KamaIcon from './icons/KamaIcon';
import TrashIcon from './icons/TrashIcon';

interface SalesTableProps {
  data: SaleItem[];
  onRemoveItem: (order: number) => void;
  onNavigateToDb: (itemName: string) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ data, onRemoveItem, onNavigateToDb }) => {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16">
        <p>Aucune donnée de vente à afficher.</p>
        <p className="text-sm mt-1">Veuillez téléverser une image de vos ventes.</p>
      </div>
    );
  }

  const formatKamas = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <div className="overflow-y-auto max-h-[50vh] pr-2">
      <table className="w-full border-collapse text-sm text-left">
        <thead className="text-gray-400 uppercase tracking-wider text-xs">
          <tr>
            <th className="p-3 font-medium">Ordre</th>
            <th className="p-3 font-medium">Nom de l'objet</th>
            <th className="p-3 font-medium text-center">Quantité</th>
            <th className="p-3 font-medium text-right">Kamas</th>
            <th className="p-3 font-medium">Type de vente</th>
            <th className="p-3 font-medium">Date de vente</th>
            <th className="p-3 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.order} className="border-t-4 border-transparent group">
              <td className="p-3 bg-[#3B385E] rounded-l-lg text-gray-400">{item.order}</td>
              <td 
                className="p-3 bg-[#3B385E] font-semibold text-white cursor-pointer hover:text-yellow-300 transition-colors"
                onClick={() => onNavigateToDb(item.itemName)}
              >
                {item.itemName}
              </td>
              <td className="p-3 bg-[#3B385E] text-center">{item.quantity}</td>
              <td className="p-3 bg-[#3B385E] font-bold text-yellow-400 text-right">
                <div className="flex items-center justify-end">
                    <span>{formatKamas(item.kamas)}</span>
                    <KamaIcon className="ml-2 h-4 w-4" />
                </div>
              </td>
              <td className="p-3 bg-[#3B385E]">{item.saleType}</td>
              <td className="p-3 bg-[#3B385E]">{item.saleDate}</td>
              <td className="p-3 bg-[#3B385E] rounded-r-lg text-center">
                 <button
                    onClick={() => onRemoveItem(item.order)}
                    className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 active:scale-90"
                    aria-label="Supprimer la vente"
                 >
                    <TrashIcon className="w-5 h-5"/>
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;