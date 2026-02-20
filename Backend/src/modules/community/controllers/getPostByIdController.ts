import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import CommunityComment from '../../../shared/database/models/communityCommentModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to fetch a single community post by ID, including its comments.
 */
export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const post = await CommunityPost.findById(id)
            .populate('userId', 'username profilepicture fullname');

        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        const comments = await CommunityComment.find({ postId: id })
            .sort({ createdAt: 1 })
            .populate('userId', 'username profilepicture fullname');

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                ...post.toObject(),
                comments
            }
        });
    } catch (error: any) {
        logger.error(`Error fetching post by ID: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch discussion details'
        });
    }
};
