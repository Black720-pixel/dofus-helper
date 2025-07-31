import React from 'react';
import { View } from '../types';
import HomeIcon from './icons/HomeIcon';
import TagIcon from './icons/TagIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import HammerIcon from './icons/HammerIcon';
import LineChartIcon from './icons/LineChartIcon';
import ShieldIcon from './icons/ShieldIcon';
import UserIcon from './icons/UserIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
  activeProfile: string | null;
  onOpenProfileManager: () => void;
}

const NavItem: React.FC<{
  label: string;
  view: View;
  activeView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
}> = ({ label, view, activeView, setView, children }) => {
  const isActive = activeView === view;
  const classes = `
    flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
    ${isActive ? 'bg-yellow-400 text-[#1e1c3a] font-bold shadow-lg animate-glow' : 'text-gray-300 hover:bg-white/10 hover:text-white'}
  `;

  return (
    <li>
      <button onClick={() => setView(view)} className={classes}>
        <div className="w-6 h-6 mr-4">{children}</div>
        <span className="text-sm font-semibold tracking-wide">{label}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, activeProfile, onOpenProfileManager }) => {
  return (
    <aside className="w-64 bg-[#2C2A44] p-4 flex flex-col h-screen border-r border-white/10 shadow-lg">
      <div className="flex-grow">
        <div className="text-2xl font-bold text-white tracking-tight mb-8 px-2">
          Dofus Helper
        </div>
        <nav>
          <ul className="space-y-2">
            <NavItem label="Accueil" view="dashboard" activeView={activeView} setView={setView}>
              <HomeIcon />
            </NavItem>
            <NavItem label="Gérer les ventes" view="sales" activeView={activeView} setView={setView}>
              <TagIcon />
            </NavItem>
            <NavItem label="Analyse" view="analysis" activeView={activeView} setView={setView}>
              <LineChartIcon />
            </NavItem>
            <NavItem label="Dofus DB" view="db" activeView={activeView} setView={setView}>
              <BookOpenIcon />
            </NavItem>
            <NavItem label="Panoplies" view="sets" activeView={activeView} setView={setView}>
              <ShieldIcon />
            </NavItem>
            <NavItem label="Listes de Craft" view="crafting" activeView={activeView} setView={setView}>
              <HammerIcon />
            </NavItem>
             <li className="pt-4"><div className="border-t border-white/10"></div></li>
             <NavItem label="Infos" view="info" activeView={activeView} setView={setView}>
                <InformationCircleIcon />
            </NavItem>
          </ul>
        </nav>
      </div>

      <div className="mt-auto">
        <div className="border-t border-white/10 pt-4 px-2">
            <p className="text-xs text-gray-400 mb-1">PROFIL ACTIF</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                    <UserIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-white font-semibold truncate" title={activeProfile || ''}>
                        {activeProfile || 'Aucun'}
                    </span>
                </div>
                <button
                    onClick={onOpenProfileManager}
                    className="text-sm font-medium text-yellow-300 hover:text-yellow-200 transition-colors"
                >
                    Changer
                </button>
            </div>
        </div>
      </div>
    </aside>
  );
};

// Create UserIcon if it doesn't exist
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);


export default Sidebar;
