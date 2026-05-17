import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to dynamically aggregate and calculate trending hashtags.
 */
export const getTrending = async (req: Request, res: Response) => {
    try {
        const result = await CommunityPost.aggregate([
            { $project: { tags: 1, interactionScore: 1 } },
            { $unwind: "$tags" },
            { 
                $group: {
                    _id: "$tags",
                    count: { $sum: 1 },
                    score: { $sum: { $ifNull: ["$interactionScore", 0] } }
                }
            },
            {
                $project: {
                    tag: "$_id",
                    postCount: "$count",
                    popularityScore: { $add: ["$score", { $multiply: ["$count", 5] }] }
                }
            },
            { $sort: { popularityScore: -1 } },
            { $limit: 6 }
        ]);

        // Hand-curated travel tags as high-quality fallback
        const defaultTags = [
            { tag: '#KyotoAutumn', postCount: 17 },
            { tag: '#SwissAlps', postCount: 44 },
            { tag: '#BaliLife', postCount: 29 },
            { tag: '#VanLife', postCount: 39 },
            { tag: '#AdventureNexus', postCount: 24 }
        ];

        // Format aggregated database tags
        const dynamicTags = result
            .filter(item => item && item.tag && typeof item.tag === 'string' && item.tag.trim().length > 0)
            .map(item => {
                let formattedTag = item.tag.trim();
                // Ensure correct hashtag prefixing
                if (!formattedTag.startsWith('#')) {
                    formattedTag = '#' + formattedTag;
                }
                return {
                    tag: formattedTag,
                    postCount: item.postCount
                };
            });

        // Merge dynamic tags with fallbacks to guarantee 4+ beautiful trending tags
        const mergedTags = [...dynamicTags];
        for (const fallback of defaultTags) {
            if (mergedTags.length >= 5) break;
            if (!mergedTags.some(t => t.tag.toLowerCase() === fallback.tag.toLowerCase())) {
                mergedTags.push(fallback);
            }
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            data: mergedTags
        });
    } catch (error: any) {
        logger.error(`Error fetching trending tags: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch trending tags'
        });
    }
};
