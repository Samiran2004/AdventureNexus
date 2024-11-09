"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel"));
const cloudinaryService_1 = __importDefault(require("../../service/cloudinaryService"));
const fs_1 = __importDefault(require("fs"));
const http_errors_1 = __importDefault(require("http-errors"));
const updateProfilePicture = async (req, res, next) => {
    try {
        // Check if the user exists
        const checkUser = await userModel_1.default.findById(req.user._id);
        if (!checkUser) {
            return next((0, http_errors_1.default)(404, "User not found."));
        }
        // Upload new profile picture to Cloudinary
        let uploadImageUrl;
        try {
            uploadImageUrl = await cloudinaryService_1.default.uploader.upload(req.file.path);
            fs_1.default.unlinkSync(req.file.path); // Remove from local storage
        }
        catch (error) {
            return next((0, http_errors_1.default)(500, "Profile picture upload failed."));
        }
        // Save the new profile picture URL to the user document
        const previousProfilePictureUrl = checkUser.profilepicture;
        checkUser.profilepicture = uploadImageUrl.url;
        await checkUser.save();
        // Delete the previous profile picture from Cloudinary
        if (previousProfilePictureUrl) {
            try {
                // Safeguard by checking if previousProfilePictureUrl has both "/" and "." before proceeding
                const segments = previousProfilePictureUrl.split('/');
                const fileName = segments.pop(); // Get the last segment which should be the file name
                // Ensure fileName exists and contains a dot before trying to split it
                const publicId = fileName?.split('.')[0];
                // Proceed with deletion only if publicId is valid
                if (publicId) {
                    await cloudinaryService_1.default.uploader.destroy(publicId);
                }
                else {
                    return next((0, http_errors_1.default)(500, "Profile picture update failed."));
                }
            }
            catch (error) {
                return next((0, http_errors_1.default)(500, "Profile picture updated but previous image could not be deleted from Cloudinary."));
            }
        }
        // Success response
        return res.status(200).send({
            status: 'Success',
            message: 'Profile picture updated successfully.',
            profilepicture: uploadImageUrl.url
        });
    }
    catch (error) {
        // console.error("Error updating profile picture:", error); // Log error for debugging
        return next((0, http_errors_1.default)(500, "Internal Server Error!"));
    }
};
exports.default = updateProfilePicture;
