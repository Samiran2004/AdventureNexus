import { Schema, model } from 'mongoose';
import { ICommunityPost } from '../../dtos/CommunityDTO';

/**
 * Community Post Schema definition.
 * Stores discussion posts created by users.
 */
const communityPostSchema = new Schema<ICommunityPost>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    clerkUserId: {
        type: String,
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    tags: [{
        type: String,
    }],
    destinationTags: [{
        type: String, // IDs or names of destinations from Kaggle dataset
    }],
    images: [{
        type: String, // URLs to images/videos
    }],
    tripId: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
    },
    likes: [{
        type: String, // Clerk User IDs
    }],
    interactionScore: {
        type: Number,
        default: 0,
        index: true,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    repliesCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const CommunityPost = model<ICommunityPost>('CommunityPost', communityPostSchema);
export default CommunityPost;
