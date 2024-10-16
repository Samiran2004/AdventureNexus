"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel")); // Adjust the import path based on your project structure
const getUserHistory = async (req, res) => {
    try {
        // Fetch the user id from the token
        const userId = req.user._id; // Assuming req.user has _id property and is of type string
        // Check if the user exists in the database
        const user = await userModel_1.default.findById(userId).populate('recommendationhistory').lean();
        if (!user) {
            return res.status(404).send({
                status: 'Failed',
                message: 'User Not Found.',
            });
        }
        // Return user recommendation history
        return res.status(200).send({
            status: 'Success',
            data: user.recommendationhistory,
        });
    }
    catch (error) {
        console.error('Error fetching user history:', error); // Log the error
        return res.status(500).send({
            status: 'Failed',
            message: 'Internal Server Error',
        });
    }
};
exports.default = getUserHistory;
