import React, { useState, useEffect, useRef } from 'react';
import { CraftingListItem, OwnedIngredient, SearchResultItem, DofusItemData } from '../types';
import { getDofusItemDetails, searchAllItems } from '../services/dofusDBService';
import HammerIcon from '../components/icons/HammerIcon';
import SearchIcon from '../components/icons/SearchIcon';
import CraftingItemsList from '../components/CraftingItemsList';
import IngredientsList from '../components/IngredientsList';

interface CraftingViewProps {
  craftingList: CraftingListItem[];
  ownedIngredients: OwnedIngredient;
  onAddItem: (item: DofusItemData) => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onUpdateOwned: (ingredientId: number, count: number) => void;
  onClearList: () => void;
  onNavigateToDb: (itemName: string) => void;
}

const CraftingView: React.FC<CraftingViewProps> = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [ingredientView, setIngredientView] = useState<'total' | 'grouped'>('total');

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const debounceTimer = setTimeout(async () => {
      try {
        const results = await searchAllItems(searchQuery);
        setSearchResults(results);
        if (results.length === 0) {
          setSearchError('Aucun objet trouvé.');
        }
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : 'Erreur de recherche.');
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        setSearchError(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSelectSearchResult = async (item: SearchResultItem) => {
    try {
      const itemDetails = await getDofusItemDetails(item.ankama_id);
      if (itemDetails.recipe) {
          props.onAddItem(itemDetails);
          setSearchQuery('');
          setSearchResults([]);
          setSearchError(null);
      } else {
        setSearchError("Cet objet n'a pas de recette et ne peut pas être ajouté.");
        setSearchResults([]);
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Impossible de récupérer les détails de l'objet.");
    }
  };

  return (
    <div className="animate-scale-in-pop space-y-8">
      <header className="flex items-center">
        <HammerIcon className="w-8 h-8 text-yellow-400 mr-4" />
        <h2 className="text-3xl font-bold text-white">Listes de Craft</h2>
      </header>

      <div className="bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2">Ajouter un objet à crafter</h3>
        <div ref={searchContainerRef} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un équipement..."
              className="w-full pl-10 pr-4 py-3 bg-[#1e1c3a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
             {searchResults.length > 0 && !isSearching && (
                <ul className="absolute z-10 w-full mt-1 bg-[#3B385E] border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map(item => (
                        <li key={item.ankama_id}
                            onClick={() => handleSelectSearchResult(item)}
                            className="flex items-center p-3 cursor-pointer hover:bg-yellow-400/20 transition-all duration-200 hover:scale-[1.02]"
                        >
                            <img src={item.image_urls} alt={item.name} className="w-8 h-8 mr-3"/>
                            <span>{item.name} <span className="text-gray-400">(Niv. {item.level})</span></span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        {searchError && !isSearching && <p className="text-red-400 mt-2">{searchError}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CraftingItemsList 
            list={props.craftingList}
            onUpdateQuantity={props.onUpdateQuantity}
            onRemoveItem={props.onRemoveItem}
            onClearList={props.onClearList}
        />
        <IngredientsList 
            craftingList={props.craftingList}
            ownedIngredients={props.ownedIngredients}
            onUpdateOwned={props.onUpdateOwned}
            onNavigateToDb={props.onNavigateToDb}
            viewMode={ingredientView}
            setViewMode={setIngredientView}
        />
      </div>
    </div>
  );
};

export default CraftingView;