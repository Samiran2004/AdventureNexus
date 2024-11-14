import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateRecommendation(
  prompt: string
): Promise<string | undefined> {
  try {
    const result: any = await model.generateContent(prompt);
    return result.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating recommendation:', error);
  }
}

export default generateRecommendation;
