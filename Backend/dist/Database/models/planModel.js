"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planSchema = new mongoose_1.Schema({
    userId: {
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
    }
}, {
    timestamps: true,
});
const Plan = (0, mongoose_1.model)('Plan', planSchema);
exports.default = Plan;
