import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    clerkUserId: string; // Changed from _id to clerkUserId
    fullname?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    username?: string; // Made optional since Clerk might not always provide it
    phonenumber?: number; // Made optional
    gender?: 'male' | 'female' | 'other';
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
            // Remove unique constraint or use sparse index
            sparse: true, // This allows multiple null values
            index: true
        },
        phonenumber: {
            type: Number,
            default: null,
            sparse: true, // This allows multiple null values without duplicate key error
            validate: {
                validator: function(v: number) {
                    return v == null || /^\d{10}$/.test(v.toString());
                },
                message: 'Phone number must be exactly 10 digits'
            }
        },
        profilepicture: {
            type: String,
            default: function () {
                if (this.gender === 'male') {
                    return 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745';
                } else if (this.gender === 'female') {
                    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeIUUwf1GuV6YhA08a9haUQBOBRqJinQCJxA&s';
                }
                return null;
            },
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
