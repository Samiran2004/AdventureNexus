import { Date, Document, Schema } from "mongoose";
import { IFlight } from "./FlightsDTO";
import { IHotel } from "./HotelsDTO";

export interface IPlan extends Document {
    userId: Schema.Types.ObjectId;
    clerkUserId: string;
    to: string;
    from: string;
    date: Date;
    travelers: number;
    budget: string;
    budget_range?: string;
    activities?: string[];
    travel_style?: string;

    // AI generated
    ai_score: string;
    image_url: string;
    name: string;
    days: number;
    cost: number;
    star: number;
    total_reviews: number;
    destination_overview: string;
    perfect_for: string[];
    budget_breakdown: Object;
    trip_highlights: Array;
    suggested_itinerary: Array;
    local_tips: string[];
}
