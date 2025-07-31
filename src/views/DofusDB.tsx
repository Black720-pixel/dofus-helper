import React, { useState, useCallback, useEffect } from 'react';
import { searchAllItems, getDofusItemDetails } from '../services/dofusDBService';
import { SearchResultItem, DofusItemData } from '../types';
import BookOpenIcon from '../components/icons/BookOpenIcon';
import SearchIcon from '../components/icons/SearchIcon';
import ItemDetailsCard from '../components/ItemDetailsCard';
import SearchResultsList from '../components/SearchResultsList';

interface DofusDBProps {
  initialSearch: string;
  onAddItemToCraftList: (item: DofusItemData) => void;
}

const DofusDB: React.FC<DofusDBProps> = ({ initialSearch, onAddItemToCraftList }) => {
    const [query, setQuery] = useState(initialSearch);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<DofusItemData | null>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setSelectedItem(null);
        setSearchResults([]);

        try {
            const results = await searchAllItems(searchQuery);
            if (results.length === 0) {
                setError('Aucun objet trouvé pour cette recherche.');
            } else if (results.length === 1) {
                await handleItemSelect(results[0].ankama_id);
            } else {
                setSearchResults(results);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSearch(query);
    }
    
    useEffect(() => {
        if(initialSearch) {
            setQuery(initialSearch);
            handleSearch(initialSearch);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSearch]);


    const handleItemSelect = async (id: number) => {
        setIsDetailsLoading(true);
        setError(null);
        setSelectedItem(null);
        setSearchResults([]); // Clear search results when showing details
        try {
            const itemDetails = await getDofusItemDetails(id);
            setSelectedItem(itemDetails);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la récupération des détails de l'objet.");
            console.error(err);
            setSelectedItem(null);
        } finally {
            setIsDetailsLoading(false);
        }
    };
    
    const renderContent = () => {
        if (isDetailsLoading || (isLoading && !searchResults.length)) {
             return (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-300">{isDetailsLoading ? "Chargement des détails..." : "Recherche en cours..."}</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center text-center text-red-400 min-h-[100px]">
                   <p className="font-bold text-lg">Une erreur est survenue</p>
                   <p className="mt-2 text-sm max-w-md">{error}</p>
               </div>
           );
        }

        if (selectedItem) {
            return <ItemDetailsCard data={selectedItem} onAddToCraftList={onAddItemToCraftList} />;
        }
        
        if (searchResults.length > 0) {
            return <SearchResultsList results={searchResults} onItemSelect={handleItemSelect} />;
        }

        return (
            <div className="text-center text-gray-400 py-16">
                <p>Recherchez un objet pour afficher ses détails.</p>
            </div>
        );
    }

    return (
        <div className="animate-scale-in-pop">
            <header className="flex items-center mb-6">
                <BookOpenIcon className="w-8 h-8 text-yellow-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Dofus Database</h2>
            </header>
            
            <p className="text-lg text-gray-400 mb-6">
                Recherchez n'importe quel objet du jeu.
            </p>
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ex: Coiffe du Bouftou Royal, Potion de Bonta..."
                    className="w-full px-4 py-3 bg-[#2C2A44] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    disabled={isLoading || isDetailsLoading}
                />
                <button
                    type="submit"
                    className="flex-shrink-0 px-6 py-3 bg-yellow-400 text-[#1e1c3a] font-bold rounded-lg hover:bg-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait active:scale-95"
                    disabled={isLoading || isDetailsLoading || !query.trim()}
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-[#1e1c3a] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <SearchIcon className="w-6 h-6" />
                    )}
                </button>
            </form>

            <div className="mt-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default DofusDB;