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

> [!IMPORTANT]
> - **User Profile endpoint (GET /users/profile)**: STRICTLY requires a valid Clerk token. The `protect` middleware attaches the user to `req.user`.
> - **Search Plan endpoint (POST /plans/search/destination)**: Checks `req.auth().userId` manually. Requires a signed-in user.

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
- **Request Body:** None.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
       "status": "Success",
       "userData": {
           "fullname": "John Doe",
           "firstname": "John",
           "lastname": "Doe",
           "email": "user@example.com",
           "phonenumber": 1234567890,
           "username": "johndoe",
           "profilepicture": "https://...",
           "preference": ["adventure"],
           "country": "USA"
       }
    }
    ```
- **Error Responses:**
  - `401 Unauthorized`: Token missing or invalid.
  - `404 Not Found`: "User not found!" (if token is valid but user not in DB)

---

## 2. ✈️ Planning Routes
**Base Path:** `/plans`

![Planning System Architecture](./Images/PlanningRouter%20System%20Architecture.png)

### Search & Generate Destination Plan
Generates a detailed travel plan using AI based on user input.

- **Endpoint:** `/search/destination`
- **Method:** ![POST](https://img.shields.io/badge/POST-success?style=for-the-badge&logo=appveyor)
- **Auth Required:** ![Yes](https://img.shields.io/badge/Auth-Required-red?style=flat-square)
- **Request Body:** (All fields below are **REQUIRED**)
  ```json
  {
      "to": "Paris, France",        // Required
      "from": "New York, USA",      // Required
      "date": "2023-12-25",         // Required
      "travelers": 2,               // Required
      "budget": 2000,               // Required
      "budget_range": "mid-range",  // Optional
      "activities": ["museums"],    // Optional
      "travel_style": "relaxed"     // Optional
  }
  ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "status": "Ok",
      "message": "Generated", // or "Plan already exists"
      "data": { ... }
    }
    ```
- **Error Responses:**
  - `400 Bad Request`: "Provide all required fields!" (if any required field is missing)
  - `401 Unauthorized`: "Unauthorized: Clerk user not found"

---

## 3. 🏨 Hotel Routes
**Base Path:** `/hotels`

### Create/Seed Hotels
Triggers a seeding script. This is a utility endpoint.

- **Endpoint:** `/create`
- **Method:** ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge&logo=appveyor)
- **Auth Required:** ![No](https://img.shields.io/badge/Auth-None-green?style=flat-square)
- **Success Response:** `200 OK` (Logs to console)

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
      "userMail": "user@example.com" // REQUIRED
  }
  ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** `{ "status": "Ok", "message": "Registered!" }`
- **Error Responses:**
  - `400 Bad Request`: "Required fields not exist!" (if `userMail` is missing)
  - `417 Expectation Failed`: "Mail sending error!"

---

## 5. 🪝 Webhooks
**Base Path:** `/api/clerk`

### Clerk Webhook
Receives events from Clerk.

- **Endpoint:** `/`
- **Method:** ![POST](https://img.shields.io/badge/POST-success?style=for-the-badge&logo=appveyor)
- **Auth Required:** ![Signature](https://img.shields.io/badge/Auth-Signature-orange?style=flat-square)