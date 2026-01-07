// Connect with mongoDb

import mongoose from 'mongoose'; // Mongoose ODM for MongoDB

/**
 * Establishes a connection to the MongoDB database.
 * @param url - The MongoDB connection string
 */
const connection = async (url: string) => {
    // Event listener for successful connection
    mongoose.connection.on('connected', () => {
        console.log("Connected to database successfully");
    });

    // Event listener for connection errors
    mongoose.connection.on('error', (err) => {
        console.log("Error connecting to database", err);
    });

    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(url as string);
    } catch (error) {
        // Log critical connection failures
        console.error("Failed to connect to database:", error);
        process.exit(1); // Exit process on DB failure
    }
};

export default connection;
