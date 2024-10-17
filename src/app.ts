import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './utils/swaggerOptions';
import figlet from 'figlet';
import mongoose from 'mongoose';
import userRoute from './routes/userRoutes';
import recommendationRoute from './routes/recommendationRoutes';
import planningRoute from './routes/planningRoute';
import sanitizeInput from './middlewares/sanitization';
import redis from './redis/client';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Configure env variables...
dotenv.config();

// Initialize express app
const app = express();

// Database connection...
mongoose.connect(process.env.DB_URI as string).then(
    () => {
        figlet("D a t a b a s e   c o n n e c t e d", (err: Error | null, data: string | undefined) =>
            err ? console.log("Figlet error...") : console.log(data)
        );
    }
).catch(
    () => {
        figlet("D a t a b a s e  c o n n e c t i o n  e r r o r", (err: Error | null, data: string | undefined) =>
            err ? console.log("Figlet error") : console.log(data)
        );
    }
);

// Redis connection...
redis.on("connect", () => {
    console.log("Redis connected...");
});

// CORS...
app.use(cors());

// Express middlewares...
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(morgan('dev'));

// Helmet for security headers...
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

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Configure Sanitization...
app.use(sanitizeInput);

// Check if server is working...
/**
 * @swagger
 * /isWork:
 *   get:
 *     summary: Check if the server is working
 *     responses:
 *       200:
 *         description: Server status check
 */
app.get('/isWork', (req: Request, res: Response) => {
    res.status(200).send({
        status: 'success',
        isWorking: true,
    });
});

// User route...
app.use('/api/v1/user', userRoute);

// Recommendation route...
app.use('/api/v1/recommendation', recommendationRoute);

// Planning route...
app.use('/api/v1/planning', planningRoute);

// Server connection...
app.listen(process.env.PORT, (err?: Error) =>
    err
        ? figlet(`S e r v e r  c o n n e c t i o n  e r r o r`, (err: Error | null, data: string | undefined) => {
            err ? console.log("Figlet error") : console.log(data);
        })
        : figlet(`S e r v e r  c o n n e c t e d \n P O R T :  ${process.env.PORT}`, (err: Error | null, data: string | undefined) => {
            err ? console.log("Figlet error...") : console.log(data);
        })
);