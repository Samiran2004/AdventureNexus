import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, RefreshCw, Play, Square, AlertTriangle } from 'lucide-react';
import { useAdminMetrics } from '../hooks/useAdminMetrics';
import { useRealtimeEvents } from '../hooks/useRealtimeEvents';
import MetricsGrid from '../components/MetricsGrid';
import ChartCard from '../components/ChartCard';
import LiveActivityFeed from '../components/LiveActivityFeed';
import SystemHealthPanel from '../components/SystemHealthPanel';
import SystemLogsPanel from '../components/SystemLogsPanel';
import ToxicityRadar from '../components/ToxicityRadar';
import api from '../services/adminApi';

const Dashboard: React.FC = () => {
    const {
        metrics,
        timeSeries,
        systemHealth,
        loading: metricsLoading,
        error: metricsError,
        refresh: refreshMetrics
    } = useAdminMetrics();

    const {
        events,
        loading: eventsLoading,
        error: eventsError,
        refresh: refreshEvents
    } = useRealtimeEvents();

    const [simulatorActive, setSimulatorActive] = useState(false);
    const [simulatorLoading, setSimulatorLoading] = useState(false);

    useEffect(() => {
        const checkSimulatorStatus = async () => {
            try {
                const res = await api.get('/simulator/status');
                setSimulatorActive(res.data.data.active);
            } catch (err) {
                console.error('Failed to query simulator status', err);
            }
        };
        checkSimulatorStatus();
    }, []);

    const handleToggleSimulator = async () => {
        setSimulatorLoading(true);
        try {
            const res = await api.post('/simulator/toggle');
            setSimulatorActive(res.data.data.active);
            // Refresh systems immediately to capture initial mock signals
            setTimeout(() => {
                refreshMetrics();
                refreshEvents();
            }, 1000);
        } catch (err) {
            alert('Failed to toggle traffic simulator');
        } finally {
            setSimulatorLoading(false);
        }
    };

    const handleManualRefresh = () => {
        refreshMetrics();
        refreshEvents();
    };

    if (metricsLoading && !metrics) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-white gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-black tracking-widest text-emerald-400 uppercase animate-pulse">Initializing Observability Tunnel...</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AdventureNexus Command Center</span>
                </div>
            </div>
        );
    }

    if (metricsError || eventsError) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-white gap-4 bg-red-950/15 border border-red-500/10 rounded-3xl p-8 max-w-lg mx-auto">
                <div className="p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                    <Shield className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-black tracking-wider uppercase text-red-400">Observability Connection Failure</h3>
                <p className="text-xs text-gray-400 font-medium text-center leading-relaxed">
                    The admin client was unable to establish a secure stream with the AdventureNexus Core endpoints. Please ensure the backend is running.
                </p>
                <button
                    onClick={handleManualRefresh}
                    className="mt-2 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 pb-20 select-none font-sans"
        >
            {/* Header telemetry info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${simulatorActive ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase font-mono">
                            Core Observability <span className="text-emerald-400 font-sans">Panel</span>
                        </h1>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">
                        Master node terminal session // live stream logs & system health
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Live Traffic Simulator controls */}
                    <button
                        onClick={handleToggleSimulator}
                        disabled={simulatorLoading}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[10px] font-bold transition-all uppercase tracking-widest font-mono ${
                            simulatorActive 
                            ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.25)]' 
                            : 'border-white/10 text-gray-400 hover:text-white bg-white/[0.01] hover:bg-white/[0.03]'
                        }`}
                        title="Toggle synthetic mock operational traffic feed"
                    >
                        {simulatorActive ? <Square className="w-3 h-3 fill-indigo-400" /> : <Play className="w-3 h-3 fill-gray-400 hover:fill-white" />}
                        {simulatorActive ? 'STOP TRAFFIC SIMULATION' : 'START TRAFFIC SIMULATION'}
                    </button>

                    <button
                        onClick={handleManualRefresh}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-[10px] font-bold text-gray-400 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all uppercase tracking-widest font-mono"
                    >
                        <RefreshCw className="w-3 h-3" />
                        SYNC CORE SYSTEMS
                    </button>
                    <div className="hidden lg:flex items-center gap-2.5 bg-white/[0.01] border border-white/10 rounded-full px-4 py-2 font-mono text-[10px] font-bold text-emerald-400">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        <span>SOCKET PIPELINE SYNCED</span>
                    </div>
                </div>
            </div>

            {/* TOP Grid: Live Metrics MetricsGrid */}
            {metrics && <MetricsGrid metrics={metrics} />}

            {/* MIDDLE Grid: Charts & Telemetry + Sidebar Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visualizations (Left + Center Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Registration Trends Chart */}
                        {timeSeries && (
                            <ChartCard
                                title="24-Hour Traveler Ingestion"
                                subtitle="Adventures Registrations"
                                type="line"
                                data={timeSeries.hourlyRegistrations}
                                dataKey="registrations"
                                xKey="hour"
                                color="#3b82f6"
                                glow="rgba(59, 130, 246, 0.4)"
                                gradientId="regGrad"
                            />
                        )}

                        {/* Community post volume Chart */}
                        {timeSeries && (
                            <ChartCard
                                title="Weekly Social Feed Volume"
                                subtitle="Community Posts Ingestion"
                                type="bar"
                                data={timeSeries.dailyPosts}
                                dataKey="count"
                                xKey="date"
                                color="#8b5cf6"
                                glow="rgba(139, 92, 246, 0.4)"
                                gradientId="postGrad"
                            />
                        )}
                    </div>

                    {/* Latency telemetric chart (wide width) */}
                    {timeSeries && (
                        <ChartCard
                            title="Average Telemetry API Response Times"
                            subtitle="Core Server Latency Ingestion (ms)"
                            type="area"
                            data={timeSeries.apiLatency}
                            dataKey="value"
                            xKey="date"
                            color="#10b981"
                            glow="rgba(16, 185, 129, 0.4)"
                            gradientId="latencyGrad"
                        />
                    )}
                </div>

                {/* Live activity logs Feed (Right Column Sidebar) */}
                <div className="lg:col-span-1">
                    <LiveActivityFeed events={events} loading={eventsLoading} />
                </div>
            </div>

            {/* NEW ROW: Toxicity Moderation Shield Radar */}
            <div className="grid grid-cols-1 gap-6">
                <ToxicityRadar />
            </div>

            {/* BOTTOM Grid: Health + Audit Log Trail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System health panel */}
                <div className="lg:col-span-1">
                    {systemHealth && <SystemHealthPanel health={systemHealth} />}
                </div>

                {/* Incidents audit log panel */}
                <div className="lg:col-span-2">
                    <SystemLogsPanel />
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
