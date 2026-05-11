import mongoose, { Schema, Document, model } from 'mongoose';

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    senderClerkUserId: string;
    content: string; // text or file URL
    type: 'text' | 'image' | 'file';
    status: 'sent' | 'delivered' | 'seen';
    seenBy: string[]; // clerkUserIds
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
        senderClerkUserId: { type: String, required: true, index: true },
        content: { type: String, required: true },
        type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
        status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' },
        seenBy: [{ type: String }],
    },
    { timestamps: true }
);

const Message = model<IMessage>('Message', messageSchema);
export default Message;
