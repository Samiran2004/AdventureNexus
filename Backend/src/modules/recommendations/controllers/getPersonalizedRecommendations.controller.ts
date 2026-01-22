import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../../shared/utils/logger";
import User from "../../../shared/database/models/userModel";
import { getRecommendationsForUser } from "../services/recommendation.service";
import Plan from "../../../shared/database/models/planModel";

const getPersonalizedRecommendations = async (req: Request, res: Response) => {
    try {
        const clerkUserId = req.auth()?.userId;

        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Unauthorized",
            });
        }

        // Get local User ID
        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found",
            });
        }

        // Get ML Recommendations
        let recommendations = await getRecommendationsForUser(user._id as string);

        // Fallback: If ML returns nothing (e.g. no other plans in DB), fetch some latest plans
        // This ensures the UI is never empty
        if (recommendations.length === 0) {
            recommendations = await Plan.find({ userId: { $ne: user._id } })
                .sort({ createdAt: -1 })
                .limit(3);
        }

        return res.status(StatusCodes.OK).json({
            status: "Ok",
            data: recommendations,
        });

    } catch (error: any) {
        logger.error(`Error fetching recommendations: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Internal Server Error",
        });
    }
};

export default getPersonalizedRecommendations;
