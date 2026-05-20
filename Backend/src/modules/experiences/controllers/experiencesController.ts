import { Request, Response, NextFunction } from 'express';
import ExperiencePost from '../../../shared/database/models/experiencePostModel';
import ExperienceComment from '../../../shared/database/models/experienceCommentModel';
import User from '../../../shared/database/models/userModel';
import logger from '../../../shared/utils/logger';
import cloudinary from '../../../shared/services/cloudinaryService';
import fs from 'fs';

// ── AUTO-INSIGHT ENGINE ──
// Generates estimated cost, difficulty, and crowd type from tags/location
const generateInsights = (tags: string[], location: string) => {
    const tagLower = tags.map(t => t.toLowerCase());

    // Estimated Cost
    let estimatedCost = '₹2,000 - ₹5,000';
    if (tagLower.some(t => ['luxury', 'premium', 'resort', 'yacht', 'cruise'].includes(t))) {
        estimatedCost = '₹15,000 - ₹50,000+';
    } else if (tagLower.some(t => ['fine-dining', 'spa', 'wine', 'helicopter'].includes(t))) {
        estimatedCost = '₹8,000 - ₹20,000';
    } else if (tagLower.some(t => ['backpacking', 'hostel', 'budget', 'street-food'].includes(t))) {
        estimatedCost = '₹500 - ₹2,000';
    } else if (tagLower.some(t => ['trekking', 'hiking', 'camping', 'adventure'].includes(t))) {
        estimatedCost = '₹3,000 - ₹8,000';
    }

    // Difficulty Level
    let difficultyLevel = 'Easy';
    if (tagLower.some(t => ['trekking', 'climbing', 'hiking', 'mountaineering', 'rafting', 'paragliding'].includes(t))) {
        difficultyLevel = 'Hard';
    } else if (tagLower.some(t => ['cycling', 'snorkeling', 'kayaking', 'safari', 'camping'].includes(t))) {
        difficultyLevel = 'Moderate';
    }

    // Crowd Type
    let crowdType = 'Solo';
    if (tagLower.some(t => ['romantic', 'couple', 'honeymoon', 'date'].includes(t))) {
        crowdType = 'Couple';
    } else if (tagLower.some(t => ['family', 'kids', 'children', 'theme-park'].includes(t))) {
        crowdType = 'Family';
    } else if (tagLower.some(t => ['group', 'friends', 'party', 'festival', 'nightlife'].includes(t))) {
        crowdType = 'Group';
    }

    return { estimatedCost, difficultyLevel, crowdType };
};

// ── 1. CREATE EXPERIENCE POST ──
export const createExperiencePost = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as any;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { title, description, location, tags, rating, estimatedCost, currency, difficultyLevel, crowdType } = req.body;

        if (!title || !description || !location) {
            return res.status(400).json({ success: false, message: 'Title, description, and location are required.' });
        }

        // Upload images to Cloudinary (same pattern as community posts)
        const images: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files as Express.Multer.File[]) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'adventurenexus/experiences',
                    });
                    images.push(result.secure_url);
                } catch (uploadErr) {
                    logger.error('Failed to upload experience image:', uploadErr);
                } finally {
                    // Clean up temp file
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                }
            }
        }
        // Also accept image URLs from body
        if (req.body.images) {
            const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            images.push(...bodyImages.filter((i: string) => i));
        }

        const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim())) : [];

        const post = await ExperiencePost.create({
            userId: user._id,
            clerkUserId: user.clerkUserId,
            title,
            description,
            location,
            images,
            tags: parsedTags,
            rating: rating ? Number(rating) : 5,
            estimatedCost: estimatedCost || '',
            currency: currency || '₹',
            difficultyLevel: difficultyLevel || 'Easy',
            crowdType: crowdType || 'Solo',
        });

        // Populate user info for response
        const populated = await ExperiencePost.findById(post._id)
            .populate('userId', 'clerkUserId firstName lastName username profilepicture');

        return res.status(201).json({ success: true, data: populated });
    } catch (error) {
        logger.error('Error creating experience post:', error);
        next(error);
    }
};

// ── 2. GET EXPERIENCE FEED ──
export const getExperienceFeed = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const sort = (req.query.sort as string) || 'latest'; // 'latest' | 'popular' | 'trending'
        const location = req.query.location as string;
        const tag = req.query.tag as string;
        const search = req.query.search as string;

        // Build filter query
        const filter: any = {};
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
        if (tag) {
            filter.tags = { $regex: tag, $options: 'i' };
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Build sort order
        let sortOrder: any = { createdAt: -1 }; // Default: latest
        if (sort === 'popular') {
            sortOrder = { likes: -1, createdAt: -1 }; // By like count, unsupported directly — we use aggregate below
        } else if (sort === 'trending') {
            sortOrder = { viewCount: -1, commentsCount: -1, createdAt: -1 };
        }

        let posts;
        if (sort === 'popular') {
            // Use aggregation to sort by likes array length
            const pipeline: any[] = [
                { $match: filter },
                { $addFields: { likesCount: { $size: '$likes' } } },
                { $sort: { likesCount: -1, createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
            ];
            posts = await ExperiencePost.aggregate(pipeline);
            // Populate user info manually
            await ExperiencePost.populate(posts, { path: 'userId', select: 'clerkUserId firstName lastName username profilepicture' });
        } else {
            posts = await ExperiencePost.find(filter)
                .sort(sortOrder)
                .skip(skip)
                .limit(limit)
                .populate('userId', 'clerkUserId firstName lastName username profilepicture')
                .lean();
        }

        const total = await ExperiencePost.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        logger.error('Error fetching experience feed:', error);
        next(error);
    }
};

// ── 3. GET SINGLE EXPERIENCE ──
export const getExperienceById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const post = await ExperiencePost.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        ).populate('userId', 'clerkUserId firstName lastName username profilepicture bio');

        if (!post) {
            return res.status(404).json({ success: false, message: 'Experience not found.' });
        }

        // Get comments for this post
        const comments = await ExperienceComment.find({ postId: id })
            .populate('userId', 'clerkUserId firstName lastName username profilepicture')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({ success: true, data: post, comments });
    } catch (error) {
        logger.error('Error fetching experience by id:', error);
        next(error);
    }
};

