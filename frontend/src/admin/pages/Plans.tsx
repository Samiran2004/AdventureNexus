import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import { Trash2, Search, Map as MapIcon, Calendar, Users as UsersIcon, Clock, DollarSign, MapPin, CheckCircle2, Eye, Compass, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DetailPanel from '../components/DetailPanel';

const PlansPage: React.FC = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await api.get('/plans');
            setPlans(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this plan?')) return;
        try {
            await api.delete(`/plans/${id}`);
            setPlans(plans.filter(p => p._id !== id));
            if (selectedPlan?._id === id) setSelectedPlan(null);
        } catch (error) {
            alert('Failed to delete plan');
        }
    };

    const filteredPlans = plans.filter(plan =>
        plan.to.toLowerCase().includes(search.toLowerCase()) ||
        plan.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse"></div>
                <div className="h-12 w-64 bg-white/5 rounded-2xl animate-pulse"></div>
            </div>
            <div className="bg-gray-900/40 rounded-[2.5rem] border border-white/5 h-[500px] overflow-hidden">
                <div className="p-8 space-y-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/5 rounded-xl animate-pulse"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-48 bg-white/5 rounded-lg animate-pulse"></div>
                                <div className="h-3 w-32 bg-white/5 rounded-lg animate-pulse"></div>
                            </div>
                            <div className="h-8 w-24 bg-white/5 rounded-full animate-pulse"></div>
                            <div className="h-10 w-24 bg-white/5 rounded-xl animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white tracking-tight">Expeditions</h1>
                    <p className="text-gray-500 font-medium">Manage and monitor all AI-generated travel plans.</p>
                </div>

                <div className="flex items-center gap-4 bg-gray-800/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-lg group focus-within:border-indigo-500/50 transition-all duration-300">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find destination..."
                            className="bg-transparent text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none w-64 placeholder-gray-600 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/60 border-b border-white/5">
                            <tr>
                                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Destination</th>
                                <th className="px-6 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Logistics</th>
                                <th className="px-6 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Deployment</th>
                                <th className="px-8 py-6 text-right text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            <AnimatePresence>
                                {filteredPlans.map((plan) => (
                                    <motion.tr
                                        key={plan._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onClick={() => setSelectedPlan(plan)}
                                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                                    <MapIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-gray-100 font-bold tracking-tight">{plan.to}</div>
                                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{plan.name || 'AI GENERATED'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <UsersIcon className="w-3.5 h-3.5 text-indigo-400" />
                                                    <span>{plan.travelers} Adventurers</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                                <span>{new Date(plan.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); }}
                                                    className="p-2.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all"
                                                    title="View Intel"
                                                >
                                                    <Eye className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(plan._id, e)}
                                                    className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all shadow-sm"
                                                    title="Terminal Delete"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {filteredPlans.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 text-gray-500">
                            <div className="w-20 h-20 bg-gray-800/30 rounded-full flex items-center justify-center border border-white/5">
                                <Search className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="font-bold tracking-tight">No expeditions matched your criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Plan Detail Panel */}
            <DetailPanel
                isOpen={!!selectedPlan}
                onClose={() => setSelectedPlan(null)}
                title="Expedition Dossier"
                description={`Intelligence report for ${selectedPlan?.to}`}
            >
                {selectedPlan && (
                    <div className="space-y-10">
                        {/* Header Image/Stats */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25"></div>
                            <div className="relative bg-gray-900 rounded-[2.5rem] overflow-hidden border border-white/5">
                                <img
                                    src={selectedPlan.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'}
                                    alt={selectedPlan.to}
                                    className="w-full h-48 object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                                <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                                    <div className="space-y-1">
                                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Destination</p>
                                        <h3 className="text-3xl font-black text-white">{selectedPlan.to}</h3>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white font-bold text-sm">
                                        Score: {selectedPlan.ai_score || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Clock, label: 'Duration', value: `${selectedPlan.days || '?'} Days`, color: 'text-blue-400' },
                                { icon: UsersIcon, label: 'Travelers', value: selectedPlan.travelers, color: 'text-emerald-400' },
                                { icon: DollarSign, label: 'Budget', value: `$${selectedPlan.budget}`, color: 'text-orange-400' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-3xl space-y-1">
                                    <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-white font-bold text-sm">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Itinerary Timeline */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Mission Timeline</h4>
                                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md">Sequential Flow</span>
                            </div>
                            <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-indigo-500/20">
                                {selectedPlan.suggested_itinerary?.map((day: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative pl-12 space-y-3"
                                    >
                                        <div className="absolute left-0 top-1 w-10 h-10 rounded-xl bg-gray-900 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-400 font-black text-xs z-10">
                                            D{day.day}
                                        </div>
                                        <div className="bg-gray-900/50 border border-white/5 p-5 rounded-3xl space-y-3">
                                            <h5 className="font-bold text-white text-sm">{day.title}</h5>
                                            <div className="grid grid-cols-1 gap-3">
                                                {['morning', 'afternoon', 'evening'].map((time) => day[time] && (
                                                    <div key={time} className="flex gap-3">
                                                        <div className="text-[9px] font-black text-gray-500 uppercase w-14 shrink-0 mt-1">{time}</div>
                                                        <p className="text-xs text-gray-400 leading-relaxed">{day[time]}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Budget Breakdown */}
                        {selectedPlan.budget_breakdown && (
                            <div className="space-y-6">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-1">Resource Allocation</h4>
                                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] p-6 space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/10 rounded-xl">
                                                <Compass className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <p className="text-sm font-bold text-white">Projected Expenses</p>
                                        </div>
                                        <div className="text-xl font-black text-white">$ {selectedPlan.budget_breakdown.total}</div>
                                    </div>
                                    <div className="space-y-3">
                                        {['flights', 'accommodation', 'activities', 'food'].map((item) => (
                                            <div key={item} className="space-y-1.5">
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                    <span>{item}</span>
                                                    <span className="text-gray-300">$ {selectedPlan.budget_breakdown[item]}</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${(selectedPlan.budget_breakdown[item] / selectedPlan.budget_breakdown.total) * 100}%` }}
                                                        className="h-full bg-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Local Tips */}
                        {selectedPlan.local_tips?.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-1">Intelligence Tips</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {selectedPlan.local_tips.map((tip: string, i: number) => (
                                        <div key={i} className="flex gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-gray-300 leading-relaxed italic">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DetailPanel>
        </motion.div>
    );
};

export default PlansPage;
