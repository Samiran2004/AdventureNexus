import { StatusCodes } from 'http-status-codes';
import User from '../../../shared/database/models/userModel';
import { Webhook } from 'svix';
import { Request, Response } from 'express';
import emailTemplates from '../../../shared/utils/email-templates';
import sendMail from '../../../shared/services/mailService';
import { config } from '../../../shared/config/config';
import logger from '../../../shared/utils/logger';

/**
 * Controller to handle Clerk Webhooks.
 * Syncs user data from Clerk (Create, Update, Delete) to local MongoDB.
 */
const clerkWebhook = async (req: Request, res: Response) => {
    try {
        // 1. Initialize Svix Webhook with Secret
        const whook = new Webhook(config.CLERK_WEBHOOK_KEY!);

        // 2. Extract Svix Headers for Verification
        const headers = {
            'svix-id': req.headers['svix-id'] as string,
            'svix-timestamp': req.headers['svix-timestamp'] as string,
            'svix-signature': req.headers['svix-signature'] as string,
        };

        // 3. Verify Webhook Signature (Throws error if invalid)
        await whook.verify(JSON.stringify(req.body), headers);

        // 4. Extract Data and Event Type
        const { data, type } = req.body;
        logger.info(`Webhook received: ${type} for user ${data.id}`);

        // 5. Prepare User Data Object
        const userData = {
            clerkUserId: data.id,
            email: data.email_addresses?.[0]?.email_address || null,
            username: data.username || null,
            firstName: data.first_name || null,
            lastName: data.last_name || null,
            profilepicture: data.image_url || null,
        };

        // 6. Handle Specific Event Types
        switch (type) {
            case 'user.created': {
                logger.info({ msg: 'Creating user:', userData });

                try {
                    // Try to create the user first
                    const user = await User.create(userData);
                    logger.info(`User created successfully: ${user._id}`);

                    // Send Welcome Email for new user registration
                    const { registerEmailData } = emailTemplates;
                    const emailData = registerEmailData(userData.firstName, userData.email);
                    await sendMail(emailData, (mailError: Error | null) => {
                        if (mailError) {
                            logger.error("Mail sending error.");
                        }
                    });

                    // Emit Socket Event
                    const { getIO } = await import('../../../shared/socket/socket');
                    getIO().emit('user:created', user);

                } catch (error: any) {
                    if (error.code === 11000) {
                        // If duplicate key error, try to update instead (Idempotency)
                        logger.info('User exists, updating...');
                        const user = await User.findOneAndUpdate(
                            { clerkUserId: data.id },
                            userData,
                            { new: true }
                        );
                        // Send Welcome Email for new/updated user registration via Webhook
                        const { registerEmailData } = emailTemplates;
                        const emailData = registerEmailData(userData.firstName, userData.email);
                        await sendMail(emailData, (mailError: Error | null) => {
                            if (mailError) {
                                logger.error("Mail sending error.");
                            }
                        });
                        logger.info(`User updated successfully: ${user?._id}`);
                    } else {
                        throw error; // Re-throw other errors
                    }
                }
                break;
            }

            case 'user.updated': {
                logger.info(`Updating user: ${data.id}`);
                const updatedUser = await User.findOneAndUpdate(
                    { clerkUserId: data.id },
                    userData,
                    {
                        new: true,
                    }
                );
                logger.info(`User updated: ${updatedUser ? 'Success' : 'Failed'}`);
                break;
            }

            case 'user.deleted': {
                logger.info(`Deleting user: ${data.id}`);
                const deletedUser = await User.findOneAndDelete({ clerkUserId: data.id });
                logger.info(`User deleted: ${deletedUser ? 'Success' : 'Not found'}`);

                // Send Account Deletion Email
                if (deletedUser) {
                    const { deleteUserEmailData } = emailTemplates;
                    const emailData = deleteUserEmailData(deletedUser.firstName, deletedUser.email);
                    await sendMail(emailData, (mailError: Error | null) => {
                        if (mailError) {
                            logger.error("Mail sending error...");
                        }
                    });
                }

                // Emit Socket Event
                const { getIO } = await import('../../../shared/socket/socket');
                getIO().emit('user:deleted', data.id);
                break;
            }

            default:
                logger.warn(`Unhandled webhook event: ${type}`);
                break;
        }

        // 7. Return Success Response to Clerk
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Webhook processed successfully',
            eventType: type,
        });

    } catch (error: any) {
        logger.error('Webhook error:', error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export default clerkWebhook;
