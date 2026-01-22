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
exports.adminLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const config_1 = require("../../../shared/config/config");
const ADMIN_CREDENTIALS = {
    username: 'admin123',
    password: 'admin123'
};
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            const token = jsonwebtoken_1.default.sign({ role: 'admin', username: 'admin' }, config_1.config.JWT_ACCESS_SECRET || 'fallback_secret_key_change_me', { expiresIn: '24h' });
            logger_1.default.info('Admin logged in successfully');
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'Success',
                token,
                message: 'Admin authenticated'
            });
        }
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: 'Failed',
            message: 'Invalid credentials'
        });
    }
    catch (error) {
        logger_1.default.error('Admin login error:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Internal Server Error'
        });
    }
});
exports.adminLogin = adminLogin;
