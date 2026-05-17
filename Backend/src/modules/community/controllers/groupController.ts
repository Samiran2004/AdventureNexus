import { Request, Response } from 'express';
import Group from '../../../shared/database/models/groupModel';
import GroupMembership from '../../../shared/database/models/groupMembershipModel';
import User from '../../../shared/database/models/userModel';
import mongoose from 'mongoose';

export const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, coverImage, privacy } = req.body;
        const userId = (req as any).user._id;

        const isPrivate = privacy === 'PRIVATE';

        const newGroup = await Group.create({
            createdBy: userId,
            name,
            description,
            coverImage,
            privacy: privacy || 'PUBLIC',
            isPrivate,
            memberCount: 1,
            members: [userId],
            admins: [userId]
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

export const getGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const groups = await Group.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getGroupById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id).populate('createdBy', 'username profilepicture');
        if (!group) {
            res.status(404).json({ success: false, message: 'Group not found' });
            return;
        }
        res.status(200).json({ success: true, group });
    } catch (error) {
        console.error('Error fetching group details:', error);
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

        await Group.findByIdAndUpdate(groupId, { 
            $inc: { memberCount: 1 },
            $addToSet: { members: userId }
        });

        res.status(200).json({ success: true, message: 'Successfully joined group' });
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const leaveGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.params;
        const userId = (req as any).user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).json({ success: false, message: 'Group not found' });
            return;
        }

        const deletedMembership = await GroupMembership.findOneAndDelete({ groupId, userId });
        if (!deletedMembership) {
            res.status(400).json({ success: false, message: 'Not a member of this group' });
            return;
        }

        await Group.findByIdAndUpdate(groupId, {
            $inc: { memberCount: -1 },
            $pull: { members: userId, admins: userId }
        });

        res.status(200).json({ success: true, message: 'Successfully left group' });
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const addMemberToGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, username } = req.body;
        const adminUserId = (req as any).user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).json({ success: false, message: 'Group not found' });
            return;
        }

        // Check if requester is admin or creator
        const isAdmin = group.admins.some((a: any) => a.toString() === adminUserId.toString()) || group.createdBy.toString() === adminUserId.toString();
        if (!isAdmin) {
            res.status(403).json({ success: false, message: 'Only group admins can add members' });
            return;
        }

        const targetUser = await User.findOne({ username });
        if (!targetUser) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const existingMembership = await GroupMembership.findOne({ groupId, userId: targetUser._id });
        if (existingMembership) {
            res.status(400).json({ success: false, message: 'User is already a member of this group' });
            return;
        }

        await GroupMembership.create({
            groupId: group._id,
            userId: targetUser._id,
            role: 'MEMBER'
        });

        await Group.findByIdAndUpdate(groupId, {
            $inc: { memberCount: 1 },
            $addToSet: { members: targetUser._id }
        });

        res.status(200).json({ success: true, message: `Successfully added ${username} to the group` });
    } catch (error) {
        console.error('Error adding member to group:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const makeUserAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId, targetUserId } = req.body;
        const adminUserId = (req as any).user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).json({ success: false, message: 'Group not found' });
            return;
        }

        // Check if requester is admin or creator
        const isAdmin = group.admins.some((a: any) => a.toString() === adminUserId.toString()) || group.createdBy.toString() === adminUserId.toString();
        if (!isAdmin) {
            res.status(403).json({ success: false, message: 'Only group admins can promote other members' });
            return;
        }

        const targetMembership = await GroupMembership.findOne({ groupId, userId: targetUserId });
        if (!targetMembership) {
            res.status(400).json({ success: false, message: 'User is not a member of this group' });
            return;
        }

        targetMembership.role = 'ADMIN';
        await targetMembership.save();

        await Group.findByIdAndUpdate(groupId, {
            $addToSet: { admins: targetUserId }
        });

        res.status(200).json({ success: true, message: 'Successfully promoted user to Admin' });
    } catch (error) {
        console.error('Error promoting member to admin:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
