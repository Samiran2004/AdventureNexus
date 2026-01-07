import { rateLimit } from 'express-rate-limit';

/**
 * Express Rate Limiter Middleware.
 * Limits repetitive requests from the same IP to prevent abuse/DDOS.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    limit: 100, // Limit each IP to 100 requests per `windowMs`
    standardHeaders: 'draft-7', // Return RateLimit headers in `Draft-7` format
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default limiter;
