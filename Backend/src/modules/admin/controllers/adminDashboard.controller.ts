import { Request, Response } from 'express';
import User from '../../../shared/database/models/userModel';
import Plan from '../../../shared/database/models/planModel';
import Review from '../../../shared/database/models/reviewModel';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../shared/utils/logger';

// --- Stats ---
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPlans = await Plan.countDocuments();
        const totalReviews = await Review.countDocuments();

        // Example: Get recent plans for a "Recent Activity" widget
        const recentPlans = await Plan.find().sort({ createdAt: -1 }).limit(5).select('name to date');

        res.status(StatusCodes.OK).json({
            status: 'Success',
            data: {
                totalUsers,
                totalPlans,
                totalReviews,
                recentPlans
            }
        });
    } catch (error) {
        logger.error('Error fetching admin stats:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- User Management ---
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }); // Simple fetch all for now
        res.status(StatusCodes.OK).json({ status: 'Success', data: users });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        const { getIO } = await import('../../../shared/socket/socket'); // Dynamic import
        if (user) getIO().emit('user:deleted', user.clerkUserId);

        res.status(StatusCodes.OK).json({ status: 'Success', message: 'User deleted' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- Plan Management ---
export const getAllPlans = async (req: Request, res: Response) => {
    try {
        const plans = await Plan.find().populate('userId', 'email username').sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({ status: 'Success', data: plans });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

export const deletePlan = async (req: Request, res: Response) => {
    try {
        await Plan.findByIdAndDelete(req.params.id);
        const { getIO } = await import('../../../shared/socket/socket');
        getIO().emit('plan:deleted', req.params.id);

        res.status(StatusCodes.OK).json({ status: 'Success', message: 'Plan deleted' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- Review Management ---
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({ status: 'Success', data: reviews });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        const { getIO } = await import('../../../shared/socket/socket');
        getIO().emit('review:deleted', req.params.id);

        res.status(StatusCodes.OK).json({ status: 'Success', message: 'Review deleted' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};
