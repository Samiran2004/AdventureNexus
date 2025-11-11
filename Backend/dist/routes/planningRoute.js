"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authTokenMiddleware_1 = __importDefault(require("../middlewares/authTokenMiddleware"));
const getPlanByIdController_1 = require("../controller/planningController/getPlanByIdController");
const deletePlanByIdController_1 = require("../controller/planningController/deletePlanByIdController");
const updatePlanController_1 = require("../controller/planningController/updatePlanController");
const splitCostController_1 = __importDefault(require("../controller/planningController/splitCostController"));
const newPlanController_1 = require("../controller/planningController/newPlanController");
const route = express_1.default.Router();
route.post('/trips/create', newPlanController_1.createPlan);
route.get('/:id', authTokenMiddleware_1.default, getPlanByIdController_1.getPlanById);
route.delete('/:id', authTokenMiddleware_1.default, (req, res, next) => {
    (0, deletePlanByIdController_1.deletePlanById)(req, res, next);
});
route.put('/:id', authTokenMiddleware_1.default, (req, res, next) => {
    (0, updatePlanController_1.updatePlan)(req, res, next);
});
route.post('/split-cost/:id', authTokenMiddleware_1.default, (req, res, next) => {
    (0, splitCostController_1.default)(req, res, next);
});
exports.default = route;
