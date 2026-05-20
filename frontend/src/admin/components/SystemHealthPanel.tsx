import React from 'react';
import { Cpu, Database, Activity, HardDrive } from 'lucide-react';
import { SystemHealthMetrics } from '../hooks/useAdminMetrics';

interface SystemHealthPanelProps {
    health: SystemHealthMetrics;
}

const SystemHealthPanel: React.FC<SystemHealthPanelProps> = ({ health }) => {
    // Format Uptime
    const formatUptime = (seconds: number) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const dDisplay = d > 0 ? `${d}d ` : "";
        const hDisplay = h > 0 ? `${h}h ` : "";
        const mDisplay = m > 0 ? `${m}m ` : "";
        const sDisplay = `${s}s`;
        return dDisplay + hDisplay + mDisplay + sDisplay;
    };

    // Calculate RAM usage in GB
    const toGB = (bytes: number) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

    const memPercent = health.memory.percentage;
    const memColor = memPercent > 85 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : memPercent > 60 ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]';

    return (
        <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
            {/* Top Indicator bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500"></div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Activity className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white tracking-widest uppercase">System Observability</h4>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">NEXUS NODE TELEMETRY</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">ONLINE</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* CPU Load Metric */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-400">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-cyan-400" />
                            <span className="uppercase tracking-widest">CPU LOAD AVERAGE</span>
                        </div>
                        <span className="font-mono text-cyan-400">{(health.cpuLoad * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                            className="bg-cyan-500 shadow-[0_0_10px_#06b6d4] h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, health.cpuLoad * 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* RAM Allocation Metric */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-400">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-amber-400" />
                            <span className="uppercase tracking-widest">SYSTEM MEMORY ALLOCATION</span>
                        </div>
                        <span className="font-mono text-amber-400">{memPercent}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                            className={`${memColor} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${memPercent}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-gray-500 font-mono tracking-widest">
                        <span>USED: {toGB(health.memory.used)} GB</span>
                        <span>FREE: {toGB(health.memory.free)} GB</span>
                        <span>TOTAL: {toGB(health.memory.total)} GB</span>
                    </div>
                </div>

                {/* Platform Specs and Uptime */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="flex items-start gap-3">
                        <HardDrive className="w-4 h-4 text-indigo-400 mt-0.5" />
                        <div>
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">SYSTEM UPTIME</span>
                            <div className="text-xs font-mono font-bold text-white mt-0.5">
                                {formatUptime(health.uptime)}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Activity className="w-4 h-4 text-pink-400 mt-0.5" />
                        <div>
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">PLATFORM FRAMEWORK</span>
                            <div className="text-xs font-mono font-bold text-white mt-0.5 uppercase">
                                NODE.JS / LINUX
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthPanel;
