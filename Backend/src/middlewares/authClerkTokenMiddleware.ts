import { NextFunction, Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import User, { IUser } from "../Database/models/userModel";


export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    console.log("Request come...");
    try {
        // Check if authorization header exists
        if (!req.headers || !req.headers.authorization) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Authentication failed. No token provided.",
            });
        }

        const authHeader = req.headers.authorization;

        // Check if token format is correct
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Invalid token format. Expected 'Bearer <token>'.",
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Optional: Verify user exists in database
        const user: IUser | null = await User.findOne({ clerkUserId: token });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found.",
            });
        }

        // Set user in request object
        req.user = {
            _id: user._id,
            clerkUserId: token,
            role: user.role,
            email: user.email,
            username: user.username,
        };
        console.log("Auth Middleware: User authenticated");

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};

export default protect;
