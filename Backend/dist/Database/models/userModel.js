"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true
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
        default: undefined,
    },
    createdat: {
        type: Date,
        default: Date.now,
    },
    refreshtoken: {
        type: String,
        default: undefined,
    },
    currency_code: {
        type: String,
        default: undefined,
    },
    recommendationhistory: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Recommendations',
        },
    ],
    plans: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Plan',
        },
    ],
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
