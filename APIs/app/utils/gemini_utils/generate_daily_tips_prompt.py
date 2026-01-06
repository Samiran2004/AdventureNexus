def generate_daily_tips_prompt():
    return """
    Act as a real-time travel monitor. Your task is to provide a "Daily Travel Briefing" for the location specified below, focusing on news, safety, or timely advice for *today*.

    Target Location: Randome choice
    Current Date: (Include day of week)
    Traveler Interest: 'General'

    Return a single JSON object with the following keys:
    - "headline": A news-style headline (e.g., "Transit Strike Expected" or "Festival Starts Today").
    - "location": The location of the news or the tips ("Paris", "Japan").
    - "category": Choose one: ["Travel Tips", "Solo Travel Tips", "Group Plan"].
    - "advice": A specific, tip (max 50 words) relevant to the tips.
    - "source_context": A brief mention of why this is relevant now (e.g., "Travel tips site").

    Do not provide any other text. Only the JSON object.
    """
