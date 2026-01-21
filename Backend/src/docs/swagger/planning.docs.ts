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

/**
 * @swagger
 * /api/v1/plans/recommendations:
 *   get:
 *     summary: Get Personalized Recommendations
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve personalized travel recommendations based on the user's history and preferences.
 *     responses:
 *       200:
 *         description: Recommendations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/plans/search/destination-images:
 *   post:
 *     summary: Get Destination Images
 *     tags: [Plans]
 *     description: Fetch a batch of high-quality images for a specific destination.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 example: "Paris"
 *               count:
 *                 type: number
 *                 example: 12
 *     responses:
 *       200:
 *         description: Images fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DestinationImagesResponse'
 *       400:
 *         description: Query parameter is required
 */

/**
 * @swagger
 * /api/v1/plans/public/{id}:
 *   get:
 *     summary: Get Public Plan by ID
 *     tags: [Plans]
 *     description: Retrieve a specific travel plan using its ID without authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The plan ID
 *     responses:
 *       200:
 *         description: Plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanResponse'
 *       404:
 *         description: Plan not found
 */

