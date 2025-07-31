import React from 'react';
import { DofusItemData } from '../types';
import KamaIcon from './icons/KamaIcon';
import SkullIcon from './icons/SkullIcon';
import HammerIcon from './icons/HammerIcon';
import StyledEffect from './StyledEffect';

const formatKamas = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
};

const ItemDetailsCard: React.FC<{ data: DofusItemData, onAddToCraftList: (item: DofusItemData) => void }> = ({ data, onAddToCraftList }) => {
  return (
    <div className="bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl animate-scale-in-pop">
      <header className="flex items-start border-b border-white/10 pb-4 mb-6 gap-6">
        <img src={data.image_urls} alt={data.name} className="w-24 h-24 bg-[#1e1c3a] rounded-lg p-2 flex-shrink-0 object-contain" />
        <div className="flex-grow">
          <h2 className="text-3xl font-bold text-white">{data.name}</h2>
          <div className="flex items-center space-x-4 text-gray-400 mt-2">
            {data.level != null && (
                <>
                    <span>Niveau {data.level}</span>
                    <span>&bull;</span>
                </>
            )}
            <span>{data.type}</span>
          </div>
        </div>
        {data.recipe && data.recipe.length > 0 && (
          <button
            onClick={() => onAddToCraftList(data)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-yellow-400/10 text-yellow-300 font-semibold rounded-lg border border-yellow-400/30 hover:bg-yellow-400/20 transition-all duration-200 active:scale-95"
          >
            <HammerIcon className="w-5 h-5" />
            Ajouter au craft
          </button>
        )}
      </header>
      
      {data.description && <p className="text-gray-300 italic mb-6">{data.description}</p>}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-grow space-y-6">
          {data.effects && data.effects.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-white mb-3">Effets</h3>
              <ul className="space-y-1.5">
                {data.effects.map((effect, index) => <StyledEffect key={index} text={effect.formatted} />)}
              </ul>
            </div>
          )}
           {data.recipe && data.recipe.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-white mb-2">Recette</h3>
              <ul className="space-y-2 text-gray-300">
                {data.recipe.map((ingredient, index) => (
                  <li key={index} className="flex items-center p-2 bg-[#3B385E]/50 rounded-lg transition-transform duration-200 hover:scale-[1.02] hover:bg-[#3b385e]">
                    <img src={ingredient.item.image_urls} alt={ingredient.item.name} className="w-10 h-10 mr-4 bg-[#1e1c3a] rounded-md p-1 object-contain" />
                    <span className="font-semibold text-white mr-2">{ingredient.quantity} x</span>
                    <span className="text-gray-200">{ingredient.item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0 space-y-6">
           {data.price && (
            <div className="bg-[#3B385E]/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-white mb-2">Prix moyens</h3>
              <ul className="space-y-1 text-gray-300">
                <li className="flex items-center justify-between">
                  <span>Minimum:</span>
                  <span className="font-semibold text-yellow-400 flex items-center">{formatKamas(data.price.min)} <KamaIcon className="ml-1 h-4 w-4"/></span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Moyen:</span>
                  <span className="font-semibold text-yellow-400 flex items-center">{formatKamas(data.price.average)} <KamaIcon className="ml-1 h-4 w-4"/></span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Maximum:</span>
                  <span className="font-semibold text-yellow-400 flex items-center">{formatKamas(data.price.max)} <KamaIcon className="ml-1 h-4 w-4"/></span>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">Données par Dofusdu.de</p>
            </div>
          )}
           {data.drops && data.drops.length > 0 && (
            <div className="bg-[#3B385E]/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-white mb-2 flex items-center">
                <SkullIcon className="w-5 h-5 mr-2" />
                Obtention
              </h3>
              <ul className="space-y-1 text-gray-300">
                {data.drops.map((drop, index) => (
                  <li key={index} className="text-sm">
                    {drop.monster_name} <span className="text-gray-400">({drop.drop_chance})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ItemDetailsCard;