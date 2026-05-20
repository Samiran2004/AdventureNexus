import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../utils/logger';
import os from 'os';

let io: Server;

// Map <UserId, Set<SocketId>>
const onlineUsers = new Map<string, Set<string>>();

export const initSocket = (server: HttpServer): Server => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Periodic system metrics broadcast (Phase 4 Grafana Real-Time Observability)
    setInterval(() => {
        try {
            if (io) {
                const cpuUsage = os.loadavg();
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const memPercent = parseFloat(((usedMem / totalMem) * 100).toFixed(2));
                
                io.emit('system:metrics:update', {
                    cpuLoad: cpuUsage[0],
                    memory: {
                        total: totalMem,
                        free: freeMem,
                        used: usedMem,
                        percentage: memPercent
                    },
                    uptime: os.uptime()
                });
            }
        } catch (err) {
            // Fail-safe to prevent crash
        }
    }, 5000);

    io.on('connection', (socket) => {
        console.log(`[DEBUG] New client connected: ${socket.id}`);

        socket.on('identity', (userId: string) => {
            if (!userId) return;

            // Add to map
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
                // First connection for this user -> Notify Admins they are online
                io.emit('user:online', userId);
            }
            onlineUsers.get(userId)?.add(socket.id);

            // Attach userId to socket for disconnect handling
            (socket as any).userId = userId;

            // logger.info(`User identified: ${userId}`);
        });

        socket.on('get-online-users', () => {
            // Send list of online User IDs
            const onlineIds = Array.from(onlineUsers.keys());
            socket.emit('online-users-list', onlineIds);
        });

        socket.on('group:join', (groupId: string) => {
            if (!groupId) return;
            socket.join(`group:${groupId}`);
            console.log(`[DEBUG] Socket ${socket.id} joined room group:${groupId}`);
        });

        socket.on('group:leave', (groupId: string) => {
            if (!groupId) return;
            socket.leave(`group:${groupId}`);
            console.log(`[DEBUG] Socket ${socket.id} left room group:${groupId}`);
        });

        socket.on('disconnect', () => {
            const userId = (socket as any).userId;
            if (userId && onlineUsers.has(userId)) {
                const userSockets = onlineUsers.get(userId);
                userSockets?.delete(socket.id);

                if (userSockets?.size === 0) {
                    onlineUsers.delete(userId);
                    // Last connection dropped -> Notify Admins they are offline
                    io.emit('user:offline', userId);
                }
            }
            // logger.info(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

/**
 * Helper to broadcast an event to everyone connected.
 */
export const broadcastRealtimeEvent = (event: string, data: any) => {
    if (io) {
        io.emit(event, data);
    }
};

/**
 * Helper to emit a notification to a specific user if they are online.
 */
export const sendRealtimeNotification = (recipientClerkUserId: string, notification: any) => {
    if (io && onlineUsers.has(recipientClerkUserId)) {
        onlineUsers.get(recipientClerkUserId)?.forEach(socketId => {
            io.to(socketId).emit('notification', notification);
            io.to(socketId).emit('notification:new', notification);
        });
    }
};

/**
 * Helper to emit a message to a specific user if they are online.
 */
export const sendRealtimeMessage = (recipientClerkUserId: string, message: any) => {
    if (io && onlineUsers.has(recipientClerkUserId)) {
        onlineUsers.get(recipientClerkUserId)?.forEach(socketId => {
            io.to(socketId).emit('message:direct', message);
        });
    }
};

/**
 * Helper to emit a message to a specific user if they are online.
 */
export const sendChatRealtimeMessage = (recipientClerkUserId: string, data: any) => {
    if (io && onlineUsers.has(recipientClerkUserId)) {
        onlineUsers.get(recipientClerkUserId)?.forEach(socketId => {
            io.to(socketId).emit('chat:message', data);
        });
    }
};

/**
 * Helper to emit a message to a group room.
 */
export const sendRealtimeGroupMessage = (groupId: string, message: any) => {
    if (io) {
        io.to(`group:${groupId}`).emit('group:message', message);
    }
};

export const isUserOnline = (userId: string): boolean => {
    return onlineUsers.has(userId);
};
