import mongoose, { Document, Schema, model } from 'mongoose'; // Mongoose for MongoDB modeling

// User Interface Definition
export interface IUser extends Document {
    clerkUserId: string; // ID from Clerk Authentication
    email: string;      // User's email address
    firstName?: string; // Optional first name
    lastName?: string;  // Optional last name
    username?: string;  // Unique username
    profilepicture?: string; // URL to profile picture
    phonenumber?: number; // Contact number
    fullname?: string;    // Full name (derived or stored)
    role: string;         // User role (e.g., user, admin)
    gender?: string;      // Gender
    country?: string;     // User's country
    preferences?: string[]; // Travel preferences (e.g., 'adventure', 'luxury')
    plans?: string[];       // Array of Plan IDs created by the user
    createdAt: Date;        // Timestamp
    updatedAt: Date;        // Timestamp
}

// Enum for Gender
enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
}

// User Schema Definition
const userSchema = new Schema<IUser>(
    {
        clerkUserId: {
            type: String,
            required: true,
            unique: true, // Ensures one account per Clerk ID
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures email uniqueness
            lowercase: true,
            trim: true
        },
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        username: { type: String, unique: true, sparse: true, trim: true }, // Sparse allows nulls to be unique-ish (ignored)
        profilepicture: { type: String, default: "" },
        phonenumber: {
            type: Number,
            validate: {
                validator: function (v: number) {
                    // Check if value is null OR exactly 10 digits
                    return v == null || /^\d{10}$/.test(v.toString());
                },
                message: 'Phone number must be exactly 10 digits'
            },
            default: null
        },
        fullname: { type: String, default: "" },
        role: {
            type: String,
            enum: ['user', 'admin'], // Restrict to specific roles
            default: 'user',
        },
        gender: {
            type: String,
            enum: Object.values(Gender),
        },
        country: { type: String, default: "" },
        preferences: {
            type: [String],
            default: [],
        },
        plans: [
            {
                type: mongoose.Schema.Types.ObjectId, // Reference to 'Plan' model
                ref: 'Plan',
            },
        ],
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

// Middleware: Handle Duplicate Key Errors (e.g., Email or Username already exists)
userSchema.post('save', function (error: any, doc: any, next: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern.clerkUserId) {
            next(new Error('User with this Clerk ID already exists'));
        } else if (error.keyPattern.username) {
            next(new Error('Username already taken'));
            next(new Error('Phone number already registered'));
        } else {
            next(new Error('Duplicate field error'));
        }
    } else {
        next(error);
    }
});

const User = model<IUser>('User', userSchema);
export default User;
