import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Settings from '../../../shared/database/models/settingsModel';
import SubscribeMail from '../../../shared/database/models/subscribeMail.model';
import AuditLog from '../../../shared/database/models/auditLogModel';
import logger from '../../../shared/utils/logger';

// --- System Configuration ---
export const getSystemSettings = async (req: Request, res: Response) => {
    try {
        const settings = await Settings.find();
        res.status(StatusCodes.OK).json({ status: 'Success', data: settings });
    } catch (error) {
        logger.error('Error fetching system settings:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

export const updateSystemSetting = async (req: Request, res: Response) => {
    try {
        const { key, value } = req.body;

        const setting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );

        // Log the tactical change
        await AuditLog.log({
            action: 'UPDATE_SETTING',
            module: 'SYSTEM_CONTROLS',
            adminId: 'admin',
            targetId: key,
            details: { newValue: value },
            severity: key === 'MAINTENANCE_MODE' && value === true ? 'critical' : 'warning'
        });

        res.status(StatusCodes.OK).json({ status: 'Success', data: setting });
    } catch (error) {
        logger.error('Error updating system setting:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- Newsletter Management ---
export const getSubscribers = async (req: Request, res: Response) => {
    try {
        const subscribers = await SubscribeMail.find().sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({ status: 'Success', data: subscribers });
    } catch (error) {
        logger.error('Error fetching subscribers:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

export const deleteSubscriber = async (req: Request, res: Response) => {
    try {
        await SubscribeMail.findByIdAndDelete(req.params.id);

        await AuditLog.log({
            action: 'DELETE_SUBSCRIBER',
            module: 'NEWSLETTER',
            adminId: 'admin',
            targetId: req.params.id,
            severity: 'info'
        });

        res.status(StatusCodes.OK).json({ status: 'Success', message: 'Subscriber removed' });
    } catch (error) {
        logger.error('Error deleting subscriber:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};
