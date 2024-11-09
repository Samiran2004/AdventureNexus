"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetRecommendations = void 0;
const generatePromptForBudget_1 = __importDefault(require("../../utils/Gemini Utils/generatePromptForBudget"));
const generateRecommendation_1 = __importDefault(require("../../utils/Gemini Utils/generateRecommendation"));
const client_1 = __importDefault(require("../../redis/client"));
const http_errors_1 = __importDefault(require("http-errors"));
const getBudgetRecommendations = async (req, res, next) => {
    try {
        // Fetch budget from req.params
        let { budget } = req.params;
        if (!budget) {
            return next((0, http_errors_1.default)(400, "Budget is required!"));
        }
        // If the budget is a string type, convert it into an integer
        if (typeof budget === 'string') {
            budget = parseInt(budget);
        }
        if (isNaN(budget)) {
            return next((0, http_errors_1.default)(400, "Invalid budget format!"));
        }
        // Redis Key
        const redisKey = `${budget}:${req.user.country}`;
        // Check if recommendation exists in Redis
        client_1.default.get(redisKey, async (err, cacheData) => {
            if (err) {
                // console.error('Redis error:', err); //Log for Debugging
                return next((0, http_errors_1.default)(500, "Internal Redis Server Error!"));
            }
            if (cacheData) {
                // If recommendation is cached, return it
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData)
                });
            }
            else {
                // Generate a prompt
                const data = {
                    budget: budget,
                    country: req.user.country
                };
                const prompt = (0, generatePromptForBudget_1.default)(data);
                // Generate recommendations
                const recommendations = await (0, generateRecommendation_1.default)(prompt);
                if (typeof recommendations != 'string') {
                    // console.error('Error: recommendations is not a valid string.'); // Log for Debugging
                    return next((0, http_errors_1.default)(500, "Invalid response from recommendation service!"));
                }
                const result = recommendations.replace(/```json|```/g, "").trim();
                // Save the new recommendation in Redis (For 5 min)
                client_1.default.setex(redisKey, 300, JSON.stringify(result));
                // Return the response
                return res.status(200).json({
                    status: 'Success',
                    recommendations: JSON.parse(result)
                });
            }
        });
    }
    catch (error) {
        console.error('Internal Server Error:', error); // Log the error for debugging
        return next((0, http_errors_1.default)(500, "Internal Server Error!"));
    }
};
exports.getBudgetRecommendations = getBudgetRecommendations;
