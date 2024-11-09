"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularDestinations = void 0;
const generatePromptForPopularDest_1 = __importDefault(require("../../utils/Gemini Utils/generatePromptForPopularDest"));
const generateRecommendation_1 = __importDefault(require("../../utils/Gemini Utils/generateRecommendation"));
const http_errors_1 = __importDefault(require("http-errors"));
const getPopularDestinations = async (req, res, next) => {
    try {
        const { country, currency } = req.user; // Extracting country and currency from the authenticated user's information
        if (!country || !currency) {
            return next((0, http_errors_1.default)(400, "Country or Currency information is missing from user data!"));
        }
        // Create a valid object for the prompt function
        const promptData = { country, currency };
        // Generate a prompt and fetch the popular destinations using external AI service
        const prompt = (0, generatePromptForPopularDest_1.default)(promptData);
        const generatePopularDest = await (0, generateRecommendation_1.default)(prompt);
        if (typeof generatePopularDest !== 'string') {
            return next((0, http_errors_1.default)(500, "Internal Server Error!"));
        }
        let destinations;
        try {
            const result = generatePopularDest.replace(/```json|```/g, "").trim();
            destinations = JSON.parse(result);
        }
        catch (parseError) {
            // console.error('Error parsing AI response:', parseError);  //Log for Debugging
            return next((0, http_errors_1.default)(500, "Error parsing popular destinations response."));
        }
        // Return successful response with popular destinations
        return res.status(200).json({
            status: 'Success',
            data: destinations
        });
    }
    catch (error) {
        // console.error(error); // Log the error for debugging
        return next((0, http_errors_1.default)(500, "Internal Server Error!"));
    }
};
exports.getPopularDestinations = getPopularDestinations;
