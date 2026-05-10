import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityEvent from '../../../shared/database/models/communityEventModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to fetch upcoming community events.
 */
export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await CommunityEvent.find({
            date: { $gte: new Date() } // Only future events
        }).sort({ date: 1 });

        return res.status(StatusCodes.OK).json({
            success: true,
            data: events
        });
    } catch (error: any) {
        logger.error(`Error fetching community events: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch events'
        });
    }
};
