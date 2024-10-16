"use strict";
// swaggerOptions.js
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API-Powered Interactive Travel Planner',
            version: '1.0.0',
            description: 'API-Powered Interactive Travel Planner API',
        },
        servers: [
            {
                url: 'http://localhost:8000',
            },
        ],
    },
    apis: ['./app.ts', './routes/*.ts'], // Adjust paths as needed
};
module.exports = swaggerOptions;
