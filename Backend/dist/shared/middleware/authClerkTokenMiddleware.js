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
exports.optionalProtect = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const userModel_1 = __importDefault(require("../database/models/userModel"));
const logger_1 = __importDefault(require("../utils/logger"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    logger_1.default.http("🔐 Auth Middleware: Request received");
    try {
        if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization)) {
            logger_1.default.warn("❌ No authorization header");
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Authentication failed. No token provided.",
            });
        }
        const authHeader = req.headers.authorization;
        if (!authHeader.startsWith("Bearer ")) {
            logger_1.default.warn("❌ Invalid token format");
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format. Expected 'Bearer <token>'.",
            });
        }
        const token = authHeader.split(" ")[1];
        let clerkUserId;
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            if (!decoded || !decoded.sub) {
                logger_1.default.warn("❌ Invalid token payload - no 'sub' field");
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    status: "Failed",
                    message: "Invalid token payload.",
                });
            }
            clerkUserId = decoded.sub;
        }
        catch (decodeError) {
            logger_1.default.error("❌ Token decode error:", decodeError);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format.",
            });
        }
        const user = yield userModel_1.default.findOne({ clerkUserId });
        if (!user) {
            logger_1.default.warn("❌ User not found in database with clerkUserId: " + clerkUserId);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found.",
            });
        }
        req.user = {
            _id: user._id.toString(),
            clerkUserId: user.clerkUserId,
            role: user.role || "user",
            email: user.email,
            username: user.username,
        };
        logger_1.default.info("✅ Auth Middleware: User authenticated successfully");
        next();
    }
    catch (error) {
        logger_1.default.error("💥 Auth Middleware Error:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
});
exports.protect = protect;
const optionalProtect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || !req.headers.authorization.startsWith("Bearer ")) {
            return next();
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jsonwebtoken_1.default.decode(token);
        if (decoded && decoded.sub) {
            const user = yield userModel_1.default.findOne({ clerkUserId: decoded.sub });
            if (user) {
                req.user = {
                    _id: user._id.toString(),
                    clerkUserId: user.clerkUserId,
                    role: user.role || "user",
                    email: user.email,
                    username: user.username,
                };
            }
        }
    }
    catch (error) {
        logger_1.default.warn("⚠️ Optional Auth failed, continuing as guest");
    }
    next();
});
exports.optionalProtect = optionalProtect;
exports.default = exports.protect;
