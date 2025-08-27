"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generatePrompt = (data) => {
    return `Based on the following details, generate a structured travel recommendation in pure JSON format:
  
  - Starting Destination: ${data.startingDestination}
  - Final Destination: ${data.destination}
  - Total Duration: ${data.day} days
  - Budget: $${data.budget}
  - Travel Date: ${data.date}
  - Total People: ${data.totalPerson}
  - Previous Recommendations: ${data.prevRecommendation}
  - User Preferences: ${data.preference.join(', ')}

  Provide the recommendations in **JSON format only** with the following structure:

    [
      {
        "destination": "Destination Name",
        "description": "Brief description of what to do there.",
        "estimated_cost": "TotalCost in ${data.startingDestination} currency",
        "activities": ["list", "of", "activities"]
      },
      {
        "destination": "Destination Name",
        "description": "Brief description of what to do there.",
        "estimated_cost": "TotalCost in ${data.startingDestination} currency",
        "activities": ["list", "of", "activities"]
      }
    ]
  
  Do **not** include markdown, explanations, or any additional text—just the JSON object.
  The estimated cost should be calculated in the currency of ${data.startingDestination}.
  Provide all possible results based on this information.`;
};
exports.default = generatePrompt;
