import express from 'express';
import authTokenMiddleware from "../middlewares/authTokenMiddleware";
import {createPlan, CreatePlanRequestBody, CustomRequest} from "../controller/planningController/newPlanController";
import {getPlanById} from "../controller/planningController/getPlanByIdController";
import {CustomRequestDeletePlan, deletePlanById} from "../controller/planningController/deletePlanByIdController";

const route = express.Router();

// Create a new travel plan
// Path: POST /api/v1/planning/create
route.post('/create', authTokenMiddleware, (req, res, next)=>{
    createPlan(req as CustomRequest<{}, {}, CreatePlanRequestBody>, res, next)
});

// Get a plan by id
// Path: GET /api/v1/planning/:id
route.get('/:id', authTokenMiddleware, getPlanById);

// Delete a plan by id
// Path: DELETE /api/v1/planning/:id
route.delete('/:id', authTokenMiddleware, (req, res, next)=>{
    deletePlanById(req as CustomRequestDeletePlan, res, next);
});

// Update a plan by id
// Path: PUT /api/v1/planning/:id
route.put('/:id', authTokenMiddleware, (req, res) => {
    // Placeholder for update logic
    res.status(501).send({ message: 'Update functionality is not implemented yet.' });
});

export default route;
