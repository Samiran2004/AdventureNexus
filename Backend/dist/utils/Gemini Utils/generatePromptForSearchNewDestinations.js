"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateNewSearchDestinationPrompt = (data) => {
    const activitiesList = data.activities && data.activities.length > 0
        ? data.activities.join(", ")
        : "general sightseeing and local culture";
    const style = data.travel_style || "balanced";
    const budgetType = data.budget_range || "standard";
    return `
        Act as an expert travel planner. Create a detailed travel plan for a trip to **${data.to}** departing from **${data.from}**.
        
        **Trip Details:**
        - **Dates:** ${data.date}
        - **Travelers:** ${data.travelers} person(s)
        - **Total Budget:** ${data.budget} (${budgetType} tier)
        - **Travel Style:** ${style}
        - **Interests:** ${activitiesList}

        Generate a strictly formatted **JSON object**. 

        **IMPORTANT: IMAGE URL RULE**
        For the "image_url" field, do NOT try to find a real URL. Instead, construct a dynamic URL using this exact format:
        "https://image.pollinations.ai/prompt/scenic%20view%20of%20<DESTINATION_NAME>%20travel%20landmark%204k"
        (Replace <DESTINATION_NAME> with the actual city name, e.g., Tokyo).

        The JSON object must contain the following keys exactly:
        1. **ai_score**: An estimated match score (e.g., "98%").
        2. **image_url**: The dynamic URL constructed using the rule above.
        3. **name**: The destination name (e.g., "Tokyo, Japan").
        4. **days**: Recommended duration (e.g., 7).
        5. **cost**: Total estimated cost per person in Indian Rupees (INR).
        6. **star**: Average rating (e.g., 4.8).
        7. **total_reviews**: Estimated number of reviews (e.g., 342).
        8. **destination_overview**: A concise summary of the vibe.
        9. **perfect_for**: An array of strings describing the trip type (e.g., ["Culture", "Food"]).
        10. **budget_breakdown**: Object with costs for "flights", "accommodation", "food", "activities".
        11. **trip_highlights**: Array of objects with "name", "description", and "match_reason".
        12. **suggested_itinerary**: Array of day objects with "morning", "afternoon", "evening".
        13. **local_tips**: Array of string tips.

        **Rules:**
        - Return **ONLY** the valid JSON object. Do not include markdown formatting (like \`\`\`json) or extra text.
        - Ensure all prices are realistic estimates in INR.

        **Example Output Format:**
        {
            "ai_score": "98%",
            "image_url": "https://image.pollinations.ai/prompt/scenic%20view%20of%20Tokyo%20travel%20landmark%204k",
            "name": "Tokyo, Japan",
            "days": 7,
            "cost": 150000,
            "star": 4.8,
            "total_reviews": 567,
            "destination_overview": "Tokyo is a vibrant mix of traditional culture and neon-lit modernity...",
            "perfect_for": ["Culture", "Food", "Shopping"],
            "budget_breakdown": {
                "flights": "Approx 40% of budget",
                "accommodation": "Approx 30% of budget",
                "food": "Approx 15% of budget",
                "activities": "Approx 15% of budget"
            },
            "trip_highlights": [
                { "name": "Senso-ji Temple", "description": "Ancient Buddhist temple...", "match_reason": "Culture" }
            ],
            "suggested_itinerary": [
                {
                    "day": 1,
                    "morning": "Arrival and check-in at Shinjuku.",
                    "afternoon": "Explore Gyoen National Garden.",
                    "evening": "Dinner at Omoide Yokocho."
                }
            ],
            "local_tips": ["Carry cash as some small shops don't take cards.", "Trains stop around midnight."]
        }
    `;
};
exports.default = generateNewSearchDestinationPrompt;
