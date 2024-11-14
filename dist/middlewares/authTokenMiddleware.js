"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authTokenMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const config_1 = require("../config/config");
async function authTokenMiddleware(req, res, next) {
    try {
        const accessToken = req.cookies['accessToken'];
        if (!accessToken) {
            res.status(401).send({
                status: 'Unauthorized',
                message: 'Access token not found.',
            });
            return;
        }
        jsonwebtoken_1.default.verify(accessToken, config_1.config.JWT_ACCESS_SECRET, async (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    try {
                        const userData = await userModel_1.default.findById(user?._id);
                        if (!userData || !userData.refreshtoken) {
                            res.status(403).send({
                                status: 'Forbidden',
                                message: 'Refresh token not found, please login again.',
                            });
                            return;
                        }
                        jsonwebtoken_1.default.verify(userData.refreshtoken, config_1.config.JWT_REFRESH_SECRET, (err, decodedRefreshToken) => {
                            if (err) {
                                res.status(403).send({
                                    status: 'Forbidden',
                                    message: 'Invalid refresh token, please login again.',
                                });
                                return;
                            }
                            const newUserPayload = {
                                fullname: userData.fullname,
                                email: userData.email,
                                username: userData.username,
                                gender: userData.gender,
                                _id: userData._id,
                                profilepicture: userData.profilepicture,
                                country: userData.country,
                                currency: userData.currency_code,
                            };
                            const newAccessToken = jsonwebtoken_1.default.sign(newUserPayload, config_1.config.JWT_ACCESS_SECRET, {
                                expiresIn: '1h',
                            });
                            res.cookie('accessToken', newAccessToken, {
                                httpOnly: true,
                                // secure: process.env.NODE_ENV === 'production',
                                // sameSite: 'Strict'
                            });
                            req.user = newUserPayload;
                            next();
                        });
                    }
                    catch (error) {
                        res.status(500).send({
                            status: 'Error',
                            message: 'Error while fetching refresh token.',
                        });
                    }
                }
                else {
                    res.status(403).send({
                        status: 'Forbidden',
                        message: 'Invalid or expired access token.',
                    });
                }
            }
            else {
                req.user = user;
                next();
            }
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'Error',
            message: 'Internal Server Error.',
        });
    }
}
