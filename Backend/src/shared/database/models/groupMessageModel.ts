import { Schema, model, Document } from 'mongoose';

export interface IGroupMessage extends Document {
    groupId: Schema.Types.ObjectId;
    sender: Schema.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const groupMessageSchema = new Schema<IGroupMessage>({
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const GroupMessage = model<IGroupMessage>('GroupMessage', groupMessageSchema);
export default GroupMessage;
