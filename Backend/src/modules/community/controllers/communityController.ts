import { Request, Response } from 'express';
import Community from '../../../shared/database/models/communityModel';
import User from '../../../shared/database/models/userModel';

export const getCommunities = async (req: Request, res: Response): Promise<void> => {
    try {
        const communities = await Community.find().sort({ followersCount: -1 });
        res.status(200).json({ success: true, communities });
    } catch (error) {
        console.error('Error fetching communities:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const joinCommunity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { communityId } = req.params;
        const clerkUserId = (req as any).user.id;

        const user = await User.findOne({ clerkUserId });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const community = await Community.findById(communityId);
        if (!community) {
            res.status(404).json({ success: false, message: 'Community not found' });
            return;
        }

        // Simplistic join implementation (you might want to track this in the User model)
        await Community.findByIdAndUpdate(communityId, { $inc: { followersCount: 1 } });

        res.status(200).json({ success: true, message: 'Successfully joined community' });
    } catch (error) {
        console.error('Error joining community:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
