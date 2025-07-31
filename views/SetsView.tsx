import React, { useState, useCallback } from 'react';
import { searchSets, getSetDetails } from '../services/dofusDBService';
import { SetSearchResultItem, DofusSetData } from '../types';
import ShieldIcon from '../components/icons/ShieldIcon';
import SearchIcon from '../components/icons/SearchIcon';
import SetDetailsCard from '../components/SetDetailsCard';
import SetSearchResultsList from '../components/SetSearchResultsList';

interface SetsViewProps {
  onNavigateToDb: (itemName: string) => void;
}

const SetsView: React.FC<SetsViewProps> = ({ onNavigateToDb }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [searchResults, setSearchResults] = useState<SetSearchResultItem[]>([]);
    const [selectedSet, setSelectedSet] = useState<DofusSetData | null>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setSelectedSet(null);
        setSearchResults([]);

        try {
            const results = await searchSets(searchQuery);
            if (results.length === 0) {
                setError('Aucune panoplie trouvée pour cette recherche.');
            } else if (results.length === 1) {
                await handleSetSelect(results[0].ankama_id);
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

    const handleSetSelect = async (id: number) => {
        setIsDetailsLoading(true);
        setError(null);
        setSelectedSet(null);
        setSearchResults([]); // Clear search results when showing details
        try {
            const setDetails = await getSetDetails(id);
            setSelectedSet(setDetails);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la récupération des détails de la panoplie.");
            console.error(err);
            setSelectedSet(null);
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

        if (selectedSet) {
            return <SetDetailsCard data={selectedSet} onNavigateToDb={onNavigateToDb} />;
        }
        
        if (searchResults.length > 0) {
            return <SetSearchResultsList results={searchResults} onSetSelect={handleSetSelect} />;
        }

        return (
            <div className="text-center text-gray-400 py-16">
                <p>Recherchez une panoplie pour afficher ses bonus et équipements.</p>
            </div>
        );
    }

    return (
        <div className="animate-scale-in-pop">
            <header className="flex items-center mb-6">
                <ShieldIcon className="w-8 h-8 text-yellow-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Panoplies</h2>
            </header>
            
            <p className="text-lg text-gray-400 mb-6">
                Recherchez n'importe quelle panoplie du jeu pour voir ses bonus.
            </p>
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ex: Panoplie du Bouftou Royal, Panoplie de l'Obsidiantre..."
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

export default SetsView;
