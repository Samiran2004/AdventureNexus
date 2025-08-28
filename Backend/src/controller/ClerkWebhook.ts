import { StatusCodes } from 'http-status-codes';
import User from '../Database/models/userModel';
import { Webhook } from 'svix';

const cleckWebhook = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret...
        const whook = new Webhook(process.env.CLERK_WEBHOOK_KEY);

        // Getting headers...
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };

        //Verify Headers...
        await whook.verify(JSON.stringify(req.body), headers);

        // Getting data from request body...
        const { data, type } = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address || null,
            username: data.username || null, // Username field
            firstName: data.first_name || null, // First name
            lastName: data.last_name || null, // Last name
            imageUrl: data.image_url || null, // Profile image
        };

        // Switch Cases for different Events...
        switch (type) {
            case 'user.created': {
                await User.create(userData);
                break;
            }

            case 'user.updated': {
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
        }

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Webhook Recieved',
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};
export default cleckWebhook;
