import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import Group from '../../../shared/database/models/groupModel';
import logger from '../../../shared/utils/logger';
import cloudinary from '../../../shared/services/cloudinaryService';
import fs from 'fs';

/**
 * Controller to create a new community post.
 */
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, category, tags, destinationTags, tripId, groupId, communityId, images } = req.body;
        const userId = req.user?._id;
        const clerkUserId = req.user?.clerkUserId;

        if (!title || !content || !category) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Title, content, and category are required'
            });
        }

        // Only members can post in private groups
        if (groupId && userId) {
            const group = await Group.findById(groupId);
            if (group && (group.privacy === 'PRIVATE' || group.isPrivate)) {
                const isMember = group.members.some(m => m.toString() === userId.toString());
                if (!isMember) {
                    return res.status(StatusCodes.FORBIDDEN).json({
                        success: false,
                        message: 'Only members can post in private groups'
                    });
                }
            }
        }

        // Upload images if any
        const imageUrls: string[] = [];
        if (images && Array.isArray(images)) {
            imageUrls.push(...images);
        }

        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'adventurenexus/posts',
                    });
                    imageUrls.push(result.secure_url);
                } catch (error) {
                    logger.error('Failed to upload image:', error);
                } finally {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                }
            }
        }

        const newPost = await CommunityPost.create({
            userId,
            clerkUserId,
            title,
            content,
            category,
            tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
            destinationTags: destinationTags ? (typeof destinationTags === 'string' ? JSON.parse(destinationTags) : destinationTags) : [],
            tripId: tripId || undefined,
            groupId: groupId || undefined,
            communityId: communityId || undefined,
            images: imageUrls
        });

        logger.info(`New community post created: ${newPost._id} by ${clerkUserId}`);

        // Real-time broadcast
        import('../../../shared/socket/socket').then(({ broadcastRealtimeEvent }) => {
            broadcastRealtimeEvent('community:post', {
                post: newPost,
                clerkUserId
            });
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            data: newPost
        });
    } catch (error: any) {
        logger.error(`Error creating community post: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create discussion'
        });
    }
};
