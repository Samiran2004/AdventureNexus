import { Request, Response } from 'express';
import Group from '../../../shared/database/models/groupModel';
import GroupMembership from '../../../shared/database/models/groupMembershipModel';
import User from '../../../shared/database/models/userModel';
import mongoose from 'mongoose';

export const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, privacy } = req.body;
        const clerkUserId = (req as any).user.id; // From Clerk auth middleware

        const user = await User.findOne({ clerkUserId });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const newGroup = await Group.create({
            creatorId: user._id,
            name,
            privacy: privacy || 'PUBLIC',
            memberCount: 1 // Creator is the first member
        });

        await GroupMembership.create({
            groupId: newGroup._id,
            userId: user._id,
            role: 'ADMIN'
        });

        res.status(201).json({ success: true, group: newGroup });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getMyGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const clerkUserId = (req as any).user.id;
        const user = await User.findOne({ clerkUserId });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const memberships = await GroupMembership.find({ userId: user._id }).populate('groupId');
        const groups = memberships.map(m => m.groupId);

        res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error('Error fetching my groups:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const joinGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.params;
        const clerkUserId = (req as any).user.id;

        const user = await User.findOne({ clerkUserId });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).json({ success: false, message: 'Group not found' });
            return;
        }

        const existingMembership = await GroupMembership.findOne({ groupId, userId: user._id });
        if (existingMembership) {
            res.status(400).json({ success: false, message: 'Already a member' });
            return;
        }

        if (group.privacy === 'PRIVATE') {
            await Group.findByIdAndUpdate(groupId, { $addToSet: { pendingRequests: user._id } });
            res.status(200).json({ success: true, message: 'Request sent to join private group' });
            return;
        }

        await GroupMembership.create({
            groupId: group._id,
            userId: user._id,
            role: 'MEMBER'
        });

        await Group.findByIdAndUpdate(groupId, { $inc: { memberCount: 1 } });

        res.status(200).json({ success: true, message: 'Successfully joined group' });
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
