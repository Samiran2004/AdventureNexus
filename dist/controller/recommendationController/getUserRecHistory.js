"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel"));
const http_errors_1 = __importDefault(require("http-errors"));
const getUserRecommendationHistory = async (req, res, next) => {
    try {
        // Fetch the user id from the token
        const userId = req.user._id;
        // Check if the user exists in the database
        const user = await userModel_1.default.findById(userId)
            .populate('recommendationhistory')
            .lean();
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User Not Found!'));
        }
        // Return user recommendation history
        return res.status(200).send({
            status: 'Success',
            data: user.recommendationhistory,
        });
    }
    catch (error) {
        // console.error('Error fetching user history:', error); // Log for Debugging
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.default = getUserRecommendationHistory;
