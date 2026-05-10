import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { config } from '../config/config';

export const protectAdmin = (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET || 'fallback_secret_key_change_me') as any;

            if (decoded.role === 'admin') {
                next();
            } else {
                res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized as admin' });
            }
        } catch (error) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized, no token' });
    }
};
