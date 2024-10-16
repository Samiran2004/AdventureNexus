"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel")); // Adjust the import according to your TypeScript setup
const cloudinaryService_1 = __importDefault(require("../../service/cloudinaryService"));
const fs_1 = __importDefault(require("fs"));
const updateProfilePicture = async (req, res) => {
    try {
        // Check if the user exists
        const checkUser = await userModel_1.default.findById(req.user._id);
        if (!checkUser) {
            return res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        }
        // Upload new profile picture to Cloudinary
        let uploadImageUrl;
        try {
            uploadImageUrl = await cloudinaryService_1.default.uploader.upload(req.file.path);
            fs_1.default.unlinkSync(req.file.path); // Remove from local storage
        }
        catch (error) {
            return res.status(500).send({
                status: 'Failed',
                message: "Profile picture upload failed."
            });
        }
        // Save the new profile picture URL to the user document
        const previousProfilePictureUrl = checkUser.profilepicture;
        checkUser.profilepicture = uploadImageUrl.url;
        await checkUser.save();
        // Delete the previous profile picture from Cloudinary
        if (previousProfilePictureUrl) {
            try {
                const publicId = previousProfilePictureUrl.split('/').pop().split('.')[0];
                await cloudinaryService_1.default.uploader.destroy(publicId);
            }
            catch (error) {
                return res.status(500).send({
                    status: 'Failed',
                    message: "Profile picture updated but previous image could not be deleted from Cloudinary."
                });
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
        console.error("Error updating profile picture:", error); // Log error for debugging
        return res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        });
    }
};
exports.default = updateProfilePicture;
