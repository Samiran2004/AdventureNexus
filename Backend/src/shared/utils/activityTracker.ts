import ActivityLog, { ActivityType } from '../database/models/activityLogModel';
import logger from './logger';

/**
 * Utility to log granular user actions.
 */
export const trackActivity = async (clerkUserId: string, activityType: ActivityType, targetId: string) => {
    try {
        if (!clerkUserId || !targetId) return;

        await ActivityLog.create({
            clerkUserId,
            activityType,
            targetId
        });
        logger.info(`Activity tracked: User ${clerkUserId} completed ${activityType} on target ${targetId}`);
    } catch (error: any) {
        logger.error(`Error tracking activity: ${error.message}`);
    }
};
export { ActivityType };
