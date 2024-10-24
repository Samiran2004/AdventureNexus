"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../models/userModel")); // Adjust the import path based on your project structure
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const joiLoginValidation_1 = require("../../utils/JoiUtils/joiLoginValidation");
const loginuser = async (req, res) => {
    try {
        // Fetch all user data from req.body
        const { username, email, password } = req.body;
        // Check if all required fields are provided in the request body
        if (!username || !email || !password) {
            return res.status(400).send({
                status: 'Failed',
                message: 'All fields are required.',
            });
        }
        // Validate user data using JOI
        const { error } = joiLoginValidation_1.userSchemaValidation.validate(req.body);
        if (error) {
            return res.status(400).send({
                status: 'Failed',
                message: error.details[0].message,
            });
        }
        // Find the user in the database
        const checkUser = await userModel_1.default.findOne({ username, email });
        if (checkUser) {
            // Match password
            const matchPassword = await bcryptjs_1.default.compare(password, checkUser.password);
            if (matchPassword) {
                // Create JWT Token
                const userPayload = {
                    fullname: checkUser.fullname,
                    email: checkUser.email,
                    username: checkUser.username,
                    gender: checkUser.gender,
                    country: checkUser.country,
                    currency_code: checkUser.currency_code,
                    _id: checkUser._id,
                };
                // Access token
                const accessToken = jsonwebtoken_1.default.sign(userPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
                // Refresh token
                const refreshToken = jsonwebtoken_1.default.sign(userPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
                // Save the refresh token into the database for future use
                checkUser.refreshtoken = refreshToken;
                await checkUser.save();
                // Set cookies
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });
                return res.status(200).send({
                    status: 'Success',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            }
            else {
                return res.status(401).send({
                    status: 'Failed',
                    message: 'Incorrect Password.',
                });
            }
        }
        else {
            return res.status(404).send({
                status: 'Failed',
                message: 'User not found.',
            });
        }
    }
    catch (error) {
        console.error('Error during login:', error); // Log the error
        return res.status(500).send({
            status: 'Failed',
            message: 'Internal Server Error...',
            error,
        });
    }
};
exports.default = loginuser;
