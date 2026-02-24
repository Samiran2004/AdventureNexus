import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../../../shared/database/models/userModel';
import logger from '../../../shared/utils/logger';
import mongoose from 'mongoose';

/**
 * Controller to remove a saved plan from a user's personal list.
 * DELETE /api/v1/plans/:planId/save
 */
export const unsavePlanFromUser = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const clerkUserId = req.auth()?.userId;

        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized: No user found'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid plan ID'
            });
        }

        // Find the user
        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found in database'
            });
        }

        // Remove plan from user's plans array
        const initialCount = user.plans?.length || 0;
        user.plans = user.plans?.filter(id => id.toString() !== planId) || [];

        if (user.plans.length === initialCount) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Plan was not in saved list',
                data: user.plans
            });
        }

        await user.save();

        logger.info(`❌ Plan ${planId} unsaved from user ${clerkUserId}`);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Plan removed from saved list',
            data: user.plans
        });

    } catch (error: any) {
        logger.error(`Error unsaving plan: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to unsave plan',
            error: error.message
        });
    }
};
