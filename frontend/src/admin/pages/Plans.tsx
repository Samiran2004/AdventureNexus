import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import { Trash2, Search, Map as MapIcon, Calendar, Users as UsersIcon, Clock, DollarSign, MapPin, Eye, Compass, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DetailPanel from '../components/DetailPanel';

const PlansPage: React.FC = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await api.get('/plans');
            setPlans(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-white gap-3">
                <span className="w-8 h-8 border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Loading Expeditions Dossiers...</span>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-b-white/5 pb-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-purple-400" />
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase font-mono">
                            Ecosystem Expeditions <span className="text-purple-400 font-sans">Index</span>
                        </h1>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">
                        Global deployment and analysis of AI-generated travel itineraries
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchPlans}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-[10px] font-bold text-gray-400 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all uppercase tracking-widest font-mono"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Sync Expeditions
                    </button>
                </div>
            </div>

            {/* Filter control */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
                <Search className="w-4 h-4 text-gray-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search by destination city or itinerary name parameters..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent text-sm text-gray-200 focus:outline-none w-full placeholder:text-gray-700 font-mono"
                />
            </div>

            {/* Main visual table */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono">
                        <thead className="bg-white/[0.02] border-b border-white/10">
                            <tr>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Destination Node</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Logistical Load</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Target Deployment</th>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Inspect</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[11px]">
                            {filteredPlans.map((plan) => (
                                <tr
                                    key={plan._id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className="hover:bg-white/[0.01] transition-colors group cursor-pointer"
                                >
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                                                <MapIcon className="w-4.5 h-4.5" />
                                            </div>
                                            <div>
                                                <div className="text-gray-200 font-bold tracking-tight">{plan.to}</div>
                                                <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{plan.name || 'AI GENERATION RECORD'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-300 font-medium">
                                            <UsersIcon className="w-3.5 h-3.5 text-purple-400" />
                                            <span>{plan.travelers} Travel Agents</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-300 font-medium">
                                            <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                            <span>{new Date(plan.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); }}
                                                className="p-1.5 rounded-lg border border-white/5 hover:border-white/20 text-gray-500 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(plan._id, e)}
                                                className="p-1.5 rounded-lg border border-white/5 hover:border-rose-500/20 text-gray-500 hover:text-rose-500 bg-white/[0.01] hover:bg-rose-500/5 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredPlans.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center flex flex-col items-center justify-center gap-3">
                                        <Compass className="w-10 h-10 text-gray-800 animate-pulse" />
                                        <p className="text-gray-600 text-xs font-black uppercase tracking-widest">No deployed itineraries matched your query</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Expedition dossier modal */}
            <DetailPanel
                isOpen={!!selectedPlan}
                onClose={() => setSelectedPlan(null)}
                title="Expedition Dossier"
                description={`Intelligence report for node destination: ${selectedPlan?.to}`}
            >
                {selectedPlan && (
                    <div className="space-y-6 select-none font-mono">
                        {/* Banner cover */}
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg h-36">
                            <img
                                src={selectedPlan.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'}
                                alt={selectedPlan.to}
                                className="w-full h-full object-cover opacity-45"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-5 flex items-end justify-between w-[90%]">
                                <div className="space-y-1">
                                    <span className="text-[8px] text-purple-400 font-black uppercase tracking-widest">NODE DESTINATION</span>
                                    <h3 className="text-xl font-black text-white uppercase">{selectedPlan.to}</h3>
                                </div>
                                <span className="bg-purple-500/20 backdrop-blur-md px-2.5 py-1 rounded border border-purple-500/30 text-purple-300 font-bold text-[9px] uppercase tracking-widest">
                                    SCORE: {selectedPlan.ai_score || '9.8'}
                                </span>
                            </div>
                        </div>

                        {/* Tri-metrics card grid */}
                        <div className="grid grid-cols-3 gap-3 text-xs">
                            {[
                                { icon: Clock, label: 'MISSION DURATION', value: `${selectedPlan.days || '?'} Days`, color: 'text-blue-400' },
                                { icon: UsersIcon, label: 'DEPLOYED USERS', value: selectedPlan.travelers, color: 'text-emerald-400' },
                                { icon: DollarSign, label: 'BUDGET LOAD', value: `$${selectedPlan.budget}`, color: 'text-amber-400' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl space-y-1">
                                    <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                                    <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest block">{stat.label}</span>
                                    <span className="text-white font-black text-[11px] block">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Sequentialtimeline */}
                        <div className="space-y-4">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Mission Itinerary Timeline</span>
                            <div className="space-y-3 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-purple-500/20">
                                {selectedPlan.suggested_itinerary?.map((day: any, idx: number) => (
                                    <div key={idx} className="relative pl-9 space-y-2">
                                        <div className="absolute left-0 top-1 w-7.5 h-7.5 rounded-lg bg-black border border-purple-500/40 flex items-center justify-center text-purple-400 font-black text-[9px] z-10">
                                            D{day.day}
                                        </div>
                                        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-2">
                                            <h5 className="font-bold text-white text-xs">{day.title}</h5>
                                            <div className="space-y-1.5 text-[10px] text-gray-400 font-sans">
                                                {['morning', 'afternoon', 'evening'].map((time) => day[time] && (
                                                    <div key={time} className="flex gap-2">
                                                        <span className="text-[8px] font-mono font-black text-purple-400 uppercase w-14 shrink-0 mt-0.5">{time}</span>
                                                        <p className="leading-relaxed font-medium">{day[time]}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Budget allocation */}
                        {selectedPlan.budget_breakdown && (
                            <div className="space-y-3">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Resource Allocation Breakdown</span>
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-xs font-bold text-white">Aggregated Budget Estimate</span>
                                        <span className="text-sm font-black text-emerald-400">${selectedPlan.budget_breakdown.total}</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        {['flights', 'accommodation', 'activities', 'food'].map((item) => (
                                            <div key={item} className="space-y-1">
                                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                                                    <span>{item}</span>
                                                    <span className="text-gray-300">${selectedPlan.budget_breakdown[item]}</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                    <div
                                                        className="h-full bg-purple-500 rounded-full"
                                                        style={{ width: `${(selectedPlan.budget_breakdown[item] / selectedPlan.budget_breakdown.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Local tips */}
                        {selectedPlan.local_tips?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ecosystem Local Intelligence</span>
                                <div className="space-y-1.5">
                                    {selectedPlan.local_tips.map((tip: string, i: number) => (
                                        <div key={i} className="flex gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                                            <p className="text-[10px] text-gray-300 leading-relaxed italic">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Danger zone actions */}
                        <button
                            onClick={(e) => handleDelete(selectedPlan._id, e)}
                            className="w-full py-3.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:shadow-rose-500/20"
                        >
                            Purge Expedition Plan From Database
                        </button>
                    </div>
                )}
            </DetailPanel>
        </motion.div>
    );
};

export default PlansPage;
