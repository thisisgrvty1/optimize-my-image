import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const getPrompt = (language: Language) => {
    const langMap: Record<Language, string> = {
        en: "English",
        de: "German",
    };
    const targetLanguage = langMap[language] || "English";

    return `Generate a concise, SEO-friendly alt text for this image in ${targetLanguage}. Describe the main subject, context, and any important text. Keep it under 125 characters. The response should only be the alt text itself, with no introductory phrases like "Alt text:" or quotes.`;
};


export const generateAltText = async (
    apiKey: string, 
    image: { mimeType: string; data: string },
    language: Language
): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey });

        const imagePart = {
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            },
        };
        
        const textPart = {
            text: getPrompt(language),
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const text = response.text.trim();
        // Sometimes the model might still wrap the output in quotes.
        return text.replace(/^["']|["']$/g, '');

    } catch (error) {
        console.error("Gemini API Error:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
            throw new Error('apiKeyInvalid');
        }
        throw new Error('altTextGenerationFailed');
    }
};
