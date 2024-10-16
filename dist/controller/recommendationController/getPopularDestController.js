"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularDestinations = void 0;
const generatePromptForPopularDest_1 = __importDefault(require("../../utils/Gemini Utils/generatePromptForPopularDest"));
const generateRecommendation_1 = __importDefault(require("../../utils/Gemini Utils/generateRecommendation"));
const getPopularDestinations = async (req, res) => {
    try {
        const country = req.user.country; // Extracting country from the authenticated user's information
        // Generate a prompt and fetch the popular destinations using external AI service
        const prompt = (0, generatePromptForPopularDest_1.default)(country);
        const generatePopularDest = await (0, generateRecommendation_1.default)(prompt);
        // Clean and parse the received data
        const result = generatePopularDest.replace(/```json|```/g, "").trim();
        const destinations = JSON.parse(result);
        // Return successful response with popular destinations
        return res.status(200).json({
            status: 'Success',
            data: destinations
        });
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            status: 'Failed',
            message: 'Internal Server Error.'
        });
    }
};
exports.getPopularDestinations = getPopularDestinations;
