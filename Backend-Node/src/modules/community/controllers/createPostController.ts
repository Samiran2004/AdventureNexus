import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to create a new community post.
 */
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, category, tags } = req.body;
        const userId = req.user?._id;
        const clerkUserId = req.user?.clerkUserId;

        if (!title || !content || !category) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Title, content, and category are required'
            });
        }

        const newPost = await CommunityPost.create({
            userId,
            clerkUserId,
            title,
            content,
            category,
            tags
        });

        logger.info(`New community post created: ${newPost._id} by ${clerkUserId}`);

        return res.status(StatusCodes.CREATED).json({
            success: true,
            data: newPost
        });
    } catch (error: any) {
        logger.error(`Error creating community post: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create discussion'
        });
    }
};
