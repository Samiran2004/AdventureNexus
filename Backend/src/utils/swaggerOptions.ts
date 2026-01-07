// utils/swaggerOptions.ts
export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'AdventureNexus API',
            version: '1.0.0',
            description: 'API documentation for AdventureNexus - AI-Powered Interactive Travel Planner',
            contact: {
                name: 'API Support',
                email: 'support@adventurenexus.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Local server',
            },
            {
                url: 'https://api-powered-interactive-travel-planner.onrender.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                clerkAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: 'Clerk Short-lived Session Token'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        clerkUserId: { type: 'string', example: 'user_2P...' },
                        email: { type: 'string', example: 'user@example.com' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        username: { type: 'string', example: 'johndoe' },
                        profilepicture: { type: 'string', example: 'https://img.clerk.com/...' },
                        preferences: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['adventure', 'nature']
                        },
                        plans: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    }
                },
                UserProfileResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'Success' },
                        userData: {
                            type: 'object',
                            properties: {
                                fullname: { type: 'string', example: 'John Doe' },
                                firstname: { type: 'string', example: 'John' },
                                lastname: { type: 'string', example: 'Doe' },
                                email: { type: 'string', example: 'user@example.com' },
                                phonenumber: { type: 'number', example: 1234567890 },
                                username: { type: 'string', example: 'johndoe' },
                                profilepicture: { type: 'string' },
                                preference: { type: 'array', items: { type: 'string' } },
                                country: { type: 'string' }
                            }
                        }
                    }
                },
                GeneralResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'Ok' },
                        message: { type: 'string', example: 'Operation successful' }
                    }
                },
                Plan: {
                    type: 'object',
                    required: ['to', 'from', 'date', 'travelers', 'budget'],
                    properties: {
                        to: { type: 'string', example: 'Paris, France' },
                        from: { type: 'string', example: 'New York, USA' },
                        date: { type: 'string', format: 'date', example: '2023-12-25' },
                        travelers: { type: 'number', example: 2 },
                        budget: { type: 'number', example: 2000 },
                        budget_range: { type: 'string', example: 'mid-range' },
                        activities: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['museums', 'food']
                        },
                        travel_style: { type: 'string', example: 'relaxed' }
                    }
                },
                PlanResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'Ok' },
                        message: { type: 'string', example: 'Generated' },
                        data: {
                            type: 'object',
                            properties: {
                                ai_score: { type: 'string', example: '95' },
                                days: { type: 'number', example: 5 },
                                cost: { type: 'number', example: 1800 },
                                suggested_itinerary: { type: 'array', items: { type: 'object' } },
                                local_tips: { type: 'array', items: { type: 'string' } }
                            }
                        }
                    }
                },
                Subscription: {
                    type: 'object',
                    required: ['userMail'],
                    properties: {
                        userMail: { type: 'string', format: 'email', example: 'user@example.com' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'Failed' },
                        message: { type: 'string', example: 'Error description' }
                    }
                }
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
        },
    },
    apis: ['src/routes/*.ts', 'src/app.ts', 'dist/app.js', 'dist/routes/*.js'],
};
