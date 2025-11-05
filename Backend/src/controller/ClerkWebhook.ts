import { StatusCodes } from 'http-status-codes';
import User from '../Database/models/userModel';
import { Webhook } from 'svix';
import { Request, Response } from 'express';
import emailTemplates from '../utils/emailTemplate';
import sendMail from '../service/mailService';
import { config } from '../config/config';

const clerkWebhook = async (req: Request, res: Response) => {
    try {
        const whook = new Webhook(config.CLERK_WEBHOOK_KEY!);

        const headers = {
            'svix-id': req.headers['svix-id'] as string,
            'svix-timestamp': req.headers['svix-timestamp'] as string,
            'svix-signature': req.headers['svix-signature'] as string,
        };

        await whook.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body;
        console.log(`Webhook received: ${type} for user ${data.id}`);

        const userData = {
            clerkUserId: data.id,
            email: data.email_addresses?.[0]?.email_address || null,
            username: data.username || null,
            firstName: data.first_name || null,
            lastName: data.last_name || null,
            profilepicture: data.image_url || null,
        };

        switch (type) {
            case 'user.created': {
                console.log('Creating user:', userData);

                try {
                    // Try to create the user first
                    const user = await User.create(userData);
                    console.log('User created successfully:', user._id);
                } catch (error: any) {
                    if (error.code === 11000) {
                        // If duplicate key error, try to update instead
                        console.log('User exists, updating...');
                        const user = await User.findOneAndUpdate(
                            { clerkUserId: data.id },
                            userData,
                            { new: true }
                        );
                        const { registerEmailData } = emailTemplates;
                        const emailData = registerEmailData(userData.firstName, userData.email);
                        await sendMail(emailData, (mailError: Error | null) => {
                            if (mailError) {
                                console.log("Mail sending error.");
                            }
                        });
                        console.log('User updated successfully:', user?._id);
                    } else {
                        throw error; // Re-throw other errors
                    }
                }
                break;
            }

            case 'user.updated': {
                console.log('Updating user:', data.id);
                const updatedUser = await User.findOneAndUpdate(
                    { clerkUserId: data.id },
                    userData,
                    {
                        new: true,
                    }
                );
                console.log('User updated:', updatedUser ? 'Success' : 'Failed');
                break;
            }

            case 'user.deleted': {
                console.log('Deleting user:', data.id);
                const deletedUser = await User.findOneAndDelete({ clerkUserId: data.id });
                console.log('User deleted:', deletedUser ? 'Success' : 'Not found');
                const { deleteUserEmailData } = emailTemplates;
                const emailData = deleteUserEmailData(deletedUser.firstName, deletedUser.email);
                await sendMail(emailData, (mailError: Error | null) => {
                    if (mailError) {
                        console.log("Mail sending error...");
                    }
                });
                break;
            }

            default:
                console.log(`Unhandled webhook event: ${type}`);
                break;
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Webhook processed successfully',
            eventType: type,
        });

    } catch (error: any) {
        console.error('Webhook error:', error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export default clerkWebhook;
