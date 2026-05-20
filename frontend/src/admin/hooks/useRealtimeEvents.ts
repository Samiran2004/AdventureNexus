import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../context/AdminSocketContext';
import api from '../services/adminApi';

export interface ActivityEvent {
    _id: string;
    clerkUserId: string;
    username: string;
    activityType: string;
    targetId: string;
    details: string;
    createdAt: string;
}

export const useRealtimeEvents = () => {
    const { socket } = useSocket();
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInitialLogs = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/activity');
            if (res.data && res.data.success) {
                setEvents(res.data.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialLogs();
    }, [fetchInitialLogs]);

    useEffect(() => {
        if (!socket) return;

        // Listen for new activity events from our central event tracker
        socket.on('activity:new', (newEvent: ActivityEvent) => {
            setEvents((prev) => {
                // Prepend new event, capped at 50 to maintain high performance
                const updated = [newEvent, ...prev];
                if (updated.length > 50) {
                    updated.pop();
                }
                return updated;
            });
        });

        return () => {
            socket.off('activity:new');
        };
    }, [socket]);

    return { events, loading, error, refresh: fetchInitialLogs };
};
