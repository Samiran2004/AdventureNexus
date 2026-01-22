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
exports.broadcastMessage = void 0;
const http_status_codes_1 = require("http-status-codes");
const socket_1 = require("../../../shared/socket/socket");
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const broadcastMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, severity = 'info' } = req.body;
        if (!message) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Message is required' });
        }
        const io = (0, socket_1.getIO)();
        console.log(`[DEBUG] Attempting to broadcast to all: "${message}"`);
        io.emit('system:announcement', {
            message,
            severity,
            timestamp: new Date(),
            sender: 'NexusAdmin'
        });
        logger_1.default.info(`System broadcast sent: ${message}`);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: 'Success',
            message: 'Broadcast sent successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error sending broadcast:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
});
exports.broadcastMessage = broadcastMessage;
