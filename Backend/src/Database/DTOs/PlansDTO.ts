import { Date, Document, Schema } from "mongoose";
import { IFlight } from "./FlightsDTO";
import { IHotel } from "./HotelsDTO";

/**
 * Interface for Travel Plans.
 * Extends Mongoose Document.
 * Contains user input fields and AI-generated trip details.
 */
export interface IPlan extends Document {
    userId: Schema.Types.ObjectId; // Reference to local User ID
    clerkUserId: string;           // Reference to Clerk User ID
    to: string;                    // Destination
    from: string;                  // Origin
    date: Date;                    // Travel Date
    travelers: number;
    budget: string;
    budget_range?: string;
    activities?: string[];
    travel_style?: string;

    // AI generated Content Fields
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
    trip_highlights: Array<any>;   // Using Array<any> or specific type if known
    suggested_itinerary: Array<any>;
    local_tips: string[];
}
