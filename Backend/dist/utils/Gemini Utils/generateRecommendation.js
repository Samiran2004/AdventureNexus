"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../../config/config");
const genai_1 = require("@google/genai");
dotenv_1.default.config();
const genAi = new generative_ai_1.GoogleGenerativeAI(config_1.config.GEMINI_API_KEY);
const ai = new genai_1.GoogleGenAI({ apiKey: config_1.config.GEMINI_API_KEY });
const model = genAi.getGenerativeModel({ model: 'gemini-3-pro-preview' });
function generateRecommendation(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt
            });
            const text = response.text;
            if (!text) {
                console.error("No text found in the response from the AI.");
                return undefined;
            }
            return text;
        }
        catch (error) {
            console.error('Error generating recommendation:', error);
        }
    });
}
exports.default = generateRecommendation;
