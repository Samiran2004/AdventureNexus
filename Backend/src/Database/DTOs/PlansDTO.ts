import { Document } from "mongoose";

export interface IPlan extends Document {
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
