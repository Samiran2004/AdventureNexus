import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import { AlertCircle, CheckCircle2, ShieldAlert, Trash2, Eye, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModerationAlert {
    _id: string;
    type: 'REVIEW' | 'COMMENT';
    author: string;
    avatar?: string;
    content: string;
    toxicity: number; // 0 to 100
    timestamp: string;
    status: 'SECURE' | 'SUSPICIOUS' | 'QUARANTINE';
}

const ToxicityRadar: React.FC = () => {
    const [alerts, setAlerts] = useState<ModerationAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioningId, setActioningId] = useState<string | null>(null);

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/moderation');
            setAlerts(res.data.data);
        } catch (error) {
            console.error('Failed to fetch toxicity alerts', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        // Poll every 8 seconds to capture newly generated simulated traffic comments!
        const interval = setInterval(fetchAlerts, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (id: string, type: 'REVIEW' | 'COMMENT', action: 'approve' | 'expunge') => {
        setActioningId(id);
        try {
            await api.post('/moderation/resolve', { id, type, action });
            // Slide out animated row
            setAlerts(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            alert('Failed to resolve moderation alert');
        } finally {
            setActioningId(null);
        }
    };

    const getToxicityColor = (score: number) => {
        if (score >= 60) return 'text-rose-500 border-rose-500/20 bg-rose-500/10 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
        if (score >= 35) return 'text-amber-500 border-amber-500/20 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
        return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
    };

    if (loading) {
        return (
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 h-[400px] flex flex-col items-center justify-center gap-3">
                <span className="w-6 h-6 border-2 border-t-rose-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">Calibrating Toxicity Radar...</span>
            </div>
        );
    }

    return (
        <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-6 relative overflow-hidden flex flex-col h-[400px] shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 animate-pulse"></div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest font-mono">Toxicity & Content Radar</h4>
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest font-mono">Live dynamic content trust scan shield</span>
                    </div>
                </div>
                <span className="text-[8px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 border border-rose-500/20 rounded font-mono">
                    SHIELD OPERATIONAL
                </span>
            </div>

            {/* List alerts */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                <AnimatePresence initial={false}>
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/[0.02] hover:border-white/10 transition-all font-mono"
                        >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <img
                                    src={alert.avatar || `https://ui-avatars.com/api/?name=${alert.author}&background=f43f5e&color=fff`}
                                    alt={alert.author}
                                    className="w-8 h-8 rounded-lg object-cover border border-white/10 mt-0.5 shrink-0"
                                />
                                <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-gray-200 truncate">@{alert.author}</span>
                                        <span className="text-[7px] font-black text-indigo-400 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">
                                            {alert.type}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-sans italic break-words line-clamp-2">
                                        "{alert.content}"
                                    </p>
                                </div>
                            </div>

                            {/* Threat index & Actions */}
                            <div className="flex items-center gap-4 shrink-0 justify-end">
                                <div className={`px-2.5 py-1 rounded border text-[9px] font-black uppercase tracking-wider ${getToxicityColor(alert.toxicity)}`}>
                                    {alert.toxicity}% THREAT
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        disabled={actioningId === alert._id}
                                        onClick={() => handleAction(alert._id, alert.type, 'approve')}
                                        className="p-2 rounded-lg border border-white/5 hover:border-emerald-500/20 text-gray-500 hover:text-emerald-400 bg-white/[0.01] hover:bg-emerald-500/5 transition-all"
                                        title="Clear flags"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        disabled={actioningId === alert._id}
                                        onClick={() => handleAction(alert._id, alert.type, 'expunge')}
                                        className="p-2 rounded-lg border border-white/5 hover:border-rose-500/20 text-gray-500 hover:text-rose-400 bg-white/[0.01] hover:bg-rose-500/5 transition-all animate-pulse"
                                        title="Expunge toxic text"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {alerts.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center gap-3 opacity-30">
                        <ShieldCheck className="w-10 h-10 text-gray-600 animate-pulse" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-center">Toxicity filters secure // no threats detected</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToxicityRadar;
