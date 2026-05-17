import { Request, Response } from 'express';
import User from '../../../shared/database/models/userModel';
import Plan from '../../../shared/database/models/planModel';

/**
 * Search users by username or display name
 * GET /api/social/search?q=...
 */
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        const searchQuery = q.trim();
        
        // Find users with matching username or fullname (display name)
        // Case-insensitive partial match
        const users = await User.find({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } },
                { fullname: { $regex: searchQuery, $options: 'i' } }
            ]
        })
        .select('clerkUserId username fullname profilepicture bio followersCount followingCount')
        .limit(20);

        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error: any) {
        console.error('Error searching users:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Get user profile by username
 * GET /api/social/profile/:username
 */
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .select('-email -phonenumber'); // Exclude sensitive info

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Calculate dynamic stats
        const tripsCount = await Plan.countDocuments({ clerkUserId: user.clerkUserId });

        // Add to the response
        const userProfileData = user.toObject();
        userProfileData.tripsCount = tripsCount;

        return res.status(200).json({
            success: true,
            data: userProfileData
        });
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Toggle follow/unfollow user
 * POST /api/social/follow/:targetId
 */
export const toggleFollow = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.auth()?.userId;
        const targetUserId = req.params.targetId;

        if (!currentUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (currentUserId === targetUserId) {
            return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
        }

        const currentUser = await User.findOne({ clerkUserId: currentUserId });
        const targetUser = await User.findOne({ clerkUserId: targetUserId });

        if (!currentUser || !targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isFollowing = currentUser.following?.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following?.filter(id => id !== targetUserId);
            targetUser.followers = targetUser.followers?.filter(id => id !== currentUserId);
        } else {
            // Follow
            currentUser.following?.push(targetUserId);
            targetUser.followers?.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({
            success: true,
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            isFollowing: !isFollowing
        });
    } catch (error: any) {
        console.error('Error toggling follow:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
