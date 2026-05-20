import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../../../shared/database/models/userModel';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import ExperiencePost from '../../../shared/database/models/experiencePostModel';
import CommunityComment from '../../../shared/database/models/communityCommentModel';
import ExperienceComment from '../../../shared/database/models/experienceCommentModel';
import GroupMembership from '../../../shared/database/models/groupMembershipModel';
import logger from '../../../shared/utils/logger';
import { clerkClient } from '@clerk/express';

/**
 * Helper to get MongoDB User by clerkUserId, syncing from Clerk in real-time if not found
 */
const getUserByClerkIdWithSync = async (clerkUserId: string) => {
    let user = await User.findOne({ clerkUserId });
    if (!user) {
        logger.info(`🔍 Auth user ${clerkUserId} not in DB, syncing from Clerk...`);
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
                logger.info(`✅ Auth user synced successfully.`);
            }
        } catch (clerkError: any) {
            logger.error(`❌ Auth user Clerk sync failed: ${clerkError.message}`);
        }
    }
    return user;
};

/**
 * ── 1. GET DYNAMIC PROFILE & CALCULATED STATS ──
 */
export const getUserDashboardProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { clerkUserId } = req.params;
        if (!clerkUserId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Clerk User ID is required' });
        }

        const user = await getUserByClerkIdWithSync(clerkUserId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' });
        }

        // Parallel counts for high performance
        const [postsCount, experiencesCount, communityCommentsCount, experienceCommentsCount, likedCommunityPosts, likedExperiencePosts, groupsCount] = await Promise.all([
            CommunityPost.countDocuments({ clerkUserId }),
            ExperiencePost.countDocuments({ clerkUserId }),
            CommunityComment.countDocuments({ clerkUserId }),
            ExperienceComment.countDocuments({ clerkUserId }),
            CommunityPost.countDocuments({ likes: clerkUserId }),
            ExperiencePost.countDocuments({ likes: clerkUserId }),
            GroupMembership.countDocuments({ userId: user._id })
        ]);

        const totalComments = communityCommentsCount + experienceCommentsCount;
        const totalLikedPosts = likedCommunityPosts + likedExperiencePosts;

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                profile: {
                    _id: user._id,
                    clerkUserId: user.clerkUserId,
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullname: user.fullname || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Traveler',
                    profilepicture: user.profilepicture,
                    coverImage: user.coverImage || '',
                    bio: user.bio || '',
                    gender: user.gender || '',
                    country: user.country || '',
                    phonenumber: user.phonenumber || '',
                    preferences: user.preferences || [],
                    isPrivate: user.isPrivate || false,
                    socialLinks: user.socialLinks || {},
                    followersCount: user.followers?.length || 0,
                    followingCount: user.following?.length || 0,
                    createdAt: user.createdAt
                },
                stats: {
                    postsCount,
                    experiencesCount,
                    commentsCount: totalComments,
                    likedPostsCount: totalLikedPosts,
                    groupsCount
                }
            }
        });
    } catch (error: any) {
        logger.error('Error fetching dashboard profile stats:', error);
        next(error);
    }
};

/**
 * ── 2. GET USER POSTS ──
 */
export const getUserDashboardPosts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { clerkUserId } = req.params;
        const posts = await CommunityPost.find({ clerkUserId })
            .populate('userId', 'username fullname profilepicture')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(StatusCodes.OK).json({ success: true, data: posts });
    } catch (error: any) {
        logger.error('Error fetching user dashboard posts:', error);
        next(error);
    }
};

/**
 * ── 3. GET USER EXPERIENCES ──
 */
export const getUserDashboardExperiences = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { clerkUserId } = req.params;
        const experiences = await ExperiencePost.find({ clerkUserId })
            .populate('userId', 'username fullname profilepicture')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(StatusCodes.OK).json({ success: true, data: experiences });
    } catch (error: any) {
        logger.error('Error fetching user dashboard experiences:', error);
        next(error);
    }
};

/**
 * ── 4. GET USER COMMENTS ──
 */
export const getUserDashboardComments = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { clerkUserId } = req.params;
        
        // Find community comments
        const commComments = await CommunityComment.find({ clerkUserId })
            .populate('postId', 'title content')
            .sort({ createdAt: -1 })
            .lean();

        // Map type flag
        const mappedComm = commComments.map(c => ({
            ...c,
            postType: 'community',
            postTitle: (c.postId as any)?.title || 'Community Post'
        }));

        return res.status(StatusCodes.OK).json({ success: true, data: mappedComm });
    } catch (error: any) {
        logger.error('Error fetching user dashboard comments:', error);
        next(error);
    }
};

/**
 * ── 5. GET USER LIKED POSTS ──
 */
export const getUserDashboardLikes = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { clerkUserId } = req.params;
        
        // Find community posts liked by this user
        const likedComm = await CommunityPost.find({ likes: clerkUserId })
            .populate('userId', 'username fullname profilepicture')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(StatusCodes.OK).json({ success: true, data: likedComm });
    } catch (error: any) {
        logger.error('Error fetching user dashboard likes:', error);
        next(error);
    }
};

/**
 * ── 6. GET USER GROUPS ──
 */
export const getUserDashboardGroups = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { clerkUserId } = req.params;
        const user = await getUserByClerkIdWithSync(clerkUserId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' });
        }

        const groups = await GroupMembership.find({ userId: user._id })
            .populate('groupId', 'name description image membersCount')
            .lean();

        return res.status(StatusCodes.OK).json({ success: true, data: groups });
    } catch (error: any) {
        logger.error('Error fetching user dashboard groups:', error);
        next(error);
    }
};
