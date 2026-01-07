"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const Plan = (0, mongoose_1.model)('Plan', planSchema);
exports.default = Plan;
