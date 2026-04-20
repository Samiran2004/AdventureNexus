import mongoose, { Document, Schema, model } from 'mongoose';

export interface ICommunityEvent extends Document {
    title: string;
    description: string;
    date: Date;
    type: 'Webinar' | 'In-Person';
    location?: string;
    attendees: string[]; // clerkUserIds
    imageUrl?: string;
    createdAt: Date;
}

const communityEventSchema = new Schema<ICommunityEvent>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        type: { type: String, enum: ['Webinar', 'In-Person'], default: 'Webinar' },
        location: { type: String },
        attendees: [{ type: String }],
        imageUrl: { type: String }
    },
    { timestamps: true }
);

const CommunityEvent = model<ICommunityEvent>('CommunityEvent', communityEventSchema);
export default CommunityEvent;
