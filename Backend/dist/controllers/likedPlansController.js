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
exports.getLikedPlans = exports.unlikePlan = exports.likePlan = void 0;
const userModel_1 = __importDefault(require("../database/models/userModel"));
const planModel_1 = __importDefault(require("../database/models/planModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const likePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { planId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clerkUserId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan ID'
            });
        }
        const plan = yield planModel_1.default.findById(planId);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }
        const user = yield userModel_1.default.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const planObjectId = new mongoose_1.default.Types.ObjectId(planId);
        if ((_b = user.likedPlans) === null || _b === void 0 ? void 0 : _b.some(id => id.toString() === planId)) {
            return res.status(400).json({
                success: false,
                message: 'Plan already liked'
            });
        }
        user.likedPlans = user.likedPlans || [];
        user.likedPlans.push(planObjectId);
        yield user.save();
        logger_1.default.info(`User ${userId} liked plan ${planId}`);
        return res.status(200).json({
            success: true,
            message: 'Plan liked successfully',
            likedPlans: user.likedPlans
        });
    }
    catch (error) {
        logger_1.default.error(`Error liking plan: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
exports.likePlan = likePlan;
const unlikePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { planId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clerkUserId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan ID'
            });
        }
        const user = yield userModel_1.default.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (!user.likedPlans || user.likedPlans.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No liked plans to remove'
            });
        }
        const initialLength = user.likedPlans.length;
        user.likedPlans = user.likedPlans.filter((id) => id.toString() !== planId);
        if (user.likedPlans.length === initialLength) {
            return res.status(400).json({
                success: false,
                message: 'Plan was not in liked plans'
            });
        }
        yield user.save();
        logger_1.default.info(`User ${userId} unliked plan ${planId}`);
        return res.status(200).json({
            success: true,
            message: 'Plan unliked successfully',
            likedPlans: user.likedPlans
        });
    }
    catch (error) {
        logger_1.default.error(`Error unliking plan: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
exports.unlikePlan = unlikePlan;
const getLikedPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clerkUserId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const user = yield userModel_1.default.findOne({ clerkUserId: userId })
            .populate('likedPlans');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.status(200).json({
            success: true,
            likedPlans: user.likedPlans || []
        });
    }
    catch (error) {
        logger_1.default.error(`Error getting liked plans: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
exports.getLikedPlans = getLikedPlans;
