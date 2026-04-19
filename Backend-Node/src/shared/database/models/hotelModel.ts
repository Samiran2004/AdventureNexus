import mongoose, { Schema } from "mongoose"; // Mongoose ODM
import { IHotel } from "../DTOs/HotelsDTO"; // Hotel Interface

/**
 * Hotel Schema Definition.
 * Represents a hotel entity with details, location, and metadata.
 */
const hotelSchema: IHotel = new Schema<IHotel>({
    // Basic Info
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
        required: true
    },
    starRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // Detailed Location Data
    location: {
        address: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        zipCode: {
            type: String
        },
        // GeoJSON for spatial queries
        geo: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [Longitude, Latitude]
                index: '2dsphere' // Geospatial Index
            }
        }
    },
    // Reference to Contact Info (if separate)
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    // Media (Cloudinary)
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
    amenities: {
        type: [String],
        default: []
    },
    // Policies
    checkInTime: {
        type: String,
        default: '14:00'
    },
    checkOutTime: {
        type: String,
        default: "11:00"
    },
    // Sub-documents / References
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
