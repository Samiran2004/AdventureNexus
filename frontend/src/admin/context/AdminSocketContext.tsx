import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Assuming Backend runs on port 8000
        const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000');
        console.log('[DEBUG] Admin socket connecting to:', import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000');

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('[DEBUG] Admin socket connected:', newSocket.id);
        });

        newSocket.on('system:announcement', (data) => {
            console.log('[DEBUG] Announcement received on admin side:', data);
            toast(data.message, {
                icon: '⚡',
                duration: 6000,
                style: {
                    background: '#111',
                    color: '#fff',
                    border: '1px solid #4f46e5',
                }
            });
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
