import { Schema, model } from 'mongoose';
import { IPlan } from '../DTOs/PlansDTO';

const planSchema = new Schema<IPlan>({
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
    to: { type: String, required: true },
    from: { type: String, required: true },
    date: { type: Date, required: true },
    travelers: { type: Number, required: true },
    budget: { type: Number, required: true },
    budget_range: String,
    activities: [String],
    travel_style: String,

    // AI generated
    ai_score: String,
    image_url: String,
    name: String,
    days: Number,
    cost: Number,
    star: Number,
    total_reviews: Number,
    destination_overview: String,
    perfect_for: [String],
    budget_breakdown: Object,
    trip_highlights: Array,
    suggested_itinerary: Array,
    local_tips: [String],
}, { timestamps: true });


const Plan = model<IPlan>('Plan', planSchema);
export default Plan;
