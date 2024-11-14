"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularDestinations = void 0;
const generatePromptForPopularDest_1 = __importDefault(require("../../utils/Gemini Utils/generatePromptForPopularDest"));
const generateRecommendation_1 = __importDefault(require("../../utils/Gemini Utils/generateRecommendation"));
const http_errors_1 = __importDefault(require("http-errors"));
const client_1 = __importDefault(require("../../redis/client"));
const getPopularDestinations = async (req, res, next) => {
    try {
        const { country, currency_code } = req.user;
        if (!country || !currency_code) {
            return next((0, http_errors_1.default)(400, 'Country or Currency information is missing from user data!'));
        }
        const redisKey = `${country}:${currency_code}`;
        client_1.default.get(redisKey, async (err, cacheData) => {
            if (err) {
                return next((0, http_errors_1.default)(500, 'Internal Redis Server Error!'));
            }
            let generatePopularDest;
            if (cacheData) {
                generatePopularDest = JSON.parse(cacheData);
            }
            else {
                const promptData = { country, currency_code };
                const prompt = (0, generatePromptForPopularDest_1.default)(promptData);
                try {
                    generatePopularDest = (await (0, generateRecommendation_1.default)(prompt));
                    await client_1.default.set(redisKey, JSON.stringify(generatePopularDest), 'EX', 86400); // Cache with expiry
                }
                catch (error) {
                    return next((0, http_errors_1.default)(500, 'Error generating recommendation data.'));
                }
            }
            // Clean and parse the response
            try {
                const result = generatePopularDest
                    .replace(/```json|```/g, '')
                    .replace(/\n/g, '')
                    .trim();
                // Return successful response with popular destinations
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.stringify(result),
                });
            }
            catch (parseError) {
                console.error('Parsing error:', parseError); // Log the exact error
                // console.error("Response data received:", generatePopularDest); // Log the raw data
                return next((0, http_errors_1.default)(500, 'Error parsing popular destinations response.'));
            }
        });
    }
    catch (error) {
        console.error('Internal Server Error:', error);
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.getPopularDestinations = getPopularDestinations;
