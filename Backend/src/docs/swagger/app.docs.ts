/**
 * @swagger
 * tags:
 *   name: Webhooks
 *   description: External webhook integrations
 */

/**
 * @swagger
 * /api/clerk:
 *   post:
 *     summary: Clerk Webhook
 *     tags: [Webhooks]
 *     security:
 *       - clerkAuth: []
 *     description: Receives events from Clerk (user.created, user.updated, etc.) to sync with local database.
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       500:
 *         description: Webhook verification failed
 */

/**
 * @swagger
 * tags:
 *   name: Mail
 *   description: Email subscription services
 */

/**
 * @swagger
 * /api/v1/mail/subscribe:
 *   post:
 *     summary: Subscribe to Daily Tips
 *     tags: [Mail]
 *     description: Subscribes an email address to receive daily travel tips.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userMail
 *             properties:
 *               userMail:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Registered or Already subscribed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralResponse'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       417:
 *         description: Mail sending error
 */

/**
 * @swagger
 * /api/v1/mail/trigger-daily-tips:
 *   post:
 *     summary: Trigger Daily Tips Manually
 *     tags: [Mail]
 *     description: Manually trigger the daily tips email delivery for all subscribers.
 *     responses:
 *       200:
 *         description: Daily tips triggered successfully
 */
