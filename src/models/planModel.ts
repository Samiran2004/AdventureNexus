import { Schema, model, Document } from 'mongoose';

interface IFlight {
    airline: string;
    flight_number: string;
    departure_time: string;
    arrival_time: string;
    price: string;
    class: string;
    duration: string;
}

interface IHotel {
    hotel_name: string;
    estimated_cost: string;
    price_per_night: string;
    address: string;
    rating: string;
    amenities: string[];
    distance_to_city_center: string;
}

interface IPlan extends Document {
    user: Schema.Types.ObjectId;
    destination: string;
    dispatch_city: string;
    budget: 'budget' | 'mid-range' | 'luxury';
    total_people: number;
    travel_dates: {
        start_date: string;
        end_date: string;
    };
    flights: IFlight[];
    hotels: IHotel[];
}

const planSchema = new Schema<IPlan>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    dispatch_city: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        enum: ['budget', 'mid-range', 'luxury'],
        default: 'budget'
    },
    total_people: {
        type: Number,
        required: true
    },
    travel_dates: {
        start_date: {
            type: String,
            required: true
        },
        end_date: {
            type: String,
            required: true
        }
    },
    flights: [
        {
            airline: { type: String },
            flight_number: { type: String },
            departure_time: { type: String },
            arrival_time: { type: String },
            price: { type: String },
            class: { type: String },
            duration: { type: String }
        }
    ],
    hotels: [
        {
            hotel_name: { type: String },
            estimated_cost: { type: String },
            price_per_night: { type: String },
            address: { type: String },
            rating: { type: String },
            amenities: [{ type: String }],
            distance_to_city_center: { type: String }
        }
    ]
});

const Plan = model<IPlan>('Plan', planSchema);
export default Plan;