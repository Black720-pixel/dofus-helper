export interface SaleItem {
  order: number;
  itemName: string;
  quantity: number;
  kamas: number;
  saleType: string;
  saleDate: string;
}

export type Tab = 'ventes' | 'invendus';
export type View = 'dashboard' | 'sales' | 'db' | 'crafting' | 'analysis' | 'sets' | 'info';

// Types for Dofus DB feature using DofusDu.de API

export interface SearchResultItem {
  ankama_id: number;
  name: string;
  level: number;
  type: string;
  image_urls: string;
}

export interface PriceData {
  average: number;
  min: number;
  max: number;
}

export interface Drop {
  monster_name: string;
  drop_chance: string;
}

export interface DofusItemData {
  ankama_id: number;
  name:string;
  level?: number;
  type: string;
  description: string;
  image_urls: string;
  recipe: {
    item: {
      name: string;
      image_urls: string;
      ankama_id: number;
    };
    quantity: number;
  }[] | null;
  effects: { formatted: string }[];
  price?: PriceData | null;
  drops?: Drop[] | null;
}

// Types for Crafting List feature
export interface CraftingListItem {
  item: DofusItemData;
  quantity: number;
}

export interface Ingredient {
  ankama_id: number;
  name: string;
  image_urls: string;
  required: number;
}

export type OwnedIngredient = {
  [ankama_id: number]: number;
};

// Types for Sets feature
export interface SetSearchResultItem {
  ankama_id: number;
  name: string;
  level: number;
  items_count: number;
}

export interface SetBonus {
  numItems: number;
  effects: { formatted: string }[];
}

export interface DofusSetData {
  ankama_id: number;
  name: string;
  level: number;
  bonuses: SetBonus[];
  items: DofusItemData[];
}