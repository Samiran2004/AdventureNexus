"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlanById = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const planModel_1 = __importDefault(require("../../models/planModel"));
const http_errors_1 = __importDefault(require("http-errors"));
const deletePlanById = async (req, res, next) => {
    try {
        const id = req.params.id; // Plan ID to be deleted
        const userId = req.user._id; // Logged-in user's ID
        // Check if the plan exists
        const plan = await planModel_1.default.findById(id);
        if (!plan) {
            return next((0, http_errors_1.default)(404, 'Plan Not Found!'));
        }
        // Check if the user exists
        const user = await userModel_1.default.findById(userId);
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found!'));
        }
        // Check if the plan belongs to the user
        if (!user.plans.some(planId => planId.toString() == id)) {
            return next((0, http_errors_1.default)(403, 'This plan does not belong to the user!'));
        }
        // Remove the plan reference from the user's plans array
        user.plans = user.plans.filter(planId => planId.toString() !== id);
        // Save the updated user document
        await user.save();
        // Delete the plan from the Plan collection
        await planModel_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            status: 'Success',
            message: 'Plan deleted successfully.',
        });
    }
    catch (error) {
        // console.log(`Error in deletePlanByIdController: ${error}`);  //For Debugging
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.deletePlanById = deletePlanById;
