import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../utils/logger';

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
