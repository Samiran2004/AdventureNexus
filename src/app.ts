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
import errorHandler from './middlewares/globalErrorHandler';
import {config} from "./config/config";

dotenv.config();

const app = express();

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

redis.on("connect", () => {
    figlet("R e d i s   c o n n e c t e d", (err: Error | null, data: string | undefined) =>
        err ? console.log("Figlet error...") : console.log(data)
    );
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
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

app.use(sanitizeInput);

app.get('/isWork', (req: Request, res: Response) => {
    res.status(200).send({
        status: 'success',
        isWorking: true,
    });
});

app.use('/api/v1/users', userRoute);
app.use('/api/v1/recommendation', recommendationRoute);
app.use('/api/v1/planning', planningRoute);

app.use(errorHandler);

app.listen(config.port, (err?: Error) =>
    err
        ? figlet(`S e r v e r  c o n n e c t i o n  e r r o r`, (err: Error | null, data: string | undefined) => {
            err ? console.log("Figlet error") : console.log(data);
        })
        : figlet(`S e r v e r  c o n n e c t e d \n P O R T :  ${config.port}`, (err: Error | null, data: string | undefined) => {
            err ? console.log("Figlet error...") : console.log(data);
        })
);