import React from 'react';
import { DofusSetData } from '../types';
import StyledEffect from './StyledEffect';

interface SetDetailsCardProps {
    data: DofusSetData;
    onNavigateToDb: (itemName: string) => void;
}

const SetDetailsCard: React.FC<SetDetailsCardProps> = ({ data, onNavigateToDb }) => {
  return (
    <div className="bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl animate-scale-in-pop">
      <header className="border-b border-white/10 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-white">{data.name}</h2>
        <p className="text-gray-400 mt-1">Niveau {data.level}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Equipment List */}
        <div className="lg:col-span-1 space-y-3">
           <h3 className="font-semibold text-lg text-white mb-2">Équipements ({data.items.length})</h3>
           <ul className="space-y-2">
            {data.items.map(item => (
                <li 
                    key={item.ankama_id}
                    className="flex items-center p-2 bg-[#3B385E]/50 rounded-lg cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:bg-[#3b385e]"
                    onClick={() => onNavigateToDb(item.name)}
                >
                     <img src={item.image_urls} alt={item.name} className="w-10 h-10 mr-4 bg-[#1e1c3a] rounded-md p-1 object-contain" />
                     <span className="font-semibold text-white">{item.name}</span>
                </li>
            ))}
           </ul>
        </div>
        
        {/* Set Bonuses */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="font-semibold text-lg text-white mb-2">Bonus de panoplie</h3>
           <div className="space-y-4">
             {data.bonuses.map(bonus => (
                <div key={bonus.numItems}>
                    <h4 className="font-bold text-yellow-400 mb-2 border-b-2 border-yellow-400/20 pb-1">Bonus {bonus.numItems} objets</h4>
                    <ul className="space-y-1.5 pl-2">
                        {bonus.effects.map((effect, index) => (
                            <StyledEffect key={index} text={effect.formatted} />
                        ))}
                    </ul>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SetDetailsCard;
