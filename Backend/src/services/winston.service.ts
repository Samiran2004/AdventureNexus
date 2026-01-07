import winston from "winston";
import path from "path";

// Define log file paths
const logDir = 'logs'; // Ensure this folder exists or is created
const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // 1. Log to the console (Terminal)
        new winston.transports.Console(),

        // 2. Log ONLY errors to error.log
        new winston.transports.File({
            filename: errorLogPath,
            level: 'error'
        }),

        // 3. Log everything (info, error, etc.) to combined.log
        new winston.transports.File({
            filename: combinedLogPath
        }),
    ],
});

export default winstonLogger;