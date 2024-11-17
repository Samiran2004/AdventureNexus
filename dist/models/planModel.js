"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    dispatch_city: {
        type: String,
        required: true,
    },
    budget: {
        type: String,
        enum: ['budget', 'mid-range', 'luxury'],
        default: 'budget',
    },
    total_people: {
        type: Number,
        required: true,
    },
    travel_dates: {
        start_date: {
            type: String,
            required: true,
        },
        end_date: {
            type: String,
            required: true,
        },
    },
    flights: [
        {
            airline: { type: String },
            flight_number: { type: String },
            departure_time: { type: String },
            arrival_time: { type: String },
            price: { type: String },
            class: { type: String },
            duration: { type: String },
        },
    ],
    hotels: [
        {
            hotel_name: { type: String },
            estimated_cost: { type: String },
            price_per_night: { type: String },
            address: { type: String },
            rating: { type: String },
            amenities: [{ type: String }],
            distance_to_city_center: { type: String },
        },
    ],
}, {
    timestamps: true,
});
const Plan = (0, mongoose_1.model)('Plan', planSchema);
exports.default = Plan;
