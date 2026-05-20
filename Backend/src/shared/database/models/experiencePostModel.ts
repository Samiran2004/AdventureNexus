import { Schema, model, Document } from 'mongoose';

export interface IExperiencePost extends Document {
    userId: Schema.Types.ObjectId;
    clerkUserId: string;
    title: string;
    description: string;
    location: string;
    images: string[];
    tags: string[];
    rating: number;
    likes: string[];       // Array of clerkUserIds
    saves: string[];       // Array of clerkUserIds
    commentsCount: number;
    viewCount: number;
    // User-provided trip insights
    estimatedCost: string;
    currency: string;
    difficultyLevel: string;
    crowdType: string;
    createdAt: Date;
    updatedAt: Date;
}

const experiencePostSchema = new Schema<IExperiencePost>({
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
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        index: true,
    },
    images: [{
        type: String,
    }],
    tags: [{
        type: String,
        index: true,
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
    },
    likes: [{
        type: String, // Clerk User IDs
    }],
    saves: [{
        type: String, // Clerk User IDs
    }],
    commentsCount: {
        type: Number,
        default: 0,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    // User-provided trip insight fields
    estimatedCost: {
        type: String,
        default: '',
    },
    currency: {
        type: String,
        enum: ['₹', '$', '€', '£'],
        default: '₹',
    },
    difficultyLevel: {
        type: String,
        enum: ['Easy', 'Moderate', 'Hard'],
        default: 'Easy',
    },
    crowdType: {
        type: String,
        enum: ['Solo', 'Couple', 'Group', 'Family'],
        default: 'Solo',
    },
}, { timestamps: true });

// Text index for search
experiencePostSchema.index({ title: 'text', location: 'text', tags: 'text' });

const ExperiencePost = model<IExperiencePost>('ExperiencePost', experiencePostSchema);
export default ExperiencePost;
