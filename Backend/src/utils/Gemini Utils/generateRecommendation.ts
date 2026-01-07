import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { config } from '../../config/config';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Old SDK Initialization (Legacy/Not used in active function below)
const genAi = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);

// New Google GenAI SDK Initialization
const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

// Legacy model getter
// const model = genAi.getGenerativeModel({ model: 'gemini-3-pro-preview' });

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
        // --- Legacy Implementation Commented Out ---
        // const result = await model.generateContent(prompt);
        // // A safer way to access the response text
        // const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

        // if (!text) {
        //      console.error("No text found in the response from the AI.");
        //      return undefined;
        // }

        // return text;
        // ------------------------------------------

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
