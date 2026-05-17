import { Schema, model } from 'mongoose';
import { IGroupMembership } from '../../dtos/CommunityDTO';

const groupMembershipSchema = new Schema<IGroupMembership>({
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['ADMIN', 'MODERATOR', 'MEMBER'], default: 'MEMBER' },
    joinedAt: { type: Date, default: Date.now }
}, { timestamps: false });

// Compound index for super-fast lookups on whether a user is in a group
groupMembershipSchema.index({ groupId: 1, userId: 1 }, { unique: true });

const GroupMembership = model<IGroupMembership>('GroupMembership', groupMembershipSchema);
export default GroupMembership;
