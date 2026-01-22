import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getIO } from '../../../shared/socket/socket';
import logger from '../../../shared/utils/logger';

export const broadcastMessage = async (req: Request, res: Response) => {
    try {
        const { message, severity = 'info' } = req.body;

        if (!message) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Message is required' });
        }

        const io = getIO();
        console.log(`[DEBUG] Attempting to broadcast to all: "${message}"`);

        // Emit to all connected clients (including users and other admins)
        io.emit('system:announcement', {
            message,
            severity,
            timestamp: new Date(),
            sender: 'NexusAdmin'
        });

        logger.info(`System broadcast sent: ${message}`);

        res.status(StatusCodes.OK).json({
            status: 'Success',
            message: 'Broadcast sent successfully'
        });
    } catch (error) {
        logger.error('Error sending broadcast:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};
