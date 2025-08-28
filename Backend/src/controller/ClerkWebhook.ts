import { StatusCodes } from 'http-status-codes';
import User from '../Database/models/userModel';
import { Webhook } from 'svix';
import { Request, Response } from 'express';

const clerkWebhook = async (req: Request, res: Response) => {
    try {
        // Create a Svix instance with clerk webhook secret...
        const whook = new Webhook(process.env.CLERK_WEBHOOK_KEY!);

        // Getting headers...
        const headers = {
            'svix-id': req.headers['svix-id'] as string,
            'svix-timestamp': req.headers['svix-timestamp'] as string,
            'svix-signature': req.headers['svix-signature'] as string,
        };

        // Verify Headers...
        await whook.verify(JSON.stringify(req.body), headers);

        // Getting data from request body...
        const { data, type } = req.body;

        // Log the event for debugging
        console.log(`Webhook received: ${type} for user ${data.id}`);

        const userData = {
            clerkUserId: data.id, // Use clerkUserId instead of _id
            email: data.email_addresses?.[0]?.email_address || null,
            username: data.username || null,
            firstName: data.first_name || null,
            lastName: data.last_name || null,
            imageUrl: data.image_url || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Switch Cases for different Events...
        switch (type) {
            case 'user.created': {
                console.log('Creating user:', userData);

                // Check if user already exists
                const existingUser = await User.findOne({ clerkUserId: data.id });
                if (existingUser) {
                    console.log('User already exists, updating instead');
                    await User.findOneAndUpdate(
                        { clerkUserId: data.id },
                        userData,
                        { upsert: true, new: true }
                    );
                } else {
                    await User.create(userData);
                }
                console.log('User created/updated successfully');
                break;
            }

            case 'user.updated': {
                console.log('Updating user:', data.id);
                const updatedUser = await User.findOneAndUpdate(
                    { clerkUserId: data.id },
                    { ...userData, updatedAt: new Date() },
                    {
                        upsert: true, // Create if doesn't exist
                        new: true,    // Return updated document
                        runValidators: true // Run schema validators
                    }
                );
                console.log('User updated:', updatedUser ? 'Success' : 'Failed');
                break;
            }

            case 'user.deleted': {
                console.log('Deleting user:', data.id);
                const deletedUser = await User.findOneAndDelete({ clerkUserId: data.id });
                console.log('User deleted:', deletedUser ? 'Success' : 'Not found');
                break;
            }

            default:
                console.log(`Unhandled webhook event: ${type}`);
                break;
        }

        // Return success response
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Webhook received and processed successfully',
            eventType: type,
        });

    } catch (error) {
        console.error('Webhook error:', error);

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Validation error',
                error: error.message,
            });
        }

        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Database error',
                error: error.message,
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export default clerkWebhook;
