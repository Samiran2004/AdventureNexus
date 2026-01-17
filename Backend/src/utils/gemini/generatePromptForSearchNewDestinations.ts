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
        
        Generate a strictly formatted **JSON Array** containing exactly 3 objects.

        **IMPORTANT: BUDGET RULE**
        - The "cost" field MUST be a realistic estimate for the destination and duration.
        - Do NOT simply default to the Total Budget. If the trip can be done cheaper, show the cheaper price.
        - Example: A 3-day trip to a nearby city might only cost 5000-10000 INR, even if the user's budget is 45000. Provide the REALISTIC cost. 

        **IMPORTANT: IMAGE URL RULE**
        For the "image_url" field, do NOT try to find a real URL. Instead, construct a dynamic URL using this exact format:
        "https://image.pollinations.ai/prompt/scenic%20view%20of%20<DESTINATION_NAME>%20travel%20landmark%204k"
        (Replace <DESTINATION_NAME> with the actual city name, e.g., Tokyo).
        
        **IMPORTANT: DURATION RULE**
        The plan MUST be for exactly **${data.duration || 7}** days. The "days" field and "suggested_itinerary" array length must match this number.

        **IMPORTANT: DIVERSITY RULE**
        - Each of the 3 plans must be slightly different (e.g., different focus, different specific location if applicable, or different itinerary vibe).
        - Ensure they aren't duplicates.

        The JSON Array must contain objects with the following keys exactly:
        1. **ai_score**: An estimated match score (e.g., "98%").
        2. **image_url**: The dynamic URL constructed using the rule above.
        3. **name**: The destination name (e.g., "Tokyo, Japan").
        4. **days**: Recommended duration (must be ${data.duration || 7} if specified).
        5. **cost**: Total estimated cost per person in Indian Rupees (INR).
        6. **star**: Average rating (e.g., 4.8).
        7. **total_reviews**: Estimated number of reviews (e.g., 342).
        8. **destination_overview**: A concise summary of the vibe.
        9. **perfect_for**: An array of strings describing the trip type (e.g., ["Culture", "Food"]).
        10. **budget_breakdown**: Object with costs for "flights", "accommodation", "food", "activities".
        11. **trip_highlights**: Array of objects with "name", "description", "match_reason", and "geo_coordinates": {"lat": number, "lng": number}.
        12. **suggested_itinerary**: Array of day objects with "morning", "afternoon", "evening".
        13. **local_tips**: Array of string tips.

        **Rules:**
        - Return **ONLY** the valid JSON Array. Do not include markdown formatting (like request \`\`\`json) or extra text.
        - Ensure all prices are realistic estimates in INR.

        **Example Output Format:**
        [
            {
                "ai_score": "98%",
                "image_url": "...",
                "name": "Tokyo, Japan",
                 ...
            },
            {
                "ai_score": "95%",
                "image_url": "...",
                "name": "Kyoto, Japan",
                 ...
            }
        ]
    `;
}

export default generateNewSearchDestinationPrompt;