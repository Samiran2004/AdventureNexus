import express from 'express';
import authTokenMiddleware from '../middlewares/authTokenMiddleware';
import {
  createPlan,
  CreatePlanRequestBody,
  CustomRequest,
} from '../controller/planningController/newPlanController';
import { getPlanById } from '../controller/planningController/getPlanByIdController';
import {
  CustomRequestDeletePlan,
  deletePlanById,
} from '../controller/planningController/deletePlanByIdController';
import {
  CustomRequestUpdatePlan,
  RequestParamsUpdatePlan,
  updatePlan,
} from '../controller/planningController/updatePlanController';

const route = express.Router();

/**
 * @swagger
 * /api/v1/plans/create:
 *   post:
 *     summary: Create a new travel plan
 *     tags: [Planning]
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
 *               destination:
 *                 type: string
 *                 example: Paris
 *               dispatch_city:
 *                 type: string
 *                 example: New York
 *               travel_dates:
 *                 type: object
 *                 properties:
 *                   start_date:
 *                     type: string
 *                     format: date
 *                     example: 2024-05-01
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     example: 2024-05-10
 *               budget:
 *                 type: string
 *                 example: medium
 *               total_people:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: New Plan Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: New Plan Created
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 603e2a7e5c146b001c5e4ef5
 *                     user:
 *                       type: string
 *                       example: 603e2a7e5c146b001c5e4ef5
 *                     destination:
 *                       type: string
 *                       example: Paris
 *                     dispatch_city:
 *                       type: string
 *                       example: New York
 *                     budget:
 *                       type: string
 *                       example: medium
 *                     total_people:
 *                       type: number
 *                       example: 4
 *                     travel_dates:
 *                       type: object
 *                       properties:
 *                         start_date:
 *                           type: string
 *                           format: date
 *                           example: 2024-05-01
 *                         end_date:
 *                           type: string
 *                           format: date
 *                           example: 2024-05-10
 *                     flights:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           airline:
 *                             type: string
 *                             example: Delta
 *                           flight_number:
 *                             type: string
 *                             example: DL123
 *                           departure_time:
 *                             type: string
 *                             example: 2024-05-01T08:00:00Z
 *                           arrival_time:
 *                             type: string
 *                             example: 2024-05-01T16:00:00Z
 *                           price:
 *                             type: number
 *                             example: 500
 *                           class:
 *                             type: string
 *                             example: Economy
 *                           duration:
 *                             type: string
 *                             example: 8h
 *                     hotels:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           hotel_name:
 *                             type: string
 *                             example: Hotel de Paris
 *                           estimated_cost:
 *                             type: number
 *                             example: 1200
 *                           price_per_night:
 *                             type: number
 *                             example: 150
 *                           address:
 *                             type: string
 *                             example: 1 Avenue des Champs-Élysées, Paris, France
 *                           rating:
 *                             type: number
 *                             example: 4.5
 *                           amenities:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["Free Wi-Fi", "Breakfast included"]
 *                           distance_to_city_center:
 *                             type: string
 *                             example: 2 km
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal server error
 */

// Create a new travel plan
// Path: POST /api/v1/plans/create
route.post('/create', authTokenMiddleware, (req, res, next) => {
  createPlan(req as CustomRequest<{}, {}, CreatePlanRequestBody>, res, next);
});

/**
 * @swagger
 * /api/v1/plans/{id}:
 *   get:
 *     summary: Get a plan by id
 *     tags: [Planning]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the plan to retrieve
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
 *                   type: object
 *       404:
 *         description: Plan not found or The id is Invalid
 *       500:
 *         description: Internal server error
 */

// Get a plan by id
// Path: GET /api/v1/plans/:id
route.get('/:id', authTokenMiddleware, getPlanById);

/**
 * @swagger
 * /api/v1/plans/{id}:
 *   delete:
 *     summary: Delete a plan by id
 *     tags: [Planning]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the plan to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Plan deleted successfully.
 *       403:
 *         description: This plan does not belong to the user
 *       404:
 *         description: Plan Not Found
 *       500:
 *         description: Internal Server Error
 */

// Delete a plan by id
// Path: DELETE /api/v1/plans/:id
route.delete('/:id', authTokenMiddleware, (req, res, next) => {
  deletePlanById(req as CustomRequestDeletePlan, res, next);
});

/**
 * @swagger
 * /api/v1/plans/{id}:
 *   put:
 *     summary: Update a plan by id
 *     tags: [Planning]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the plan to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destination:
 *                 type: string
 *               dispatch_city:
 *                 type: string
 *               travel_dates:
 *                 type: object
 *                 properties:
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   end_date:
 *                     type: string
 *                     format: date
 *               budget:
 *                 type: string
 *               total_people:
 *                 type: number
 *               flights:
 *                 type: array
 *                 items:
 *                   type: object
 *               hotels:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Plan updated successfully.
 *                 data:
 *                   type: object
 *       403:
 *         description: You do not have permission to update this plan
 *       404:
 *         description: Plan Not Found
 *       500:
 *         description: Internal Server Error
 */

// Update a plan by id
// Path: PUT /api/v1/plans/:id
route.put('/:id', authTokenMiddleware, (req, res, next) => {
  updatePlan(
    req as unknown as CustomRequestUpdatePlan<RequestParamsUpdatePlan, {}, {}>,
    res,
    next
  );
});

export default route;
