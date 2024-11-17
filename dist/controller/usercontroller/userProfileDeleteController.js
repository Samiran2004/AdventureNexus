"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinaryService_1 = __importDefault(require("../../service/cloudinaryService"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const mailService_1 = __importDefault(require("../../service/mailService"));
const http_errors_1 = __importDefault(require("http-errors"));
const emailTemplate_1 = __importDefault(require("../../utils/emailTemplate"));
const userDelete = async (req, res, next) => {
    try {
        // Check if the user exists
        const checkUser = await userModel_1.default.findById(req.user._id);
        if (!checkUser) {
            return next((0, http_errors_1.default)(404, 'Not a valid user.'));
        }
        else {
            // Delete profile picture from Cloudinary
            const profilePictureUrl = checkUser.profilepicture;
            const publicId = profilePictureUrl
                .split('/')
                .pop()
                ?.split('.')[0]; // Optional chaining
            if (publicId) {
                try {
                    await cloudinaryService_1.default.uploader.destroy(publicId);
                }
                catch (error) {
                    return next((0, http_errors_1.default)(500, 'Error deleting profile picture from Cloudinary'));
                }
            }
            // Delete user's plans
            // Delete user from the database
            await userModel_1.default.findByIdAndDelete(req.user._id);
            // Send a mail
            const emailData = emailTemplate_1.default.deleteUserEmailData(checkUser.fullname, checkUser.email);
            await (0, mailService_1.default)(emailData, (error) => {
                if (error) {
                    return next((0, http_errors_1.default)(500, 'User deleted, but email sending failed!'));
                }
                return res.status(200).send({
                    status: 'Success',
                    message: 'User deleted.',
                });
            });
        }
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.default = userDelete;
