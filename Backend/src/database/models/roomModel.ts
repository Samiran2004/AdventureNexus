import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomType: {
        type: String,
        default: "Standard",
        enum: [
            "Standard", "Deluxe", "Suite", "Family", "Penthouse"
        ]
    },
    description: {
        type: String
    },
    pricePerNight: {
        type: Number
    },
    capacity: {
        adults: {
            type: Number,
            default: 1
        },
        children: {
            type: Number,
            default: 0
        }
    },
    amenities: [String],
    bookDates:[
        {
            from: {
                type: String
            },
            to: {
                type: String
            }
        }
    ],
    images: [
        {
            cloudinaryURL: {
                type: String
            },
            cloudinaryPublicId: {
                type: String
            }
        }
    ]
});

const Room = new mongoose.model('Room', roomSchema);
export default Room;
