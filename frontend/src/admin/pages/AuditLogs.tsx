import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import {
    Shield, History, Search, Filter, AlertTriangle,
    Info, Calendar, Fingerprint, ExternalLink, Trash2,
    User as UserIcon, Settings as SettingsIcon, Package as PackageIcon,
    AlertCircle
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
    severity: 'info' | 'warning' | 'critical';
}

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleFilter, setModuleFilter] = useState('all');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/audit-logs');
                setLogs(res.data.data);
            } catch (error) {
                console.error('Failed to fetch audit logs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.module.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
        return matchesSearch && matchesModule;
    });

    const getIcon = (module: string) => {
        switch (module) {
            case 'COMMUNITY': return <UserIcon className="w-4 h-4" />;
            case 'EXPEDITIONS': return <PackageIcon className="w-4 h-4" />;
            default: return <SettingsIcon className="w-4 h-4" />;
        }
    };

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'warning': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white tracking-tight">Audit Trail</h1>
                    <p className="text-gray-500 font-medium">Tracing every administrative action in Nexus terminal.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-800/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 group focus-within:border-indigo-500/20 transition-all">
                        <Search className="w-4 h-4 text-gray-500 ml-3" />
                        <input
                            type="text"
                            placeholder="Search actions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-sm text-gray-200 py-2 pr-4 focus:outline-none placeholder:text-gray-700 font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/60 border-b border-white/5 uppercase">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-gray-500 tracking-[0.2em]">Timestamp</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 tracking-[0.2em]">Module</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 tracking-[0.2em]">Action</th>
                                <th className="px-10 py-5 text-xs font-bold text-gray-500 tracking-[0.2em]">Intelligence</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-500 tracking-[0.2em] text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.map((log) => (
                                <motion.tr
                                    key={log._id}
                                    layout
                                    className="hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-3.5 h-3.5 text-gray-600" />
                                            <span className="text-sm font-bold text-gray-300">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-white/5 text-gray-500 group-hover:text-indigo-400 transition-colors">
                                                {getIcon(log.module)}
                                            </div>
                                            <span className="text-[10px] font-black tracking-widest text-gray-500">{log.module}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black tracking-wider text-white">
                                                {log.action.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tight">by {log.adminId}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-5">
                                        <div className="max-w-xs">
                                            <p className="text-xs text-gray-400 font-medium truncate italic">
                                                {log.details ? JSON.stringify(log.details) : 'N/A Intelligence'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSeverityStyles(log.severity)}`}>
                                            {log.severity}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredLogs.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                            <History className="w-12 h-12 text-gray-800" />
                            <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">No matching traces found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* System Info Footnote */}
            <div className="flex items-center gap-3 px-8 text-[10px] text-gray-700 font-black uppercase tracking-widest">
                <Fingerprint className="w-3 h-3" />
                <span>Logs retention enabled: 30 days stored locally</span>
            </div>
        </motion.div>
    );
};

export default AuditLogs;
