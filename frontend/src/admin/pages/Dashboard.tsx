import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import { Users, Map, Star, TrendingUp, AlertTriangle, ChevronRight, Activity, Clock, Shield, ArrowUpRight, ArrowDownRight, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface Stats {
    totalUsers: number;
    totalPlans: number;
    totalReviews: number;
    recentPlans: any[];
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats');
                setStats(res.data.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-white">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );

    const cards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
        { title: 'Total Plans', value: stats?.totalPlans || 0, icon: Map, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
        { title: 'Total Reviews', value: stats?.totalReviews || 0, icon: MessageSquare, gradient: 'from-orange-500 to-rose-600', shadow: 'shadow-orange-500/20' },
    ];

    const chartData = [
        { name: 'Users', count: stats?.totalUsers || 0 },
        { name: 'Plans', count: stats?.totalPlans || 0 },
        { name: 'Reviews', count: stats?.totalReviews || 0 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white tracking-tight">Overview</h1>
                <p className="text-gray-500 font-medium">Monitoring system performance and user engagement.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800/30 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent blur-2xl transition-transform group-hover:scale-150"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.15em]">{card.title}</p>
                                <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{card.value}</p>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center ${card.shadow} border border-white/10 transition-transform group-hover:rotate-12`}>
                                <card.icon className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Charts Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800/20 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative group"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <TrendingUp className="w-5 h-5 text-indigo-400" />
                            </div>
                            Platform Distribution
                        </h2>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0.2} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#4b5563"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#4b5563"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{
                                        backgroundColor: '#111827',
                                        borderColor: '#ffffff10',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 10px 50px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="url(#barGradient)"
                                    radius={[8, 8, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Recent Activity (Plans) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800/20 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/5 shadow-xl"
                >
                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <Map className="w-5 h-5 text-emerald-400" />
                        </div>
                        Recent Expeditions
                    </h2>
                    <div className="space-y-4 max-h-[19rem] overflow-y-auto custom-scrollbar pr-2">
                        {stats?.recentPlans?.map((plan: any, idx: number) => (
                            <motion.div
                                key={plan._id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + (idx * 0.05) }}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group cursor-default"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center font-black text-xs text-indigo-400 group-hover:scale-110 transition-transform">
                                        {idx + 1}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-200">{plan.to}</span>
                                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Plan ID: {plan._id.slice(-6)}</span>
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 bg-gray-900 px-3 py-1.5 rounded-lg border border-white/5">
                                    {new Date(plan.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            </motion.div>
                        ))}
                        {!stats?.recentPlans?.length && (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500 italic text-sm">
                                <Map className="w-10 h-10 mb-2 opacity-20" />
                                No recent plans detected.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
