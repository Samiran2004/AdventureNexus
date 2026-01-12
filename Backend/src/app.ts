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
import connection from './database/connection'; // DB connection function
import redis from './redis/client'; // Redis client
import "./jobs/dailyTips.job"; // Cron job for daily tips
import "./jobs/runner.job"; // Other background jobs

// Middlewares
import errorHandler from './middlewares/globalErrorHandler'; // Global error handler
import sanitizeInput from './middlewares/sanitization';
import { clerkMiddleware } from '@clerk/express';

// Controllers
import cleckWebhook from './controllers/ClerkWebhook';
import subscribeDailyMailController from './controllers/newsSubscriptionController/subscribeDailyMail.controller';

// Routes
import userRoute from './routes/user.routes';
import planningRoute from './routes/planning.routes';
import hotelsRoute from './routes/hotels.routes';
import reviewRoute from './routes/review.routes';

// Swagger
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './utils/swaggerOptions';

const app = express();

// --- Database Connection ---
(async () => {
    await connection(process.env.DB_URI as string);
})();

// --- Redis Connection Event ---
redis.on('connect', (): void => {
    figlet(
        'R e d i s   c o n n e c t e d',
        (err: Error | null, data: string | undefined): void =>
            err ? console.log('Figlet error...') : console.log(data)
    );
});

// --- Global Middlewares ---

// Serve static files from 'public' directory
app.use(express.static('public')); // Checks 'public' first
app.use(express.static(path.resolve('./Public'))); // Fallback/Alternative

// Security Headers
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

// Enable CORS
app.use(cors());

// Parse Incoming Data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Logging
app.use(morgan('dev'));

// Authentication
app.use(clerkMiddleware());

// Initialize Swagger Docs
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Input Sanitization (Applies to all routes below)
app.use(sanitizeInput);


// --- Routes Definition ---

// Clerk Webhook Route
app.use('/api/clerk', cleckWebhook);

// User Management Routes
app.use('/api/v1/users', userRoute);

// AI Planning Routes
app.use('/api/v1/plans', planningRoute);

// Hotel Management Routes
app.use('/api/v1/hotels', hotelsRoute);

// Review Management Routes
app.use('/api/v1/reviews', reviewRoute);

// Newsletter Subscription Route
import triggerDailyTips from './controllers/newsSubscriptionController/triggerDailyTips.controller';
app.post('/api/v1/mail/subscribe', subscribeDailyMailController);
app.post('/api/v1/mail/trigger-daily-tips', triggerDailyTips);



// --- Error Handling ---

// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404));
});

// Global Error Handler
app.use(errorHandler);

// Export app instance
export default app;

// --- Server Start ---
app.listen(config.port, (err?: Error): void =>
    err
        ? figlet(
            `S e r v e r  c o n n e c t i o n  e r r o r`,
            (err: Error | null, data: string | undefined): void => {
                err ? console.log('Figlet error') : console.log(data);
            }
        )
        : figlet(
            `S e r v e r  c o n n e c t e d \n P O R T :  ${config.port}`,
            (err: Error | null, data: string | undefined): void => {
                err ? console.log('Figlet error...') : console.log(data);
            }
        )
);
