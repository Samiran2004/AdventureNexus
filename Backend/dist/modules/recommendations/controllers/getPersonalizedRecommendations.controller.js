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
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const userModel_1 = __importDefault(require("../../../shared/database/models/userModel"));
const recommendation_service_1 = require("../services/recommendation.service");
const planModel_1 = __importDefault(require("../../../shared/database/models/planModel"));
const getPersonalizedRecommendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const clerkUserId = (_a = req.auth()) === null || _a === void 0 ? void 0 : _a.userId;
        if (!clerkUserId) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Unauthorized",
            });
        }
        const user = yield userModel_1.default.findOne({ clerkUserId });
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found",
            });
        }
        let recommendations = yield (0, recommendation_service_1.getRecommendationsForUser)(user._id);
        if (recommendations.length === 0) {
            recommendations = yield planModel_1.default.find({ userId: { $ne: user._id } })
                .populate({
                path: 'hotels',
                populate: { path: 'rooms' }
            })
                .populate('flights')
                .sort({ createdAt: -1 })
                .limit(3);
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "Ok",
            data: recommendations,
        });
    }
    catch (error) {
        logger_1.default.error(`Error fetching recommendations: ${error.message}`);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Internal Server Error",
        });
    }
});
exports.default = getPersonalizedRecommendations;
