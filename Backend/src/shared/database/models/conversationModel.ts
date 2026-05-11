import mongoose, { Schema, Document, model } from 'mongoose';

export interface IConversation extends Document {
    participants: string[]; // clerkUserIds
    isGroup: boolean;
    groupName?: string;
    groupImage?: string;
    admins: string[]; // clerkUserIds
    lastMessage?: mongoose.Types.ObjectId; // Reference to Message model
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        participants: [{ type: String, required: true, index: true }],
        isGroup: { type: Boolean, default: false },
        groupName: { type: String, trim: true },
        groupImage: { type: String, default: "" },
        admins: [{ type: String }],
        lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    },
    { timestamps: true }
);

const Conversation = model<IConversation>('Conversation', conversationSchema);
export default Conversation;
