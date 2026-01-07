import dotenv from 'dotenv';
import { config } from '../../config/config';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// New Google GenAI SDK Initialization
const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

/**
 * Generates content using Google's Gemini AI model.
 * Uses the newer `gemini-2.5-flash` model via `@google/genai` SDK.
 * @param prompt - The string prompt to send to the AI.
 * @returns The text content of the AI's response, or undefined if failed.
 */
async function generateRecommendation(
    prompt: string
): Promise<string | undefined> {
    try {
        // Call Gemini 2.5 Model
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const text = response.text;
        if (!text) {
            console.error("No text found in the response from the AI.");
            return undefined;
        }

        return text;

    } catch (error) {
        console.error('Error generating recommendation:', error);
    }
}

export default generateRecommendation;
