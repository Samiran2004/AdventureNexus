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
        trim: true,
    }],
    likes: [{
        type: String, // Array of Clerk User IDs
    }],
    repliesCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const CommunityPost = model<ICommunityPost>('CommunityPost', communityPostSchema);
export default CommunityPost;
