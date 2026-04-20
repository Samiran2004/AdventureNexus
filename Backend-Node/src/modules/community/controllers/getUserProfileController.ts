import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../../../shared/database/models/userModel';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import TravelStory from '../../../shared/database/models/travelStoryModel';
import logger from '../../../shared/utils/logger';
import { clerkClient } from '@clerk/express';

/**
 * Controller to fetch a user's public profile and activity.
 */
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { clerkUserId } = req.params;
        const requestingUserClerkId = req.user?.clerkUserId;

        if (!clerkUserId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'User ID is required'
            });
        }

        let user = await User.findOne({ clerkUserId });

        // --- REAL-TIME SYNC FALLBACK ---
        // If user not in DB, fetch from Clerk and sync
        if (!user) {
            logger.info(`🔍 User ${clerkUserId} not found in DB, attempting sync from Clerk...`);
            try {
                const clerkUser = await clerkClient.users.getUser(clerkUserId);
                if (clerkUser) {
                    user = await User.findOneAndUpdate(
                        { clerkUserId },
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
                    logger.info(`✅ Synced missing user ${clerkUserId} to database.`);
                }
            } catch (clerkError: any) {
                logger.error(`❌ Clerk sync failed: ${clerkError.message}`);
            }
        }

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }

        // Fetch user's community posts
        const posts = await CommunityPost.find({ clerkUserId })
            .sort({ createdAt: -1 })
            .limit(10);

        // Fetch user's travel stories (blogs)
        const stories = await TravelStory.find({ clerkUserId })
            .sort({ createdAt: -1 })
            .limit(10);

        // Fetch user's saved plans
        const savedPlans = await User.findOne({ clerkUserId })
            .populate('plans')
            .then(u => u?.plans || []);

        // Check if the requesting user is following this user
        const isFollowing = requestingUserClerkId
            ? user.followers?.includes(requestingUserClerkId)
            : false;

        // Better name derivation for profile
        const fullname = user.fullname || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Traveler';

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                profile: {
                    clerkUserId: user.clerkUserId,
                    username: user.username,
                    fullname,
                    profilepicture: user.profilepicture,
                    bio: user.bio || '',
                    coverImage: user.coverImage || '',
                    country: user.country || '',
                    phonenumber: user.phonenumber,
                    followersCount: user.followers?.length || 0,
                    followingCount: user.following?.length || 0,
                    isFollowing,
                    createdAt: user.createdAt
                },
                activity: {
                    posts,
                    stories,
                    savedPlans
                }
            }
        });
    } catch (error: any) {
        logger.error(`Error fetching user profile: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
};
