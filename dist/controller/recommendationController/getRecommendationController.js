"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel"));
const recommendationModel_1 = __importDefault(require("../../models/recommendationModel"));
const generateRecommendation_1 = __importDefault(require("../../utils/Gemini Utils/generateRecommendation"));
const generatePrompt_1 = __importDefault(require("../../utils/Gemini Utils/generatePrompt"));
const joiRecommendationValidation_1 = require("../../utils/JoiUtils/joiRecommendationValidation");
const client_1 = __importDefault(require("../../redis/client"));
const http_errors_1 = __importDefault(require("http-errors"));
const generateRecommendations = async (req, res, next) => {
    try {
        // Validate request body
        const { error } = joiRecommendationValidation_1.recommendationValidation.validate(req.body);
        if (error) {
            return next((0, http_errors_1.default)(400, error?.details[0].message));
        }
        // Fetch data from req.body
        const { day, budget, destination, date, totalPeople } = req.body;
        // Ensure required fields are present
        if (!budget || !destination || !totalPeople || !day) {
            return next((0, http_errors_1.default)(400, "Budget, Destination, Total People, and Day are required."));
        }
        // Redis key based on destination, budget, totalPeople, and day
        const redisKey = `${destination}:${budget}:${totalPeople}:${day}`;
        // Check if recommendation exists in Redis
        client_1.default.get(redisKey, async (err, cacheData) => {
            if (err) {
                // console.error("Redis error:", err); // Log for Debugging
                return next((0, http_errors_1.default)(500, "Internal Redis Server Error!"));
            }
            if (cacheData) {
                // If recommendation is cached, return it
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData) // Parse JSON data
                });
            }
            else {
                // Fetch user and populate recommendation history
                const user = await userModel_1.default.findById(req.user._id).populate('recommendationhistory');
                if (!user) {
                    return next((0, http_errors_1.default)(404, "User not found!"));
                }
                // Check if recommendation exists in the database (include `day` in the query)
                const existingRecommendation = await recommendationModel_1.default.findOne({
                    destination: destination,
                    budget: budget,
                    totalPerson: totalPeople,
                    day: day
                });
                if (existingRecommendation) {
                    // Save the recommendation in Redis (cache it for 24 hours)
                    await client_1.default.setex(redisKey, 86400, JSON.stringify(existingRecommendation.details));
                    // Return the recommendation found in the database
                    return res.status(200).json({
                        status: 'Success',
                        data: JSON.parse(existingRecommendation.details)
                    });
                }
                // Generate a new recommendation if it doesn't exist
                const data = {
                    startingDestination: user.country,
                    destination: destination,
                    day: day,
                    budget: budget,
                    date: date || new Date().toISOString(),
                    totalPerson: totalPeople,
                    prevRecommendation: "Not Provided",
                    preference: user.preferences
                };
                // Generate a prompt and fetch the recommendation using an external AI service
                const prompt = (0, generatePrompt_1.default)(data);
                const getRecommendation = await (0, generateRecommendation_1.default)(prompt);
                if (typeof getRecommendation != 'string') {
                    // console.error('Error: recommendations is not a valid string.'); // Log for Debugging
                    return next((0, http_errors_1.default)(5000, "Invalid response from recommendation service!"));
                }
                const result = getRecommendation.replace(/```json|```/g, "").trim();
                // Create a new recommendation and save it to the database
                const newRecommendation = new recommendationModel_1.default({
                    destination: destination,
                    budget: budget,
                    totalPerson: totalPeople,
                    day: day,
                    details: result,
                    user: req.user._id
                });
                // const savedRecommendation = await newRecommendation.save() as IRecommendation & { _id: string };
                const savedRecommendation = await newRecommendation.save();
                // Add the new recommendation to the user's recommendation history
                user.recommendationhistory.push(savedRecommendation._id);
                await user.save();
                // Save the new recommendation in Redis (set expiry to 24 hours)
                client_1.default.setex(redisKey, 86400, JSON.stringify(result));
                // Return the new recommendation
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(result) // Use parsed result directly
                });
            }
        });
    }
    catch (error) {
        // console.error("Error generating recommendations:", error); // Log for Debugging
        return next((0, http_errors_1.default)(500, "Internal Server Error!"));
    }
};
exports.default = generateRecommendations;
