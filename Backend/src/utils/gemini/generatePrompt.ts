interface TravelPromptData {
  startingDestination: string;
  destination: string;
  day: number;
  budget: number;
  date: string;
  totalPerson: number;
  prevRecommendation: string;
  preference: string[];
}

/**
 * Generates a comprehensive AI Prompt for a full Travel Plan.
 * Includes destinations, cost estimates, and activities.
 * @param data - Full travel details including preferences and budget.
 */
const generatePrompt = (data: TravelPromptData): string => {
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

export default generatePrompt;
