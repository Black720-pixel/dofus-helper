import { DofusItemData, SearchResultItem, DofusSetData, SetBonus, SetSearchResultItem } from '../types';

const DUDE_API_URL = 'https://api.dofusdu.de';
const GAME = 'dofus3';
const LANGUAGE = 'fr';

async function fetchFromDudeAPI<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${DUDE_API_URL}${endpoint}`);
    if (!response.ok) {
        if (response.status === 404) {
             throw new Error(`Endpoint non trouvé : ${endpoint}. L'API a peut-être changé ou l'objet n'existe pas.`);
        }
        throw new Error(`L'API de DofusDu.de a répondu avec le statut ${response.status}`);
    }
    return response.json() as Promise<T>;
}

function getSafeImageUrl(imageUrls: any): string {
    if (!imageUrls) return '';
    if (typeof imageUrls === 'string') return imageUrls;
    if (typeof imageUrls === 'object') {
        return imageUrls.sd || imageUrls.icon || imageUrls.hd || imageUrls.default || '';
    }
    return '';
}

export async function searchDofusItems(name: string): Promise<SearchResultItem[]> {
    if (!name.trim()) return [];
    const endpoint = `/${GAME}/v1/${LANGUAGE}/items/equipment/search?query=${encodeURIComponent(name)}`;
    const results = await fetchFromDudeAPI<any[]>(endpoint);
    
    return results.map(item => ({
        ankama_id: item.ankama_id,
        name: item.name,
        level: item.level,
        type: item.type.name,
        image_urls: getSafeImageUrl(item.image_urls),
    }));
}

export async function searchAllItems(name: string): Promise<SearchResultItem[]> {
    if (!name.trim()) return [];
    const itemCategories = ['equipment', 'resources', 'consumables'];
    const query = encodeURIComponent(name);

    const itemPromises = itemCategories.map(category => 
        fetchFromDudeAPI<any[]>(`/${GAME}/v1/${LANGUAGE}/items/${category}/search?query=${query}`)
            .catch(() => []) // Ignore failures for a single category
    );
    
    // Assuming a search endpoint for mounts exists and returns an array of mounts
    const mountPromise = fetchFromDudeAPI<any[]>(`/${GAME}/v1/${LANGUAGE}/mounts/search?query=${query}`)
        .catch(() => []);

    const results = await Promise.all([...itemPromises, mountPromise]);
    const combined = results.flat();

    // Remove duplicates by ankama_id
    const uniqueResults = Array.from(new Map(combined.map(item => [item.ankama_id, item])).values());

     return uniqueResults.map(item => ({
        ankama_id: item.ankama_id,
        name: item.name,
        level: item.level || 0, // Mounts may not have a level
        type: item.type?.name || item.family?.name || 'Inconnu', // Use family name for mounts
        image_urls: getSafeImageUrl(item.image_urls),
    }));
}


async function getSimpleItem(id: number, subtype: string): Promise<{ name: string; image_urls: string; ankama_id: number; }> {
    // Determine the correct category from subtype if possible, otherwise guess.
    let category = subtype;
    if (subtype === 'resources' || subtype === 'consumables') {
        category = subtype;
    } else { // Assume equipment for other cases like 'helmet', 'cloak', etc.
        category = 'equipment';
    }

    const endpoint = `/${GAME}/v1/${LANGUAGE}/items/${category}/${id}`;
    const item = await fetchFromDudeAPI<any>(endpoint);
    return {
        name: item.name,
        image_urls: getSafeImageUrl(item.image_urls),
        ankama_id: item.ankama_id
    };
}

