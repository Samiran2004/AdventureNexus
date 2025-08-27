"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generatePromptForBudget = (data) => {
    return `
        Generate travel recommendations for a user based on the following inputs:
        - Budget: ${data.budget} ${data.country} currency
        
        For each destination, include the following details:
        1. Destination name
        2. A brief description of key activities or landmarks to explore
        3. Estimated cost in ${data.country} currency
        4. A list of activities associated with the destination

        Response format: Provide only a **pure JSON object**. No additional text or explanations.
        
        [
          {
            "destination": "Paris",
            "description": "Explore the Eiffel Tower and Louvre.",
            "estimated_cost": "TotalCost in ${data.country} currency",
            "activities": ["sightseeing", "museums"]
          },
          {
            "destination": "Maldives",
            "description": "Relax on pristine beaches.",
            "estimated_cost": "TotalCost in ${data.country} currency",
            "activities": ["beach", "water sports"]
          }
        ]

        Generate all possible recommendations with unique destinations and activities.
        Ensure the response is formatted **strictly in JSON**.
    `;
};
exports.default = generatePromptForBudget;
