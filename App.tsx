
import React, { useState, useCallback, useEffect } from 'react';
import { SaleItem, View, CraftingListItem, DofusItemData, OwnedIngredient } from './types';
import { extractSalesDataFromImage } from './services/geminiService';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import SalesManager from './views/SalesManager';
import DofusDB from './views/DofusDB';
import CraftingView from './views/CraftingView';
import AnalysisView from './views/AnalysisView';
import SetsView from './views/SetsView';
import ProfileManager from './components/ProfileManager';
import InfoView from './views/InfoView';

const getProfileKey = (profile: string, key: string) => `dofus-helper-profile-${profile}-${key}`;

const App: React.FC = () => {
  // Profile State
  const [profiles, setProfiles] = useState<string[]>([]);
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [isProfileManagerOpen, setProfileManagerOpen] = useState(false);

  // Sales State
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [unsold] = useState<SaleItem[]>([]); // Placeholder for future feature
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Crafting List State
  const [craftingList, setCraftingList] = useState<CraftingListItem[]>([]);
  const [ownedIngredients, setOwnedIngredients] = useState<OwnedIngredient>({});

  // Global State
  const [view, setView] = useState<View>('dashboard');
  const [dbInitialSearch, setDbInitialSearch] = useState('');

  // --- Profile Management ---
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('dofus-helper-profiles');
      const allProfiles = savedProfiles ? JSON.parse(savedProfiles) : [];
      setProfiles(allProfiles);
      
      const lastActive = localStorage.getItem('dofus-helper-last-active-profile');
      if (lastActive && allProfiles.includes(lastActive)) {
        setActiveProfile(lastActive);
      } else if (allProfiles.length > 0) {
        setActiveProfile(allProfiles[0]);
      } else {
        setProfileManagerOpen(true); // No profiles exist, force creation
      }
    } catch (e) {
      console.error("Failed to load profiles", e);
      setProfileManagerOpen(true);
    }
  }, []);

  const handleProfileSwitch = (name: string) => {
    if (profiles.includes(name)) {
      setActiveProfile(name);
      localStorage.setItem('dofus-helper-last-active-profile', name);
      setView('dashboard'); // Go to dashboard on profile switch
      setProfileManagerOpen(false);
    }
  };

  const handleProfileCreate = (name: string) => {
    if (name && !profiles.includes(name)) {
      const newProfiles = [...profiles, name];
      setProfiles(newProfiles);
      localStorage.setItem('dofus-helper-profiles', JSON.stringify(newProfiles));
      handleProfileSwitch(name);
    }
  };

  const handleProfileDelete = (name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le profil "${name}" ? Toutes les données associées seront perdues.`)) {
      const newProfiles = profiles.filter(p => p !== name);
      setProfiles(newProfiles);
      localStorage.setItem('dofus-helper-profiles', JSON.stringify(newProfiles));

      // Clean up deleted profile's data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`dofus-helper-profile-${name}-`)) {
          localStorage.removeItem(key);
        }
      });

      if (activeProfile === name) {
        if (newProfiles.length > 0) {
          handleProfileSwitch(newProfiles[0]);
        } else {
          setActiveProfile(null);
          setProfileManagerOpen(true);
        }
      }
    }
  };


  // --- Data Loading and Persistence Effects ---
  // Load data on profile change
  useEffect(() => {
    if (!activeProfile) {
      setSales([]);
      setCraftingList([]);
      setOwnedIngredients({});
      return;
    };
    try {
      const savedSales = localStorage.getItem(getProfileKey(activeProfile, 'sales'));
      setSales(savedSales ? JSON.parse(savedSales) : []);

      const savedCrafting = localStorage.getItem(getProfileKey(activeProfile, 'crafting-list'));
      setCraftingList(savedCrafting ? JSON.parse(savedCrafting) : []);

      const savedOwned = localStorage.getItem(getProfileKey(activeProfile, 'owned-ingredients'));
      setOwnedIngredients(savedOwned ? JSON.parse(savedOwned) : {});
    } catch (error) { 
      console.error("Failed to load profile data", error);
      setSales([]);
      setCraftingList([]);
      setOwnedIngredients({});
    }
  }, [activeProfile]);
  
  // Save sales when they change
  useEffect(() => {
    if (!activeProfile) return;
    try {
      localStorage.setItem(getProfileKey(activeProfile, 'sales'), JSON.stringify(sales));
    } catch (error) { console.error("Failed to save sales", error); }
  }, [sales, activeProfile]);

  // Save crafting list when it changes
  useEffect(() => {
    if (!activeProfile) return;
    try {
      localStorage.setItem(getProfileKey(activeProfile, 'crafting-list'), JSON.stringify(craftingList));
    } catch (error) { console.error("Failed to save crafting list", error); }
  }, [craftingList, activeProfile]);

  // Save owned ingredients when they change
  useEffect(() => {
    if (!activeProfile) return;
    try {
      localStorage.setItem(getProfileKey(activeProfile, 'owned-ingredients'), JSON.stringify(ownedIngredients));
    } catch (error) { console.error("Failed to save owned ingredients", error); }
  }, [ownedIngredients, activeProfile]);


  // Navigation and Data Interaction Handlers
  const handleNavigateToDb = useCallback((itemName: string) => {
    setDbInitialSearch(itemName);
    setView('db');
  }, []);

  // Sales Handlers
  const handleImageProcess = useCallback(async (files: FileList) => {
    setIsLoading(true);
    setError(null);
    setView('sales');

    try {
      const readFileAsBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (typeof reader.result !== 'string') {
              return reject(new Error('Failed to read image file.'));
            }
            resolve(reader.result.split(',')[1]);
          };
          reader.onerror = () => reject(new Error('Error reading file.'));
        });

      const allNewSales: SaleItem[] = [];
      for (const file of Array.from(files)) {
        const base64Image = await readFileAsBase64(file);
        const extractedData = await extractSalesDataFromImage(base64Image);
        allNewSales.push(...extractedData);
      }

      setSales(currentSales => {
        const combinedSales = [...currentSales, ...allNewSales];
        const uniqueSales = Array.from(new Map(combinedSales.map(item => [item.order, item])).values());
        return uniqueSales.sort((a, b) => a.order - b.order);
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  const handleClearSalesData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les données de ventes de ce profil ? Cette action est irréversible.")) {
      setSales([]);
      setView('dashboard');
    }
  };

  const handleRemoveSaleItem = (order: number) => {
    setSales(prevSales => prevSales.filter(sale => sale.order !== order));
  };

  // Crafting Handlers
  const handleAddItemToCraftList = (item: DofusItemData) => {
    setCraftingList(prev => {
      const existing = prev.find(i => i.item.ankama_id === item.ankama_id);
      if (existing) {
        return prev.map(i => i.item.ankama_id === item.ankama_id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateCraftQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCraftList(itemId);
    } else {
      setCraftingList(prev => prev.map(i => i.item.ankama_id === itemId ? { ...i, quantity: newQuantity } : i));
    }
  };

  const handleRemoveFromCraftList = (itemId: number) => {
    setCraftingList(prev => prev.filter(i => i.item.ankama_id !== itemId));
  };
  
  const handleUpdateOwnedIngredient = (ingredientId: number, count: number) => {
    setOwnedIngredients(prev => ({
      ...prev,
      [ingredientId]: Math.max(0, count) // Ensure count is not negative
    }));
  };
  
  const handleClearCraftData = () => {
     if (window.confirm("Êtes-vous sûr de vouloir vider votre liste de craft et vos ingrédients possédés pour ce profil ? Cette action est irréversible.")) {
      setCraftingList([]);
      setOwnedIngredients({});
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#1e1c3a] text-gray-200 font-sans">
      <ProfileManager
        isOpen={isProfileManagerOpen}
        onClose={() => setProfileManagerOpen(false)}
        profiles={profiles}
        activeProfile={activeProfile}
        onSwitch={handleProfileSwitch}
        onCreate={handleProfileCreate}
        onDelete={handleProfileDelete}
      />

      <Sidebar activeView={view} setView={setView} activeProfile={activeProfile} onOpenProfileManager={() => setProfileManagerOpen(true)} />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {!activeProfile ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Bienvenue !</h2>
                  <p className="text-gray-400 mb-6">Veuillez créer ou sélectionner un profil pour commencer.</p>
                  <button 
                      onClick={() => setProfileManagerOpen(true)}
                      className="bg-yellow-400 text-[#1e1c3a] font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-all duration-200 active:scale-95"
                  >
                      Gérer les profils
                  </button>
              </div>
          ) : (
            <>
              {view === 'dashboard' && <Dashboard setView={setView} />}
              {view === 'sales' && (
                <SalesManager 
                  sales={sales}
                  unsold={unsold}
                  isLoading={isLoading}
                  error={error}
                  onImageProcess={handleImageProcess}
                  onClearData={handleClearSalesData}
                  onRemoveItem={handleRemoveSaleItem}
                  onNavigateToDb={handleNavigateToDb}
                />
              )}
              {view === 'db' && <DofusDB initialSearch={dbInitialSearch} onAddItemToCraftList={handleAddItemToCraftList} />}
              {view === 'analysis' && <AnalysisView sales={sales} />}
              {view === 'crafting' && (
                <CraftingView
                  craftingList={craftingList}
                  ownedIngredients={ownedIngredients}
                  onAddItem={handleAddItemToCraftList}
                  onUpdateQuantity={handleUpdateCraftQuantity}
                  onRemoveItem={handleRemoveFromCraftList}
                  onUpdateOwned={handleUpdateOwnedIngredient}
                  onClearList={handleClearCraftData}
                  onNavigateToDb={handleNavigateToDb}
                />
              )}
              {view === 'sets' && <SetsView onNavigateToDb={handleNavigateToDb} />}
              {view === 'info' && <InfoView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
