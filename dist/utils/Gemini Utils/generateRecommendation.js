"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAi = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });
async function generateRecommendation(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.candidates[0].content.parts[0].text;
    }
    catch (error) {
        console.error('Error generating recommendation:', error);
    }
}
exports.default = generateRecommendation;
