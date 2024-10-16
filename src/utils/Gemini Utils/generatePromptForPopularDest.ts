interface DestinationPromptData {
    currency: string;
}

const generatePopularDestinationsPrompt = (data: DestinationPromptData): string => {
    return `
        "Generate a JSON object containing currently popular travel destinations around the world. Each destination should include the following details:

        destination: The name of the city or region.
        description: A brief description of why the destination is popular.
        estimated_cost: A price range for a typical visit in the ${data.currency} currency and the number of days.
        activities: A list of popular activities or attractions in that destination.
        popularity_rank: A rank from 1-10 based on current global trends.
        best_time_to_visit: The recommended season or months to visit."

        Example output in JSON format:
        [
          {
            "destination": "Paris, France",
            "description": "The City of Light is known for its art, culture, and world-renowned landmarks like the Eiffel Tower.",
            "estimated_cost": "€1,500 - €2,500 for a 5-day trip",
            "activities": ["sightseeing", "museum tours", "fine dining", "shopping"],
            "popularity_rank": 1,
            "best_time_to_visit": "April to June, September to November"
          },
          {
            "destination": "Tokyo, Japan",
            "description": "A blend of ultramodern and traditional, featuring temples, shopping, and vibrant nightlife.",
            "estimated_cost": "¥150,000 - ¥300,000 for a 7-day trip",
            "activities": ["temple visits", "shopping", "food tours", "nightlife"],
            "popularity_rank": 2,
            "best_time_to_visit": "March to May, September to November"
          },
          {
            "destination": "New York City, USA",
            "description": "Known for iconic landmarks such as Times Square, Central Park, and Broadway shows.",
            "estimated_cost": "$2,000 - $4,000 for a 5-day trip",
            "activities": ["sightseeing", "theater", "shopping", "museums"],
            "popularity_rank": 3,
            "best_time_to_visit": "April to June, September to November"
          },
          {
            "destination": "Bali, Indonesia",
            "description": "A tropical paradise famous for its beaches, rice terraces, and spiritual retreats.",
            "estimated_cost": "IDR 10,000,000 - IDR 20,000,000 for a 7-day trip",
            "activities": ["beach visits", "surfing", "yoga retreats", "temple tours"],
            "popularity_rank": 4,
            "best_time_to_visit": "April to October"
          }
        ]

        This prompt will generate a structured JSON response with information about popular travel destinations based on global trends.
        And give all possible results.
    `;
};

export default generatePopularDestinationsPrompt;
