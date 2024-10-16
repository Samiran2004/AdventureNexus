import express from 'express';
import authTokenMiddleware from '../../middlewares/authTokenMiddleware';
import newPlanController from '../../controller/planningController/newPlanController';
import getPlanByIdController from '../../controller/planningController/getPlanByIdController';
import deletePlanByIdController from '../../controller/planningController/deletePlanByIdController';

const route = express.Router();

// Create a new travel plan
// Path: POST /api/v1/planning/create
route.post('/create', authTokenMiddleware, newPlanController);

// Get a plan by id
// Path: GET /api/v1/planning/:id
route.get('/:id', authTokenMiddleware, getPlanByIdController);

// Delete a plan by id
// Path: DELETE /api/v1/planning/:id
route.delete('/:id', authTokenMiddleware, deletePlanByIdController);

// Update a plan by id
// Path: PUT /api/v1/planning/:id
route.put('/:id', authTokenMiddleware, (req, res) => {
    // Placeholder for update logic
    res.status(501).send({ message: 'Update functionality is not implemented yet.' });
});

export default route;
