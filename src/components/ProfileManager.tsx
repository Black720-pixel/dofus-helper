import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import TrashIcon from './icons/TrashIcon';

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: string[];
  activeProfile: string | null;
  onSwitch: (name: string) => void;
  onCreate: (name: string) => void;
  onDelete: (name: string) => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ isOpen, onClose, profiles, activeProfile, onSwitch, onCreate, onDelete }) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    const trimmedName = newProfileName.trim();
    if (!trimmedName) {
      setError('Le nom du profil ne peut pas être vide.');
      return;
    }
    if (profiles.includes(trimmedName)) {
      setError('Ce nom de profil existe déjà.');
      return;
    }
    onCreate(trimmedName);
    setNewProfileName('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-[#2C2A44] w-full max-w-md p-6 rounded-xl border border-white/10 shadow-2xl animate-scale-in-pop">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-bold text-white">Gérer les profils</h2>
          {profiles.length > 0 && (
             <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <CloseIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        
        {profiles.length === 0 && (
            <p className="text-gray-400 mb-4">Créez votre premier profil pour commencer à utiliser l'application.</p>
        )}
        
        {profiles.length > 0 && (
          <div className="mb-6 max-h-60 overflow-y-auto pr-2">
            <ul className="space-y-2">
              {profiles.map(profile => (
                <li key={profile} className={`flex items-center justify-between p-3 rounded-lg ${profile === activeProfile ? 'bg-yellow-400/20' : 'bg-[#3B385E]'}`}>
                  <span className={`font-semibold ${profile === activeProfile ? 'text-yellow-300' : 'text-white'}`}>{profile}</span>
                  <div className="flex items-center gap-2">
                    {profile !== activeProfile && (
                      <button onClick={() => onSwitch(profile)} className="text-sm font-semibold text-gray-200 hover:text-white transition-colors">
                        Activer
                      </button>
                    )}
                     <button onClick={() => onDelete(profile)} className="text-gray-400 hover:text-red-400 transition-colors" aria-label="Supprimer le profil">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Nouveau profil</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => { setNewProfileName(e.target.value); setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder="Nom du personnage..."
              className="flex-grow px-4 py-2 bg-[#1e1c3a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-yellow-400 text-[#1e1c3a] font-bold rounded-lg hover:bg-yellow-500 transition-all duration-200 active:scale-95"
            >
              Créer
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

      </div>
    </div>
  );
};

export default ProfileManager;