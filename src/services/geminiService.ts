import { GoogleGenAI, Type } from "@google/genai";
import { SaleItem } from '../types';

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable not set. Please create a .env file or configure it in your hosting provider.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            order: {
                type: Type.INTEGER,
                description: "The order number from the 'Ordre' column."
            },
            itemName: {
                type: Type.STRING,
                description: "The item name from the 'Nom de l'objet' column."
            },
            quantity: {
                type: Type.INTEGER,
                description: "The quantity from the 'Quantité' column."
            },
            kamas: {
                type: Type.INTEGER,
                description: "The price in Kamas from the 'Kamas' column. Numbers only, no symbols or spaces."
            },
            saleType: {
                type: Type.STRING,
                description: "The sale type from the 'Type de vente' column."
            },
            saleDate: {
                type: Type.STRING,
                description: "The sale date from the 'Date de vente' column, in DD/MM/YYYY format."
            },
        },
        required: ["order", "itemName", "quantity", "kamas", "saleType", "saleDate"]
    }
};

export async function extractSalesDataFromImage(base64Image: string): Promise<SaleItem[]> {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/png',
                data: base64Image,
            },
        };

        const textPart = {
            text: "Extract all item sales data from this image. The image is a screenshot from the game Dofus showing items sold. The column names are 'Ordre', 'Nom de l'objet', 'Quantité', 'Kamas', 'Type de vente', and 'Date de vente'. Return the data as a JSON array of objects matching the provided schema. Carefully extract every row visible.",
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        // Sort data by order number just in case the AI doesn't return it sorted
        return data.sort((a: SaleItem, b: SaleItem) => a.order - b.order);

    } catch (error) {
        console.error("Error extracting data with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to process image with Gemini AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred during AI processing.");
    }
}