import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import { useSocket } from '../context/AdminSocketContext';
import {
    Users, Map, MessageSquare, TrendingUp, Activity, Clock, Shield,
    ArrowUpRight, ArrowDownRight, Cpu, Database, Zap, Bell,
    Server, Terminal, AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface Stats {
    totalUsers: number;
    totalPlans: number;
    totalReviews: number;
    recentPlans: any[];
}

interface Health {
    cpuLoad: number;
    memory: {
        total: number;
        free: number;
        used: number;
        percentage: string;
    };
    uptime: number;
    platform: string;
    arch: string;
}

interface ActivityEvent {
    id: string;
    type: string;
    message: string;
    timestamp: Date;
    severity: 'info' | 'warning' | 'critical';
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [health, setHealth] = useState<Health | null>(null);
    const [activities, setActivities] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [sendingBroadcast, setSendingBroadcast] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, healthRes] = await Promise.all([
                    api.get('/stats'),
                    api.get('/health')
                ]);
                setStats(statsRes.data.data);
                setHealth(healthRes.data.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const healthInterval = setInterval(async () => {
            try {
                const healthRes = await api.get('/health');
                setHealth(healthRes.data.data);
            } catch (e) { /* ignore periodic errors */ }
        }, 5000);

        return () => clearInterval(healthInterval);
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNewUser = (userId: string) => {
            addActivity('NEW_USER', `New adventurer joined: ${userId.slice(-6)}`, 'info');
        };
        const handlePlanDeleted = (planId: string) => {
            addActivity('PLAN_DELETE', `Expedition decommissioned: ${planId.slice(-6)}`, 'warning');
        };
        const handleUserOnline = (userId: string) => {
            addActivity('USER_ONLINE', `User ${userId.slice(-6)} logged into Terminal`, 'info');
        };

        socket.on('user:online', handleUserOnline);
        socket.on('plan:deleted', handlePlanDeleted);

        return () => {
            socket.off('user:online', handleUserOnline);
            socket.off('plan:deleted', handlePlanDeleted);
        };
    }, [socket]);

    const addActivity = (type: string, message: string, severity: 'info' | 'warning' | 'critical') => {
        const newEvent: ActivityEvent = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            message,
            timestamp: new Date(),
            severity
        };
        setActivities(prev => [newEvent, ...prev].slice(0, 20));
    };

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!broadcastMsg.trim()) return;
        setSendingBroadcast(true);
        try {
            await api.post('/broadcast', { message: broadcastMsg, severity: 'info' });
            addActivity('BROADCAST', `System-wide alert: ${broadcastMsg}`, 'critical');
            setBroadcastMsg('');
        } catch (error) {
            alert('Failed to send broadcast');
        } finally {
            setSendingBroadcast(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-white">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );

    const formatUptime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hrs}h ${mins}m`;
    };

    const sysCards = [
        { title: 'CPU Load', value: health?.cpuLoad.toFixed(2) || '0.00', icon: Cpu, color: 'text-indigo-400', sub: 'OS 1m Average' },
        { title: 'Memory', value: `${health?.memory.percentage}%` || '0%', icon: Database, color: 'text-emerald-400', sub: 'Allocated vs Free' },
        { title: 'System Uptime', value: formatUptime(health?.uptime || 0), icon: Clock, color: 'text-orange-400', sub: 'Node Continuity' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-white tracking-tight">Intelligence</h1>
                    <p className="text-gray-500 font-medium italic">Live operational data from Nexus Core.</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-900/40 p-1 rounded-2xl border border-white/5">
                    <div className="px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Master Terminal</span>
                    </div>
                </div>
            </div>

            {/* TOP Metrics - Pulse Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sysCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/20 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl"
                    >
                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${card.color}`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <Activity className="w-4 h-4 text-gray-700 animate-pulse" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</p>
                                <p className="text-3xl font-black text-white tracking-tighter tabular-nums">{card.value}</p>
                                <p className="text-[10px] text-gray-600 font-bold mt-2 uppercase">{card.sub}</p>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Global Broadcast Center */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-indigo-500/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-indigo-500/10 shadow-xl"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Bell className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Broadcast Center</h2>
                    </div>
                    <form onSubmit={handleBroadcast} className="space-y-4">
                        <textarea
                            value={broadcastMsg}
                            onChange={(e) => setBroadcastMsg(e.target.value)}
                            placeholder="System-wide announcement..."
                            className="w-full h-32 bg-gray-900 border border-white/5 rounded-2xl p-4 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none placeholder:text-gray-700 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={sendingBroadcast || !broadcastMsg.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl py-4 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20"
                        >
                            {sendingBroadcast ? <Zap className="w-4 h-4 animate-spin" /> : <>
                                <Zap className="w-4 h-4" />
                                Initialize Global Alert
                            </>}
                        </button>
                    </form>
                    <p className="mt-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center">
                        <Shield className="w-3 h-3 inline-block mr-2" />
                        Encrypted Hub Node-01
                    </p>
                </motion.div>

                {/* Live Activity Stream */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-gray-800/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <Terminal className="w-5 h-5 text-emerald-400" />
                            </div>
                            Activity Stream
                        </h2>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase animate-pulse">Live</span>
                    </div>

                    <div className="space-y-3 h-[22rem] overflow-y-auto custom-scrollbar pr-4">
                        <AnimatePresence initial={false}>
                            {activities.map((ev) => (
                                <motion.div
                                    key={ev.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4 hover:bg-white/10 transition-colors`}
                                >
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${ev.severity === 'critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                            ev.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                                        }`}></div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-xs text-gray-300 font-bold tracking-wide">{ev.message}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{ev.type}</span>
                                            <span className="text-[9px] text-gray-700">{ev.timestamp.toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {activities.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-3 opacity-30">
                                <Terminal className="w-10 h-10" />
                                <p className="text-xs uppercase font-black tracking-[0.2em]">Awaiting system signals...</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
