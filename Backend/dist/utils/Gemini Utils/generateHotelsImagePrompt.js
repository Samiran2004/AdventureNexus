"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHotelImage = void 0;
const generateHotelImage = (data) => {
    return `
    Act as a web search expert. Your task is to find the official website URL for the hotel specified below.

    Hotel Name: ${data.hotelName}
    Location: ${data.location}

    Return the result as a single JSON object with one key: "official_url".

    - If you find the official website, the value should be the full URL as a string.
    - If you cannot confidently determine the official website, the value should be null.

    Do not provide any other text, explanations, or notes. Only the JSON object.
    `;
};
exports.generateHotelImage = generateHotelImage;
