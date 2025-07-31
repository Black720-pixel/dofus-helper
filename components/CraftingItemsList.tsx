import React from 'react';
import { CraftingListItem } from '../types';

interface CraftingItemsListProps {
  list: CraftingListItem[];
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onClearList: () => void;
}

const CraftingItemsList: React.FC<CraftingItemsListProps> = ({ list, onUpdateQuantity, onRemoveItem, onClearList }) => {
  return (
    <div className="bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Objets à fabriquer</h3>
         {list.length > 0 && (
          <button 
            onClick={onClearList}
            className="text-sm text-red-400 hover:text-red-300 font-semibold transition-transform duration-150 active:scale-95"
          >
            Vider la liste
          </button>
        )}
      </div>
      {list.length === 0 ? (
        <p className="text-gray-400 text-center py-10">Ajoutez des objets pour commencer votre liste de craft.</p>
      ) : (
        <ul className="space-y-3">
          {list.map(({ item, quantity }) => (
            <li key={item.ankama_id} className="flex items-center p-3 bg-[#3B385E] rounded-lg transition-transform duration-200 hover:scale-[1.01]">
              <img src={item.image_urls} alt={item.name} className="w-12 h-12 mr-4 bg-[#1e1c3a] rounded-md p-1" />
              <div className="flex-grow">
                <p className="font-bold text-white">{item.name}</p>
                <p className="text-sm text-gray-400">Niv. {item.level}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => onUpdateQuantity(item.ankama_id, parseInt(e.target.value, 10) || 1)}
                  min="1"
                  className="w-16 text-center bg-[#1e1c3a] border border-gray-600 rounded-md py-1"
                />
                <button
                  onClick={() => onRemoveItem(item.ankama_id)}
                  className="text-red-400 hover:text-red-300 p-1 transition-transform duration-150 active:scale-95"
                  aria-label="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CraftingItemsList;