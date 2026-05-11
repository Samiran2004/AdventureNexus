import mongoose, { Schema, Document, model } from 'mongoose';

export enum FriendshipStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export interface IFriendship extends Document {
    requesterClerkUserId: string;
    recipientClerkUserId: string;
    status: FriendshipStatus;
    createdAt: Date;
    updatedAt: Date;
}

const friendshipSchema = new Schema<IFriendship>(
    {
        requesterClerkUserId: { type: String, required: true, index: true },
        recipientClerkUserId: { type: String, required: true, index: true },
        status: {
            type: String,
            enum: Object.values(FriendshipStatus),
            default: FriendshipStatus.PENDING,
        },
    },
    { timestamps: true }
);

// Ensure unique friendship between two users regardless of who is requester
friendshipSchema.index({ requesterClerkUserId: 1, recipientClerkUserId: 1 }, { unique: true });

const Friendship = model<IFriendship>('Friendship', friendshipSchema);
export default Friendship;
