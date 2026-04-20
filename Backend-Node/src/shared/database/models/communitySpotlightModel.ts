import mongoose, { Document, Schema, model } from 'mongoose';

export interface ICommunitySpotlight extends Document {
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    link: string;
    isActive: boolean;
    createdAt: Date;
}

const communitySpotlightSchema = new Schema<ICommunitySpotlight>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        content: { type: String },
        imageUrl: { type: String, required: true },
        link: { type: String },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const CommunitySpotlight = model<ICommunitySpotlight>('CommunitySpotlight', communitySpotlightSchema);
export default CommunitySpotlight;
