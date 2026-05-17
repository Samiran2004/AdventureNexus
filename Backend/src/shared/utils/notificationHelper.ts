import Notification, { NotificationType } from '../database/models/notificationModel';
import User from '../database/models/userModel';
import { sendRealtimeNotification } from '../socket/socket';
import logger from './logger';

interface CreateNotificationParams {
    recipientClerkUserId: string;
    senderClerkUserId: string;
    type: NotificationType;
    relatedId?: string;
}

/**
 * Creates, saves, enriches with sender profile, and sends a real-time notification to the recipient.
 */
export const createAndSendNotification = async (params: CreateNotificationParams) => {
    try {
        // Prevent sending notification to oneself
        if (params.recipientClerkUserId === params.senderClerkUserId) {
            return null;
        }

        // Save to DB
        const notification = await Notification.create({
            recipientClerkUserId: params.recipientClerkUserId,
            senderClerkUserId: params.senderClerkUserId,
            type: params.type,
            relatedId: params.relatedId,
            isRead: false
        });

        // Fetch sender details
        const sender = await User.findOne({ clerkUserId: params.senderClerkUserId })
            .select('username profilepicture fullname');

        const enrichedNotification = {
            ...notification.toObject(),
            sender: sender ? {
                username: sender.username,
                profilepicture: sender.profilepicture,
                fullname: sender.fullname
            } : { username: 'Someone', profilepicture: '', fullname: 'Someone' }
        };

        // Send via Socket.io
        sendRealtimeNotification(params.recipientClerkUserId, enrichedNotification);

        return enrichedNotification;
    } catch (error: any) {
        logger.error(`Error in createAndSendNotification: ${error.message}`);
        return null;
    }
};
