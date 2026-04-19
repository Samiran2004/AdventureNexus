/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel management and data seeding
 */

/**
 * @swagger
 * /api/v1/hotels/create:
 *   get:
 *     summary: Seed Hotels Data
 *     tags: [Hotels]
 *     description: Triggers a seeding script to populate the database with initial hotel data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destination
 *               - duration
 *               - budget
 *               - currency_code
 *             properties:
 *               destination:
 *                 type: string
 *                 example: "Paris"
 *               duration:
 *                 type: string
 *                 example: "5 days"
 *               budget:
 *                 type: number
 *                 example: 2000
 *               currency_code:
 *                 type: string
 *                 example: "USD"
 *     responses:
 *       200:
 *         description: Hotels created successfully (Logs to console)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: 'string', example: 'Ok' }
 *                 data: { type: 'array', items: { type: 'object' } }
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
