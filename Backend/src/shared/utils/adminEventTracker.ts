import ActivityLog from '../database/models/activityLogModel';
import User from '../database/models/userModel';
import { broadcastRealtimeEvent } from '../socket/socket';
import logger from './logger';

export const trackAdminEvent = async (params: {
    clerkUserId: string;
    activityType: string;
    targetId: string;
    details?: string;
    username?: string;
}) => {
    try {
        let username = params.username;
        if (!username) {
            const user = await User.findOne({ clerkUserId: params.clerkUserId });
            username = user?.username || 'traveler';
        }

        const log = await ActivityLog.create({
            clerkUserId: params.clerkUserId,
            activityType: params.activityType,
            targetId: params.targetId,
            details: params.details || '',
            username
        });

        // Broadcast to admin dashboard instantly
        broadcastRealtimeEvent('activity:new', {
            _id: log._id,
            clerkUserId: log.clerkUserId,
            username,
            activityType: log.activityType,
            targetId: log.targetId,
            details: log.details,
            createdAt: log.createdAt
        });

        logger.info(`[OBSERVABILITY] Event tracked: ${params.activityType} by @${username}`);
        return log;
    } catch (err: any) {
        logger.error(`[OBSERVABILITY] Error tracking activity event: ${err.message}`);
    }
};
