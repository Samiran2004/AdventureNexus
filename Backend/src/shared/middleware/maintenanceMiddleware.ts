import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Settings from '../database/models/settingsModel';

export const checkMaintenance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Skip maintenance check for admin routes
        if (req.path.startsWith('/api/v1/admin')) {
            return next();
        }

        const maintenanceSetting = await Settings.findOne({ key: 'MAINTENANCE_MODE' });

        if (maintenanceSetting && maintenanceSetting.value === true) {
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
                status: 'Maintenance',
                message: 'AdventureNexus is currently undergoing scheduled maintenance. Please check back later.',
                retryAfter: 3600
            });
        }

        next();
    } catch (error) {
        // Fail-safe: if DB check fails, assume system is available
        next();
    }
};
