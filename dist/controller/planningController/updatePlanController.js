"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlan = void 0;
const planModel_1 = __importDefault(require("../../models/planModel"));
const http_errors_1 = __importDefault(require("http-errors"));
const updatePlan = async (req, res, next) => {
    try {
        const { id } = req.params; // Extracting plan ID from the URL parameters
        const updates = req.body; // Extracting the updates from the request body
        // Find the plan by ID
        const plan = await planModel_1.default.findById(id);
        if (!plan) {
            return next((0, http_errors_1.default)(404, "Plan Not Found!"));
        }
        // Check if the plan belongs to the user
        if (plan.user.toString() !== req.user._id) {
            return next((0, http_errors_1.default)(403, "You do not permission to update this plan"));
        }
        // Update the plan with the provided fields
        Object.assign(plan, updates);
        const updatedPlan = await plan.save();
        // Return the updated plan
        return res.status(200).json({
            status: 'Success',
            message: 'Plan updated successfully.',
            data: updatedPlan
        });
    }
    catch (error) {
        // console.error(error); // Log the error for debugging
        return next((0, http_errors_1.default)(500, "Internal Server Error!"));
    }
};
exports.updatePlan = updatePlan;
