import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityComment from '../../../shared/database/models/communityCommentModel';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to add a comment to a community post.
 */
export const addComment = async (req: Request, res: Response) => {
    try {
        const { postId, content } = req.body;
        const userId = req.user?._id;
        const clerkUserId = req.user?.clerkUserId;

        if (!postId || !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Post ID and content are required'
            });
        }

        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Post not found'
            });
        }

        const newComment = await CommunityComment.create({
            postId,
            userId,
            clerkUserId,
            content
        });

        // Increment replies count on the post
        post.repliesCount += 1;
        await post.save();

        logger.info(`New comment added to post ${postId} by ${clerkUserId}`);

        return res.status(StatusCodes.CREATED).json({
            success: true,
            data: newComment
        });
    } catch (error: any) {
        logger.error(`Error adding comment: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to add comment'
        });
    }
};
