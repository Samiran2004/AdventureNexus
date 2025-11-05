import express from 'express';
import authTokenMiddleware from '../middlewares/authTokenMiddleware';
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
import splitCost, {
    CustomRequestSplitCost,
} from '../controller/planningController/splitCostController';

const route = express.Router();


// Create a new travel plan
// Path: POST /api/v1/plans/create
route.post('/trips/create', (req, res, next) => {
    
});


// Get a plan by id
// Path: GET /api/v1/plans/:id
route.get('/:id', authTokenMiddleware, getPlanById);


// Delete a plan by id
// Path: DELETE /api/v1/plans/:id
route.delete('/:id', authTokenMiddleware, (req, res, next) => {
    deletePlanById(req as CustomRequestDeletePlan, res, next);
});


// Update a plan by id
// Path: PUT /api/v1/plans/:id
route.put('/:id', authTokenMiddleware, (req, res, next) => {
    updatePlan(
        req as unknown as CustomRequestUpdatePlan<
            RequestParamsUpdatePlan,
            object,
            object
        >,
        res,
        next
    );
});

// Feature that allows users to split trip expenses with others.
// Path: POST  /api/v1/plans/split-cost/:id
route.post('/split-cost/:id', authTokenMiddleware, (req, res, next) => {
    splitCost(req as CustomRequestSplitCost, res, next);
});

export default route;
