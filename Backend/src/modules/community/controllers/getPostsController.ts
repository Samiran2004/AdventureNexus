import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import User from '../../../shared/database/models/userModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to fetch all community posts.
 * Upgraded with Social Feed Ranking logic.
 */
export const getPosts = async (req: Request, res: Response) => {
    try {
        const { category, search, clerkUserId } = req.query;
        let query: any = {};

        if (category) query.category = category;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        let followingIds: string[] = [];
        if (clerkUserId) {
            const user = await User.findOne({ clerkUserId: clerkUserId as string });
            if (user) {
                followingIds = user.following || [];
            }
        }

        // Advanced aggregation for Feed Ranking
        // 1. Posts from followed users get priority
        // 2. High interaction score posts are boosted
        // 3. Newest posts are always relevant
        const posts = await CommunityPost.aggregate([
            { $match: query },
            {
                $addFields: {
                    isFollowed: {
                        $cond: { if: { $in: ["$clerkUserId", followingIds] }, then: 1, else: 0 }
                    }
                }
            },
            {
                $sort: {
                    isFollowed: -1, // Followed users first
                    interactionScore: -1, // Then by engagement
                    createdAt: -1 // Then by date
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
