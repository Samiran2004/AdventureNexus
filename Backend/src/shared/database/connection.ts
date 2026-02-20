// Connect with MongoDB — with retry logic (no process.exit)

import mongoose from 'mongoose';
import logger from '../utils/logger';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000; // 5 seconds between retries

/**
 * Establishes a connection to the MongoDB database.
 * Retries up to MAX_RETRIES times before giving up (without crashing the server).
 */
const connection = async (url: string, attempt = 1): Promise<void> => {
    // Event listener for successful connection (only register once)
    if (attempt === 1) {
        mongoose.connection.on('connected', () => {
            logger.info('Connected to database successfully');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('Database connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Database disconnected. Attempting to reconnect...');
        });
    }

    try {
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 8000, // Give up selecting a server after 8s
            connectTimeoutMS: 10000,        // Give up initial connection after 10s
        });
    } catch (error: any) {
        logger.error(
            `Failed to connect to database (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`
        );

        if (attempt >= MAX_RETRIES) {
            logger.error(
                '❌ Could not connect to MongoDB after maximum retries. ' +
                'Server will continue running — please resume your Atlas cluster at https://cloud.mongodb.com'
            );
            return; // Don't crash — let the server keep running
        }

        logger.info(`Retrying database connection in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return connection(url, attempt + 1);
    }
};

export default connection;
