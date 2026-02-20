import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import CommunityComment from '../../../shared/database/models/communityCommentModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to toggle like on a post or comment.
 */
export const toggleLike = async (req: Request, res: Response) => {
    try {
        const { targetType, targetId } = req.body;
        const clerkUserId = req.user?.clerkUserId;

        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        let target: any;
        if (targetType === 'post') {
            target = await CommunityPost.findById(targetId);
        } else if (targetType === 'comment') {
            target = await CommunityComment.findById(targetId);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid target type'
            });
        }

        if (!target) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Target not found'
            });
        }

        const likeIndex = target.likes.indexOf(clerkUserId);
        if (likeIndex > -1) {
            // Unlike
            target.likes.splice(likeIndex, 1);
        } else {
            // Like
            target.likes.push(clerkUserId);
        }

        await target.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                likes: target.likes,
                liked: likeIndex === -1
            }
        });
    } catch (error: any) {
        logger.error(`Error toggling like: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to process like'
        });
    }
};
