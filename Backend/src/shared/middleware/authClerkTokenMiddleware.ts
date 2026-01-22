import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import User, { IUser } from "../database/models/userModel";
import logger from "../utils/logger";

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
    logger.http("🔐 Auth Middleware: Request received");

    try {
        // 1. Check for Authorization Header
        if (!req.headers?.authorization) {
            logger.warn("❌ No authorization header");
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Authentication failed. No token provided.",
            });
        }

        const authHeader = req.headers.authorization;

        // 2. Validate Token Format (Bearer <token>)
        if (!authHeader.startsWith("Bearer ")) {
            logger.warn("❌ Invalid token format");
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format. Expected 'Bearer <token>'.",
            });
        }

        // 3. Extract Token
        const token = authHeader.split(" ")[1];
        // logger.debug("🎫 Token received: " + token.substring(0, 20) + "...");

        // 4. Decode Token (Verification handled by Clerk Middleware at app level, this manual decode extracts ID)
        let clerkUserId: string;
        try {
            const decoded = JWT.decode(token) as ClerkJWTPayload;
            // logger.debug({
            //     msg: "📋 Decoded token payload:",
            //     sub: decoded?.sub,
            //     iss: decoded?.iss,
            //     exp: decoded?.exp
            // });

            if (!decoded || !decoded.sub) {
                logger.warn("❌ Invalid token payload - no 'sub' field");
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: "Failed",
                    message: "Invalid token payload.",
                });
            }

            clerkUserId = decoded.sub;
            // logger.debug("🆔 Extracted Clerk User ID: " + clerkUserId);

        } catch (decodeError) {
            logger.error("❌ Token decode error:", decodeError);
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format.",
            });
        }

        // 5. Sync with Local Database
        // Find user by Clerk ID
        // logger.debug("🔍 Searching for user with clerkUserId: " + clerkUserId);
        const user: IUser | null = await User.findOne({ clerkUserId });

        if (!user) {
            logger.warn("❌ User not found in database with clerkUserId: " + clerkUserId);
            return res.status(StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found.",
            });
        }

        // logger.debug("✅ User found: " + (user.email || user.username));

        // 6. Attach User to Request Object for downstream use
        req.user = {
            _id: user._id.toString(),
            clerkUserId: user.clerkUserId,
            role: user.role || "user",
            email: user.email,
            username: user.username,
        };

        logger.info("✅ Auth Middleware: User authenticated successfully");
        next(); // Proceed to controller

    } catch (error) {
        logger.error("💥 Auth Middleware Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};

export default protect;
