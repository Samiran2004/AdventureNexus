/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: User reviews and feedback management
 */

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Get All Reviews
 *     tags: [Reviews]
 *     description: Retrieve all reviews with optional filtering and sorting.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by trip type (solo, family, couple, etc.)
 *       - in: query
 *         name: rating
 *         schema:
 *           type: string
 *         description: Filter by minimum rating (e.g. "4" for 4+ stars)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in comments, locations, or usernames
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, oldest, highest, helpful]
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/reviews:
 *   post:
 *     summary: Create a New Review
 *     tags: [Reviews]
 *     description: Submit a new user review for a trip.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         description: Invalid data
 */

/**
 * @swagger
 * /api/v1/reviews/{id}/like:
 *   put:
 *     summary: Like a Review
 *     tags: [Reviews]
 *     description: Increment the helpful count of a specific review.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     responses:
 *       200:
 *         description: Review liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server Error
 */
