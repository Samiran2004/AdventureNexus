import { Schema, model } from 'mongoose'; // Mongoose ODM
import { IPlan } from '../DTOs/PlansDTO'; // Plan Interface/DTO

/**
 * Plan Schema definition.
 * Stores all details related to a user's generated travel plan.
 */
const planSchema = new Schema<IPlan>({
    // Relationship with User Model
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    // Reference to Clerk User ID for quick lookups
    clerkUserId: {
        type: String,
        required: true,
        index: true,
    },
    // Core Trip Details
    to: { type: String, required: true }, // Destination
    from: { type: String, required: true }, // Origin
    date: { type: Date, required: true }, // Travel Date
    travelers: { type: Number, required: true }, // Pax count
    budget: { type: Number, required: true }, // Budget limit
    budget_range: String, // e.g. "Low", "Medium", "High"
    activities: [String], // User preferences for activities
    travel_style: String, // e.g. "Relaxed", "Adventure"

    // AI-Generated Rich Content
    ai_score: { type: Number, index: true }, // Changed from String to Number for sorting
    image_url: String,
    name: String,
    days: Number,
    cost: Number,
    star: Number,
    total_reviews: Number,
    destination_overview: String,
    perfect_for: [String],

    // Structured Budget
    budget_breakdown: {
        flights: Number,
        accommodation: Number,
        activities: Number,
        food: Number,
        total: Number,
        currency: { type: String, default: 'USD' }
    },

    // Structured Itinerary
    suggested_itinerary: [{
        day: Number,
        title: String,
        description: String,
        activities: [{
            name: String,
            cost: String,
            time: String,
            description: String
        }]
    }],

    trip_highlights: [String],
    local_tips: [String],
}, { timestamps: true });


const Plan = model<IPlan>('Plan', planSchema);
export default Plan;
