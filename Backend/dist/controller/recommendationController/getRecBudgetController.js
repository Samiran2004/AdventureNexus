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
exports.getBudgetRecommendations = void 0;
const generatePromptForBudget_1 = __importDefault(require("../../utils/Gemini Utils/generatePromptForBudget"));
const generateRecommendation_1 = __importDefault(require("../../utils/Gemini Utils/generateRecommendation"));
const client_1 = __importDefault(require("../../redis/client"));
const http_errors_1 = __importDefault(require("http-errors"));
const getBudgetRecommendations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let budget = req.params.budget;
        if (!budget) {
            return next((0, http_errors_1.default)(400, 'Budget is required!'));
        }
        if (isNaN(budget)) {
            return next((0, http_errors_1.default)(400, 'Invalid budget format!'));
        }
        const redisKey = `${budget}:${req.user.country}`;
        client_1.default.get(redisKey, (err, cacheData) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next((0, http_errors_1.default)(500, 'Internal Redis Server Error!'));
            }
            if (cacheData) {
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData),
                });
            }
            else {
                const data = {
                    budget: budget,
                    country: req.user.country,
                };
                const prompt = (0, generatePromptForBudget_1.default)(data);
                const recommendations = (yield (0, generateRecommendation_1.default)(prompt));
                const result = recommendations
                    .replace(/```json|```/g, '')
                    .trim();
                yield client_1.default.setex(redisKey, 300, JSON.stringify(result));
                return res.status(200).json({
                    status: 'Success',
                    recommendations: JSON.parse(result),
                });
            }
        }));
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.getBudgetRecommendations = getBudgetRecommendations;
