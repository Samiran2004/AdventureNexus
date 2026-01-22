// Connect with mongoDb

import mongoose from 'mongoose'; // Mongoose ODM for MongoDB
import logger from '../utils/logger';

/**
 * Establishes a connection to the MongoDB database.
 * @param url - The MongoDB connection string
 */
const connection = async (url: string) => {
    // Event listener for successful connection
    mongoose.connection.on('connected', () => {
        logger.info("Connected to database successfully");
    });

    // Event listener for connection errors
    mongoose.connection.on('error', (err) => {
        logger.error("Error connecting to database", err);
    });

    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(url as string);
    } catch (error) {
        // Log critical connection failures
        logger.error("Failed to connect to database:", error);
        process.exit(1); // Exit process on DB failure
    }
};

export default connection;
