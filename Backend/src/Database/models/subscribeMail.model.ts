import { model, Schema, Document } from "mongoose"; // Mongoose ODM

// Interface for Subscription Document
export interface ISubscribe extends Document {
    userMail: string; // Subscriber's email
}

// Subscription Schema
const subscribeMailSchema = new Schema<ISubscribe>({
    userMail: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate subscriptions
        trim: true,
        lowercase: true // Normalize email
    }
}, { timestamps: true }); // Auto-timestamps

// Export Subscription Model
const SubscribeMail = model<ISubscribe>("SubscribeMail", subscribeMailSchema);
export default SubscribeMail;