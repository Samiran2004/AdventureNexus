"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel"));
async function userProfile(req, res) {
    try {
        const userData = await userModel_1.default.findById(req.user._id);
        if (!userData) {
            return res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        }
        else {
            return res.status(200).send({
                status: 'Success',
                userData: {
                    fullname: userData.fullname,
                    email: userData.email,
                    phonenumber: userData.phonenumber,
                    username: userData.username,
                    gender: userData.gender,
                    profilepicture: userData.profilepicture,
                    preference: userData.preferences,
                    country: userData.country
                }
            });
        }
    }
    catch (error) {
        console.error("Error fetching user profile:", error); // Log error for debugging
        return res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        });
    }
}
exports.default = userProfile;
