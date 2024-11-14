import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { config } from '../config/config';

// Global error handler
const errorHandler: ErrorRequestHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'Failed',
    message: err.message,
    errorStack: config.env === 'development' ? err.stack : '',
  });
};

export default errorHandler;
