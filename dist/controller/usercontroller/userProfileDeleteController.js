"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinaryService_1 = __importDefault(require("../../service/cloudinaryService"));
const userModel_1 = __importDefault(require("../../models/userModel")); // Adjust the import according to your TypeScript setup
const mailService_1 = __importDefault(require("../../service/mailService"));
const emailTemplate_1 = require("../../utils/emailTemplate");
const userDelete = async (req, res) => {
    try {
        // Check if the user exists
        const checkUser = await userModel_1.default.findById(req.user._id);
        if (!checkUser) {
            return res.status(404).send({
                status: 'Failed',
                message: "Not a valid user."
            });
        }
        else {
            // Delete profile picture from Cloudinary
            const profilePictureUrl = checkUser.profilepicture;
            const publicId = profilePictureUrl.split('/').pop()?.split('.')[0]; // Optional chaining
            if (publicId) {
                try {
                    await cloudinaryService_1.default.uploader.destroy(publicId);
                }
                catch (error) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: "Error deleting profile picture from Cloudinary",
                        error: error.message
                    });
                }
            }
            // Delete user from the database
            await userModel_1.default.findByIdAndDelete(req.user._id);
            // Send a mail
            const emailData = (0, emailTemplate_1.deleteUserEmailData)(checkUser.fullname, checkUser.email);
            await (0, mailService_1.default)(emailData, (error) => {
                if (error) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: "User deleted, but email sending failed"
                    });
                }
                return res.status(200).send({
                    status: 'Success',
                    message: "User deleted."
                });
            });
        }
    }
    catch (error) {
        return res.status(500).send({
            status: 'Failed',
            message: "Internal server error.",
            error: error.message // Include error message for debugging
        });
    }
};
exports.default = userDelete;
