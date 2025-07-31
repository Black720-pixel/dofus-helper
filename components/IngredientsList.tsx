import React, { useMemo } from 'react';
import { CraftingListItem, OwnedIngredient, Ingredient } from '../types';

interface IngredientsListProps {
  craftingList: CraftingListItem[];
  ownedIngredients: OwnedIngredient;
  onUpdateOwned: (ingredientId: number, count: number) => void;
  onNavigateToDb: (itemName: string) => void;
  viewMode: 'total' | 'grouped';
  setViewMode: (mode: 'total' | 'grouped') => void;
}

const IngredientsList: React.FC<IngredientsListProps> = ({ craftingList, ownedIngredients, onUpdateOwned, onNavigateToDb, viewMode, setViewMode }) => {
  const totalIngredients = useMemo<Ingredient[]>(() => {
    if (viewMode === 'grouped') return [];
    const ingredientsMap = new Map<number, Ingredient>();

    craftingList.forEach(({ item, quantity: craftQuantity }) => {
      if (item.recipe) {
        item.recipe.forEach(({ item: ingredientItem, quantity: recipeQuantity }) => {
          const required = recipeQuantity * craftQuantity;
          const existing = ingredientsMap.get(ingredientItem.ankama_id);
          if (existing) {
            existing.required += required;
          } else {
            ingredientsMap.set(ingredientItem.ankama_id, {
              ankama_id: ingredientItem.ankama_id,
              name: ingredientItem.name,
              image_urls: ingredientItem.image_urls,
              required,
            });
          }
        });
      }
    });

    return Array.from(ingredientsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [craftingList, viewMode]);

  const renderIngredient = (ingredient: Ingredient) => {
    const owned = ownedIngredients[ingredient.ankama_id] || 0;
    const remaining = Math.max(0, ingredient.required - owned);
    const progress = ingredient.required > 0 ? (owned / ingredient.required) * 100 : 100;

    return (
       <li key={ingredient.ankama_id} className="p-3 bg-[#3B385E] rounded-lg transition-transform duration-200 hover:scale-[1.01]">
            <div className="flex items-center gap-3">
                <img src={ingredient.image_urls} alt={ingredient.name} className="w-10 h-10 mr-2 bg-[#1e1c3a] rounded-md p-1" />
                <div className="flex-grow">
                  <p 
                    className="font-semibold text-white cursor-pointer hover:text-yellow-300 transition-colors"
                    onClick={() => onNavigateToDb(ingredient.name)}
                  >
                    {ingredient.name}
                  </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Requis: {ingredient.required}</span>
                        <span>&bull;</span>
                        <span className={remaining > 0 ? 'text-red-400' : 'text-green-400'}>
                            Manque: {remaining}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <label htmlFor={`owned-${ingredient.ankama_id}`} className="text-xs text-gray-400 mb-1">Possédé</label>
                    <input
                        id={`owned-${ingredient.ankama_id}`}
                        type="number"
                        value={owned || ''}
                        onChange={(e) => onUpdateOwned(ingredient.ankama_id, parseInt(e.target.value, 10) || 0)}
                        min="0"
                        className="w-20 text-center bg-[#1e1c3a] border border-gray-600 rounded-md py-1"
                        placeholder="0"
                    />
                </div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-[#1e1c3a] rounded-full">
                <div
                    className="h-1.5 rounded-full bg-yellow-400"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
            </div>
        </li>
    )
  }

  const hasContent = craftingList.length > 0;

  return (
    <div className="bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Total des Ingrédients</h3>
        {hasContent && (
             <div className="flex items-center bg-[#1e1c3a] p-1 rounded-lg">
                <button onClick={() => setViewMode('total')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${viewMode === 'total' ? 'bg-yellow-400 text-[#1e1c3a]' : 'text-gray-300 hover:bg-white/10'}`}>Total</button>
                <button onClick={() => setViewMode('grouped')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${viewMode === 'grouped' ? 'bg-yellow-400 text-[#1e1c3a]' : 'text-gray-300 hover:bg-white/10'}`}>Groupé</button>
            </div>
        )}
      </div>
      {!hasContent ? (
         <p className="text-gray-400 text-center py-10">La liste des ingrédients apparaîtra ici.</p>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto pr-2">
            {viewMode === 'total' && <ul className="space-y-2">{totalIngredients.map(renderIngredient)}</ul>}
            {viewMode === 'grouped' && (
                <div className="space-y-4">
                    {craftingList.map(({ item, quantity }) => (
                        <div key={item.ankama_id}>
                            <h4 className="font-bold text-lg text-yellow-400 mb-2">{quantity} x {item.name}</h4>
                            {item.recipe ? (
                                <ul className="space-y-2 pl-4 border-l-2 border-yellow-400/20">
                                  {item.recipe.map(ing => renderIngredient({
                                    ankama_id: ing.item.ankama_id,
                                    name: ing.item.name,
                                    image_urls: ing.item.image_urls,
                                    required: ing.quantity * quantity,
                                  }))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 pl-4">Cet objet n'a pas de recette.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default IngredientsList;