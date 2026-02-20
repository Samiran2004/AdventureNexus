import mongoose, { Schema, Document, model } from 'mongoose';

export interface ITravelStory extends Document {
    userId: mongoose.Types.ObjectId;
    clerkUserId: string;
    title: string;
    content: string;
    location: string;
    images: string[];
    likes: string[]; // Clerk User IDs
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const travelStorySchema = new Schema<ITravelStory>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        clerkUserId: { type: String, required: true, index: true },
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        location: { type: String, required: true },
        images: [{ type: String }],
        likes: [{ type: String, ref: 'User' }],
        commentsCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Populate user details when finding stories
travelStorySchema.pre(/^find/, function () {
    this.populate({
        path: 'userId',
        select: 'username profilepicture fullname email',
    });
});

const TravelStory = model<ITravelStory>('TravelStory', travelStorySchema);
export default TravelStory;
