"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHotelSearchPrompt = void 0;
const generateHotelSearchPrompt = (data) => {
    return `
        Act as a travel expert. Generate a JSON array of 5 recommended hotels in ${data.destination}.
        The recommendations should be tailored for a ${data.duration} trip with a ${data.budget} budget,
        focusing on interests.

        Each hotel object in the JSON array must include the following fields:
        - hotel_name: The official name of the hotel.
        - description: A short, compelling summary (2 sentences max).
        - average_price_per_night: An estimated integer price in ${data.currency_code} for a standard room.
        - rating: A float number out of 5.
        - amenities: A string array of key amenities relevant to the user's interests.
        - location_description: A brief description of the hotel's location and nearby attractions.
        - available_rooms: An array of 2-3 objects, each representing a room type with a "room_type" (e.g., "Deluxe King") and its "price_per_night" as an integer.
        - recent_review: An object with "reviewer_name", a "rating" out of 5, and a short "comment".

        The output must be only the valid JSON array and nothing else.

        Example JSON output:
        [
          {
            "hotel_name": "The Grand Harborview",
            "description": "A luxury hotel offering stunning ocean views and direct beach access, perfect for a relaxing getaway.",
            "average_price_per_night": 25000,
            "rating": 4.8,
            "amenities": ["Private Beach", "Infinity Pool", "Spa", "Rooftop Bar"],
            "location_description": "Located directly on Marina Beach, just a 10-minute walk from the city's main shopping district.",
            "available_rooms": [
              { "room_type": "Deluxe Queen", "price_per_night": 22000 },
              { "room_type": "Ocean View Suite", "price_per_night": 35000 }
            ],
            "recent_review": {
              "reviewer_name": "Priya S.",
              "rating": 5,
              "comment": "Absolutely breathtaking views and impeccable service. The pool is a highlight!"
            }
          }
        ]
    `;
};
exports.generateHotelSearchPrompt = generateHotelSearchPrompt;
