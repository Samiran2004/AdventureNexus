import chalk from "chalk";
import cron from "node-cron";

const runnerCronJob = async () => {
    try {
        console.log(chalk.bgCyan("Runner is running..."));
    } catch (error) {
        console.log(chalk.red("Failed to run runner cron job..."));
    }
}

cron.schedule("*/10 * * * * *", runnerCronJob, { timezone: "Asia/Kolkata" });

export default runnerCronJob;