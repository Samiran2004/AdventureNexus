import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../../../shared/database/models/userModel';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to toggle saving/bookmarking a community post.
 */
export const toggleSavePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
        }

        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' });
        }

        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Post not found' });
        }

        const isSaved = user.savedPosts?.includes(post._id as any);

        if (isSaved) {
            // Unsave
            user.savedPosts = user.savedPosts?.filter(id => id.toString() !== postId.toString());
        } else {
            // Save
            if (!user.savedPosts) user.savedPosts = [];
            user.savedPosts.push(post._id as any);
        }

        await user.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            isSaved: !isSaved,
            message: isSaved ? 'Post unsaved successfully' : 'Post saved successfully'
        });

    } catch (error: any) {
        logger.error(`Error toggling save post: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
