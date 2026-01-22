import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { config } from '../config/config';

/**
 * Global Error Handling Middleware.
 * Catches all errors propagated via next(err) and sends a standardized JSON response.
 *
 * @param err - The error object (instance of HttpError)
 * @param _req - Express Request object (unused)
 * @param res - Express Response object
 * @param _next - Express Next function (unused)
 */
const errorHandler: ErrorRequestHandler = (
    err: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Determine status code (default to 500 Internal Server Error)
    const statusCode = err.statusCode || 500;

    // Send JSON response
    res.status(statusCode).json({
        status: 'Failed',
        message: err.message,
        // Show stack trace only in development mode for debugging
        errorStack: config.env === 'development' ? err.stack : '',
    });
};

export default errorHandler;
