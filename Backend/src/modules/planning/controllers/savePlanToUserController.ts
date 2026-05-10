import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Plan from '../../../shared/database/models/planModel';
import User from '../../../shared/database/models/userModel';
import logger from '../../../shared/utils/logger';
import mongoose from 'mongoose';

/**
 * Controller to save an AI-generated plan to a user's personal list.
 * POST /api/v1/plans/:planId/save
 */
export const savePlanToUser = async (req: Request, res: Response) => {
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

        // 1. Find the plan
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Plan not found'
            });
        }

        // 2. Find the user
        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found in database'
            });
        }

        // 3. Add plan to user's plans array if not already present
        // Note: user.plans is an array of ObjectIds
        const planObjectId = plan._id as mongoose.Types.ObjectId;

        if (user.plans?.some(id => id.toString() === planId)) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Plan is already saved',
                data: user.plans
            });
        }

        user.plans = user.plans || [];
        user.plans.push(planObjectId as any);
        await user.save();

        logger.info(`✅ Plan ${planId} saved to user ${clerkUserId}`);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Plan saved successfully',
            data: user.plans
        });

    } catch (error: any) {
        logger.error(`Error saving plan: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to save plan',
            error: error.message
        });
    }
};
