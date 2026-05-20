import { Schema, model, Document } from 'mongoose';

export interface IExperienceComment extends Document {
    postId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    clerkUserId: string;
    content: string;
    parentId: Schema.Types.ObjectId | null;
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const experienceCommentSchema = new Schema<IExperienceComment>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'ExperiencePost',
        required: true,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    clerkUserId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'ExperienceComment',
        default: null,
    },
    likes: [{
        type: String,
    }],
}, { timestamps: true });

const ExperienceComment = model<IExperienceComment>('ExperienceComment', experienceCommentSchema);
export default ExperienceComment;
