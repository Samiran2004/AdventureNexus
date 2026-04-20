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

        let targetUser = await User.findOne({ clerkUserId: targetClerkUserId });
        let followerUser = await User.findOne({ clerkUserId: followerClerkUserId });

        // --- REAL-TIME SYNC FALLBACK ---
        if (!targetUser) {
            try {
                const clerkUser = await clerkClient.users.getUser(targetClerkUserId);
                if (clerkUser) {
                    targetUser = await User.findOneAndUpdate(
                        { clerkUserId: targetClerkUserId },
                        {
                            clerkUserId: clerkUser.id,
                            email: clerkUser.emailAddresses[0]?.emailAddress,
                            username: clerkUser.username || clerkUser.externalAccounts[0]?.username || `traveler_${clerkUser.id.substring(0, 5)}`,
                            firstName: clerkUser.firstName,
                            lastName: clerkUser.lastName,
                            fullname: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'Traveler',
                            profilepicture: clerkUser.imageUrl,
                        },
                        { upsert: true, new: true }
                    );
                }
            } catch (e) { }
        }

        if (!followerUser && followerClerkUserId) {
            try {
                const clerkUser = await clerkClient.users.getUser(followerClerkUserId);
                if (clerkUser) {
                    followerUser = await User.findOneAndUpdate(
                        { clerkUserId: followerClerkUserId },
                        {
                            clerkUserId: clerkUser.id,
                            email: clerkUser.emailAddresses[0]?.emailAddress,
                            username: clerkUser.username || clerkUser.externalAccounts[0]?.username || `traveler_${clerkUser.id.substring(0, 5)}`,
                            firstName: clerkUser.firstName,
                            lastName: clerkUser.lastName,
                            fullname: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'Traveler',
                            profilepicture: clerkUser.imageUrl,
                        },
                        { upsert: true, new: true }
                    );
                }
            } catch (e) { }
        }

        if (!targetUser || !followerUser) {
            logger.warn(`❌ Follow failed: Target(${targetClerkUserId}:${!!targetUser}) or Follower(${followerClerkUserId}:${!!followerUser}) not in DB`);
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found in database'
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
