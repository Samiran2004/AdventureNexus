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
    ai_score: String, // Suitability score
    image_url: String, // Destination hero image
    name: String, // Plan/Trip Name
    days: Number, // Duration
    cost: Number, // Estimated cost
    star: Number, // Rating
    total_reviews: Number,
    destination_overview: String, // AI summary
    perfect_for: [String], // Target audience tags
    budget_breakdown: Object, // Detailed cost analysis
    trip_highlights: Array, // Key attractions
    suggested_itinerary: Array, // Day-by-day plan
    local_tips: [String], // Do's and Don'ts
}, { timestamps: true }); // Auto-manage createdAt/updatedAt


const Plan = model<IPlan>('Plan', planSchema);
export default Plan;
