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
/**
 * @swagger
 * /api/v1/recommendation/generate-recommendations:
 *   post:
 *     summary: Generate recommendations based on user preferences and input data
 *     tags: [Recommendation]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: number
 *               budget:
 *                 type: number
 *               destination:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               totalPeople:
 *                 type: number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// Generate personalized recommendations using Gemini
// Path: /api/v1/recommendation/generate-recommendations
route.post('/generate-recommendations', authTokenMiddleware_1.default, (req, res, next) => {
    (0, getRecommendationController_1.default)(req, res, next);
});
/**
 * @swagger
 * /api/v1/recommendations/recommendation-history:
 *   get:
 *     summary: View user's past recommendations
 *     tags: [Recommendation]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: User Not Found
 *       500:
 *         description: Internal Server Error
 */
// View user's past recommendations
// Path: /api/v1/recommendations/recommendation-history
route.get('/recommendation-history', authTokenMiddleware_1.default, (req, res, next) => {
    (0, getUserRecHistory_1.default)(req, res, next);
});
/**
 * @swagger
 * /api/v1/recommendations/popular-destinations:
 *   get:
 *     summary: Discover trending travel destinations
 *     tags: [Recommendation]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: string
 *                   example: JSON string of popular destinations
 *       400:
 *         description: Country or Currency information is missing from user data
 *       500:
 *         description: Internal server error
 */
// Discover trending travel destinations
// Path: /api/v1/recommendations/popular-destinations
route.get('/popular-destinations', authTokenMiddleware_1.default, (req, res, next) => {
    (0, getPopularDestController_1.getPopularDestinations)(req, res, next);
});
/**
 * @swagger
 * /api/v1/recommendation/{budget}:
 *   get:
 *     summary: Generate all possible recommendations using budget
 *     tags: [Recommendation]
 *     parameters:
 *       - in: path
 *         name: budget
 *         required: true
 *         description: Budget for the recommendations
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Budget is required or invalid budget format
 *       500:
 *         description: Internal server error
 */
// Generate all possible recommendations using budget
// Path: /api/v1/recommendation/:budget
route.get('/:budget', authTokenMiddleware_1.default, (req, res, next) => {
    (0, getRecBudgetController_1.getBudgetRecommendations)(req, res, next);
});
exports.default = route;
