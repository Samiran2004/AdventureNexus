import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../context/AdminSocketContext';
import api from '../services/adminApi';

export interface ObservabilityMetrics {
    totalUsers: number;
    activeUsers: number;
    postsCreatedToday: number;
    experiencesCreatedToday: number;
    commentsCount: number;
    likesCount: number;
    groupJoins: number;
}

export interface TimeSeriesData {
    hourlyRegistrations: { hour: string; registrations: number }[];
    dailyPosts: { date: string; count: number }[];
    apiLatency: { date: string; value: number }[];
}

export interface SystemHealthMetrics {
    cpuLoad: number;
    memory: {
        total: number;
        free: number;
        used: number;
        percentage: number;
    };
    uptime: number;
}

export const useAdminMetrics = () => {
    const { socket } = useSocket();
    const [metrics, setMetrics] = useState<ObservabilityMetrics | null>(null);
    const [timeSeries, setTimeSeries] = useState<TimeSeriesData | null>(null);
    const [systemHealth, setSystemHealth] = useState<SystemHealthMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllMetrics = useCallback(async () => {
        try {
            setLoading(true);
            const [metricsRes, timeSeriesRes, healthRes] = await Promise.all([
                api.get('/metrics'),
                api.get('/timeseries'),
                api.get('/health')
            ]);

            if (metricsRes.data.success) {
                setMetrics(metricsRes.data.data);
            }
            if (timeSeriesRes.data.success) {
                setTimeSeries(timeSeriesRes.data.data);
            }
            if (healthRes.data.status === 'Success') {
                setSystemHealth(healthRes.data.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dashboard metrics');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllMetrics();
    }, [fetchAllMetrics]);

    // Live Socket listener for dynamic incremental updates & CPU/Memory streams
    useEffect(() => {
        if (!socket) return;

        // 1. Stream live CPU & RAM metrics from background ticker
        socket.on('system:metrics:update', (data: SystemHealthMetrics) => {
            setSystemHealth(data);
        });

        // 2. Stream activity logs to dynamically update Metrics Cards (Datadog Style)
        socket.on('activity:new', (activity: { activityType: string }) => {
            setMetrics((prev) => {
                if (!prev) return null;
                const updated = { ...prev };
                
                if (activity.activityType === 'user:joined') {
                    updated.totalUsers += 1;
                    updated.activeUsers += 1;
                } else if (activity.activityType === 'post:created') {
                    updated.postsCreatedToday += 1;
                } else if (activity.activityType === 'comment:created') {
                    updated.commentsCount += 1;
                } else if (activity.activityType === 'like:added') {
                    updated.likesCount += 1;
                } else if (activity.activityType === 'group:joined') {
                    updated.groupJoins += 1;
                }
                return updated;
            });
        });

        return () => {
            socket.off('system:metrics:update');
            socket.off('activity:new');
        };
    }, [socket]);

    return {
        metrics,
        timeSeries,
        systemHealth,
        loading,
        error,
        refresh: fetchAllMetrics
    };
};
