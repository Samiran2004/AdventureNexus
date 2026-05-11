import { Request, Response } from 'express';
import User from '../../../shared/database/models/userModel';

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

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
