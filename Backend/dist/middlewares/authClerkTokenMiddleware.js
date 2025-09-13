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
const http_status_codes_1 = require("http-status-codes");
const userModel_1 = __importDefault(require("../Database/models/userModel"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request come...");
    try {
        if (!req.headers || !req.headers.authorization) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Authentication failed. No token provided.",
            });
        }
        const authHeader = req.headers.authorization;
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format. Expected 'Bearer <token>'.",
            });
        }
        const token = authHeader.split(" ")[1];
        const user = yield userModel_1.default.findOne({ clerkUserId: token });
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found.",
            });
        }
        req.user = {
            _id: user._id,
            clerkUserId: token,
            role: user.role,
            email: user.email,
            username: user.username,
        };
        console.log("Auth Middleware: User authenticated");
        next();
    }
    catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
});
exports.protect = protect;
exports.default = exports.protect;
