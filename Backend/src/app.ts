import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './utils/swaggerOptions';
import figlet from 'figlet';
import userRoute from './routes/userRoutes';
import recommendationRoute from './routes/recommendationRoutes';
import planningRoute from './routes/planningRoute';
import sanitizeInput from './middlewares/sanitization';
import redis from './redis/client';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import errorHandler from './middlewares/globalErrorHandler';
import { config } from './config/config';
import path from 'path';
import connectDb from './Database/connectDb';
import { clerkMiddleware } from '@clerk/express';
import cleckWebhook from './controller/ClerkWebhook';
import hotelsRoute from './routes/hotelsRoute';
import subscribeDailyMailController from './controller/newsSubscriptionController/subscribeDailyMail.controller';
import "./jobs/dailyTips.job";
import "./jobs/runner.job";

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

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(sanitizeInput);

app.get('/isWork', (req: Request, res: Response): void => {
    res.status(200).send({
        status: 'success',
        isWorking: true,
    });
});

app.use('/api/v1/users', userRoute);
app.use('/api/v1/recommendations', recommendationRoute);
app.use('/api/v1/plans', planningRoute);
app.use('/api/v1/hotels', hotelsRoute);
app.post('/api/v1/mail/subscribe', subscribeDailyMailController);

app.use(errorHandler);

app.listen(config.port, (err?: Error): void =>
    err
        ? figlet(
              `S e r v e r  c o n n e c t i o n  e r r o r`,
              (err: Error | null, data: string | undefined): void => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  err ? console.log('Figlet error') : console.log(data);
              }
          )
        : figlet(
              `S e r v e r  c o n n e c t e d \n P O R T :  ${config.port}`,
              (err: Error | null, data: string | undefined): void => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  err ? console.log('Figlet error...') : console.log(data);
              }
          )
);
