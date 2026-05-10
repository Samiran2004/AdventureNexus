import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Notification from '../../../shared/database/models/notificationModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to fetch all notifications for the current user.
 */
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const clerkUserId = req.user?.clerkUserId;

        const notifications = await Notification.find({ recipientClerkUserId: clerkUserId })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(StatusCodes.OK).json({
            success: true,
            data: notifications
        });
    } catch (error: any) {
        logger.error(`Error fetching notifications: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch notifications'
        });
    }
};

/**
 * Controller to mark a notification as read.
 */
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { notificationId } = req.params;
        const clerkUserId = req.user?.clerkUserId;

        await Notification.findOneAndUpdate(
            { _id: notificationId, recipientClerkUserId: clerkUserId },
            { isRead: true }
        );

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error: any) {
        logger.error(`Error marking notification as read: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update notification'
        });
    }
};
