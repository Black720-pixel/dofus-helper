import React from 'react';
import { SaleItem } from '../types';
import AnalysisDashboard from '../components/AnalysisDashboard';
import LineChartIcon from '../components/icons/LineChartIcon';

interface AnalysisViewProps {
  sales: SaleItem[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ sales }) => {
  return (
    <div className="animate-scale-in-pop">
      <header className="flex items-center mb-6">
        <LineChartIcon className="w-8 h-8 text-yellow-400 mr-4" />
        <h2 className="text-3xl font-bold text-white">Analyse des Ventes</h2>
      </header>

      {sales.length === 0 ? (
        <div className="text-center bg-[#2C2A44] p-8 rounded-lg border border-white/10 shadow-xl">
          <p className="text-gray-400">
            Aucune donnée à analyser. Allez dans "Gérer les ventes" pour commencer.
          </p>
        </div>
      ) : (
        <AnalysisDashboard sales={sales} />
      )}
    </div>
  );
};

export default AnalysisView;