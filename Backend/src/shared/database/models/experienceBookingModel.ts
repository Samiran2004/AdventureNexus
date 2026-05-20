import { Schema, model, Document } from 'mongoose';

export interface IExperienceBooking {
    experienceId: Schema.Types.ObjectId;
    clerkUserId: string;
    slot: {
        date: string;
        time: string;
    };
    guestCount: number;
    guestNames: string[];
    basePriceAtBooking: number;
    finalPricePerPerson: number;
    totalPrice: number;
    splitDetails: {
        splitCount: number;
        pricePerPerson: number;
    };
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    paymentStatus: 'Pending' | 'Paid';
}

export interface IExperienceBookingDocument extends IExperienceBooking, Document {}

const experienceBookingSchema = new Schema<IExperienceBookingDocument>({
    experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
    clerkUserId: { type: String, required: true },
    slot: {
        date: { type: String, required: true },
        time: { type: String, required: true }
    },
    guestCount: { type: Number, required: true, default: 1 },
    guestNames: [{ type: String }],
    basePriceAtBooking: { type: Number, required: true },
    finalPricePerPerson: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    splitDetails: {
        splitCount: { type: Number, default: 1 },
        pricePerPerson: { type: Number, required: true }
    },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Paid' }
}, { timestamps: true });

const ExperienceBooking = model<IExperienceBookingDocument>('ExperienceBooking', experienceBookingSchema);
export default ExperienceBooking;
