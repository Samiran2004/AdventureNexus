import { Schema, model } from 'mongoose';
import { ICommunityComment } from '../../dtos/CommunityDTO';

/**
 * Community Comment Schema definition.
 * Stores replies to community posts.
 */
const communityCommentSchema = new Schema<ICommunityComment>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'CommunityPost',
        required: true,
        index: true,
    },
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
    content: {
        type: String,
        required: true,
    },
    likes: [{
        type: String, // Array of Clerk User IDs
    }],
}, { timestamps: true });

const CommunityComment = model<ICommunityComment>('CommunityComment', communityCommentSchema);
export default CommunityComment;