// ── 4. TOGGLE LIKE ──
export const toggleExperienceLike = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as any;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { id } = req.params;
        const post = await ExperiencePost.findById(id);
        if (!post) return res.status(404).json({ success: false, message: 'Experience not found.' });

        const clerkId = user.clerkUserId;
        const alreadyLiked = post.likes.includes(clerkId);

        if (alreadyLiked) {
            post.likes = post.likes.filter((lid: string) => lid !== clerkId);
        } else {
            post.likes.push(clerkId);
        }
        await post.save();

        return res.status(200).json({
            success: true,
            liked: !alreadyLiked,
            likesCount: post.likes.length,
        });
    } catch (error) {
        logger.error('Error toggling experience like:', error);
        next(error);
    }
};

// ── 5. TOGGLE SAVE/BOOKMARK ──
export const toggleExperienceSave = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as any;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { id } = req.params;
        const post = await ExperiencePost.findById(id);
        if (!post) return res.status(404).json({ success: false, message: 'Experience not found.' });

        const clerkId = user.clerkUserId;
        const alreadySaved = post.saves.includes(clerkId);

        if (alreadySaved) {
            post.saves = post.saves.filter((sid: string) => sid !== clerkId);
        } else {
            post.saves.push(clerkId);
        }
        await post.save();

        return res.status(200).json({
            success: true,
            saved: !alreadySaved,
            savesCount: post.saves.length,
        });
    } catch (error) {
        logger.error('Error toggling experience save:', error);
        next(error);
    }
};

// ── 6. ADD COMMENT (WITH NESTED REPLY SUPPORT) ──
export const addExperienceComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as any;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { postId, content, parentId } = req.body;

        if (!postId || !content) {
            return res.status(400).json({ success: false, message: 'postId and content are required.' });
        }

        const post = await ExperiencePost.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: 'Experience not found.' });

        const comment = await ExperienceComment.create({
            postId,
            userId: user._id,
            clerkUserId: user.clerkUserId,
            content,
            parentId: parentId || null,
        });

        // Increment comment count on the post
        post.commentsCount = (post.commentsCount || 0) + 1;
        await post.save();

        const populated = await ExperienceComment.findById(comment._id)
            .populate('userId', 'clerkUserId firstName lastName username profilepicture');

        return res.status(201).json({ success: true, data: populated });
    } catch (error) {
        logger.error('Error adding experience comment:', error);
        next(error);
    }
};

// ── 7. GET COMMENTS FOR A POST ──
export const getExperienceComments = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { postId } = req.params;
        const comments = await ExperienceComment.find({ postId })
            .populate('userId', 'clerkUserId firstName lastName username profilepicture')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({ success: true, data: comments });
    } catch (error) {
        logger.error('Error fetching experience comments:', error);
        next(error);
    }
};

// Helper to extract Cloudinary public ID from a secure URL
const extractPublicIdFromUrl = (url: string): string | null => {
    try {
        if (!url || !url.includes('image/upload/')) return null;
        
        const parts = url.split('image/upload/');
        if (parts.length < 2) return null;
        
        const pathParts = parts[1].split('/');
        
        // Remove version part (e.g. v171620000)
        if (pathParts[0].startsWith('v') && !isNaN(Number(pathParts[0].substring(1)))) {
            pathParts.shift();
        }
        
        const publicIdWithExt = pathParts.join('/');
        const lastDotIndex = publicIdWithExt.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            return publicIdWithExt.substring(0, lastDotIndex);
        }
        return publicIdWithExt;
    } catch (e) {
        logger.error('Failed to extract public ID from Cloudinary URL:', e);
        return null;
    }
};

// ── 8. DELETE EXPERIENCE POST ──
export const deleteExperiencePost = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as any;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { id } = req.params;
        const post = await ExperiencePost.findById(id);
        
        if (!post) {
            return res.status(404).json({ success: false, message: 'Experience not found.' });
        }

        // Check if current user is the creator of the experience
        if (post.clerkUserId !== user.clerkUserId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this experience.' });
        }

        // Delete images from Cloudinary if they exist
        if (post.images && Array.isArray(post.images) && post.images.length > 0) {
            for (const imgUrl of post.images) {
                const publicId = extractPublicIdFromUrl(imgUrl);
                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                        logger.info(`✅ Deleted image from Cloudinary: ${publicId}`);
                    } catch (cloudinaryErr) {
                        logger.error(`❌ Failed to delete image ${publicId} from Cloudinary:`, cloudinaryErr);
                    }
                }
            }
        }

        // Delete the post
        await ExperiencePost.findByIdAndDelete(id);

        // Delete associated comments
        await ExperienceComment.deleteMany({ postId: id });

        return res.status(200).json({ success: true, message: 'Experience deleted successfully.' });
    } catch (error) {
        logger.error('Error deleting experience:', error);
        next(error);
    }
};
