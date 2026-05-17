import { Schema, model } from 'mongoose';
import { IGroup } from '../../dtos/CommunityDTO';

const groupSchema = new Schema<IGroup>({
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    privacy: { type: String, enum: ['PUBLIC', 'PRIVATE', 'HIDDEN'], default: 'PUBLIC' },
    memberCount: { type: Number, default: 0 },
    pendingRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Group = model<IGroup>('Group', groupSchema);
export default Group;
