import chalk from "chalk";
import cron from "node-cron";

/**
 * Simple Runner Job for testing Cron functionality.
 * Runs every 10 seconds to indicate the scheduler is active.
 */
const runnerCronJob = async () => {
    try {
        console.log(chalk.bgCyan(`Runner is running...`));
    } catch (error) {
        console.log(chalk.red("Failed to run runner cron job..."));
    }
}

cron.schedule("*/10 * * * * *", runnerCronJob, { timezone: "Asia/Kolkata" });

export default runnerCronJob;