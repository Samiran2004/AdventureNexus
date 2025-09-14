import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import User, { IUser } from "../Database/models/userModel";


interface ClerkJWTPayload {
  sub: string; // This is the actual Clerk user ID
  exp: number;
  iat: number;
  iss: string;
  azp: string;
  sid: string;
  [key: string]: any;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    console.log("🔐 Auth Middleware: Request received");

    try {
        // Check authorization header
        if (!req.headers?.authorization) {
            console.log("❌ No authorization header");
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Authentication failed. No token provided.",
            });
        }

        const authHeader = req.headers.authorization;

        if (!authHeader.startsWith("Bearer ")) {
            console.log("❌ Invalid token format");
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format. Expected 'Bearer <token>'.",
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];
        console.log("🎫 Token received:", token.substring(0, 20) + "...");

        // Decode JWT token WITHOUT verification (Clerk handles verification)
        let clerkUserId: string;
        try {
            // Decode the JWT token to get the payload
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

        // Find user in database using the actual Clerk user ID
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

        // Set user in request object
        req.user = {
            _id: user._id.toString(),
            clerkUserId: user.clerkUserId, // Use the stored clerkUserId
            role: user.role || "user",
            email: user.email,
            username: user.username,
        };

        console.log("✅ Auth Middleware: User authenticated successfully");
        next();

    } catch (error) {
        console.error("💥 Auth Middleware Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};

export default protect;
