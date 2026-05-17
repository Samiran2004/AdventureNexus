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
            { 
                $project: { 
                    combinedTags: { 
                        $concatArrays: [ 
                            { $ifNull: ["$tags", []] }, 
                            { $ifNull: ["$destinationTags", []] } 
                        ] 
                    },
                    interactionScore: 1 
                } 
            },
            { $unwind: "$combinedTags" },
            { 
                $group: {
                    _id: "$combinedTags",
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
            { $limit: 10 } // Fetch more to allow deduplication
        ]);

        // Hand-curated travel tags as high-quality fallback
        const defaultTags = [
            { tag: '#KyotoAutumn', postCount: 17 },
            { tag: '#SwissAlps', postCount: 44 },
            { tag: '#BaliLife', postCount: 29 },
            { tag: '#VanLife', postCount: 39 },
            { tag: '#AdventureNexus', postCount: 24 }
        ];

        // Format aggregated database tags and deduplicate
        const seen = new Set<string>();
        const dynamicTags: any[] = [];
        
        for (const item of result) {
            if (!item || !item.tag || typeof item.tag !== 'string') continue;
            let formattedTag = item.tag.trim();
            if (formattedTag.length === 0) continue;
            
            // Format to start with '#' and be capitalized
            if (!formattedTag.startsWith('#')) {
                formattedTag = '#' + formattedTag;
            }
            
            const lowerTag = formattedTag.toLowerCase();
            if (!seen.has(lowerTag)) {
                seen.add(lowerTag);
                dynamicTags.push({
                    tag: formattedTag,
                    postCount: item.postCount
                });
            }
        }

        // Merge dynamic tags with fallbacks to guarantee 5 beautiful trending tags
        const mergedTags = [...dynamicTags];
        for (const fallback of defaultTags) {
            if (mergedTags.length >= 5) break;
            const lowerFallback = fallback.tag.toLowerCase();
            if (!seen.has(lowerFallback)) {
                seen.add(lowerFallback);
                mergedTags.push(fallback);
            }
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            data: mergedTags.slice(0, 5)
        });
    } catch (error: any) {
        logger.error(`Error fetching trending tags: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch trending tags'
        });
    }
};
