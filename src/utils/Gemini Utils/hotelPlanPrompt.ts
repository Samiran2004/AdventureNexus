interface HotelData {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  total_people: number;
  type: string;
  currency_code: string;
}

const generateHotelPrompt = (data: HotelData): string => {
  return `
        Based on the following details, generate a structured hotel recommendation in pure JSON format:

- Destination: ${data.destination}
- Check-in Date: ${data.checkInDate}
- Check-out Date: ${data.checkOutDate}
- Total People: ${data.total_people}
- Room Type: Any
- Type: ${data.type}
- Hotel Preferences: Near city center, Free Wi-Fi, Breakfast included

Provide the recommendations in **JSON format only** with the following structure:

[
  {
    "hotel_name": "Hotel Name",
    "address": "Hotel Address",
    "price_per_night": "Price per night in ${data.currency_code}",
    "total_cost": "Total cost for stay in ${data.currency_code}",
    "amenities": ["Free Wi-Fi", "Breakfast included", "Gym"],
    "rating": "Hotel rating out of 5",
    "distance_to_city_center": "Distance in km"
  },
  {
    "hotel_name": "Hotel Name",
    "address": "Hotel Address",
    "price_per_night": "Price per night in ${data.currency_code}",
    "total_cost": "Total cost for stay in ${data.currency_code}",
    "amenities": ["Free Wi-Fi", "Breakfast included", "Swimming Pool"],
    "rating": "Hotel rating out of 5",
    "distance_to_city_center": "Distance in km"
  }
]

Do **not** include markdown, explanations, or any additional text—just the JSON object.
Provide all possible hotel options based on this information.
    `;
};

export default generateHotelPrompt;
