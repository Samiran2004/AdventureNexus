import { Request, Response } from 'express';
import User from '../../../shared/database/models/userModel';
import Plan from '../../../shared/database/models/planModel';
import Review from '../../../shared/database/models/reviewModel';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../shared/utils/logger';
import os from 'os';
import AuditLog from '../../../shared/database/models/auditLogModel';

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

// --- System Intelligence (Phase 4) ---
export const getSystemHealth = async (req: Request, res: Response) => {
    try {
        const cpuUsage = os.loadavg(); // Returns 1, 5, 15 min load averages
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const uptime = os.uptime();

        res.status(StatusCodes.OK).json({
            status: 'Success',
            data: {
                cpuLoad: cpuUsage[0], // 1 min load average
                memory: {
                    total: totalMem, free: freeMem, used: totalMem - freeMem,
                    percentage: (((totalMem - freeMem) / totalMem) * 100).toFixed(2)
                },
                uptime,
                platform: os.platform(),
                arch: os.arch()
            }
        });
    } catch (error) {
        logger.error('Error fetching system health:', error);
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
        if (user) {
            getIO().emit('user:deleted', user.clerkUserId);

            // Log the action (Phase 4)
            await AuditLog.log({
                action: 'DELETE_USER',
                module: 'COMMUNITY',
                adminId: 'admin',
                targetId: req.params.id,
                details: { username: user.username, email: user.email },
                severity: 'warning'
            });
        }

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
        const plan = await Plan.findByIdAndDelete(req.params.id);
        const { getIO } = await import('../../../shared/socket/socket');
        getIO().emit('plan:deleted', req.params.id);

        // Log the action (Phase 4)
        if (plan) {
            await AuditLog.log({
                action: 'DELETE_PLAN',
                module: 'EXPEDITIONS',
                adminId: 'admin',
                targetId: req.params.id,
                details: { destination: (plan as any).to },
                severity: 'info'
            });
        }

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
        const review = await Review.findByIdAndDelete(req.params.id);
        const { getIO } = await import('../../../shared/socket/socket');
        getIO().emit('review:deleted', req.params.id);

        // Log the action (Phase 4)
        if (review) {
            await AuditLog.log({
                action: 'DELETE_REVIEW',
                module: 'TESTIMONIALS',
                adminId: 'admin',
                targetId: req.params.id,
                details: { reviewer: (review as any).userName },
                severity: 'info'
            });
        }

        res.status(StatusCodes.OK).json({ status: 'Success', message: 'Review deleted' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- Governance (Audit Logs) ---
export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
        res.status(StatusCodes.OK).json({ status: 'Success', data: logs });
    } catch (error) {
        logger.error('Error fetching audit logs:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};
