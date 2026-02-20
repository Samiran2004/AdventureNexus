import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunitySpotlight from '../../../shared/database/models/communitySpotlightModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to fetch the active member spotlight.
 */
export const getSpotlight = async (req: Request, res: Response) => {
    try {
        const spotlight = await CommunitySpotlight.findOne({ isActive: true })
            .sort({ createdAt: -1 });

        return res.status(StatusCodes.OK).json({
            success: true,
            data: spotlight
        });
    } catch (error: any) {
        logger.error(`Error fetching community spotlight: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch spotlight'
        });
    }
};
