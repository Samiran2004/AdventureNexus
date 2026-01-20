"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../database/models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const joiLoginValidation_1 = require("../../utils/validators/joiLoginValidation");
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../../config/config");
const logger_1 = __importDefault(require("../../utils/logger"));
const loginuser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return next((0, http_errors_1.default)(400, 'All fields are required'));
        }
        const { error } = joiLoginValidation_1.userSchemaValidationLogin.validate(req.body);
        if (error) {
            return next((0, http_errors_1.default)(400, error.details[0].message));
        }
        const checkUser = yield userModel_1.default.findOne({
            username,
            email,
        });
        if (checkUser) {
            const matchPassword = yield bcryptjs_1.default.compare(password, checkUser.password);
            if (matchPassword) {
                const userPayload = {
                    fullname: checkUser.fullname,
                    email: checkUser.email,
                    username: checkUser.username,
                    gender: checkUser.gender,
                    country: checkUser.country,
                    currency_code: checkUser.currency_code,
                    _id: checkUser._id,
                };
                const accessToken = jsonwebtoken_1.default.sign(userPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
                const refreshToken = jsonwebtoken_1.default.sign(userPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
                checkUser.refreshtoken = refreshToken;
                yield checkUser.save();
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
        if (config_1.config.env === 'development') {
            logger_1.default.error('Error during login:', error);
        }
        return next((0, http_errors_1.default)(500, 'Internal Server Error!'));
    }
});
exports.default = loginuser;
