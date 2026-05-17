import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CommunityComment from '../../../shared/database/models/communityCommentModel';
import CommunityPost from '../../../shared/database/models/communityPostModel';
import logger from '../../../shared/utils/logger';

/**
 * Controller to add a comment to a community post.
 */
export const addComment = async (req: Request, res: Response) => {
    try {
        const { postId, content, parentId } = req.body;
        const userId = req.user?._id;
        const clerkUserId = req.user?.clerkUserId;

        if (!postId || !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Post ID and content are required'
            });
        }

        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Post not found'
            });
        }

        const newComment = await CommunityComment.create({
            postId,
            userId,
            clerkUserId,
            content,
            parentId: parentId || undefined
        });

        // Increment replies count on the post
        post.repliesCount += 1;
        await post.save();

        // Send real-time notification
        const { createAndSendNotification } = await import('../../../shared/utils/notificationHelper');
        const { NotificationType } = await import('../../../shared/database/models/notificationModel');

        if (parentId) {
            // Reply to a comment
            const parentComment = await CommunityComment.findById(parentId);
            if (parentComment && parentComment.clerkUserId) {
                createAndSendNotification({
                    recipientClerkUserId: parentComment.clerkUserId,
                    senderClerkUserId: clerkUserId!,
                    type: NotificationType.COMMENT_POST,
                    relatedId: postId
                });
            }
        } else {
            // Direct comment on post
            if (post.clerkUserId) {
                createAndSendNotification({
                    recipientClerkUserId: post.clerkUserId,
                    senderClerkUserId: clerkUserId!,
                    type: NotificationType.COMMENT_POST,
                    relatedId: postId
                });
            }
        }

        logger.info(`New comment added to post ${postId} by ${clerkUserId}`);

        // Fetch populated comment for real-time broadcast
        const populatedComment = await CommunityComment.findById(newComment._id)
            .populate('userId', 'username profilepicture fullname');

        // Real-time broadcast
        import('../../../shared/socket/socket').then(({ broadcastRealtimeEvent }) => {
            broadcastRealtimeEvent('community:comment', {
                postId,
                comment: populatedComment || newComment,
                clerkUserId
            });
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            data: newComment
        });
    } catch (error: any) {
        logger.error(`Error adding comment: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to add comment'
        });
    }
};
