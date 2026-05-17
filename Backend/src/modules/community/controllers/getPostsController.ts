import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import User from '../../../shared/database/models/userModel';
import GroupMembership from '../../../shared/database/models/groupMembershipModel';
import ActivityLog from '../../../shared/database/models/activityLogModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to fetch all community posts.
 * Upgraded with Personalization Social Feed Ranking logic.
 */
export const getPosts = async (req: Request, res: Response) => {
    try {
        const { category, search, clerkUserId, groupId, communityId } = { ...req.query, ...req.params } as any;
        let query: any = {};

        if (category) query.category = category;
        
        if (groupId) {
            if (groupId === 'all_groups') {
                query.groupId = { $exists: true, $ne: null };
            } else if (groupId === 'none') {
                query.groupId = { $exists: false };
            } else {
                query.groupId = new mongoose.Types.ObjectId(groupId);
            }
        }
        
        if (communityId) {
            query.communityId = new mongoose.Types.ObjectId(communityId);
        }

        if (search) {
            const cleanSearch = search.startsWith('#') ? search.substring(1) : search;
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $regex: cleanSearch, $options: 'i' } },
                { destinationTags: { $regex: cleanSearch, $options: 'i' } }
            ];
        }

        let followingIds: string[] = [];
        let userGroupIds: mongoose.Types.ObjectId[] = [];
        let interactedPostIds: string[] = [];

        if (clerkUserId) {
            const user = await User.findOne({ clerkUserId: clerkUserId as string });
            if (user) {
                followingIds = user.following || [];
                const memberships = await GroupMembership.find({ userId: user._id });
                userGroupIds = memberships.map(m => m.groupId);
            }

            // Fetch last 50 activity logs to identify recent interactions
            const recentLogs = await ActivityLog.find({ clerkUserId })
                .sort({ createdAt: -1 })
                .limit(50);
            interactedPostIds = recentLogs.map(log => log.targetId);
        }

        // Advanced aggregation for Feed Personalization & Ranking
        // 1. Boost score by 100 for posts from joined groups
        // 2. Boost score by 50 for posts from followed users
        // 3. Boost score by 30 for posts with recent interactions
        // 4. Sort by personalizedScore first, then engagement/createdAt
        const posts = await CommunityPost.aggregate([
            { $match: query },
            {
                $addFields: {
                    isFollowed: {
                        $cond: { if: { $in: ["$clerkUserId", followingIds] }, then: 1, else: 0 }
                    },
                    inJoinedGroup: {
                        $cond: { if: { $in: ["$groupId", userGroupIds] }, then: 1, else: 0 }
                    },
                    isRecentInteraction: {
                        $cond: { if: { $in: [{ $toString: "$_id" }, interactedPostIds] }, then: 1, else: 0 }
                    }
                }
            },
            {
                $addFields: {
                    personalizationScore: {
                        $add: [
                            { $multiply: ["$inJoinedGroup", 100] },
                            { $multiply: ["$isFollowed", 50] },
                            { $multiply: ["$isRecentInteraction", 30] },
                            { $ifNull: ["$interactionScore", 0] }
                        ]
                    }
                }
            },
            {
                $sort: {
                    personalizationScore: -1, // Personalized posts first
                    createdAt: -1 // Newest posts next
                }
            },
            { $limit: 50 }
        ]);

        // Populate userId manually since aggregate doesn't support populate directly as easily
        let populatedPosts = await CommunityPost.populate(posts, {
            path: 'userId',
            select: 'username profilepicture fullname'
        });
        
        populatedPosts = await CommunityPost.populate(populatedPosts, {
            path: 'tripId',
            select: 'title destinations startDate endDate budget'
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            data: populatedPosts
        });
    } catch (error: any) {
        logger.error(`Error fetching community posts: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch discussions'
        });
    }
};
