export interface SearchNewDestinationPromptData {
    to: string;
    from: string;
    date: string;
    travelers: number;
    budget: number;
    budget_range?: string[];
    activities?: string[];
    travel_style?: string;
    duration?: number;
}

/**
 * Generates a highly detailed AI prompt for creating a custom Travel Plan.
 * Includes specific instructions for AI to generate dynamic image URLs via Pollinations.ai.
 * Formats the output as a strict JSON object with detailed trip breakdown.
 */
const generateNewSearchDestinationPrompt = (data: SearchNewDestinationPromptData): string => {
    const activitiesList = data.activities && data.activities.length > 0
        ? data.activities.join(", ")
        : "general sightseeing and local culture";

    const style = data.travel_style || "balanced";
    const budgetType = data.budget_range || "standard";
    const duration = data.duration ? `${data.duration} days` : "approximately 5-7 days";

    return `
        - **Total Budget:** ~${data.budget} INR (Target Upper Limit - ${budgetType} tier)
        - **Travel Style:** ${style}
        - **Interests:** ${activitiesList}

        Act as an expert travel planner. Create **3 DISTINCT** travel plan options for a trip to **${data.to}** (or nearby regions if ${data.to} is a country/broad region).
        
        Generate a strictly formatted **JSON Object** with a key "plans" containing exactly 3 objects.

        **IMPORTANT: BUDGET REALISM RULE**
        - The "cost" field MUST be a realistic estimate for the destination and duration, considering the origin (**${data.from}**) and destination (**${data.to}**).
        - **FLIGHTS/TRANSPORT:** You MUST include estimated flight or long-distance transport costs in the breakdown and total cost. For example, a trip to an island (Andaman, Maldives) or a distant country MUST reflect current market rates for flights.
        - **REALISM TRUMPS BUDGET:** If the user's budget (${data.budget} INR) is too low for a realistic trip to that destination, you MUST provide the **ACTUAL MINIMUM REALISTIC COST** instead of trying to fit into the budget. It is better to be expensive and honest than cheap and impossible.
        - Example: A 5-day trip to Andaman from Kolkata rarely costs less than 25,000-30,000 INR per person including flights. Do NOT return a cost like 12,000 INR if it's impossible.

        **IMPORTANT: IMAGE URL RULE**
        For the "image_url" field, do NOT try to find a real URL. Instead, construct a dynamic URL using this exact format:
        "https://image.pollinations.ai/prompt/scenic%20view%20of%20<DESTINATION_NAME>%20travel%20landmark%204k"
        (Replace <DESTINATION_NAME> with the actual city name, e.g., Tokyo).
        
        **IMPORTANT: DURATION RULE**
        The plan MUST be for exactly **${data.duration || 7}** days. The "days" field and "suggested_itinerary" array length must match this number.

        **IMPORTANT: DIVERSITY RULE**
        - Each of the 3 plans must be slightly different (e.g., different focus, different specific location if applicable, or different itinerary vibe).
        - Ensure they aren't duplicates.

        The JSON Object must contain a "plans" key, which is an array of objects with the following keys:
        1. "ai_score": estimated match score as a string (e.g., "98%").
        2. "image_url": dynamic URL using the rule above.
        3. "name": destination name.
        4. "days": number (must be ${data.duration || 7}).
        5. "cost": estimated cost in INR.
        6. "star": number (e.g., 4.8).
        7. "total_reviews": number (e.g., 342).
        8. "destination_overview": string summary.
        9. "perfect_for": array of strings.
        10. "budget_breakdown": object with keys "flights", "accommodation", "food", "activities" (all numbers).
        11. "trip_highlights": array of objects with "name", "description", "match_reason", and "geo_coordinates" (object with "lat", "lng" as numbers).
        12. "suggested_itinerary": array of objects with "day" (number), "title", "description", "morning", "afternoon", "evening".
        13. "local_tips": array of strings.
        14. "hotel_options": array of 3 objects with "hotel_name", "description", "starRating", "amenities" (array), "category", "location" (object with "address", "city", "state", "country", "zipCode"), and "rooms" (array of 2 objects with "roomType", "pricePerNight", "amenities", "description", "capacity": {"adults": number, "children": number}).
        15. "flight_options": array of 3 objects with "airline", "flight_number", "departure_time", "arrival_time", "price", "class", "duration", "departure_airport", "arrival_airport".

        **Rules:**
        - Return **ONLY** the valid JSON Array. Do not include markdown formatting (like request \`\`\`json) or extra text.
        - Ensure all prices are realistic estimates in INR.

        **Example Output Format:**
        {
            "plans": [
                {
                    "ai_score": "98%",
                    "image_url": "...",
                    "name": "Tokyo, Japan",
                     ...
                }
            ]
        }
    `;
}

export default generateNewSearchDestinationPrompt;