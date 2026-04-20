import { Request, Response, NextFunction } from 'express';
import ApiLog from '../database/models/apiLogModel';
import logger from '../utils/logger';

export const telemetryMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Hook into the response 'finish' event to log after the request is processed
    res.on('finish', async () => {
        try {
            const duration = Date.now() - start;
            const logData = {
                method: req.method,
                endpoint: req.originalUrl.split('?')[0], // Strip query params for cleaner grouping
                statusCode: res.statusCode,
                duration,
                ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent']
            };

            // Non-blocking write to DB
            ApiLog.create(logData).catch(err => {
                logger.error('Failed to create ApiLog entry:', err);
            });

        } catch (error) {
            logger.error('Error in telemetry middleware finish event:', error);
        }
    });

    next();
};
