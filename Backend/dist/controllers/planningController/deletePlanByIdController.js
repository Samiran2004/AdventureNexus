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
exports.deletePlanById = void 0;
const userModel_1 = __importDefault(require("../../database/models/userModel"));
const planModel_1 = __importDefault(require("../../database/models/planModel"));
const http_errors_1 = __importDefault(require("http-errors"));
const deletePlanById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userId = req.user._id;
        const plan = yield planModel_1.default.findById(id);
        if (!plan) {
            return next((0, http_errors_1.default)(404, 'Plan Not Found!'));
        }
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found!'));
        }
        if (!user.plans.some(planId => planId.toString() == id)) {
            return next((0, http_errors_1.default)(403, 'This plan does not belong to the user!'));
        }
        user.plans = user.plans.filter(planId => planId.toString() !== id);
        yield user.save();
        yield planModel_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            status: 'Success',
            message: 'Plan deleted successfully.',
        });
    }
    catch (_a) {
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.deletePlanById = deletePlanById;
