import { Schema } from "mongoose";

export interface IBooking {
    userId: Schema.Types.ObjectId;
    clerkUserId: string;
    type: 'Flight' | 'Hotel';
    referenceId: Schema.Types.ObjectId; // Ref to Flight or Hotel
    roomId?: Schema.Types.ObjectId; // Specific room if Hotel
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    totalPrice: number;
    currency: string;
    bookingDetails: any; // Dynamic details like seat number, etc.
    travelDates?: {
        from: Date;
        to: Date;
    };
    paxCount: number;
}
