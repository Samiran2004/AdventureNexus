import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import {
    Hammer, Zap, Mail, Trash2,
    ShieldCheck, AlertTriangle, RefreshCw,
    Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Setting {
    key: string;
    value: any;
    description: string;
}

interface Subscriber {
    _id: string;
    userMail: string;
    createdAt: string;
}

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [settingsRes, subscribersRes] = await Promise.all([
                api.get('/settings'),
                api.get('/subscribers')
            ]);
            setSettings(settingsRes.data.data);
            setSubscribers(subscribersRes.data.data);
        } catch (error) {
            console.error('Failed to fetch settings data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleSetting = async (key: string, currentValue: boolean) => {
        setSavingKey(key);
        try {
            const newValue = !currentValue;
            await api.patch('/settings', { key, value: newValue });
            setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
        } catch (error) {
            alert(`Failed to update ${key}`);
        } finally {
            setSavingKey(null);
        }
    };

    const handleDeleteSubscriber = async (id: string) => {
        if (!confirm('Are you sure you want to remove this subscriber?')) return;
        try {
            await api.delete(`/subscribers/${id}`);
            setSubscribers(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            alert('Failed to remove subscriber');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-white gap-3">
                <span className="w-8 h-8 border-2 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Loading Controls Panel...</span>
            </div>
        );
    }

    const isMaintenanceMode = settings.find(s => s.key === 'MAINTENANCE_MODE')?.value || false;
    const isAiPremiumEnabled = settings.find(s => s.key === 'AI_PREMIUM_MODULES')?.value || false;

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
                        <Sliders className="w-5 h-5 text-indigo-400" />
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase font-mono">
                            System Settings <span className="text-indigo-400 font-sans">Panel</span>
                        </h1>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">
                        Ecosystem control overrides and configuration overrides
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-[10px] font-bold text-gray-400 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all uppercase tracking-widest font-mono"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Sync Settings
                    </button>
                </div>
            </div>

            {/* Core Settings Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left side: Core Control Overrides */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2.5 px-1">
                        <Hammer className="w-4 h-4 text-indigo-400" />
                        <h2 className="text-xs font-black text-white uppercase tracking-widest font-mono">Platform Control Overrides</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Maintenance switch */}
                        <div className={`bg-[#0c0c0c]/80 backdrop-blur-md p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                            isMaintenanceMode ? 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-white/10'
                        }`}>
                            {isMaintenanceMode && (
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500"></div>
                            )}
                            <div className="flex items-center justify-between gap-6">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className={`w-4 h-4 ${isMaintenanceMode ? 'text-red-500' : 'text-gray-500'}`} />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Platform Maintenance Gate</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-relaxed max-w-[280px]">
                                        Forces public client routes into offline maintenance locks.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggleSetting('MAINTENANCE_MODE', isMaintenanceMode)}
                                    disabled={savingKey === 'MAINTENANCE_MODE'}
                                    className={`relative w-14 h-7.5 rounded-full transition-colors flex items-center p-1.5 ${
                                        isMaintenanceMode ? 'bg-red-500' : 'bg-gray-800 border border-white/5'
                                    }`}
                                >
                                    <motion.div
                                        animate={{ x: isMaintenanceMode ? 26 : 0 }}
                                        className="w-4.5 h-4.5 bg-white rounded-full shadow-lg"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Artificial Intelligence Module Switch */}
                        <div className={`bg-[#0c0c0c]/80 backdrop-blur-md p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                            isAiPremiumEnabled ? 'border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-white/10'
                        }`}>
                            {isAiPremiumEnabled && (
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500"></div>
                            )}
                            <div className="flex items-center justify-between gap-6">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <Zap className={`w-4 h-4 ${isAiPremiumEnabled ? 'text-indigo-500 font-bold' : 'text-gray-500'}`} />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Experimental AI Generative Engine</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-relaxed max-w-[280px]">
                                        Toggles AI generation pipelines for custom trip itinerary creations.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggleSetting('AI_PREMIUM_MODULES', isAiPremiumEnabled)}
                                    disabled={savingKey === 'AI_PREMIUM_MODULES'}
                                    className={`relative w-14 h-7.5 rounded-full transition-colors flex items-center p-1.5 ${
                                        isAiPremiumEnabled ? 'bg-indigo-500' : 'bg-gray-800 border border-white/5'
                                    }`}
                                >
                                    <motion.div
                                        animate={{ x: isAiPremiumEnabled ? 26 : 0 }}
                                        className="w-4.5 h-4.5 bg-white rounded-full shadow-lg"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side: Subscribers base panel */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2.5 px-1">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        <h2 className="text-xs font-black text-white uppercase tracking-widest font-mono">Newsletter Subscribers Base</h2>
                    </div>

                    <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl h-[410px] overflow-hidden flex flex-col relative shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500"></div>

                        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest font-mono">Ecosystem Contacts Database</span>
                            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase border border-emerald-500/20 font-mono">
                                {subscribers.length} ACTIVE CONTACTS
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                            <AnimatePresence initial={false}>
                                {subscribers.map((sub) => (
                                    <motion.div
                                        key={sub._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.02] hover:border-white/10 transition-all font-mono text-xs"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-gray-600">
                                                <Mail className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-200">{sub.userMail}</p>
                                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                                    REGISTERED: {new Date(sub.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteSubscriber(sub._id)}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-500 transition-all hover:bg-rose-500/10 rounded-xl"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {subscribers.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center gap-3 opacity-30">
                                    <Mail className="w-10 h-10 text-gray-600 animate-pulse" />
                                    <p className="text-[9px] font-black uppercase tracking-widest">No active subscriber traces found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Alert/Warning panel */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden flex items-center gap-5 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-emerald-500"></div>

                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest font-mono">Ecosystem Security Clearance Enforced</h4>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                        All platform control override adjustments, maintenance gating toggles, and subscriber purges require administrative access levels and are logged to security audit logs.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
