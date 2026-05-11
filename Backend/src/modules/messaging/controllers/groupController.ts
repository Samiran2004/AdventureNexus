import { Request, Response } from 'express';
import Conversation from '../../../shared/database/models/conversationModel';
import { broadcastRealtimeEvent } from '../../../shared/socket/socket';

/**
 * Create a new group conversation
 * POST /api/messaging/group
 */
export const createGroup = async (req: Request, res: Response) => {
    try {
        const { groupName, participants, groupImage = "" } = req.body;
        const creatorClerkUserId = (req as any).user?.clerkUserId;

        if (!groupName || !participants || !Array.isArray(participants)) {
            return res.status(400).json({ success: false, message: 'Invalid group data' });
        }

        // Include creator in participants
        const allParticipants = Array.from(new Set([...participants, creatorClerkUserId]));

        const group = new Conversation({
            participants: allParticipants,
            isGroup: true,
            groupName,
            groupImage,
            admins: [creatorClerkUserId]
        });

        await group.save();

        // Notify all participants about the new group
        allParticipants.forEach(participantId => {
            broadcastRealtimeEvent(participantId, 'chat:group_created', group);
        });

        return res.status(201).json({
            success: true,
            data: group
        });
    } catch (error: any) {
        console.error('Error creating group:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Add members to a group
 * POST /api/messaging/group/add-members
 */
export const addMembers = async (req: Request, res: Response) => {
    try {
        const { conversationId, newParticipants } = req.body;
        const userClerkUserId = (req as any).user?.clerkUserId;

        const group = await Conversation.findById(conversationId);
        if (!group || !group.isGroup) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        if (!group.admins.includes(userClerkUserId)) {
            return res.status(403).json({ success: false, message: 'Only admins can add members' });
        }

        group.participants = Array.from(new Set([...group.participants, ...newParticipants]));
        await group.save();

        // Notify existing and new participants
        group.participants.forEach(participantId => {
            broadcastRealtimeEvent(participantId, 'chat:group_updated', group);
        });

        return res.status(200).json({
            success: true,
            data: group
        });
    } catch (error: any) {
        console.error('Error adding group members:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
