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
const userModel_1 = __importDefault(require("../../Database/models/userModel"));
const recommendationModel_1 = __importDefault(require("../../Database/models/recommendationModel"));
const generateRecommendation_1 = __importDefault(require("../../utils/Gemini Utils/generateRecommendation"));
const generatePrompt_1 = __importDefault(require("../../utils/Gemini Utils/generatePrompt"));
const joiRecommendationValidation_1 = require("../../utils/JoiUtils/joiRecommendationValidation");
const client_1 = __importDefault(require("../../redis/client"));
const http_errors_1 = __importDefault(require("http-errors"));
const generateRecommendations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = joiRecommendationValidation_1.recommendationValidation.validate(req.body);
        if (error) {
            return next((0, http_errors_1.default)(400, error === null || error === void 0 ? void 0 : error.details[0].message));
        }
        const { day, budget, destination, date, totalPeople } = req.body;
        if (!budget || !destination || !totalPeople || !day) {
            return next((0, http_errors_1.default)(400, 'Budget, Destination, Total People, and Day are required.'));
        }
        const redisKey = `${destination}:${budget}:${totalPeople}:${day}`;
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
                const user = yield userModel_1.default.findById(req.user._id).populate('recommendationhistory');
                if (!user) {
                    return next((0, http_errors_1.default)(404, 'User not found!'));
                }
                const existingRecommendation = yield recommendationModel_1.default.findOne({
                    destination: destination,
                    budget: budget,
                    totalPerson: totalPeople,
                    day: day,
                });
                if (existingRecommendation) {
                    yield client_1.default.setex(redisKey, 86400, JSON.stringify(existingRecommendation.details));
                    return res.status(200).json({
                        status: 'Success',
                        data: JSON.parse(existingRecommendation.details),
                    });
                }
                const data = {
                    startingDestination: user.country,
                    destination: destination,
                    day: day,
                    budget: budget,
                    date: date || new Date().toISOString(),
                    totalPerson: totalPeople,
                    prevRecommendation: 'Not Provided',
                    preference: user.preferences,
                };
                const prompt = (0, generatePrompt_1.default)(data);
                const getRecommendation = yield (0, generateRecommendation_1.default)(prompt);
                if (typeof getRecommendation != 'string') {
                    return next((0, http_errors_1.default)(5000, 'Invalid response from recommendation service!'));
                }
                const result = getRecommendation
                    .replace(/```json|```/g, '')
                    .trim();
                const newRecommendation = new recommendationModel_1.default({
                    destination: destination,
                    budget: budget,
                    totalPerson: totalPeople,
                    day: day,
                    details: result,
                    user: req.user._id,
                });
                const savedRecommendation = yield newRecommendation.save();
                user.recommendationhistory.push(savedRecommendation._id);
                yield user.save();
                client_1.default.setex(redisKey, 86400, JSON.stringify(result));
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(result),
                });
            }
        }));
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.default = generateRecommendations;
