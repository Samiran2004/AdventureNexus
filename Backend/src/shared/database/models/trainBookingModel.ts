import { Schema, model, Document } from 'mongoose';

export interface ITrainBooking {
    clerkUserId: string;
    // Passenger Details
    passengerName: string;
    passengerAge: number;
    passengerGender: 'Male' | 'Female' | 'Other';
    // Train Details
    trainNumber: string;
    trainName: string;
    fromStation: string;
    fromStationCode: string;
    toStation: string;
    toStationCode: string;
    // Journey Details
    journeyDate: Date;
    departureTime: string;
    arrivalTime: string;
    seatClass: 'General' | 'Sleeper' | 'Second_AC' | 'Third_AC';
    // Booking Details
    pnrNumber: string;
    status: 'Confirmed' | 'Cancelled' | 'Waitlisted';
    fareAmount: number;
    passengersCount: number;
    // Metadata
    bookingDetails?: Record<string, any>;
    disclaimer: string;
}

export interface ITrainBookingDocument extends ITrainBooking, Document {}

const trainBookingSchema = new Schema<ITrainBookingDocument>(
    {
        clerkUserId: { type: String, required: true, index: true },
        passengerName: { type: String, required: true, trim: true, maxlength: 100 },
        passengerAge: { type: Number, required: true, min: 1, max: 120 },
        passengerGender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
        trainNumber: { type: String, required: true, trim: true },
        trainName: { type: String, required: true, trim: true },
        fromStation: { type: String, required: true, trim: true },
        fromStationCode: { type: String, required: true, trim: true, uppercase: true },
        toStation: { type: String, required: true, trim: true },
        toStationCode: { type: String, required: true, trim: true, uppercase: true },
        journeyDate: { type: Date, required: true },
        departureTime: { type: String, required: true },
        arrivalTime: { type: String, required: true },
        seatClass: {
            type: String,
            enum: ['General', 'Sleeper', 'Second_AC', 'Third_AC'],
            required: true,
            default: 'General'
        },
        pnrNumber: { type: String, required: true, unique: true, index: true },
        status: {
            type: String,
            enum: ['Confirmed', 'Cancelled', 'Waitlisted'],
            default: 'Confirmed'
        },
        fareAmount: { type: Number, required: true, min: 0 },
        passengersCount: { type: Number, required: true, default: 1, min: 1, max: 6 },
        bookingDetails: { type: Schema.Types.Mixed },
        disclaimer: {
            type: String,
            default: 'This is a demo booking for AdventureNexus. No actual IRCTC ticket has been issued.'
        }
    },
    { timestamps: true }
);

const TrainBooking = model<ITrainBookingDocument>('TrainBooking', trainBookingSchema);
export default TrainBooking;
