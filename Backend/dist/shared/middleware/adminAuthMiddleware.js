"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../config/config");
const protectAdmin = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_ACCESS_SECRET || 'fallback_secret_key_change_me');
            if (decoded.role === 'admin') {
                next();
            }
            else {
                res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ message: 'Not authorized as admin' });
            }
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized, token failed' });
        }
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized, no token' });
    }
};
exports.protectAdmin = protectAdmin;
