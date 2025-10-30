import { Schema, model } from 'mongoose';
import { IPlan } from '../DTOs/PlansDTO';

const planSchema = new Schema<IPlan>(
    {
        userId: {
            type: Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
    }
);

const Plan = model<IPlan>('Plan', planSchema);
export default Plan;
