"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlan = void 0;
const planModel_1 = __importDefault(require("../../Database/models/planModel"));
const http_errors_1 = __importDefault(require("http-errors"));
const updatePlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const plan = yield planModel_1.default.findById(id);
        if (!plan) {
            return next((0, http_errors_1.default)(404, 'Plan Not Found!'));
        }
        if (plan.user.toString() !== req.user._id) {
            return next((0, http_errors_1.default)(403, 'You do not permission to update this plan'));
        }
        Object.assign(plan, updates);
        const updatedPlan = yield plan.save();
        return res.status(200).json({
            status: 'Success',
            message: 'Plan updated successfully.',
            data: updatedPlan,
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.updatePlan = updatePlan;
