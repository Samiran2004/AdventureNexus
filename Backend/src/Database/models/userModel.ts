import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    fullname: string;
    email: string;
    password: string;
    username: string;
    phonenumber: number;
    gender: 'male' | 'female' | 'other';
    profilepicture: string;
    preferences: string[];
    country?: string; // Optional if it may not be provided
    createdat: Date;
    refreshtoken?: string; // Optional if it may not be provided
    currency_code?: string; // Optional if it may not be provided
    recommendationhistory: Schema.Types.ObjectId[]; // Array of ObjectId references
    plans: Schema.Types.ObjectId[]; // Array of ObjectId references
}

const userSchema = new Schema<IUser>(
    {
        _id: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        phonenumber: {
            type: Number,
            unique: true,
            minlength: [10, 'Phone number must be 10 digits long'],
            maxlength: [10, 'Phone number must be 10 digits long'],
            match: [/^\d{10}$/, 'Phone number must contain exactly 10 digits'],
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        profilepicture: {
            type: String,
            default: function () {
                return this.gender === 'male'
                    ? 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeIUUwf1GuV6YhA08a9haUQBOBRqJinQCJxA&s';
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
            default: ['relaxation', 'nature', 'beach'],
        },
        country: {
            type: String,
            default: undefined, // Optional
        },
        createdat: {
            type: Date,
            default: Date.now,
        },
        refreshtoken: {
            type: String,
            default: undefined, // Optional
        },
        currency_code: {
            type: String,
            default: undefined, // Optional
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

const User = model<IUser>('User', userSchema);
export default User;
