"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const userModel_1 = __importDefault(require("../Database/models/userModel"));
const svix_1 = require("svix");
const clerkWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const whook = new svix_1.Webhook(process.env.CLERK_WEBHOOK_KEY);
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };
        yield whook.verify(JSON.stringify(req.body), headers);
        const { data, type } = req.body;
        console.log(`Webhook received: ${type} for user ${data.id}`);
        const userData = {
            clerkUserId: data.id,
            email: ((_b = (_a = data.email_addresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.email_address) || null,
            username: data.username || null,
            firstName: data.first_name || null,
            lastName: data.last_name || null,
            profilepicture: data.image_url || null,
        };
        switch (type) {
            case 'user.created': {
                console.log('Creating user:', userData);
                const user = yield userModel_1.default.findOneAndUpdate({ clerkUserId: data.id }, userData, {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                });
                if (user) {
                    console.log('User created/updated successfully:', user._id);
                }
                else {
                    console.error('Failed to create/update user');
                }
                break;
            }
            case 'user.updated': {
                console.log('Updating user:', data.id);
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ clerkUserId: data.id }, userData, {
                    new: true,
                    runValidators: true
                });
                console.log('User updated:', updatedUser ? 'Success' : 'Failed');
                break;
            }
            case 'user.deleted': {
                console.log('Deleting user:', data.id);
                const deletedUser = yield userModel_1.default.findOneAndDelete({ clerkUserId: data.id });
                console.log('User deleted:', deletedUser ? 'Success' : 'Not found');
                break;
            }
            default:
                console.log(`Unhandled webhook event: ${type}`);
                break;
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'Webhook processed successfully',
            eventType: type,
        });
    }
    catch (error) {
        console.error('Webhook error:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});
exports.default = clerkWebhook;
