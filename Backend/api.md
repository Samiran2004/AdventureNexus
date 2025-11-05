1. GET USER'S PROFILE DETAILS->
        /api/v1/users/profile [GET]
        auth -> ../middlewares/authClerkTokenMiddleware

2. GET HOTELS ->
        /api/v1/hotels/create [GET]
        body -> destination, duration, budget, currency_code