import mongoose, { Schema, Document, model } from 'mongoose';

export enum NotificationType {
    LIKE_POST = 'like_post',
    LIKE_STORY = 'like_story',
    COMMENT_POST = 'comment_post',
    COMMENT_STORY = 'comment_story',
    FOLLOW = 'follow',
    MESSAGE = 'message',
}

export interface INotification extends Document {
    recipientClerkUserId: string;
    senderClerkUserId: string;
    type: NotificationType;
    relatedId?: string; // ID of post, story, or message
    isRead: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        recipientClerkUserId: { type: String, required: true, index: true },
        senderClerkUserId: { type: String, required: true },
        type: { type: String, enum: Object.values(NotificationType), required: true },
        relatedId: { type: String },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Notification = model<INotification>('Notification', notificationSchema);
export default Notification;
