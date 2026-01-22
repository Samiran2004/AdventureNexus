import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../shared/utils/logger';
import { config } from '../../../shared/config/config';

const ADMIN_CREDENTIALS = {
    username: 'admin123',
    password: 'admin123'
};

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {

            // Sign Token
            const token = jwt.sign(
                { role: 'admin', username: 'admin' },
                config.JWT_ACCESS_SECRET || 'fallback_secret_key_change_me',
                { expiresIn: '24h' }
            );

            logger.info('Admin logged in successfully');

            return res.status(StatusCodes.OK).json({
                status: 'Success',
                token,
                message: 'Admin authenticated'
            });
        }

        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: 'Failed',
            message: 'Invalid credentials'
        });

    } catch (error) {
        logger.error('Admin login error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: 'Internal Server Error'
        });
    }
};
