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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const userModel_1 = __importDefault(require("../database/models/userModel"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("🔐 Auth Middleware: Request received");
    try {
        if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization)) {
            console.log("❌ No authorization header");
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Authentication failed. No token provided.",
            });
        }
        const authHeader = req.headers.authorization;
        if (!authHeader.startsWith("Bearer ")) {
            console.log("❌ Invalid token format");
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format. Expected 'Bearer <token>'.",
            });
        }
        const token = authHeader.split(" ")[1];
        console.log("🎫 Token received:", token.substring(0, 20) + "...");
        let clerkUserId;
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            console.log("📋 Decoded token payload:", {
                sub: decoded === null || decoded === void 0 ? void 0 : decoded.sub,
                iss: decoded === null || decoded === void 0 ? void 0 : decoded.iss,
                exp: decoded === null || decoded === void 0 ? void 0 : decoded.exp
            });
            if (!decoded || !decoded.sub) {
                console.log("❌ Invalid token payload - no 'sub' field");
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    status: "Failed",
                    message: "Invalid token payload.",
                });
            }
            clerkUserId = decoded.sub;
            console.log("🆔 Extracted Clerk User ID:", clerkUserId);
        }
        catch (decodeError) {
            console.error("❌ Token decode error:", decodeError);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format.",
            });
        }
        console.log("🔍 Searching for user with clerkUserId:", clerkUserId);
        const user = yield userModel_1.default.findOne({ clerkUserId });
        if (!user) {
            console.log("❌ User not found in database with clerkUserId:", clerkUserId);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found.",
            });
        }
        console.log("✅ User found:", user.email || user.username);
        req.user = {
            _id: user._id.toString(),
            clerkUserId: user.clerkUserId,
            role: user.role || "user",
            email: user.email,
            username: user.username,
        };
        console.log("✅ Auth Middleware: User authenticated successfully");
        next();
    }
    catch (error) {
        console.error("💥 Auth Middleware Error:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
});
exports.protect = protect;
exports.default = exports.protect;
