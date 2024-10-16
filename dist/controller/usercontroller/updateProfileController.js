"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel")); // Adjust the import according to your TypeScript setup
const generateRandomUserName_1 = __importDefault(require("../../utils/generateRandomUserName"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updateProfile = async (req, res) => {
    try {
        // Fetch the user using id
        const checkUser = await userModel_1.default.findById(req.user._id);
        if (!checkUser) {
            return res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        }
        const { fullname, gender, preference, country, password } = req.body;
        if (!fullname && !gender && !preference && !country && !password) {
            return res.status(400).send({
                status: 'Failed',
                message: "Please provide at least one field to update."
            });
        }
        if (fullname) {
            checkUser.fullname = fullname;
            try {
                const username = await (0, generateRandomUserName_1.default)(fullname);
                checkUser.username = username;
            }
            catch (error) {
                return res.status(500).send({
                    status: 'Failed',
                    message: "Error generating username."
                });
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
            const newHashedPassword = await bcryptjs_1.default.hash(password, salt);
            checkUser.password = newHashedPassword;
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
        console.error("Error updating profile:", error); // Log error for debugging
        return res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        });
    }
};
exports.default = updateProfile;
