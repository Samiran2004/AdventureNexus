import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// After updating your npm package, this will now work correctly.
const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

async function generateRecommendation(
    prompt: string
): Promise<string | undefined> {
    try {
        const result = await model.generateContent(prompt);
        // A safer way to access the response text
        const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

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
