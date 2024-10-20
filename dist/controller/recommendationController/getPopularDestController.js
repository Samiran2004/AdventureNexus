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
        const { country, currency } = req.user; // Extracting country and currency from the authenticated user's information
        if (!country || !currency) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Country or currency information is missing from user data.'
            });
        }
        // Create a valid object for the prompt function
        const promptData = { country, currency };
        // Generate a prompt and fetch the popular destinations using external AI service
        const prompt = (0, generatePromptForPopularDest_1.default)(promptData); // Passing the correct object
        const generatePopularDest = await (0, generateRecommendation_1.default)(prompt);
        if (typeof generatePopularDest !== 'string') {
            return res.status(500).json({
                status: 'Failed',
                message: 'Internal Server Error.'
            });
        }
        let destinations;
        try {
            const result = generatePopularDest.replace(/```json|```/g, "").trim();
            destinations = JSON.parse(result);
        }
        catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            return res.status(500).json({
                status: 'Failed',
                message: 'Error parsing popular destinations response.'
            });
        }
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
