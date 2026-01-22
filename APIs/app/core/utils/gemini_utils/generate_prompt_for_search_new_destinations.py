def generate_new_search_destination_prompt(data):
    return f"""
    Act as a travel expert. Generate a detailed travel plan for a trip to {data['to']} from {data['from']}.
    The trip details are:
    - Date: {data['date']}
    - Travelers: {data['travelers']}
    - Budget: {data['budget']} {data.get('budget_range', '')}
    - Activities: {', '.join(data.get('activities', []))}
    - Travel Style: {data.get('travel_style', 'Standard')}

    Generate a JSON object with the following fields:
    - ai_score: A string score (e.g., "8.5/10").
    - image_url: A placeholder string for the destination image.
    - name: A catchy name for the trip plan.
    - days: Estimated number of days (integer).
    - cost: Estimated total cost (integer).
    - star: A rating out of 5 (number).
    - total_reviews: A mock number of reviews.
    - destination_overview: A paragraph describing the destination.
    - perfect_for: An array of strings describing who this trip is perfect for.
    - budget_breakdown: An object with estimated cost breakdown (e.g., flights, accommodation, food).
    - trip_highlights: An array of strings highlighting key experiences.
    - suggested_itinerary: An array of objects, each representing a day with "day", "title", and "activities" array.
    - local_tips: An array of utility tips for the destination.

    Output ONLY the valid JSON object.
    """
