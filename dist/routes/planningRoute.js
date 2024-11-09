"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authTokenMiddleware_1 = __importDefault(require("../middlewares/authTokenMiddleware"));
const newPlanController_1 = require("../controller/planningController/newPlanController");
const getPlanByIdController_1 = require("../controller/planningController/getPlanByIdController");
const deletePlanByIdController_1 = require("../controller/planningController/deletePlanByIdController");
const route = express_1.default.Router();
// Create a new travel plan
// Path: POST /api/v1/planning/create
route.post('/create', authTokenMiddleware_1.default, (req, res, next) => {
    (0, newPlanController_1.createPlan)(req, res, next);
});
// Get a plan by id
// Path: GET /api/v1/planning/:id
route.get('/:id', authTokenMiddleware_1.default, getPlanByIdController_1.getPlanById);
// Delete a plan by id
// Path: DELETE /api/v1/planning/:id
route.delete('/:id', authTokenMiddleware_1.default, (req, res, next) => {
    (0, deletePlanByIdController_1.deletePlanById)(req, res, next);
});
// Update a plan by id
// Path: PUT /api/v1/planning/:id
route.put('/:id', authTokenMiddleware_1.default, (req, res) => {
    // Placeholder for update logic
    res.status(501).send({ message: 'Update functionality is not implemented yet.' });
});
exports.default = route;
