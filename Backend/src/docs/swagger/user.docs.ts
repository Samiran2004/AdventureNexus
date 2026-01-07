/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile retrieval
 */

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get User Profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve the profile details of the currently authenticated user.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
