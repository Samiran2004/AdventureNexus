import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import { Trash2, Search, Star, Quote, MapPin, Clock, Eye, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DetailPanel from '../components/DetailPanel';

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedReview, setSelectedReview] = useState<any | null>(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reviews');
            setReviews(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-white gap-3">
                <span className="w-8 h-8 border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Loading Testimonials Feed...</span>
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
                        <MessageSquare className="w-5 h-5 text-amber-400" />
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase font-mono">
                            Ecosystem Testimonials <span className="text-amber-400 font-sans">Feed</span>
                        </h1>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">
                        Verification and reputation management of customer testimonials
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchReviews}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-[10px] font-bold text-gray-400 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all uppercase tracking-widest font-mono"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Sync Testimonials
                    </button>
                </div>
            </div>

            {/* Filter control */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
                <Search className="w-4 h-4 text-gray-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search by username, location, or excerpt comment..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent text-sm text-gray-200 focus:outline-none w-full placeholder:text-gray-700 font-mono"
                />
            </div>

            {/* Main grid */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-yellow-600"></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono">
                        <thead className="bg-white/[0.02] border-b border-white/10">
                            <tr>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Contributor</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Context / Rating</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Feedback Excerpt</th>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Inspect</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[11px]">
                            {filteredReviews.map((review) => (
                                <tr
                                    key={review._id}
                                    onClick={() => setSelectedReview(review)}
                                    className="hover:bg-white/[0.01] transition-colors group cursor-pointer"
                                >
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=f59e0b&color=fff`}
                                                alt={review.userName}
                                                className="w-9 h-9 rounded-xl object-cover border border-white/10 group-hover:border-amber-500/50 transition-all"
                                            />
                                            <div>
                                                <div className="text-gray-200 font-bold tracking-tight">{review.userName}</div>
                                                <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{review.location || 'GLOBAL TRAVELER'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-800'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{review.tripType || 'EXPLORATION'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-400 truncate max-w-[320px] font-sans italic font-medium">
                                            "{review.comment}"
                                        </p>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedReview(review); }}
                                                className="p-1.5 rounded-lg border border-white/5 hover:border-white/20 text-gray-500 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(review._id, e)}
                                                className="p-1.5 rounded-lg border border-white/5 hover:border-rose-500/20 text-gray-500 hover:text-rose-500 bg-white/[0.01] hover:bg-rose-500/5 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredReviews.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center flex flex-col items-center justify-center gap-3">
                                        <Quote className="w-10 h-10 text-gray-800 animate-pulse" />
                                        <p className="text-gray-600 text-xs font-black uppercase tracking-widest">No active testimonial traces found matching query</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Testimonials detail modal */}
            <DetailPanel
                isOpen={!!selectedReview}
                onClose={() => setSelectedReview(null)}
                title="Reputation Assessment"
                description={`Verification of feedback from @${selectedReview?.userName}`}
            >
                {selectedReview && (
                    <div className="space-y-6 select-none font-mono">
                        {/* Contributor badge */}
                        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                            <img
                                src={selectedReview.userAvatar || `https://ui-avatars.com/api/?name=${selectedReview.userName}&background=111&color=fff&size=128`}
                                alt={selectedReview.userName}
                                className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-lg"
                            />
                            <div>
                                <h3 className="text-lg font-black text-white">{selectedReview.userName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedReview.location || 'GLOBAL EXPLORER'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rating panel */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl space-y-1">
                                <p className="text-amber-500 text-[8px] font-black uppercase tracking-widest">Trust Index</p>
                                <div className="flex items-center gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < selectedReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-800'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                                <Clock className="w-4 h-4 text-emerald-400" />
                                <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mt-1">JOURNEY STATUS</p>
                                <p className="text-white font-bold text-[10px] uppercase">{selectedReview.tripType || 'ADVENTURE'}</p>
                            </div>
                        </div>

                        {/* Comment verbatim */}
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Verbatim Comment Transcript</span>
                            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl font-sans italic text-sm text-gray-300 leading-relaxed">
                                "{selectedReview.comment}"
                            </div>
                        </div>

                        {/* System integrity indicator */}
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
                                <div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Reputation Verified</span>
                                    <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">PEER AUTHENTICATED SIGNS</p>
                                </div>
                            </div>
                            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 uppercase">SECURE</span>
                        </div>

                        {/* Danger zone actions */}
                        <button
                            onClick={(e) => handleDelete(selectedReview._id, e)}
                            className="w-full py-3.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:shadow-rose-500/20"
                        >
                            Purge Testimonial From Nodes
                        </button>
                    </div>
                )}
            </DetailPanel>
        </motion.div>
    );
};

export default ReviewsPage;
