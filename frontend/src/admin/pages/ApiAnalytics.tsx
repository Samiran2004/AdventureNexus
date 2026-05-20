import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import {
    Activity, BarChart3, PieChart as PieChartIcon,
    AlertCircle, CheckCircle2, Zap, RefreshCw,
    Globe, ShieldCheck, Terminal
} from 'lucide-react';
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';

interface AnalyticsData {
    distribution: { _id: string, count: number }[];
    latency: { date: string, value: number }[];
    errors: { endpoint: string, method: string, count: number }[];
}

const COLORS = {
    Success: '#10b981',
    Redirect: '#6366f1',
    Error: '#f43f5e'
};

const ApiAnalytics: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics');
            setData(res.data.data);
        } catch (error) {
            console.error('Failed to fetch API analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-white gap-3">
                <span className="w-8 h-8 border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Querying Analytics Logs...</span>
            </div>
        );
    }

    if (!data) return null;

    const totalRequests = data.distribution.reduce((acc, curr) => acc + curr.count, 0);
    const errorCount = data.distribution.find(d => d._id === 'Error')?.count || 0;
    const errorRate = totalRequests > 0 ? ((errorCount / totalRequests) * 100).toFixed(1) : '0.0';
    const successCount = data.distribution.find(d => d._id === 'Success')?.count || 0;
    const uptimePercentage = totalRequests > 0 ? (((totalRequests - errorCount) / totalRequests) * 100).toFixed(2) : '100.00';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pb-20 select-none font-sans"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-b-white/5 pb-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase font-mono">
                            API Command <span className="text-emerald-400 font-sans">Center</span>
                        </h1>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">
                        Real-time HTTP request logging and service telemetry
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchAnalytics}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-[10px] font-bold text-gray-400 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all uppercase tracking-widest font-mono"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Refresh Telemetry
                    </button>
                </div>
            </div>

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'TOTAL INGESTED VOLUME', value: totalRequests.toLocaleString(), icon: Globe, color: 'text-indigo-400', border: 'border-indigo-500/20' },
                    { label: 'AVERAGE LATENCY SPEED', value: data.latency.length > 0 ? `${Math.round(data.latency.reduce((a, b) => a + b.value, 0) / data.latency.length)}ms` : '0ms', icon: Zap, color: 'text-amber-400', border: 'border-amber-500/20' },
                    { label: 'SERVICE FAILURE RATIO', value: `${errorRate}%`, icon: AlertCircle, color: parseFloat(errorRate) > 5 ? 'text-red-400' : 'text-emerald-400', border: parseFloat(errorRate) > 5 ? 'border-red-500/20' : 'border-emerald-500/20' },
                    { label: 'NODE OPERATIONAL UPTIME', value: `${uptimePercentage}%`, icon: ShieldCheck, color: 'text-cyan-400', border: 'border-cyan-500/20' }
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-[#0c0c0c]/80 backdrop-blur-md p-5 rounded-2xl border ${stat.border} flex items-center gap-5 shadow-sm`}>
                        <div className={`p-3.5 rounded-xl bg-white/[0.02] border border-white/5 ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                            <h3 className="text-xl lg:text-2xl font-black text-white font-mono">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recharts visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Latency Area Chart (Left 2 columns) */}
                <div className="lg:col-span-2 bg-[#0c0c0c]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 relative h-[360px] flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-black text-white uppercase tracking-widest font-mono">Core System Latency Ingestions</h4>
                    </div>

                    <div className="flex-1 w-full h-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.latency} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="latencyGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} fontStyle="mono font-bold" />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} tickFormatter={(v) => `${v}ms`} fontStyle="mono font-bold" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#0a0a0a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '11px',
                                        fontFamily: 'monospace'
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#latencyGlow)" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.3))' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* HTTP Status Distribution Pie Chart (Right column) */}
                <div className="lg:col-span-1 bg-[#0c0c0c]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 relative h-[360px] flex flex-col justify-between items-center">
                    <div className="flex items-center gap-3 mb-2 self-start">
                        <PieChartIcon className="w-4 h-4 text-purple-400" />
                        <h4 className="text-xs font-black text-white uppercase tracking-widest font-mono">Response Code Allocation</h4>
                    </div>

                    <div className="relative w-full h-[220px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={4}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {data.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry._id as keyof typeof COLORS] || '#8884d8'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#0a0a0a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '11px',
                                        fontFamily: 'monospace'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-[9px] uppercase font-black text-gray-500 tracking-widest">Global Status</span>
                            <span className="text-2xl font-black text-white font-mono">{uptimePercentage}%</span>
                        </div>
                    </div>

                    <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest font-mono mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded bg-[#10b981]"></span>
                            <span className="text-emerald-400">Success</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded bg-[#6366f1]"></span>
                            <span className="text-indigo-400">Redirect</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded bg-[#f43f5e]"></span>
                            <span className="text-rose-400">Error</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error hotspots table */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 to-rose-600"></div>

                <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Ecosystem Critical Hotspots</h4>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-mono">IDENTIFIED ROUTING ANOMALIES & FAILURE VECTORS</span>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left font-mono">
                        <thead className="border-b border-white/10 uppercase text-[10px]">
                            <tr>
                                <th className="pb-3 font-black text-gray-500 tracking-widest pl-4">Request Method</th>
                                <th className="pb-3 font-black text-gray-500 tracking-widest">Routing Endpoint</th>
                                <th className="pb-3 font-black text-gray-500 tracking-widest text-right pr-4">Anomalous Counts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[11px]">
                            {data.errors.map((error, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="py-4 pl-4">
                                        <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                                            error.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            error.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                        }`}>
                                            {error.method}
                                        </span>
                                    </td>
                                    <td className="py-4 text-xs font-bold text-gray-300 tracking-tight">{error.endpoint}</td>
                                    <td className="py-4 pr-4 text-right">
                                        <span className="text-rose-500 font-black text-base drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]">{error.count}</span>
                                    </td>
                                </tr>
                            ))}

                            {data.errors.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-12 text-center text-[10px] text-gray-600 font-black uppercase tracking-widest">
                                        NO DEVIATING SERVICE FAILURE SIGNALS RECORDED
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default ApiAnalytics;
