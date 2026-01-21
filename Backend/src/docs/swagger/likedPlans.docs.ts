/**
 * @swagger
 * tags:
 *   name: Liked Plans
 *   description: Manage user's favorite travel plans
 */

/**
 * @swagger
 * /api/v1/liked-plans:
 *   get:
 *     summary: Get All Liked Plans
 *     tags: [Liked Plans]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all travel plans liked by the currently authenticated user.
 *     responses:
 *       200:
 *         description: Liked plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikedPlanResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/liked-plans/{planId}:
 *   post:
 *     summary: Like a Plan
 *     tags: [Liked Plans]
 *     security:
 *       - bearerAuth: []
 *     description: Add a specific travel plan to the user's liked plans.
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: The plan ID to like
 *     responses:
 *       201:
 *         description: Plan liked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Plan not found
 */

/**
 * @swagger
 * /api/v1/liked-plans/{planId}:
 *   delete:
 *     summary: Unlike a Plan
 *     tags: [Liked Plans]
 *     security:
 *       - bearerAuth: []
 *     description: Remove a specific travel plan from the user's liked plans.
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: The plan ID to unlike
 *     responses:
 *       200:
 *         description: Plan unliked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Plan not found
 */
