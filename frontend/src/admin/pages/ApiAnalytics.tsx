import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import {
    Activity, BarChart3, PieChart as PieChartIcon,
    AlertCircle, CheckCircle2, Zap, Loader2,
    ArrowUpRight, ArrowDownRight, Globe, MousePointer2
} from 'lucide-react';
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyticsData {
    distribution: { _id: string, count: number }[];
    latency: { date: string, value: number }[];
    errors: { endpoint: string, method: string, count: number }[];
}

const COLORS = {
    Success: '#10b981',
    Redirect: '#6366f1',
    Error: '#ef4444'
};

const ApiAnalytics: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics');
                setData(res.data.data);
            } catch (error) {
                console.error('Failed to fetch API analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-white">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
    );

    if (!data) return null;

    const totalRequests = data.distribution.reduce((acc, curr) => acc + curr.count, 0);
    const errorRate = ((data.distribution.find(d => d._id === 'Error')?.count || 0) / totalRequests * 100).toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white tracking-tight">API Command Center</h1>
                <p className="text-gray-500 font-medium">Real-time telemetry and error intelligence.</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Volume', value: totalRequests.toLocaleString(), icon: Globe, color: 'text-indigo-400' },
                    { label: 'Avg Latency', value: `${Math.round(data.latency.reduce((a, b) => a + b.value, 0) / data.latency.length)}ms`, icon: Zap, color: 'text-yellow-400' },
                    { label: 'Error Rate', value: `${errorRate}%`, icon: AlertCircle, color: errorRate > '5' ? 'text-red-400' : 'text-emerald-400' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-gray-800/10 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-sm">
                        <div className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Traffic Distribution */}
                <div className="bg-gray-800/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <PieChartIcon className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-bold text-white tracking-tight">Status Distribution</h2>
                    </div>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {data.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry._id as keyof typeof COLORS] || '#8884d8'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Global</span>
                            <span className="text-2xl font-black text-white">TRAFFIC</span>
                        </div>
                    </div>
                </div>

                {/* Latency Heatmap */}
                <div className="bg-gray-800/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <Activity className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-xl font-bold text-white tracking-tight">Latency Trends</h2>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.latency}>
                                <defs>
                                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="date" stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#555" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}ms`} />
                                <Tooltip
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Error Heatmap Table */}
            <div className="bg-gray-800/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Critical Hotspots</h2>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="border-b border-white/5">
                            <tr>
                                <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">Method</th>
                                <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Endpoint</th>
                                <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right pr-4">Failure Vol.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {data.errors.map((error, idx) => (
                                <tr key={idx} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="py-5 pl-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${error.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                error.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                            }`}>
                                            {error.method}
                                        </span>
                                    </td>
                                    <td className="py-5 text-sm font-medium text-gray-300 font-mono tracking-tight">{error.endpoint}</td>
                                    <td className="py-5 pr-4 text-right">
                                        <span className="text-red-400 font-black text-lg">{error.count}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default ApiAnalytics;
