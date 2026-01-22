# 🚀 AdventureNexus API Documentation

## 📖 Introduction
Welcome to the *AdventureNexus* API documentation. This API serves as the backbone for the AdventureNexus platform, handling everything from AI-powered travel planning and user profile management to community reviews and newsletter subscriptions.

## 🔗 Base URL
All API requests should be made to:
`http://<domain>/api/v1`

## 🔐 Authentication
Authentication is handled via **Clerk**.
Most private routes require a valid **Bearer Token** from a Clerk session.
- **Header:** `Authorization: Bearer <token>`
- **Middleware Mechanism:**
  1. `clerkMiddleware()`: Validates the token signature.
  2. `protect`: Middleware that extracts `clerkUserId`, verifies the user exists in our MongoDB, and attaches the user object to `req.user`.

---

## 1. 👤 User Routes
**Base Path:** `/users`

### Get User Profile
Retrieves the full profile details of the currently authenticated user.

- **Endpoint:** `/profile`
- **Method:** `GET`
- **Auth Required:** ✅ Yes

#### How it works:
1. Middleware extracts the `clerkUserId` from the token.
2. Controller queries the `users` collection for a match.
3. Returns a filtered object containing personal details and preferences.

#### Response (`200 OK`):
```json
{
   "status": "Success",
   "userData": {
       "fullname": "John Doe",
       "firstname": "John",
       "lastname": "Doe",
       "email": "user@example.com",
       "username": "johndoe",
       "profilepicture": "https://img.clerk.com/...",
       "preference": ["adventure", "budget"],
       "country": "USA",
       "gender": "male"
   }
}
```

---

## 2. ✈️ Planning Routes
**Base Path:** `/plans`

The core of AdventureNexus, powered by AI (Groq/Gemini) and external data sources (Wikipedia/Unsplash).

### 1. Search & Generate Destination Plan
Generates a detailed, AI-curated travel plan based on user inputs.

- **Endpoint:** `/search/destination`
- **Method:** `POST`
- **Auth Required:** ✅ Yes

#### How it works:
1. **Validation**: Checks if all required fields are present.
2. **Caching**: Checks Redis for an identical search query (same dates, budget, travelers). Returns cached result if found.
3. **AI Generation**: Sends a prompt to the Groq AI service to generate a JSON structure.
4. **Data Enrichment**:
   - Fetches a specialized image for the destination (Wikipedia first, then Unsplash).
   - Calculates custom AI scores.
5. **Storage**: Saves the plan to MongoDB linked to the user.
6. **Caching**: Stores the result in Redis for 1 hour.

#### Request Body:
```json
{
    "to": "Kyoto, Japan",         // Target destination
    "from": "London, UK",         // Starting point
    "date": "2024-05-15",         // Travel date
    "travelers": 2,               // Number of people
    "budget": 3000,               // Total budget in USD
    "budget_range": "Luxury",     // "Budget", "Mid-range", "Luxury"
    "activities": ["Temples", "Food"],
    "travel_style": "Cultural",
    "duration": "7 days"          // Length of stay
}
```

#### Response (`200 OK`):
Returns an array of generated plan options.
```json
{
  "status": "Ok",
  "message": "Generated",
  "data": [
    {
      "name": "Kyoto Cultural Immersion",
      "ai_score": 95,
      "cost": 2800,
      "days": 7,
      "destination_overview": "A historical journey...",
      "budget_breakdown": { ... },
      "suggested_itinerary": [ ... ],
      "image_url": "https://..."
    }
  ]
}
```

### 2. Get Personalized Recommendations
Fetches recommended plans based on the user's past history and preferences (Content-Based Filtering).

- **Endpoint:** `/recommendations`
- **Method:** `GET`
- **Auth Required:** ✅ Yes

#### How it works:
1. Fetches the user's profile and past liked/generated plans.
2. Uses **TF-IDF & Cosine Similarity** to compare user preferences against all available plans in the database.
3. Returns the top matches. If the user is new, falls back to the latest popular plans.

### 3. Search Destination Images
Fetch high-quality images for a location name.

- **Endpoint:** `/search/destination-images`
- **Method:** `POST`
- **Request Body:** `{ "query": "Bali", "count": 12 }`
- **Logic**: Proxies requests to Unsplash API and caches results for 24 hours to save API quota.

### 4. Get Public Plan
Fetch details of a specific plan by its ID. Useful for shared links.

- **Endpoint:** `/public/:id`
- **Method:** `GET`
- **Auth Required:** ❌ No

---

## 3. ❤️ Liked Plans Routes
**Base Path:** `/liked-plans`

Manages the user's "Wishlist" or saved trips.

### Get All Liked Plans
- **Endpoint:** `/`
- **Method:** `GET`
- **Auth Required:** ✅ Yes
- **Logic**: Returns the `likedPlans` array from the User document, populated with full Plan details.

### Like a Plan
- **Endpoint:** `/:planId`
- **Method:** `POST`
- **Auth Required:** ✅ Yes
- **Logic**: push the `planId` to the user's `likedPlans` array (preventing duplicates).

### Unlike a Plan
- **Endpoint:** `/:planId`
- **Method:** `DELETE`
- **Auth Required:** ✅ Yes
- **Logic**: Filters out the `planId` from the user's `likedPlans` array.

---

## 4. ⭐ Review Routes
**Base Path:** `/reviews`

### Get All Reviews
Fetch community reviews with powerful filtering and sorting.

- **Endpoint:** `/`
- **Method:** `GET`
- **Auth Required:** ❌ No

#### Query Parameters:
| Param | Description | Example |
|-------|-------------|---------|
| `page` | Page number for pagination | `1` |
| `limit` | Number of items per page | `6` |
| `category` | Filter by trip type | `Family`, `Solo`, `Adventure` |
| `rating` | Filter by minimum star rating | `4` (returns 4 stars and up) |
| `sortBy` | Sort order | `newest`, `oldest`, `highest` (rating), `helpful` |
| `search` | Search text in comments or location | `Paris` |

### Create Review
- **Endpoint:** `/`
- **Method:** `POST`
- **Auth Required:** ✅ Yes
- **Body**: `{ "rating": 5, "comment": "Amazing!", "location": "Paris", "tripType": "Solo", ... }`
- **Logic**: Creates a review and invalidates the reviews cache.

### Like a Review
- **Endpoint:** `/:id/like`
- **Method:** `PUT`
- **Logic**: Increments the `helpfulCount` of a review. Useful for ranking reviews.

---

## 5. 🏨 Hotel Routes
**Base Path:** `/hotels`

### Create/Seed Hotels
**Utility Endpoint** to populate the database with initial hotel data.
- **Endpoint:** `/create`
- **Method:** `GET`
- **Logic**: Reads a JSON seed file and inserts documents into the `hotels` collection.

---

## 6. 📧 Mail Routes
**Base Path:** `/mail`

### Subscribe to Daily Tips
- **Endpoint:** `/subscribe`
- **Method:** `POST`
- **Body**: `{ "userMail": "email@example.com" }`
- **Logic**:
  1. Checks if email exists.
  2. Saves to `SubscribeMail` collection.
  3. Sends a Welcome Email immediately.
  4. Generates and sends the **first daily tip** immediately using AI.

### Trigger Daily Tips
- **Endpoint:** `/trigger-daily-tips`
- **Method:** `POST`
- **Logic**: Manually triggers the Cron Job that sends daily tips to ALL subscribers. Useful for testing or external schedulers.