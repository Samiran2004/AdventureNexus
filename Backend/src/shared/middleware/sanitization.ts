import { Request, Response, NextFunction } from 'express';
import escapeHtml from 'escape-html';

/**
 * Middleware to sanitize incoming request data.
 * Prevents XSS attacks by escaping HTML characters in strings.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express Next function
 */
const sanitizeInput = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Recursive function to sanitize objects
    const sanitize = (obj: Record<string, any>) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                // Escape HTML characters in string values
                obj[key] = escapeHtml(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Recursively sanitize nested objects
                sanitize(obj[key]);
            }
        }
    };

    // Apply sanitization to body, query, and params
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next(); // Proceed to next middleware
};

export default sanitizeInput;
