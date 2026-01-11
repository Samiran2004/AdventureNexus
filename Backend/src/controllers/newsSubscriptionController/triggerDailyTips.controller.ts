import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendAutoDailyTipsJob from '../../jobs/dailyTips.job';

/**
 * Manually trigger the daily tips job.
 * Useful for external schedulers (Render Cron, GitHub Actions, etc) to ensure the job runs
 * even if the server is sleeping.
 */
const triggerDailyTips = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await sendAutoDailyTipsJob();

        if (result && result.status === 'success') {
            res.status(StatusCodes.OK).json({
                message: 'Daily tips job executed successfully',
                details: result
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Daily tips job failed or completed with errors',
                details: result
            });
        }
    } catch (error) {
        next(error);
    }
};

export default triggerDailyTips;
