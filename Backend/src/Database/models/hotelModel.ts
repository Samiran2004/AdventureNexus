import mongoose, { Schema } from "mongoose";
import { IHotel } from "../DTOs/HotelsDTO";

const hotelSchema: IHotel = new Schema<IHotel>({
    hotel_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Hotel", "Resort", "Apartment", "Villa", "Hostel"]
    },
    starRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        geo: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            }
        }
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    images: [
        {
            cloudinaryURL: {
                type: String
            },
            cloudinaryPublicId: {
                type: String
            }
        }
    ],
    amenities: [String],
    checkInTime: {
        type: String,
        default: '14:00'
    },
    checkOutTime: {
        type: String,
        default: "11:00"
    },
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            userName: {
                type: String
            },
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            comment: {
                type: String
            }
        }
    ]
}, {timestamps: true});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
