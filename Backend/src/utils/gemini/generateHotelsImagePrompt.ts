/**
 * Generates an AI Prompt to find an official website URL for a hotel.
 * This URL is meant to be used (or scrapped) to find images, though the prompt asks for 'official_url'.
 */
export const generateHotelImage = (data) => {
    return `
    Act as a web search expert. Your task is to find the official website URL for the hotel specified below.

    Hotel Name: ${data.hotelName}
    Location: ${data.location}

    Return the result as a single JSON object with one key: "official_url".

    - If you find the official website, the value should be the full URL as a string.
    - If you cannot confidently determine the official website, the value should be null.

    Do not provide any other text, explanations, or notes. Only the JSON object.
    `
}
