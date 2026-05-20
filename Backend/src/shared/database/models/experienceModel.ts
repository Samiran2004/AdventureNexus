import { Schema, model, Document } from 'mongoose';

export interface ISlot {
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    capacity: number;
    bookedCount: number;
}

export interface IExperience {
    title: string;
    location: string;
    description: string;
    image: string;
    category: string;
    basePrice: number;
    rating: number;
    reviewsCount: number;
    duration: string;
    groupSize: string;
    tags: string[];
    slots: ISlot[];
    host: {
        name: string;
        verified: boolean;
        avatar: string;
    };
    cancellationPolicy: string;
    riskLevel: 'Low' | 'Moderate' | 'High';
    ratingBreakdown: {
        cleanliness: number;
        communication: number;
        value: number;
    };
    compatPreferences: {
        pace: 'Slow' | 'Active';
        vibe: 'Thrill' | 'Culture' | 'Foodie' | 'Zen';
        budgetRange: 'Low' | 'Mid' | 'Luxury';
    };
}

export interface IExperienceDocument extends IExperience, Document {}

const slotSchema = new Schema<ISlot>({
    date: { type: String, required: true },
    time: { type: String, required: true },
    capacity: { type: Number, required: true },
    bookedCount: { type: Number, default: 0 }
});

const experienceSchema = new Schema<IExperienceDocument>({
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    basePrice: { type: Number, required: true },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 0 },
    duration: { type: String, required: true },
    groupSize: { type: String, required: true },
    tags: [{ type: String }],
    slots: [slotSchema],
    host: {
        name: { type: String, required: true },
        verified: { type: Boolean, default: false },
        avatar: { type: String }
    },
    cancellationPolicy: { type: String, default: 'Free cancellation up to 24 hours in advance' },
    riskLevel: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Low' },
    ratingBreakdown: {
        cleanliness: { type: Number, default: 5 },
        communication: { type: Number, default: 5 },
        value: { type: Number, default: 5 }
    },
    compatPreferences: {
        pace: { type: String, enum: ['Slow', 'Active'], required: true },
        vibe: { type: String, enum: ['Thrill', 'Culture', 'Foodie', 'Zen'], required: true },
        budgetRange: { type: String, enum: ['Low', 'Mid', 'Luxury'], required: true }
    }
}, { timestamps: true });

const Experience = model<IExperienceDocument>('Experience', experienceSchema);
export default Experience;
