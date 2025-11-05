1. GET USER'S PROFILE DETAILS->
        /api/v1/users/profile [GET]
        auth -> ../middlewares/authClerkTokenMiddleware

2. GET HOTELS ->
        /api/v1/hotels/create [GET]
        body -> destination, duration, budget, currency_code

3. CREATE TRIPS ->
        /api/v1/plans/trips/create [POST]
        Auth: Required (Clerk token)
        Body: {
                destination: string,
                dispatch_city: string,
                start_date: date,
                end_date: date,
                budget: "budget" | "mid-range" | "luxury",
                total_people: number,
                preferences: {
                        activities: string[],
                        accommodation_type: string[],
                        dietary_restrictions: string[]
                }
        }