import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import { Trash2, Search, Star, MessageSquare, Quote, User as UserIcon, MapPin, Calendar, Clock, ThumbsUp, Eye, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DetailPanel from '../components/DetailPanel';

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedReview, setSelectedReview] = useState<any | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/reviews');
            setReviews(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Delete this testimonial permanently?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
            if (selectedReview?._id === id) setSelectedReview(null);
        } catch (error) {
            alert('Failed to delete review');
        }
    };

    const filteredReviews = reviews.filter(review =>
        review.userName?.toLowerCase().includes(search.toLowerCase()) ||
        review.location?.toLowerCase().includes(search.toLowerCase()) ||
        review.comment?.toLowerCase().includes(search.toLowerCase())
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
                            <div className="w-10 h-10 bg-white/5 rounded-xl animate-pulse"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse"></div>
                                <div className="h-3 w-40 bg-white/5 rounded-lg animate-pulse"></div>
                            </div>
                            <div className="h-10 w-40 bg-white/5 rounded-xl animate-pulse"></div>
                            <div className="h-10 w-12 bg-white/5 rounded-xl animate-pulse"></div>
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
                    <h1 className="text-4xl font-black text-white tracking-tight">Testimonials</h1>
                    <p className="text-gray-500 font-medium">Public feedback and reputation management.</p>
                </div>

                <div className="flex items-center gap-4 bg-gray-800/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-lg group focus-within:border-indigo-500/50 transition-all duration-300">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter feedback..."
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
                                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Contributor</th>
                                <th className="px-6 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Rating & Context</th>
                                <th className="px-6 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Excerpt</th>
                                <th className="px-8 py-6 text-right text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            <AnimatePresence>
                                {filteredReviews.map((review) => (
                                    <motion.tr
                                        key={review._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onClick={() => setSelectedReview(review)}
                                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=6366f1&color=fff`}
                                                    alt={review.userName}
                                                    className="w-10 h-10 rounded-xl object-cover border-2 border-white/5 group-hover:border-indigo-500/50 transition-colors"
                                                />
                                                <div>
                                                    <div className="text-gray-100 font-bold tracking-tight">{review.userName}</div>
                                                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{review.location || 'GLOBAL'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.tripType || 'Exploration'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-gray-400 truncate max-w-[250px] italic">
                                                "{review.comment}"
                                            </p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedReview(review); }}
                                                    className="p-2.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all"
                                                    title="Deep Read"
                                                >
                                                    <Eye className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(review._id, e)}
                                                    className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all shadow-sm"
                                                    title="Expunge Record"
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

                    {filteredReviews.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 text-gray-500">
                            <div className="w-20 h-20 bg-gray-800/30 rounded-full flex items-center justify-center border border-white/5">
                                <Search className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="font-bold tracking-tight">No testimonials found matching identification</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Detail Panel */}
            <DetailPanel
                isOpen={!!selectedReview}
                onClose={() => setSelectedReview(null)}
                title="Review Assessment"
                description={`Verification of feedback from ${selectedReview?.userName}`}
            >
                {selectedReview && (
                    <div className="space-y-10">
                        {/* Contributor Card */}
                        <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
                            <img
                                src={selectedReview.userAvatar || `https://ui-avatars.com/api/?name=${selectedReview.userName}&background=111&color=fff&size=128`}
                                alt={selectedReview.userName}
                                className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-gray-900 shadow-xl"
                            />
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white">{selectedReview.userName}</h3>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{selectedReview.location || 'Global Adventurer'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rating & Context Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-3xl space-y-2">
                                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Trust Rating</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < selectedReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-white font-black text-lg">{selectedReview.rating}/5</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-5 rounded-3xl space-y-1">
                                <Clock className="w-5 h-5 text-emerald-400 mb-2" />
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Trip Duration</p>
                                <p className="text-white font-bold">{selectedReview.tripDuration || 'Unknown'}</p>
                            </div>
                        </div>

                        {/* Main Feedback Analysis */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-1">Verbatim Content</h4>
                            <div className="relative">
                                <Quote className="absolute -top-4 -left-2 w-12 h-12 text-indigo-500/10" />
                                <div className="bg-gray-900/50 border border-white/5 p-8 rounded-[2rem] relative z-10">
                                    <p className="text-lg text-gray-200 leading-relaxed font-serif italic">
                                        {selectedReview.comment}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Verification Metrics */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-1">System Verification</h4>
                            <div className="bg-gray-900/50 border border-white/5 rounded-[2rem] divide-y divide-white/5">
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase tracking-wider">Status</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Verified Journey</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-[0.1em]">AUTHENTIC</span>
                                </div>
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-indigo-500/10 rounded-xl">
                                            <ThumbsUp className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase tracking-wider">Helpfulness</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">User Peer Consensus</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-black text-white">{selectedReview.helpfulCount || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6">
                            <button
                                onClick={(e) => handleDelete(selectedReview._id, e)}
                                className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-red-500/20"
                            >
                                Decommission Testimonial
                            </button>
                        </div>
                    </div>
                )}
            </DetailPanel>
        </motion.div>
    );
};

export default ReviewsPage;
