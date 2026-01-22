"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const userModel_1 = __importDefault(require("../../../shared/database/models/userModel"));
const svix_1 = require("svix");
const email_templates_1 = __importDefault(require("../../../shared/utils/email-templates"));
const mailService_1 = __importDefault(require("../../../shared/services/mailService"));
const config_1 = require("../../../shared/config/config");
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const clerkWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const whook = new svix_1.Webhook(config_1.config.CLERK_WEBHOOK_KEY);
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };
        yield whook.verify(JSON.stringify(req.body), headers);
        const { data, type } = req.body;
        logger_1.default.info(`Webhook received: ${type} for user ${data.id}`);
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
                logger_1.default.info({ msg: 'Creating user:', userData });
                try {
                    const user = yield userModel_1.default.create(userData);
                    logger_1.default.info(`User created successfully: ${user._id}`);
                    const { registerEmailData } = email_templates_1.default;
                    const emailData = registerEmailData(userData.firstName, userData.email);
                    yield (0, mailService_1.default)(emailData, (mailError) => {
                        if (mailError) {
                            logger_1.default.error("Mail sending error.");
                        }
                    });
                    const { getIO } = yield Promise.resolve().then(() => __importStar(require('../../../shared/socket/socket')));
                    getIO().emit('user:created', user);
                }
                catch (error) {
                    if (error.code === 11000) {
                        logger_1.default.info('User exists, updating...');
                        const user = yield userModel_1.default.findOneAndUpdate({ clerkUserId: data.id }, userData, { new: true });
                        const { registerEmailData } = email_templates_1.default;
                        const emailData = registerEmailData(userData.firstName, userData.email);
                        yield (0, mailService_1.default)(emailData, (mailError) => {
                            if (mailError) {
                                logger_1.default.error("Mail sending error.");
                            }
                        });
                        logger_1.default.info(`User updated successfully: ${user === null || user === void 0 ? void 0 : user._id}`);
                    }
                    else {
                        throw error;
                    }
                }
                break;
            }
            case 'user.updated': {
                logger_1.default.info(`Updating user: ${data.id}`);
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ clerkUserId: data.id }, userData, {
                    new: true,
                });
                logger_1.default.info(`User updated: ${updatedUser ? 'Success' : 'Failed'}`);
                break;
            }
            case 'user.deleted': {
                logger_1.default.info(`Deleting user: ${data.id}`);
                const deletedUser = yield userModel_1.default.findOneAndDelete({ clerkUserId: data.id });
                logger_1.default.info(`User deleted: ${deletedUser ? 'Success' : 'Not found'}`);
                if (deletedUser) {
                    const { deleteUserEmailData } = email_templates_1.default;
                    const emailData = deleteUserEmailData(deletedUser.firstName, deletedUser.email);
                    yield (0, mailService_1.default)(emailData, (mailError) => {
                        if (mailError) {
                            logger_1.default.error("Mail sending error...");
                        }
                    });
                }
                const { getIO } = yield Promise.resolve().then(() => __importStar(require('../../../shared/socket/socket')));
                getIO().emit('user:deleted', data.id);
                break;
            }
            default:
                logger_1.default.warn(`Unhandled webhook event: ${type}`);
                break;
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'Webhook processed successfully',
            eventType: type,
        });
    }
    catch (error) {
        logger_1.default.error('Webhook error:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});
exports.default = clerkWebhook;
