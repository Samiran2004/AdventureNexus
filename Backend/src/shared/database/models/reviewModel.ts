import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String, // Keeping as String for backward compatibility (Clerk ID)
        required: true,
        index: true
    },
    // Explicit Clerk ID field for clarity/future migration
    clerkUserId: {
        type: String,
        required: false, // Optional for old records, required for new
        index: true
    },
    // Link review to a specific Trip/Plan
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: false
    },
    userName: {
        type: String,
        required: true
    },
    userAvatar: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    tripType: {
        type: String,
        enum: ['solo', 'family', 'couple', 'adventure', 'cultural', 'business', 'nature'],
        required: true
    },
    tripDuration: {
        type: String,
        required: true
    },
    travelers: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    images: [{
        type: String // URLs
    }],
    helpfulCount: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
