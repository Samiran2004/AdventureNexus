import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import logger from '../../../shared/utils/logger';

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, category, tags, destinationTags } = req.body;
        const userId = req.user?._id;

        const post = await CommunityPost.findById(id);
        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Verify if the requester is the creator of the post
        if (post.userId.toString() !== userId.toString()) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not authorized to edit this post'
            });
        }

        // Update fields
        if (title) post.title = title;
        if (content) post.content = content;
        if (category) post.category = category;
        if (tags) post.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        if (destinationTags) post.destinationTags = typeof destinationTags === 'string' ? JSON.parse(destinationTags) : destinationTags;

        await post.save();

        logger.info(`Community post updated: ${post._id} by user ${userId}`);

        return res.status(StatusCodes.OK).json({
            success: true,
            data: post
        });
    } catch (error: any) {
        logger.error(`Error updating community post: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update post'
        });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const post = await CommunityPost.findById(id);
        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Verify if the requester is the creator of the post
        if (post.userId.toString() !== userId.toString()) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not authorized to delete this post'
            });
        }

        await CommunityPost.findByIdAndDelete(id);

        logger.info(`Community post deleted: ${id} by user ${userId}`);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error: any) {
        logger.error(`Error deleting community post: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete post'
        });
    }
};
