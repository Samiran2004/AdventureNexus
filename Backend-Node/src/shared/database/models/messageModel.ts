import mongoose, { Schema, Document, model } from 'mongoose';

export interface IMessage extends Document {
    senderClerkUserId: string;
    recipientClerkUserId: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        senderClerkUserId: { type: String, required: true, index: true },
        recipientClerkUserId: { type: String, required: true, index: true },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Message = model<IMessage>('Message', messageSchema);
export default Message;
