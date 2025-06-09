"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../Database/models/userModel"));
const generateRandomUserName_1 = __importDefault(require("../../utils/generateRandomUserName"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const cloudinaryService_1 = __importDefault(require("../../service/cloudinaryService"));
const fs_1 = __importDefault(require("fs"));
const updateProfile = async (req, res, next) => {
    try {
        // Fetch the user by ID
        const checkUser = await userModel_1.default.findById(req.user._id);
        if (!checkUser)
            return next((0, http_errors_1.default)(404, 'User not found.'));
        const { fullname, gender, preference, country, password } = req.body;
        if (!fullname &&
            !gender &&
            !preference &&
            !country &&
            !password &&
            !req.file?.path) {
            return next((0, http_errors_1.default)(400, 'Please provide at least one field to update.'));
        }
        // Update each field if provided
        if (fullname && fullname != checkUser.fullname) {
            checkUser.fullname = fullname;
            try {
                checkUser.username = (await (0, generateRandomUserName_1.default)(fullname));
            }
            catch (error) {
                return next((0, http_errors_1.default)(500, 'Error generating username.'));
            }
        }
        if (gender)
            checkUser.gender = gender;
        if (preference)
            checkUser.preferences = preference;
        if (country)
            checkUser.country = country;
        // Update password if provided
        if (password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            checkUser.password = await bcryptjs_1.default.hash(password, salt);
        }
        // Update profile picture
        let uploadImageUrl;
        if (req.file?.path) {
            try {
                uploadImageUrl = await cloudinaryService_1.default.uploader.upload(req.file.path);
                fs_1.default.unlinkSync(req.file.path);
                const previousProfilePictureUrl = checkUser.profilepicture;
                checkUser.profilepicture = uploadImageUrl.url;
                // Delete the previous profile picture from Cloudinary if it exists
                if (previousProfilePictureUrl) {
                    const publicId = previousProfilePictureUrl
                        .split('/')
                        .pop()
                        ?.split('.')[0];
                    if (publicId) {
                        try {
                            await cloudinaryService_1.default.uploader.destroy(publicId);
                        }
                        catch (error) {
                            console.error('Error deleting previous profile picture:', error);
                            return next((0, http_errors_1.default)(500, 'Profile picture update failed.'));
                        }
                    }
                }
            }
            catch (error) {
                return next((0, http_errors_1.default)(500, 'Profile picture upload failed.'));
            }
        }
        // Save the updated user data
        await checkUser.save();
        return res.status(200).send({
            status: 'Success',
            message: 'User updated.',
            userData: {
                fullname: checkUser.fullname,
                username: checkUser.username,
                email: checkUser.email,
                phonenumber: checkUser.phonenumber,
                gender: checkUser.gender,
                preference: checkUser.preferences,
                country: checkUser.country,
                profilepicture: checkUser.profilepicture,
                _id: checkUser._id,
            },
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.default = updateProfile;
