import { Request, Response } from 'express';
import GroupMessage from '../../../shared/database/models/groupMessageModel';
import Group from '../../../shared/database/models/groupModel';
import GroupMembership from '../../../shared/database/models/groupMembershipModel';
import { sendRealtimeGroupMessage } from '../../../shared/socket/socket';

export const getGroupMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.params;
        const userId = (req as any).user._id;

        // Verify if group exists
        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).json({ success: false, message: 'Group not found' });
            return;
        }

        // Verify if user is a member
        const isMember = await GroupMembership.findOne({ groupId, userId });
        if (!isMember) {
            res.status(403).json({ success: false, message: 'You must be a member of this group to view messages' });
            return;
        }

        // Fetch last 100 messages
        const messages = await GroupMessage.find({ groupId })
            .sort({ createdAt: 1 })
            .limit(100)
            .populate('sender', 'username profilepicture');

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching group messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const sendGroupMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.params;
        const { content } = req.body;
        const userId = (req as any).user._id;

        if (!content || !content.trim()) {
            res.status(400).json({ success: false, message: 'Message content is required' });
            return;
        }

        // Verify group exists
        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).json({ success: false, message: 'Group not found' });
            return;
        }

        // Verify if user is a member
        const isMember = await GroupMembership.findOne({ groupId, userId });
        if (!isMember) {
            res.status(403).json({ success: false, message: 'You must be a member of this group to send messages' });
            return;
        }

        // Save message
        const newMessage = await GroupMessage.create({
            groupId,
            sender: userId,
            content: content.trim()
        });

        // Populate sender info
        const populatedMessage = await GroupMessage.findById(newMessage._id)
            .populate('sender', 'username profilepicture');

        // Broadcast to group members in real-time
        sendRealtimeGroupMessage(groupId, populatedMessage);

        res.status(201).json({ success: true, message: populatedMessage });
    } catch (error) {
        console.error('Error sending group message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
