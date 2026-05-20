import React, { useEffect, useState, useCallback } from 'react';
import { Terminal, ShieldAlert, ShieldCheck, Database, Trash2, ShieldX } from 'lucide-react';
import api from '../services/adminApi';
import { useSocket } from '../context/AdminSocketContext';

export interface AuditLogItem {
    _id: string;
    action: string;
    module: string;
    adminId: string;
    targetId?: string;
    details: any;
    severity: 'info' | 'warning' | 'danger';
    timestamp: string;
}

const SystemLogsPanel: React.FC = () => {
    const { socket } = useSocket();
    const [logs, setLogs] = useState<AuditLogItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/audit-logs');
            if (res.data.status === 'Success') {
                setLogs(res.data.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    useEffect(() => {
        if (!socket) return;

        // Listen for new audit logs instantly
        socket.on('audit:new', (newLog: AuditLogItem) => {
            setLogs((prev) => [newLog, ...prev].slice(0, 100));
        });

        return () => {
            socket.off('audit:new');
        };
    }, [socket]);

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'danger':
                return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'warning':
                return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'info':
            default:
                return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
        }
    };

    return (
        <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col h-[400px]">
            {/* Top Indicator bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-cyan-500"></div>

            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        <Terminal className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white tracking-widest uppercase">Nexus Security Audit Trail</h4>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-mono">GOVERNANCE & INCIDENT AUDITING TERMINAL</span>
                    </div>
                </div>
                <button
                    onClick={fetchLogs}
                    className="text-[9px] font-bold text-gray-400 hover:text-white border border-white/10 rounded-full px-3 py-1 hover:bg-white/5 transition-all uppercase tracking-widest font-mono"
                >
                    Clear Filter / Refresh
                </button>
            </div>

            {/* Scrollable logs list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent font-mono text-[11px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                        <span className="w-6 h-6 border-2 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Querying Trail Log...</span>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        NO INCIDENTS LOGGED
                    </div>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log) => (
                            <div
                                key={log._id}
                                className="flex items-start gap-4 p-2 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all text-gray-300"
                            >
                                <span className="text-gray-600 font-bold flex-shrink-0 w-24">
                                    {new Date(log.timestamp).toLocaleString([], { hour12: false })}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-widest flex-shrink-0 ${getSeverityBadge(log.severity)}`}>
                                    {log.severity}
                                </span>
                                <span className="text-indigo-400 font-bold flex-shrink-0 w-28 uppercase tracking-widest">
                                    {log.action}
                                </span>
                                <span className="text-purple-400 font-bold flex-shrink-0 w-20 uppercase tracking-widest">
                                    {log.module}
                                </span>
                                <span className="text-gray-400 flex-1 break-all">
                                    {JSON.stringify(log.details)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemLogsPanel;