async function parseAndHydrateItem(item: any): Promise<DofusItemData> {
    let hydratedRecipe = null;
    if (item.recipe && item.recipe.length > 0) {
        const recipePromises = item.recipe.map(async (ingredient: any) => {
            try {
                const ingredientDetails = await getSimpleItem(ingredient.item_ankama_id, ingredient.item_subtype);
                return { quantity: ingredient.quantity, item: ingredientDetails };
            } catch (e) {
                console.error(`Failed to fetch ingredient ${ingredient.item_ankama_id}`, e);
                return {
                    quantity: ingredient.quantity,
                    item: { name: `Ingrédient inconnu (${ingredient.item_ankama_id})`, image_urls: '', ankama_id: ingredient.item_ankama_id }
                };
            }
        });
        hydratedRecipe = await Promise.all(recipePromises);
    }
    
    const price = item.price && item.price.average > 0 ? item.price : null;
    const drops = item.drops && item.drops.length > 0 ? item.drops : null;

    return {
        ankama_id: item.ankama_id,
        name: item.name,
        level: item.level,
        type: item.type?.name || item.family?.name || "Inconnu",
        description: item.description,
        image_urls: getSafeImageUrl(item.image_urls),
        effects: item.effects?.map((effect: any) => ({ formatted: effect.formatted })) || [],
        recipe: hydratedRecipe,
        price,
        drops,
    };
}


export async function getDofusItemDetails(id: number): Promise<DofusItemData> {
    const fields = ['recipe', 'effects', 'description', 'price', 'drops', 'conditions', 'type', 'level', 'name', 'ankama_id', 'image_urls', 'family'];
    const queryParams = new URLSearchParams({ fields: fields.join(',') }).toString();

    const itemCategories = ['equipment', 'consumables', 'resources'];

    for (const category of itemCategories) {
        const endpoint = `/${GAME}/v1/${LANGUAGE}/items/${category}/${id}?${queryParams}`;
        try {
            const item = await fetchFromDudeAPI<any>(endpoint);
            // If fetch is successful, parse and return
            return await parseAndHydrateItem(item);
        } catch (error) {
            // This is likely a 404, which is expected.
            // Log for debugging and continue to the next category.
            // The request will only fail if all categories fail.
            console.log(`Item ID ${id} not found in category '${category}', trying next.`);
        }
    }

    // Try mounts
    try {
        const mountEndpoint = `/${GAME}/v1/${LANGUAGE}/mounts/${id}?${queryParams}`;
        const mount = await fetchFromDudeAPI<any>(mountEndpoint);
        return await parseAndHydrateItem(mount);
    } catch(error) {
        // This is also expected if the ID is not a mount
        console.log(`Item ID ${id} not found in category 'mounts'.`);
    }

    throw new Error(`Impossible de trouver les détails pour l'objet avec l'ID ${id} dans les catégories testées (équipement, consommables, ressources, montures).`);
}

// ========== SETS API ==========

export async function searchSets(name: string): Promise<SetSearchResultItem[]> {
    if (!name.trim()) return [];
    const endpoint = `/${GAME}/v1/${LANGUAGE}/sets/search?query=${encodeURIComponent(name)}`;
    const results = await fetchFromDudeAPI<any[]>(endpoint);
    
    return results.map(set => ({
        ankama_id: set.ankama_id,
        name: set.name,
        level: set.level,
        items_count: set.items,
    }));
}


export async function getSetDetails(id: number): Promise<DofusSetData> {
    const setEndpoint = `/${GAME}/v1/${LANGUAGE}/sets/${id}`;
    const rawSet = await fetchFromDudeAPI<any>(setEndpoint);

    const bonuses: SetBonus[] = Object.entries(rawSet.effects)
        .filter(([, value]) => value !== null && Array.isArray(value))
        .map(([num, effects]) => ({
            numItems: parseInt(num, 10),
            effects: (effects as any[]).map(effect => ({ formatted: effect.formatted }))
        }));

    const itemPromises = (rawSet.equipment_ids as number[]).map(itemId => 
        getDofusItemDetails(itemId).catch(e => {
            console.error(`Failed to fetch item ${itemId} for set ${id}`, e);
            // Return a placeholder if an item fails, so Promise.all doesn't fail the whole set
            return null;
        })
    );

    const items = (await Promise.all(itemPromises)).filter(item => item !== null) as DofusItemData[];

    return {
        ankama_id: rawSet.ankama_id,
        name: rawSet.name,
        level: rawSet.level,
        bonuses: bonuses.sort((a, b) => a.numItems - b.numItems),
        items: items
    };
}