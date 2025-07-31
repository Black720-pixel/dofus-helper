import React, { useState } from 'react';
import { SaleItem, Tab } from '../types';
import ImageUploader from '../components/ImageUploader';
import SalesTable from '../components/SalesTable';

interface SalesManagerProps {
    sales: SaleItem[];
    unsold: SaleItem[];
    isLoading: boolean;
    error: string | null;
    onImageProcess: (files: FileList) => void;
    onClearData: () => void;
    onRemoveItem: (order: number) => void;
    onNavigateToDb: (itemName: string) => void;
}

const SalesManager: React.FC<SalesManagerProps> = ({ sales, unsold, isLoading, error, onImageProcess, onClearData, onRemoveItem, onNavigateToDb }) => {
    const [activeTab, setActiveTab] = useState<Tab>('ventes');
    
    return (
        <div className="space-y-8 animate-scale-in-pop">
            <div className="bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl">
                <h2 className="text-3xl font-bold text-white mb-2">Gérer vos ventes</h2>
                <p className="text-lg text-gray-400 mb-6">
                    Téléchargez une ou plusieurs captures d'écran de vos ventes pour les analyser.
                </p>
                <ImageUploader onImageUpload={onImageProcess} disabled={isLoading} />
            </div>

            {(isLoading || error || sales.length > 0) && (
                 <div className="bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl">
                    <div className="border-b border-white/10 mb-6">
                        <nav className="flex space-x-8">
                            <button
                            onClick={() => setActiveTab('ventes')}
                            className={`py-2 px-1 text-sm font-medium uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                                activeTab === 'ventes' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-200'
                            }`}
                            >
                            Ventes
                            </button>
                            <button
                            onClick={() => setActiveTab('invendus')}
                            className={`py-2 px-1 text-sm font-medium uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                                activeTab === 'invendus' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-200'
                            }`}
                            >
                            Invendus
                            </button>
                        </nav>
                    </div>

                    <div className="min-h-[300px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-300">Analyse de l'image en cours...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-red-400 min-h-[300px]">
                                <p className="font-bold text-lg">Une erreur est survenue</p>
                                <p className="mt-2 text-sm max-w-md">{error}</p>
                            </div>
                        ) : (
                            <div>
                                {activeTab === 'ventes' && <SalesTable data={sales} onRemoveItem={onRemoveItem} onNavigateToDb={onNavigateToDb}/>}
                                {activeTab === 'invendus' && (
                                    <div className="text-center text-gray-400 py-16">
                                    <p>La section des invendus est en cours de développement.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                     <footer className="mt-6 pt-4 border-t border-white/10 flex justify-start items-center">
                        <button
                        onClick={onClearData}
                        className="px-4 py-2 bg-red-800/80 hover:bg-red-700/80 text-red-100 font-semibold rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        disabled={sales.length === 0 && unsold.length === 0 && !isLoading}
                        >
                        Effacer les données
                        </button>
                    </footer>
                </div>
            )}
        </div>
    );
};

export default SalesManager;