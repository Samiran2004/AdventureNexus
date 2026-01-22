import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import {
    Settings as SettingsIcon, Hammer, Zap, Mail, Trash2,
    ShieldCheck, Activity, Save, Loader2, AlertTriangle,
    Eye, EyeOff, CheckCircle2, XCircle
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

    useEffect(() => {
        const fetchData = async () => {
            try {
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

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-white">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
    );

    const isMaintenanceMode = settings.find(s => s.key === 'MAINTENANCE_MODE')?.value || false;
    const isAiPremiumEnabled = settings.find(s => s.key === 'AI_PREMIUM_MODULES')?.value || false;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white tracking-tight">Tactical Controls</h1>
                <p className="text-gray-500 font-medium">Global system orchestration and governance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* System Toggles */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <Hammer className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-bold text-white tracking-tight">Core Overrides</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Maintenance Mode */}
                        <div className={`p-6 rounded-[2rem] border transition-all ${isMaintenanceMode ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'bg-gray-800/20 border-white/5'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className={`w-4 h-4 ${isMaintenanceMode ? 'text-red-500' : 'text-gray-500'}`} />
                                        <span className="text-sm font-black text-white uppercase tracking-wider">Maintenance Mode</span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium max-w-[200px]">
                                        Instantly block public access to the terminal while you work.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggleSetting('MAINTENANCE_MODE', isMaintenanceMode)}
                                    disabled={savingKey === 'MAINTENANCE_MODE'}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${isMaintenanceMode ? 'bg-red-500' : 'bg-gray-700'
                                        } flex items-center justify-start p-1`}
                                >
                                    <motion.div
                                        animate={{ x: isMaintenanceMode ? 24 : 0 }}
                                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                                    />
                                    {savingKey === 'MAINTENANCE_MODE' && (
                                        <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* AI Modules Toggle */}
                        <div className={`p-6 rounded-[2rem] border transition-all ${isAiPremiumEnabled ? 'bg-indigo-500/5 border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'bg-gray-800/20 border-white/5'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Zap className={`w-4 h-4 ${isAiPremiumEnabled ? 'text-indigo-500' : 'text-gray-500'}`} />
                                        <span className="text-sm font-black text-white uppercase tracking-wider">Experimental AI</span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium max-w-[200px]">
                                        Enable pro-level generative models for trip planning.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggleSetting('AI_PREMIUM_MODULES', isAiPremiumEnabled)}
                                    disabled={savingKey === 'AI_PREMIUM_MODULES'}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${isAiPremiumEnabled ? 'bg-indigo-500' : 'bg-gray-700'
                                        } flex items-center justify-start p-1`}
                                >
                                    <motion.div
                                        animate={{ x: isAiPremiumEnabled ? 24 : 0 }}
                                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Hub */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <Mail className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-bold text-white tracking-tight">Newsletter Hub</h2>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden h-[400px] flex flex-col">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Subscriber Base</span>
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase">
                                {subscribers.length} Contacts
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                            {subscribers.map((sub) => (
                                <motion.div
                                    key={sub._id}
                                    layout
                                    className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-gray-900 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-200">{sub.userMail}</p>
                                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
                                                Joined {new Date(sub.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSubscriber(sub._id)}
                                        className="p-2 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-xl"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                            {subscribers.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                                    <Mail className="w-12 h-12" />
                                    <p className="text-[10px] uppercase font-black tracking-widest">No active subscribers</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Status Footnote */}
            <div className="flex items-center gap-4 bg-gray-900/40 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider leading-none mb-1">Authorization Layer Active</h3>
                    <p className="text-xs text-gray-600 font-medium">All tactical overrides require administrative level clearances and are recorded in the Audit Trail.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
