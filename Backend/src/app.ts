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
import http from 'http';
import { Server } from 'socket.io';

// Load env vars
dotenv.config();

// Config & Database
import { config } from './shared/config/config'; // App configuration
import connection from './shared/database/connection'; // DB connection function
import redis from './shared/redis/client'; // Redis client
import "./jobs/dailyTips.job"; // Cron job for daily tips
import "./jobs/runner.job"; // Other background jobs
import User from './shared/database/models/userModel';

// Middlewares
import errorHandler from './shared/middleware/globalErrorHandler'; // Global error handler
import sanitizeInput from './shared/middleware/sanitization';
import { clerkMiddleware } from '@clerk/express';
import { checkMaintenance } from './shared/middleware/maintenanceMiddleware';
import { telemetryMiddleware } from './shared/middleware/telemetryMiddleware';

// Controllers
import cleckWebhook from './modules/auth/controllers/ClerkWebhook';
import subscribeDailyMailController from './modules/newsletter/controllers/subscribeDailyMail.controller';

// Routes
import userRoute from './modules/users/routes/user.routes';
import planningRoute from './modules/planning/routes/planning.routes';
import hotelsRoute from './modules/hotels/routes/hotels.routes';
import reviewRoute from './modules/reviews/routes/review.routes';
import likedPlansRoute from './modules/planning/routes/likedPlans.routes';

// Swagger
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './shared/utils/swaggerOptions';
import logger from './shared/utils/logger';

import { initSocket } from './shared/socket/socket';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// --- Database Connection ---
(async () => {
    await connection(process.env.DB_URI as string);
})();

// --- Redis Connection Event ---
redis.on('connect', (): void => {
    figlet(
        'R e d i s   c o n n e c t e d',
        (err: Error | null, data: string | undefined): void =>
            err ? logger.error('Figlet error...') : logger.info(data)
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
const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message: string) => logger.http(message.trim()),
        },
    }
);
app.use(morganMiddleware);

// --- Telemetry & Analytics ---
app.use(telemetryMiddleware);

// Authentication
app.use(clerkMiddleware());

// Initialize Swagger Docs
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Input Sanitization (Applies to all routes below)
app.use(sanitizeInput);

// Activity Tracking Middleware (Updates lastActive)
app.use(async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.auth?.userId) {
            // Fire and forget update (don't await to avoid latency)
            User.updateOne({ clerkUserId: req.auth.userId }, { lastActive: new Date() }).exec();
        }
    } catch (error) {
        // Ignore errors here to not block request
        logger.warn('Failed to update user activity');
    }
    next();
});

// --- Routes Definition ---

// Clerk Webhook Route
app.use('/api/clerk', cleckWebhook);

// Maintenance Check (Phase 4 - Blocks public access if enabled)
app.use(checkMaintenance);

// User Management Routes
app.use('/api/v1/users', userRoute);

// AI Planning Routes
app.use('/api/v1/plans', planningRoute);

// Hotel Management Routes
app.use('/api/v1/hotels', hotelsRoute);

// Review Management Routes
app.use('/api/v1/reviews', reviewRoute);

// Liked Plans Routes
app.use('/api/v1/liked-plans', likedPlansRoute);

// Newsletter Subscription Route
import triggerDailyTips from './modules/newsletter/controllers/triggerDailyTips.controller';
app.post('/api/v1/mail/subscribe', subscribeDailyMailController);
app.post('/api/v1/mail/trigger-daily-tips', triggerDailyTips);

// Admin Routes
import adminRoutes from './modules/admin/routes/admin.routes';
app.use('/api/v1/admin', adminRoutes);



// --- Error Handling ---

// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404));
});

// Global Error Handler
app.use(errorHandler);

// Export app instance (optional, mainly server is used now)
export default app;

// --- Server Start ---
server.listen(config.port, () => {
    figlet(
        `S e r v e r  c o n n e c t e d \n P O R T :  ${config.port}`,
        (err: Error | null, data: string | undefined): void => {
            err ? logger.error('Figlet error...') : logger.info(data);
        }
    );
});
