export interface SearchNewDestinationPromptData {
    to: string;
    from: string;
    date: string;
    travelers: number;
    budget: number;
    budget_range?: string[];
    activities?: string[];
    travel_style?: string;
}

const generateNewSearchDestinationPrompt = (data: SearchNewDestinationPromptData): string => {
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

        Generate a strictly formatted **JSON object** containing the following details:

        1. **destination_overview**: A concise summary of the destination vibe and why it fits the user's interests.
        2. **budget_breakdown**: Estimated costs for "Flights" (from ${data.from}), "Accommodation", "Food", and "Activities" based on the total budget of ${data.budget}.
        3. **top_attractions**: An array of 3-5 top places to visit that match the user's interests.
        4. **suggested_itinerary**: An array of "Day" objects (assume a standard 3-5 day trip if duration isn't explicit in the date). Each day should have "morning", "afternoon", and "evening" activities.
        5. **local_tips**: A list of 2-3 practical tips (safety, transport, or etiquette).

        **Rules:**
        - Return **ONLY** the valid JSON object. Do not include markdown formatting (like \`\`\`json) or extra text.
        - Ensure all prices are realistic estimates.

        **Example Output Format:**
        {
            "ai score": "The score of ai" e.g.(98%),
            "name": "Place name" e.g.(Tokyo, Japan),
            "days": "Days number" e.g.(7, 5, 10),
            "cost": "total Cost per person in indian rupees" e.g.(2450, 1890),
            "star": "Review number" e.g.(4.8, 4.9),
            "total_reviews": "Total reviews number." e.g.(342, 567),
            "destination_overview": "Tokyo is a vibrant mix of traditional culture and neon-lit modernity...",
            "perfect_for": "The trip is for" e.g.("Adventure", "Culture", "Food", "Beach", "Nature", "Photography", "Romance", "Wellness", "Shopping", "Nightlife", "History", "Art"),
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
}

export default generateNewSearchDestinationPrompt;