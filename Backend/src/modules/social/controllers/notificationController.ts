import { Request, Response } from 'express';
import Notification from '../../../shared/database/models/notificationModel';

/**
 * Get all notifications for current user
 * GET /api/v1/notifications
 */
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userClerkUserId = (req as any).user?.clerkUserId;

        const notifications = await Notification.find({ recipientClerkUserId: userClerkUserId })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error: any) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Mark notification as read
 * POST /api/v1/notifications/:id/read
 */
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userClerkUserId = (req as any).user?.clerkUserId;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipientClerkUserId: userClerkUserId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        return res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error: any) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
