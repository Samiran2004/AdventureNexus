import { Request, Response } from 'express';
import Group from '../../../shared/database/models/groupModel';
import GroupMembership from '../../../shared/database/models/groupMembershipModel';
import User from '../../../shared/database/models/userModel';
import mongoose from 'mongoose';

export const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, privacy } = req.body;
        const userId = (req as any).user._id;

        const newGroup = await Group.create({
            creatorId: userId,
            name,
            privacy: privacy || 'PUBLIC',
            memberCount: 1 // Creator is the first member
        });

        await GroupMembership.create({
            groupId: newGroup._id,
            userId: userId,
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
        const userId = (req as any).user._id;

        const memberships = await GroupMembership.find({ userId }).populate('groupId');
        const groups = memberships.map(m => m.groupId).filter(Boolean);

        res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error('Error fetching my groups:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const joinGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.params;
        const userId = (req as any).user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).json({ success: false, message: 'Group not found' });
            return;
        }

        const existingMembership = await GroupMembership.findOne({ groupId, userId });
        if (existingMembership) {
            res.status(400).json({ success: false, message: 'Already a member' });
            return;
        }

        if (group.privacy === 'PRIVATE') {
            await Group.findByIdAndUpdate(groupId, { $addToSet: { pendingRequests: userId } });
            res.status(200).json({ success: true, message: 'Request sent to join private group' });
            return;
        }

        await GroupMembership.create({
            groupId: group._id,
            userId: userId,
            role: 'MEMBER'
        });

        await Group.findByIdAndUpdate(groupId, { $inc: { memberCount: 1 } });

        res.status(200).json({ success: true, message: 'Successfully joined group' });
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
