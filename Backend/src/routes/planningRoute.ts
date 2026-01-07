import express from 'express';
import searchNewDestination from '../controller/recommendationController/searchNewDestination.controller';
import protect from '../middlewares/authClerkTokenMiddleware';

const route = express.Router();

// route.post("/search/destination", protect, searchNewDestination);
/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Travel plan generation and management
 */

/**
 * @swagger
 * /api/v1/plans/search/destination:
 *   post:
 *     summary: Generate Travel Plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     description: Generate a detailed travel plan using AI based on user preferences.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - from
 *               - date
 *               - travelers
 *               - budget
 *             properties:
 *               to:
 *                 type: string
 *               from:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               travelers:
 *                 type: number
 *               budget:
 *                 type: number
 *               budget_range:
 *                 type: string
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *               travel_style:
 *                 type: string
 *             example:
 *               to: "Paris"
 *               from: "London"
 *               date: "2024-06-01"
 *               travelers: 2
 *               budget: 5000
 *     responses:
 *       200:
 *         description: Plan generated successfully or retrieved existing plan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanResponse'
 *       400:
 *         description: Bad Request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Clerk user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
route.post("/search/destination", searchNewDestination);

export default route;
