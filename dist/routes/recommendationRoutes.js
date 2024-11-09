"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authTokenMiddleware_1 = __importDefault(require("../middlewares/authTokenMiddleware"));
const getRecommendationController_1 = __importDefault(require("../controller/recommendationController/getRecommendationController"));
const getUserRecHistory_1 = __importDefault(require("../controller/recommendationController/getUserRecHistory"));
const getPopularDestController_1 = require("../controller/recommendationController/getPopularDestController");
const getRecBudgetController_1 = require("../controller/recommendationController/getRecBudgetController");
const route = express_1.default.Router();
// Generate personalized recommendations using Gemini
// Path: /api/v1/recommendation/generate-recommendations
route.post('/generate-recommendations', authTokenMiddleware_1.default, (req, res, next) => {
    (0, getRecommendationController_1.default)(req, res, next);
});
// View user's past recommendations
// Path: /api/v1/recommendations/recommendation-history
route.get('/recommendation-history', authTokenMiddleware_1.default, (req, res, next) => {
    (0, getUserRecHistory_1.default)(req, res, next);
});
// Discover trending travel destinations
// Path: /api/v1/recommendations/popular-destinations
route.get('/popular-destinations', authTokenMiddleware_1.default, (req, res, next) => {
    (0, getPopularDestController_1.getPopularDestinations)(req, res, next);
});
// Generate all possible recommendations using budget
// Path: /api/v1/recommendation/:budget
route.get('/:budget', authTokenMiddleware_1.default, (req, res, next) => {
    (0, getRecBudgetController_1.getBudgetRecommendations)(req, res, next);
});
exports.default = route;
