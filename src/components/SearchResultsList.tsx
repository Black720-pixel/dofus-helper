import React from 'react';
import { SearchResultItem } from '../types';

interface SearchResultsListProps {
  results: SearchResultItem[];
  onItemSelect: (id: number) => void;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results, onItemSelect }) => {
  return (
    <div className="bg-[#2C2A44] p-4 rounded-lg border border-white/10 shadow-xl animate-scale-in-pop">
        <h3 className="text-lg font-semibold text-white mb-4">Résultats de la recherche</h3>
        <ul className="space-y-3">
            {results.map((item) => (
                <li
                    key={item.ankama_id}
                    onClick={() => onItemSelect(item.ankama_id)}
                    className="flex items-center p-3 bg-[#3B385E] rounded-lg cursor-pointer hover:bg-yellow-400/20 transition-all duration-200 border border-transparent hover:border-yellow-400 hover:scale-[1.02]"
                >
                    <img src={item.image_urls} alt={item.name} className="w-12 h-12 mr-4 bg-[#2C2A44] rounded-md p-1" />
                    <div className="flex-grow">
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">Niv. {item.level} &bull; {item.type}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default SearchResultsList;