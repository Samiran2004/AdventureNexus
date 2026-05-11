import { Request, Response } from 'express';
import Friendship, { FriendshipStatus } from '../../../shared/database/models/friendshipModel';
import User from '../../../shared/database/models/userModel';
import Notification, { NotificationType } from '../../../shared/database/models/notificationModel';
import { broadcastRealtimeEvent } from '../../../shared/socket/socket';

/**
 * Send a friend request
 * POST /api/social/friend-request
 */
export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        const { recipientClerkUserId } = req.body;
        const requesterClerkUserId = (req as any).user?.clerkUserId;

        if (!recipientClerkUserId || requesterClerkUserId === recipientClerkUserId) {
            return res.status(400).json({ success: false, message: 'Invalid recipient' });
        }

        // Check if already friends or request pending
        const existingFriendship = await Friendship.findOne({
            $or: [
                { requesterClerkUserId, recipientClerkUserId },
                { requesterClerkUserId: recipientClerkUserId, recipientClerkUserId: requesterClerkUserId }
            ]
        });

        if (existingFriendship) {
            return res.status(400).json({ success: false, message: 'Friendship already exists or request pending' });
        }

        const friendship = new Friendship({
            requesterClerkUserId,
            recipientClerkUserId,
            status: FriendshipStatus.PENDING
        });

        await friendship.save();

        // Create notification
        const notification = new Notification({
            recipientClerkUserId: recipientClerkUserId,
            senderClerkUserId: requesterClerkUserId,
            type: NotificationType.FRIEND_REQUEST,
            relatedId: friendship._id
        });
        await notification.save();

        // Broadcast real-time notification
        broadcastRealtimeEvent(recipientClerkUserId, 'notification:new', notification);

        return res.status(201).json({
            success: true,
            message: 'Friend request sent',
            data: friendship
        });
    } catch (error: any) {
        console.error('Error sending friend request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Accept a friend request
 * POST /api/social/accept-request
 */
export const acceptFriendRequest = async (req: Request, res: Response) => {
    try {
        const { friendshipId } = req.body;
        const userClerkUserId = (req as any).user?.clerkUserId;

        const friendship = await Friendship.findById(friendshipId);

        if (!friendship || friendship.recipientClerkUserId !== userClerkUserId) {
            return res.status(404).json({ success: false, message: 'Friend request not found' });
        }

        if (friendship.status !== FriendshipStatus.PENDING) {
            return res.status(400).json({ success: false, message: 'Request already processed' });
        }

        friendship.status = FriendshipStatus.ACCEPTED;
        await friendship.save();

        // Create notification for the requester
        const notification = new Notification({
            recipientClerkUserId: friendship.requesterClerkUserId,
            senderClerkUserId: userClerkUserId,
            type: NotificationType.FRIEND_ACCEPTED,
            relatedId: friendship._id
        });
        await notification.save();

        broadcastRealtimeEvent(friendship.requesterClerkUserId, 'notification:new', notification);

        return res.status(200).json({
            success: true,
            message: 'Friend request accepted',
            data: friendship
        });
    } catch (error: any) {
        console.error('Error accepting friend request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Get friend list
 * GET /api/social/friends
 */
export const getFriends = async (req: Request, res: Response) => {
    try {
        const userClerkUserId = (req as any).user?.clerkUserId;

        const friendships = await Friendship.find({
            $or: [{ requesterClerkUserId: userClerkUserId }, { recipientClerkUserId: userClerkUserId }],
            status: FriendshipStatus.ACCEPTED
        });

        const friendIds = friendships.map(f => 
            f.requesterClerkUserId === userClerkUserId ? f.recipientClerkUserId : f.requesterClerkUserId
        );

        const friends = await User.find({ clerkUserId: { $in: friendIds } })
            .select('clerkUserId username fullname profilepicture onlineStatus lastActive');

        return res.status(200).json({
            success: true,
            data: friends
        });
    } catch (error: any) {
        console.error('Error fetching friends:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
