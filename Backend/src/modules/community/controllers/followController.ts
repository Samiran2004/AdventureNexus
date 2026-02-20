import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../../../shared/database/models/userModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to toggle follow/unfollow a user.
 */
export const toggleFollow = async (req: Request, res: Response) => {
    try {
        const { targetClerkUserId } = req.body;
        const followerClerkUserId = req.user?.clerkUserId;

        if (!targetClerkUserId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Target user ID is required'
            });
        }

        if (targetClerkUserId === followerClerkUserId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'You cannot follow yourself'
            });
        }

        const targetUser = await User.findOne({ clerkUserId: targetClerkUserId });
        const followerUser = await User.findOne({ clerkUserId: followerClerkUserId });

        if (!targetUser || !followerUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }

        const isFollowing = followerUser.following?.includes(targetClerkUserId);

        if (isFollowing) {
            // Unfollow
            await User.findOneAndUpdate(
                { clerkUserId: followerClerkUserId },
                { $pull: { following: targetClerkUserId } }
            );
            await User.findOneAndUpdate(
                { clerkUserId: targetClerkUserId },
                { $pull: { followers: followerClerkUserId } }
            );

            logger.info(`User ${followerClerkUserId} unfollowed ${targetClerkUserId}`);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Unfollowed successfully',
                data: { isFollowing: false }
            });
        } else {
            // Follow
            await User.findOneAndUpdate(
                { clerkUserId: followerClerkUserId },
                { $addToSet: { following: targetClerkUserId } }
            );
            await User.findOneAndUpdate(
                { clerkUserId: targetClerkUserId },
                { $addToSet: { followers: followerClerkUserId } }
            );

            logger.info(`User ${followerClerkUserId} followed ${targetClerkUserId}`);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Followed successfully',
                data: { isFollowing: true }
            });
        }
    } catch (error: any) {
        logger.error(`Error toggling follow: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to toggle follow status'
        });
    }
};
