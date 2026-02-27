"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRealtimeMessage = exports.sendRealtimeNotification = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const onlineUsers = new Map();
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        console.log(`[DEBUG] New client connected: ${socket.id}`);
        socket.on('identity', (userId) => {
            var _a;
            if (!userId)
                return;
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
                io.emit('user:online', userId);
            }
            (_a = onlineUsers.get(userId)) === null || _a === void 0 ? void 0 : _a.add(socket.id);
            socket.userId = userId;
        });
        socket.on('get-online-users', () => {
            const onlineIds = Array.from(onlineUsers.keys());
            socket.emit('online-users-list', onlineIds);
        });
        socket.on('disconnect', () => {
            const userId = socket.userId;
            if (userId && onlineUsers.has(userId)) {
                const userSockets = onlineUsers.get(userId);
                userSockets === null || userSockets === void 0 ? void 0 : userSockets.delete(socket.id);
                if ((userSockets === null || userSockets === void 0 ? void 0 : userSockets.size) === 0) {
                    onlineUsers.delete(userId);
                    io.emit('user:offline', userId);
                }
            }
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIO = getIO;
const sendRealtimeNotification = (recipientClerkUserId, notification) => {
    var _a;
    if (onlineUsers.has(recipientClerkUserId)) {
        (_a = onlineUsers.get(recipientClerkUserId)) === null || _a === void 0 ? void 0 : _a.forEach(socketId => {
            io.to(socketId).emit('notification', notification);
        });
    }
};
exports.sendRealtimeNotification = sendRealtimeNotification;
const sendRealtimeMessage = (recipientClerkUserId, message) => {
    var _a;
    if (onlineUsers.has(recipientClerkUserId)) {
        (_a = onlineUsers.get(recipientClerkUserId)) === null || _a === void 0 ? void 0 : _a.forEach(socketId => {
            io.to(socketId).emit('message:direct', message);
        });
    }
};
exports.sendRealtimeMessage = sendRealtimeMessage;
