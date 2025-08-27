"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateFlightPrompt = (data) => {
    return `
        Based on the following details, generate a structured flight recommendation in pure JSON format:

- Starting Destination: ${data.start_destination}
- Final Destination: ${data.final_destination}
- Travel Date: ${data.start_date}
- Return Date: ${data.return_date}
- Total People: ${data.total_people}
- Class: Economy
- estimated_cost: rough estimated cost in ${data.currency_code}
- Airline Preference: Any

Provide the recommendations in **JSON format only** with the following structure:

[
  {
    "airline": "Airline Name",
    "flight_number": "Flight Number",
    "departure_time": "2024-12-15T08:00:00",
    "arrival_time": "2024-12-15T20:00:00",
    "price": "1000 USD",
    "class": "Economy",
    "duration": "7h 30m"
  },
  {
    "airline": "Airline Name",
    "flight_number": "Flight Number",
    "departure_time": "2024-12-22T10:00:00",
    "arrival_time": "2024-12-22T14:00:00",
    "price": "500 USD",
    "class": "Economy",
    "duration": "7h 00m"
  }
]

Do **not** include markdown, explanations, or any additional text—just the JSON object.
Provide all possible flight options based on this information.
    `;
};
exports.default = generateFlightPrompt;
