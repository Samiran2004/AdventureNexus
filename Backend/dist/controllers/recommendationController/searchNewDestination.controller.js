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
const http_status_codes_1 = require("http-status-codes");
const groq_service_1 = require("../../services/groq.service");
const generatePromptForSearchNewDestinations_1 = __importDefault(require("../../utils/gemini/generatePromptForSearchNewDestinations"));
const logger_1 = __importDefault(require("../../utils/logger"));
const getFullURL_service_1 = __importDefault(require("../../services/getFullURL.service"));
const unsplash_service_1 = require("../../services/unsplash.service");
const wikipedia_service_1 = require("../../services/wikipedia.service");
const planModel_1 = __importDefault(require("../../database/models/planModel"));
const userModel_1 = __importDefault(require("../../database/models/userModel"));
const searchNewDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fullUrl = (0, getFullURL_service_1.default)(req);
    try {
        const { to, from, date, travelers, budget, budget_range, activities, travel_style, duration } = req.body;
        if (!to || !from || !date || !travelers || !budget) {
            logger_1.default.error(`URL: ${fullUrl} - Missing required fields`);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Provide all required fields!",
            });
        }
        const clerkUserId = (_a = req.auth()) === null || _a === void 0 ? void 0 : _a.userId;
        if (!clerkUserId) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Unauthorized: Clerk user not found",
            });
        }
        const promptData = {
            to,
            from,
            date,
            travelers,
            budget,
            budget_range,
            activities,
            travel_style,
            duration,
        };
        const prompt = (0, generatePromptForSearchNewDestinations_1.default)(promptData);
        const generatedData = yield (0, groq_service_1.groqGeneratedData)(prompt);
        const startIndex = generatedData.indexOf("[");
        const endIndex = generatedData.lastIndexOf("]");
        const cleanString = generatedData.substring(startIndex, endIndex + 1);
        const aiResponseArray = JSON.parse(cleanString);
        if (!Array.isArray(aiResponseArray)) {
            throw new Error("AI response is not an array");
        }
        const processedPlans = yield Promise.all(aiResponseArray.map((aiResponse) => __awaiter(void 0, void 0, void 0, function* () {
            const searchQuery = aiResponse.name || to;
            let destinationImage = yield (0, wikipedia_service_1.fetchWikipediaImage)(searchQuery);
            if (!destinationImage) {
                logger_1.default.warn(`Wikipedia failed for ${searchQuery}, trying Unsplash...`);
                destinationImage = yield (0, unsplash_service_1.fetchUnsplashImage)(searchQuery);
            }
            const planData = {
                clerkUserId,
                to,
                from,
                date,
                travelers,
                budget,
                budget_range,
                activities,
                travel_style,
                ai_score: typeof aiResponse.ai_score === 'string' ? parseFloat(aiResponse.ai_score.replace('%', '')) : aiResponse.ai_score,
                image_url: destinationImage || aiResponse.image_url,
                name: aiResponse.name,
                days: aiResponse.days,
                cost: aiResponse.cost,
                star: aiResponse.star,
                total_reviews: aiResponse.total_reviews,
                destination_overview: aiResponse.destination_overview,
                perfect_for: aiResponse.perfect_for,
                budget_breakdown: aiResponse.budget_breakdown,
                trip_highlights: aiResponse.trip_highlights,
                suggested_itinerary: aiResponse.suggested_itinerary,
                local_tips: aiResponse.local_tips,
                userId: null
            };
            return planData;
        })));
        const user = yield userModel_1.default.findOne({ clerkUserId });
        if (!user) {
            logger_1.default.info(`URL: ${fullUrl} - User not found`);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found",
            });
        }
        const savedPlans = yield Promise.all(processedPlans.map((planData) => __awaiter(void 0, void 0, void 0, function* () {
            const existingPlan = yield planModel_1.default.findOne({
                clerkUserId,
                name: planData.name,
                date,
                budget
            });
            if (existingPlan) {
                return existingPlan;
            }
            planData.userId = user._id;
            const newPlan = new planModel_1.default(planData);
            yield newPlan.save();
            return newPlan;
        })));
        logger_1.default.info(`URL: ${fullUrl} - Plans generated successfully`);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "Ok",
            message: "Generated",
            data: savedPlans,
        });
    }
    catch (error) {
        logger_1.default.error("Internal Server Error", error);
        logger_1.default.error(`URL: ${fullUrl}, error_message: ${error.message}`);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
});
exports.default = searchNewDestination;
