import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to fetch all community posts.
 * Supports filtering by category and basic search.
 */
export const getPosts = async (req: Request, res: Response) => {
    try {
        const { category, search } = req.query;
        let query: any = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await CommunityPost.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilepicture fullname');

        return res.status(StatusCodes.OK).json({
            success: true,
            data: posts
        });
    } catch (error: any) {
        logger.error(`Error fetching community posts: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch discussions'
        });
    }
};
