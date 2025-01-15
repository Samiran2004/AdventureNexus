import express, { Router } from 'express';
import authTokenMiddleware from '../middlewares/authTokenMiddleware';
import generateRecommendations, {
    CustomRequestRecommendationController,
    RequestBody,
} from '../controller/recommendationController/getRecommendationController';
import getUserRecommendationHistory from '../controller/recommendationController/getUserRecHistory';
import {
    CustomRequestGetPopularDest,
    getPopularDestinations,
} from '../controller/recommendationController/getPopularDestController';
import {
    CustomRequestGetRecBudget,
    getBudgetRecommendations,
} from '../controller/recommendationController/getRecBudgetController';

const route: Router = express.Router();

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
// Path: /api/v1/recommendations/generate-recommendations
route.post(
    '/generate-recommendations',
    authTokenMiddleware,
    (req, res, next) => {
        generateRecommendations(
            req as CustomRequestRecommendationController,
            res,
            next
        );
    }
);

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
route.get('/recommendation-history', authTokenMiddleware, (req, res, next) => {
    getUserRecommendationHistory(
        req as CustomRequestRecommendationController<object, object, object>,
        res,
        next
    );
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
route.get('/popular-destinations', authTokenMiddleware, (req, res, next) => {
    getPopularDestinations(
        req as CustomRequestGetPopularDest,
        res,
        next
    );
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
route.get('/:budget', authTokenMiddleware, (req, res, next) => {
    getBudgetRecommendations(
        req as unknown as CustomRequestGetRecBudget<{ budget: number }>,
        res,
        next
    );
});

export default route;
