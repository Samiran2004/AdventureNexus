import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import User, { IUser } from "../database/models/userModel";

// Interface for Clerk JWT Payload
interface ClerkJWTPayload {
    sub: string; // Subject (Clerk User ID)
    exp: number; // Expiration time
    iat: number; // Issued at time
    iss: string; // Issuer
    azp: string; // Authorized party
    sid: string; // Session ID
    [key: string]: any;
}

/**
 * Middleware to protect routes using Clerk Authentication.
 * Verifies the Bearer token and attaches the user object to the request.
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    console.log("🔐 Auth Middleware: Request received");

    try {
        // 1. Check for Authorization Header
        if (!req.headers?.authorization) {
            console.log("❌ No authorization header");
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Authentication failed. No token provided.",
            });
        }

        const authHeader = req.headers.authorization;

        // 2. Validate Token Format (Bearer <token>)
        if (!authHeader.startsWith("Bearer ")) {
            console.log("❌ Invalid token format");
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format. Expected 'Bearer <token>'.",
            });
        }

        // 3. Extract Token
        const token = authHeader.split(" ")[1];
        console.log("🎫 Token received:", token.substring(0, 20) + "...");

        // 4. Decode Token (Verification handled by Clerk Middleware at app level, this manual decode extracts ID)
        let clerkUserId: string;
        try {
            const decoded = JWT.decode(token) as ClerkJWTPayload;
            console.log("📋 Decoded token payload:", {
                sub: decoded?.sub,
                iss: decoded?.iss,
                exp: decoded?.exp
            });

            if (!decoded || !decoded.sub) {
                console.log("❌ Invalid token payload - no 'sub' field");
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: "Failed",
                    message: "Invalid token payload.",
                });
            }

            clerkUserId = decoded.sub;
            console.log("🆔 Extracted Clerk User ID:", clerkUserId);

        } catch (decodeError) {
            console.error("❌ Token decode error:", decodeError);
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format.",
            });
        }

        // 5. Sync with Local Database
        // Find user by Clerk ID
        console.log("🔍 Searching for user with clerkUserId:", clerkUserId);
        const user: IUser | null = await User.findOne({ clerkUserId });

        if (!user) {
            console.log("❌ User not found in database with clerkUserId:", clerkUserId);
            return res.status(StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found.",
            });
        }

        console.log("✅ User found:", user.email || user.username);

        // 6. Attach User to Request Object for downstream use
        req.user = {
            _id: user._id.toString(),
            clerkUserId: user.clerkUserId,
            role: user.role || "user",
            email: user.email,
            username: user.username,
        };

        console.log("✅ Auth Middleware: User authenticated successfully");
        next(); // Proceed to controller

    } catch (error) {
        console.error("💥 Auth Middleware Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};

export default protect;
