import { Request, Response } from 'express';
import Notification from '../../../shared/database/models/notificationModel';
import User from '../../../shared/database/models/userModel';

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

        // Fetch sender user profiles in batch
        const senderClerkUserIds = Array.from(new Set(notifications.map(n => n.senderClerkUserId)));
        const senders = await User.find({ clerkUserId: { $in: senderClerkUserIds } })
            .select('username profilepicture fullname clerkUserId');

        const senderMap = new Map(senders.map(s => [s.clerkUserId, s]));

        const enrichedNotifications = notifications.map(n => {
            const sender = senderMap.get(n.senderClerkUserId);
            return {
                ...n.toObject(),
                sender: sender ? {
                    username: sender.username,
                    profilepicture: sender.profilepicture,
                    fullname: sender.fullname
                } : { username: 'Someone', profilepicture: '', fullname: 'Someone' }
            };
        });

        return res.status(200).json({
            success: true,
            data: enrichedNotifications
        });
    } catch (error: any) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Mark notification as read
 * POST /api/v1/social/notifications/:id/read
 * PATCH /api/v1/social/notifications/read/:id
 */
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || req.params.notificationId;
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

/**
 * Mark all notifications as read
 * PATCH /api/v1/social/notifications/read-all
 */
export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const userClerkUserId = (req as any).user?.clerkUserId;

        await Notification.updateMany(
            { recipientClerkUserId: userClerkUserId, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error: any) {
        console.error('Error marking all notifications as read:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
