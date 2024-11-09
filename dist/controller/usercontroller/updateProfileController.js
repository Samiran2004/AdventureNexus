"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel"));
const generateRandomUserName_1 = __importDefault(require("../../utils/generateRandomUserName"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const updateProfile = async (req, res, next) => {
    try {
        // Fetch the user using id
        const checkUser = await userModel_1.default.findById(req.user._id);
        if (!checkUser) {
            return next((0, http_errors_1.default)(404, "User not found."));
        }
        const { fullname, gender, preference, country, password } = req.body;
        if (!fullname && !gender && !preference && !country && !password) {
            return next((0, http_errors_1.default)(400, "Please provide at least one field to update."));
        }
        if (fullname) {
            checkUser.fullname = fullname;
            try {
                const username = await (0, generateRandomUserName_1.default)(fullname);
                checkUser.username = username;
            }
            catch (error) {
                return next((0, http_errors_1.default)(500, "Error generating username."));
            }
        }
        if (gender) {
            checkUser.gender = gender;
        }
        if (preference) {
            checkUser.preferences = preference;
        }
        if (country) {
            checkUser.country = country;
        }
        if (password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            checkUser.password = await bcryptjs_1.default.hash(password, salt);
        }
        // Save the updated data
        await checkUser.save();
        return res.status(200).send({
            status: 'Success',
            message: "User updated.",
            userData: {
                fullname: checkUser.fullname,
                username: checkUser.username,
                email: checkUser.email,
                phonenumber: checkUser.phonenumber,
                gender: checkUser.gender,
                preference: checkUser.preferences,
                country: checkUser.country,
                _id: checkUser._id
            }
        });
    }
    catch (error) {
        // console.error("Error updating profile:", error); // Log error for debugging
        return next((0, http_errors_1.default)(500, "Internal Server Error!"));
    }
};
exports.default = updateProfile;
