# 🚀 AdventureNexus API Documentation

## 📖 Introduction
Welcome to the **AdventureNexus** API documentation. This API powers the AdventureNexus backend, providing services for user management, travel planning, hotel management, and email subscriptions.

## 🔗 Base URL
All API requests should be made to:
`http://<domain>/api/v1` (unless otherwise specified, e.g., Webhooks)

## 🔐 Authentication
Authentication is handled via **Clerk**.
- **Header:** `Authorization: Bearer <token>`
- **Middleware:** `protect` (verifies the Clerk session token)

> [!NOTE]
> Some endpoints check `req.auth().userId` manually even if the middleware is not explicitly present in the route definition.

## ⚠️ Error Handling
The API generally returns errors in the following format:
```json
{
  "status": "Failed",
  "message": "Error description"
}
```

---

## 1. 👤 User Routes
**Base Path:** `/users`

![User System Architecture](./Images/UserRouter%20HLD%20Post.png)

### Get User Profile
Retrieves the profile details of the currently authenticated user.

- **Endpoint:** `/profile`
- **Method:** ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge&logo=appveyor)
- **Auth Required:** ![Yes](https://img.shields.io/badge/Auth-Required-red?style=flat-square)
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
       "status": "success",
       "data": {
           "_id": "60d0fe4f5311236168a109ca",
           "clerkUserId": "user_2P...",
           "email": "user@example.com",
           "firstName": "John",
           "lastName": "Doe",
           "username": "johndoe",
           "profilepicture": "https://...",
           "preferences": ["adventure", "nature"],
           "plans": [...]
       }
    }
    ```
- **Error Responses:**
  - `401 Unauthorized`: Token missing or invalid.

---

## 2. ✈️ Planning Routes
**Base Path:** `/plans`

![Planning System Architecture](./Images/PlanningRouter%20System%20Architecture.png)

### Search & Generate Destination Plan
Generates a detailed travel plan using AI based on user input.

- **Endpoint:** `/search/destination`
- **Method:** ![POST](https://img.shields.io/badge/POST-success?style=for-the-badge&logo=appveyor)
- **Auth Required:** ![Yes](https://img.shields.io/badge/Auth-Required-red?style=flat-square)
- **Request Body:**
  ```json
  {
      "to": "Paris, France",
      "from": "New York, USA",
      "date": "2023-12-25",
      "travelers": 2,
      "budget": 2000,
      "budget_range": "mid-range",
      "activities": ["museums", "food"],
      "travel_style": "relaxed"
  }
  ```
- **Success Response (Plan Generated):**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "status": "Ok",
      "message": "Generated",
      "data": {
        "clerkUserId": "user_2P...",
        "to": "Paris, France",
        "ai_score": "95",
        "days": 5,
        "cost": 1800,
        "suggested_itinerary": [...],
        "local_tips": ["..."]
      }
    }
    ```
- **Success Response (Plan Already Exists):**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "status": "Ok",
      "message": "Plan already exists",
      "data": { ... }
    }
    ```
- **Error Responses:**
  - `400 Bad Request`: "Provide all required fields!"
  - `401 Unauthorized`: "Unauthorized: Clerk user not found"
  - `404 Not Found`: "User not found"

---

## 3. 🏨 Hotel Routes
**Base Path:** `/hotels`

### Create/Seed Hotels
Triggers a seeding script to populate the database with initial hotel data. This is typically an administrative or development endpoint.

- **Endpoint:** `/create`
- **Method:** ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge&logo=appveyor)
- **Auth Required:** ![No](https://img.shields.io/badge/Auth-None-green?style=flat-square)
- **Success Response:**
  - **Code:** `200 OK` (Implicit, logs to console)
- **Error Responses:**
  - `500 Internal Server Error`: "Internal Server Error"

---

## 4. 📧 Mail Routes
**Base Path:** `/mail`

### Subscribe to Daily Tips
Subscribes an email address to receive daily travel tips.

- **Endpoint:** `/subscribe`
- **Method:** ![POST](https://img.shields.io/badge/POST-success?style=for-the-badge&logo=appveyor)
- **Auth Required:** ![No](https://img.shields.io/badge/Auth-None-green?style=flat-square)
- **Request Body:**
  ```json
  {
      "userMail": "user@example.com"
  }
  ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "status": "Ok",
      "message": "Registered!"
    }
    ```
  - **Or if already subscribed:**
    ```json
    {
      "status": "OK",
      "message": "Already subscribed!"
    }
    ```
- **Error Responses:**
  - `400 Bad Request`: "Required fields not exist!"
  - `417 Expectation Failed`: "Mail sending error!"

---

## 5. 🪝 Webhooks
**Base Path:** `/api/clerk`

### Clerk Webhook
Receives events from Clerk to synchronize user data with the local database.

- **Endpoint:** `/`
- **Method:** ![POST](https://img.shields.io/badge/POST-success?style=for-the-badge&logo=appveyor)
- **Auth Required:** ![Signature](https://img.shields.io/badge/Auth-Signature-orange?style=flat-square)
- **Supported Events:**
  - `user.created`: Creates new user.
  - `user.updated`: Updates user details.
  - `user.deleted`: Deletes user.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "success": true,
      "message": "Webhook processed successfully",
      "eventType": "user.created"
    }
    ```
- **Error Responses:**
  - `500 Internal Server Error`: Verification failed or processing error.