import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Plan from "../../../shared/database/models/planModel";

/**
 * Controller to fetch all plans associated with the authenticated user.
 */
export const getMyPlans = async (req: Request, res: Response) => {
    try {
        const clerkUserId = req.user?.clerkUserId;

        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'Failed',
                message: 'User not authenticated'
            });
        }

        const plans = await Plan.find({ clerkUserId }).sort({ createdAt: -1 });

        return res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Plans retrieved successfully',
            data: plans
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            error
        });
    }
}
