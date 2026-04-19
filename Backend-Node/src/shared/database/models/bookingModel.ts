import { Schema, model, Document } from 'mongoose';
import { IBooking } from '../dtos/BookingDTO';

export interface IBookingDocument extends IBooking, Document { }

const bookingSchema = new Schema<IBookingDocument>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clerkUserId: { type: String, required: true },
    type: { type: String, enum: ['Flight', 'Hotel'], required: true },
    referenceId: { type: Schema.Types.ObjectId, required: true, refPath: 'type' },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    bookingDetails: { type: Schema.Types.Mixed },
    travelDates: {
        from: { type: Date },
        to: { type: Date }
    },
    paxCount: { type: Number, default: 1 }
}, { timestamps: true });

const Booking = model<IBookingDocument>('Booking', bookingSchema);
export default Booking;
