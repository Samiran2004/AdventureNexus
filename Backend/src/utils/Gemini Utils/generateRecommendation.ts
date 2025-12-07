import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { config } from '../../config/config';
import {GoogleGenAI} from "@google/genai";

dotenv.config();

const genAi = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);

const ai = new GoogleGenAI({apiKey: config.GEMINI_API_KEY});

// After updating your npm package, this will now work correctly.
const model = genAi.getGenerativeModel({ model: 'gemini-3-pro-preview' });

async function generateRecommendation(
    prompt: string
): Promise<string | undefined> {
    try {
        // const result = await model.generateContent(prompt);
        // // A safer way to access the response text
        // const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

        // if (!text) {
        //      console.error("No text found in the response from the AI.");
        //      return undefined;
        // }

        // return text;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const text = response.text;
        if(!text) {
             console.error("No text found in the response from the AI.");
             return undefined;
        }

        return text;

    } catch (error) {
        console.error('Error generating recommendation:', error);
    }
}

export default generateRecommendation;
