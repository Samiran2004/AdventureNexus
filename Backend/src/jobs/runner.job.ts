import cron from "node-cron";
import logger from "../utils/logger";

/**
 * Simple Runner Job for testing Cron functionality.
 * Runs every 10 seconds to indicate the scheduler is active.
 */
const runnerCronJob = async () => {
    try {
        logger.info(`Runner is running...`);
    } catch (error) {
        logger.error("Failed to run runner cron job...");
    }
}

cron.schedule("*/10 * * * * *", runnerCronJob, { timezone: "Asia/Kolkata" });

export default runnerCronJob;