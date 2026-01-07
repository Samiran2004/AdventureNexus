import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function dropPhoneNumberIndex() {
    const uri = process.env.DB_URI;

    if (!uri) {
        console.error('MONGODB_URI is not defined in environment variables');
        console.error('Please check your .env file or set the environment variable');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);

        console.log('Dropping phonenumber_1 index...');
        await mongoose.connection.db.collection('users').dropIndex('phonenumber_1');
        console.log('Successfully dropped phonenumber_1 index');

    } catch (error) {
        if (error.codeName === 'IndexNotFound') {
            console.log('Index phonenumber_1 not found - it may already be dropped');
        } else {
            console.error('Error dropping index:', error.message);
        }
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the migration
dropPhoneNumberIndex();
