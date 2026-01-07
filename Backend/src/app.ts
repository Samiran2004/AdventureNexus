// Core dependencies
import express, { NextFunction, Request, Response } from 'express'; // Express framework
import createHttpError from 'http-errors'; // HTTP error creation utility
import morgan from 'morgan'; // HTTP request logger
import cors from 'cors'; // Cross-Origin Resource Sharing
import dotenv from 'dotenv'; // Environment variables
import cookieParser from 'cookie-parser'; // Parse Cookie header
import helmet from 'helmet'; // Security headers
import path from 'path'; // File path utilities
import figlet from 'figlet'; // ASCII art for console logs

// Load env vars
dotenv.config();

// Config & Database
import { config } from './config/config'; // App configuration
import connectDb from './Database/connectDb'; // DB connection function
import redis from './redis/client'; // Redis client
import "./jobs/dailyTips.job"; // Cron job for daily tips
import "./jobs/runner.job"; // Other background jobs

// Middlewares
// Middlewares
import errorHandler from './middlewares/globalErrorHandler'; // Global error handler
import sanitizeInput from './middlewares/sanitization';
import { clerkMiddleware } from '@clerk/express';

// Controllers
import cleckWebhook from './controller/ClerkWebhook';
import subscribeDailyMailController from './controller/newsSubscriptionController/subscribeDailyMail.controller';

// Routes
import userRoute from './routes/userRoutes';
import planningRoute from './routes/planningRoute';
import hotelsRoute from './routes/hotelsRoute';

// Swagger
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './utils/swaggerOptions';

const app = express();


// --- Global Middlewares ---

// Serve static files from 'public' directory
app.use(express.static('public'));

// Parse incoming JSON payloads (req.body)
app.use(express.json());

// Parse URL-encoded data (e.g., forms)
app.use(express.urlencoded({ extended: false }));

// Initialize Morgan logger for request logging
app.use(morgan('dev'));

// Enable CORS to allow requests from frontend domains
app.use(cors());

// Initialize Clerk middleware for secure authentication
app.use(clerkMiddleware());
import cookieParser from 'cookie-parser';
import figlet from 'figlet';
import helmet from 'helmet';
import path from 'path';
import { config as appConfig } from './config/config';
import connectDb from './Database/connectDb';
import "./jobs/dailyTips.job";
import "./jobs/runner.job";
import sanitizeInput from './middlewares/sanitization';
import redis from './redis/client';

dotenv.config();

const app = express();

(async () => {
    await connectDb(process.env.DB_URI as string);
})();

redis.on('connect', (): void => {
    figlet(
        'R e d i s   c o n n e c t e d',
        (err: Error | null, data: string | undefined): void =>
            err ? console.log('Figlet error...') : console.log(data)
    );
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static(path.resolve('./Public')));
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
            },
        },
        referrerPolicy: {
            policy: 'no-referrer',
        },
        xssFilter: true,
        noSniff: true,
    })
);

app.use(clerkMiddleware());

// API to listen to clerk Webhooks...
app.use('/api/clerk', cleckWebhook);
// Initialize Swagger Docs generator
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(sanitizeInput);

// --- Routes Definition ---

// Clerk Webhook Route (Handles user sync events from Clerk)
// Prefix: /api/clerk
app.use('/api/clerk', cleckWebhook);

// User Management Routes (Profile, etc.)
// Prefix: /api/v1/users
app.use('/api/v1/users', userRoute);

// AI Planning Routes (Trip generation)
// Prefix: /api/v1/plans
app.use('/api/v1/plans', planningRoute);

// Hotel Management Routes (Seeding, etc.)
// Prefix: /api/v1/hotels
app.use('/api/v1/hotels', hotelsRoute);

// Newsletter Subscription Route
// Endpoint: POST /api/v1/mail/subscribe
app.post('/api/v1/mail/subscribe', subscribeDailyMailController);

// --- Error Handling ---

// 404 Not Found Handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404)); // Pass 404 error to global handler
});

// Global Error Handler (Catches all errors passed to next())
app.use(errorHandler);

// Export the app instance for testing or other uses
export default app;

// Start the Server
app.listen(config.port, (err?: Error): void =>
    err
        ? figlet(
            `S e r v e r  c o n n e c t i o n  e r r o r`,
            (err: Error | null, data: string | undefined): void => {
                // Log connection error with ASCII art
                err ? console.log('Figlet error') : console.log(data);
            }
        )
        : figlet(
            `S e r v e r  c o n n e c t e d \n P O R T :  ${config.port}`,
            (err: Error | null, data: string | undefined): void => {
                // Log successful connection with ASCII art
                err ? console.log('Figlet error...') : console.log(data);
            }
        )
);
