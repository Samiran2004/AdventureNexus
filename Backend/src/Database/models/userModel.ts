import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    clerkUserId: string;
    fullname?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    username?: string;
    phonenumber?: number;
    profilepicture?: string;
    preferences?: string[];
    country?: string;
    createdat?: Date;
    refreshtoken?: string;
    currency_code?: string;
    recommendationhistory?: Schema.Types.ObjectId[];
    plans?: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
    {
        clerkUserId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        fullname: {
            type: String,
            default: null
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        firstName: {
            type: String,
            default: null,
            trim: true
        },
        lastName: {
            type: String,
            default: null,
            trim: true
        },
        password: {
            type: String,
            default: null
        },
        username: {
            type: String,
            default: null,
            trim: true,
            unique: true
        },
        phonenumber: {
            type: Number,
            validate: {
                validator: function(v: number) {
                    return v == null || /^\d{10}$/.test(v.toString());
                },
                message: 'Phone number must be exactly 10 digits'
            },
            required: false
        },
        profilepicture: {
            type: String,
            default: 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745' // Simple static default
        },
        preferences: {
            type: [String],
            enum: [
                'adventure',
                'relaxation',
                'culture',
                'nature',
                'beach',
                'mountains',
                'urban',
            ],
            default: []
        },
        country: {
            type: String,
            default: null
        },
        createdat: {
            type: Date,
            default: Date.now,
        },
        refreshtoken: {
            type: String,
            default: null
        },
        currency_code: {
            type: String,
            default: null
        },
        recommendationhistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Recommendations',
            },
        ],
        plans: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Plan',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Handle duplicate key errors
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern.clerkUserId) {
            next(new Error('User with this Clerk ID already exists'));
        } else if (error.keyPattern.username) {
            next(new Error('Username already taken'));
        } else if (error.keyPattern.phonenumber) {
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
