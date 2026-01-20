import { Request, Response } from 'express';
import User from '../database/models/userModel';
import Plan from '../database/models/planModel';
import mongoose from 'mongoose';
import logger from '../utils/logger';

/**
 * Like a plan
 * POST /api/liked-plans/:planId
 */
export const likePlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const userId = req.user?.clerkUserId; // From Clerk auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Validate planId
        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan ID'
            });
        }

        // Check if plan exists
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        // Find user by Clerk ID
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if plan is already liked
        const planObjectId = new mongoose.Types.ObjectId(planId);
        if (user.likedPlans?.some(id => id.toString() === planId)) {
            return res.status(400).json({
                success: false,
                message: 'Plan already liked'
            });
        }

        // Add plan to liked plans
        user.likedPlans = user.likedPlans || [];
        user.likedPlans.push(planObjectId as any);
        await user.save();

        logger.info(`User ${userId} liked plan ${planId}`);

        return res.status(200).json({
            success: true,
            message: 'Plan liked successfully',
            likedPlans: user.likedPlans
        });
    } catch (error: any) {
        logger.error(`Error liking plan: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Unlike a plan
 * DELETE /api/liked-plans/:planId
 */
export const unlikePlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const userId = req.user?.clerkUserId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Validate planId
        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan ID'
            });
        }

        // Find user by Clerk ID
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove plan from liked plans
        if (!user.likedPlans || user.likedPlans.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No liked plans to remove'
            });
        }

        const initialLength = user.likedPlans.length;
        user.likedPlans = user.likedPlans.filter(
            (id: any) => id.toString() !== planId
        ) as any;

        if (user.likedPlans.length === initialLength) {
            return res.status(400).json({
                success: false,
                message: 'Plan was not in liked plans'
            });
        }

        await user.save();

        logger.info(`User ${userId} unliked plan ${planId}`);

        return res.status(200).json({
            success: true,
            message: 'Plan unliked successfully',
            likedPlans: user.likedPlans
        });
    } catch (error: any) {
        logger.error(`Error unliking plan: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Get all liked plans for the current user
 * GET /api/liked-plans
 */
export const getLikedPlans = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.clerkUserId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Find user and populate liked plans
        const user = await User.findOne({ clerkUserId: userId })
            .populate('likedPlans');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            likedPlans: user.likedPlans || []
        });
    } catch (error: any) {
        logger.error(`Error getting liked plans: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
