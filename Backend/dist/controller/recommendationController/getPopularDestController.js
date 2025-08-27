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
exports.getPopularDestinations = void 0;
const generatePromptForPopularDest_1 = __importDefault(require("../../utils/Gemini Utils/generatePromptForPopularDest"));
const generateRecommendation_1 = __importDefault(require("../../utils/Gemini Utils/generateRecommendation"));
const http_errors_1 = __importDefault(require("http-errors"));
const client_1 = __importDefault(require("../../redis/client"));
const getPopularDestinations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { country, currency_code } = req.user;
        if (!country || !currency_code) {
            return next((0, http_errors_1.default)(400, 'Country or Currency information is missing from user data!'));
        }
        const redisKey = `${country}:${currency_code}`;
        client_1.default.get(redisKey, (err, cacheData) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next((0, http_errors_1.default)(500, 'Internal Redis Server Error!'));
            }
            let generatePopularDest;
            if (cacheData) {
                generatePopularDest = JSON.parse(cacheData);
            }
            else {
                const promptData = {
                    country,
                    currency_code,
                };
                const prompt = (0, generatePromptForPopularDest_1.default)(promptData);
                try {
                    generatePopularDest = (yield (0, generateRecommendation_1.default)(prompt));
                    yield client_1.default.set(redisKey, JSON.stringify(generatePopularDest), 'EX', 86400);
                }
                catch (error) {
                    return next((0, http_errors_1.default)(500, 'Error generating recommendation data.'));
                }
            }
            try {
                const result = generatePopularDest
                    .replace(/```json|```/g, '')
                    .replace(/\n/g, '')
                    .trim();
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.stringify(result),
                });
            }
            catch (parseError) {
                console.error('Parsing error:', parseError);
                return next((0, http_errors_1.default)(500, 'Error parsing popular destinations response.'));
            }
        }));
    }
    catch (error) {
        console.error('Internal Server Error:', error);
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.getPopularDestinations = getPopularDestinations;
