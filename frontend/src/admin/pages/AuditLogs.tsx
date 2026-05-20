import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import {
    Shield, History, Search, Filter, AlertTriangle,
    Info, Calendar, Fingerprint, RefreshCw, Terminal, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuditLog {
    _id: string;
    action: string;
    module: string;
    adminId: string;
    targetId?: string;
    details: any;
    timestamp: string;
    severity: 'info' | 'warning' | 'danger' | 'critical';
}

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleFilter, setModuleFilter] = useState('all');
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/audit-logs');
            setLogs(res.data.data);
        } catch (error) {
            console.error('Failed to fetch audit logs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
            JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
        return matchesSearch && matchesModule;
    });

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'critical':
            case 'danger':
                return 'text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
            case 'warning':
                return 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
            case 'info':
            default:
                return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.2)]';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-white gap-3">
                <span className="w-8 h-8 border-2 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Loading Audit Stream...</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pb-20 select-none font-sans"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase font-mono">
                            Audit Logs <span className="text-indigo-400 font-sans">Trail</span>
                        </h1>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">
                        Nexus master security audit and policy logs
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchLogs}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-[10px] font-bold text-gray-400 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all uppercase tracking-widest font-mono"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Refresh Logs
                    </button>
                </div>
            </div>

            {/* Filter control center */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-2 bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-500 ml-2" />
                    <input
                        type="text"
                        placeholder="Search by action, module, or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-sm text-gray-200 focus:outline-none w-full placeholder:text-gray-700 font-mono"
                    />
                </div>

                {/* Module Dropdown */}
                <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center gap-3">
                    <Filter className="w-4 h-4 text-gray-500 ml-2" />
                    <select
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                        className="bg-transparent text-sm text-gray-200 focus:outline-none w-full font-mono uppercase cursor-pointer"
                    >
                        <option value="all" className="bg-[#0c0c0c]">All Modules</option>
                        <option value="COMMUNITY" className="bg-[#0c0c0c]">Community</option>
                        <option value="EXPEDITIONS" className="bg-[#0c0c0c]">Expeditions</option>
                        <option value="TESTIMONIALS" className="bg-[#0c0c0c]">Testimonials</option>
                        <option value="SYSTEM" className="bg-[#0c0c0c]">System Settings</option>
                    </select>
                </div>
            </div>

            {/* Main Log Table */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono">
                        <thead className="bg-white/[0.02] border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Date / Time</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Module</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Action Type</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Details Preview</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Severity</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Inspect</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[11px]">
                            {filteredLogs.map((log) => {
                                const isExpanded = expandedLogId === log._id;
                                return (
                                    <React.Fragment key={log._id}>
                                        <tr className="hover:bg-white/[0.01] transition-colors group cursor-pointer" onClick={() => setExpandedLogId(isExpanded ? null : log._id)}>
                                            <td className="px-6 py-4 text-gray-400 font-bold whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString([], { hour12: false })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black tracking-widest text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                                                    {log.module}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold tracking-tight uppercase">
                                                        {log.action.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="text-[9px] text-gray-600 font-medium">Operator: {log.adminId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 font-medium max-w-xs truncate">
                                                {JSON.stringify(log.details)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getSeverityStyles(log.severity)}`}>
                                                    {log.severity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setExpandedLogId(isExpanded ? null : log._id);
                                                    }}
                                                    className="p-1.5 rounded-lg border border-white/5 hover:border-white/20 text-gray-500 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                                                >
                                                    {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded JSON viewer */}
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={6} className="bg-black/40 px-8 py-4 border-l border-r border-indigo-500/30">
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="space-y-2 overflow-hidden"
                                                    >
                                                        <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
                                                            <span>Telemetry Payload Inspect</span>
                                                            <span className="text-indigo-400 font-mono">ID: {log._id}</span>
                                                        </div>
                                                        <pre className="text-xs text-emerald-400 font-mono leading-relaxed bg-white/[0.01] border border-white/5 rounded-2xl p-4 overflow-x-auto max-h-60 scrollbar-thin">
                                                            {JSON.stringify(log, null, 4)}
                                                        </pre>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredLogs.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                            <History className="w-10 h-10 text-gray-800 animate-pulse" />
                            <p className="text-gray-600 text-xs font-black uppercase tracking-widest">No traces recorded matching logs query</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Retention metadata */}
            <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase tracking-widest px-1 font-mono">
                <Fingerprint className="w-3 h-3 text-gray-700 animate-pulse" />
                <span>OBSERVABILITY RETENTION GUARANTEE: Logs persistent over 30 cycles</span>
            </div>
        </motion.div>
    );
};

export default AuditLogs;
