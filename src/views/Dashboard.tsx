import React from 'react';
import { View } from '../types';
import TagIcon from '../components/icons/TagIcon';
import BookOpenIcon from '../components/icons/BookOpenIcon';
import HammerIcon from '../components/icons/HammerIcon';

interface DashboardProps {
  setView: (view: View) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
}> = ({ title, description, icon, buttonText, onClick }) => (
  <div className="bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-1">
    <div className="flex items-center mb-4">
      <div className="text-yellow-400 mr-4">{icon}</div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-gray-400 flex-grow mb-6">{description}</p>
    <button
      onClick={onClick}
      className="mt-auto w-full bg-yellow-400/10 text-yellow-300 font-semibold py-2 px-4 rounded-lg border border-yellow-400/30 hover:bg-yellow-400/20 transition-all duration-200 active:scale-95"
    >
      {buttonText}
    </button>
  </div>
);


const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="animate-scale-in-pop">
      <h2 className="text-4xl font-extrabold text-white mb-2">Bienvenue sur Dofus Helper !</h2>
      <p className="text-lg text-gray-400 mb-8">Votre compagnon tout-en-un pour optimiser votre aventure.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Gestion des Ventes"
          description="Suivez vos ventes en analysant des captures d'écran et visualisez vos statistiques de gains."
          icon={<TagIcon className="w-8 h-8"/>}
          buttonText="Gérer mes ventes"
          onClick={() => setView('sales')}
        />
        <FeatureCard
          title="Listes de Craft"
          description="Planifiez vos sessions de métier en créant des listes d'objets. Calculez automatiquement les ingrédients et suivez votre progression."
          icon={<HammerIcon className="w-8 h-8"/>}
          buttonText="Voir mes listes"
          onClick={() => setView('crafting')}
        />
        <FeatureCard
          title="Base de données"
          description="Explorez une base de données complète des objets du jeu. Trouvez des recettes, des effets, des prix et des taux de drop."
          icon={<BookOpenIcon className="w-8 h-8"/>}
          buttonText="Explorer la DB"
          onClick={() => setView('db')}
        />
      </div>
       <div className="mt-8 text-center bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Prêt à analyser vos performances ?</h3>
            <p className="text-gray-400 mb-4">Consultez les graphiques et statistiques détaillés de vos ventes.</p>
             <button
                onClick={() => setView('analysis')}
                className="bg-yellow-400 text-[#1e1c3a] font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-all duration-200 active:scale-95"
                >
                Voir l'analyse
            </button>
       </div>
    </div>
  );
};

export default Dashboard;