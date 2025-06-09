"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../Database/models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const joiLoginValidation_1 = require("../../utils/JoiUtils/joiLoginValidation");
const http_errors_1 = __importDefault(require("http-errors"));
const loginuser = async (req, res, next) => {
    try {
        // Fetch all user data from req.body
        const { username, email, password } = req.body;
        // Check if all required fields are provided in the request body
        if (!username || !email || !password) {
            return next((0, http_errors_1.default)(400, 'All fields are required'));
        }
        // Validate user data using JOI
        const { error } = joiLoginValidation_1.userSchemaValidationLogin.validate(req.body);
        if (error) {
            return next((0, http_errors_1.default)(400, error.details[0].message));
        }
        // Find the user in the database
        const checkUser = await userModel_1.default.findOne({
            username,
            email,
        });
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
                return next((0, http_errors_1.default)(401, 'Incorrect Password'));
            }
        }
        else {
            return next((0, http_errors_1.default)(404, 'User not found!'));
        }
    }
    catch (error) {
        // console.error('Error during login:', error); // Log for debugging
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
};
exports.default = loginuser;
