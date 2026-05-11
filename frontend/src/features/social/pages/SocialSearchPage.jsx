import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, User, MapPin, Compass, TrendingUp, 
    Filter, SlidersHorizontal, UserPlus, MessageSquare,
    Globe, Shield, Award, Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SocialSearchPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || "";
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) handleSearch();
            else setResults([]);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/social/search?q=${query}`);
            if (res.data.success) {
                setResults(res.data.data);
            }
        } catch (error) {
            console.error("Search error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black font-inter pb-20 pt-32">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center space-y-6 mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl font-black text-white tracking-tighter uppercase"
                    >
                        Find Your <span className="text-blue-500 italic">Pack</span>
                    </motion.h1>
                    <p className="text-white/40 max-w-xl mx-auto text-lg font-medium">
                        Connect with travelers, explorers, and adventure seekers from all around the globe.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-3xl mx-auto mb-20 group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
                    <div className="relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-2 flex items-center backdrop-blur-3xl shadow-2xl">
                        <div className="pl-6 pr-4 text-white/20 group-focus-within:text-blue-500 transition-colors">
                            <Search size={28} />
                        </div>
                        <Input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by username or name..." 
                            className="bg-transparent border-none text-2xl h-16 text-white placeholder:text-white/10 focus-visible:ring-0"
                        />
                        <Button className="h-16 w-16 rounded-[2rem] bg-white text-black hover:bg-white/90 shrink-0">
                            <SlidersHorizontal size={24} />
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {["all", "travelers", "guides", "trending", "nearby"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === filter ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="h-80 rounded-[3rem] bg-white/5 animate-pulse" />
                            ))
                        ) : results.length > 0 ? (
                            results.map((u, i) => (
                                <motion.div
                                    key={u._id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card 
                                        className="bg-white/[0.02] border-white/5 rounded-[3rem] overflow-hidden group hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 cursor-pointer"
                                        onClick={() => navigate(`/profile/${u.username}`)}
                                    >
                                        <CardContent className="p-8 space-y-6">
                                            <div className="flex items-start justify-between">
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-[2rem] p-1 bg-gradient-to-br from-blue-500 to-purple-500">
                                                        <div className="w-full h-full rounded-[1.8rem] overflow-hidden border-4 border-black">
                                                            <img 
                                                                src={u.profilepicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + u.username} 
                                                                alt={u.username} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-black shadow-lg" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40"><Shield size={16} /></div>
                                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40"><Award size={16} /></div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-blue-500 transition-colors">
                                                    {u.fullname || u.username}
                                                </h3>
                                                <p className="text-white/20 font-bold text-sm tracking-tight italic">@{u.username}</p>
                                            </div>

                                            <p className="text-white/40 text-sm leading-relaxed line-clamp-2 font-medium">
                                                {u.bio || "Avid traveler, mountain climber, and adventure enthusiast."}
                                            </p>

                                            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-black">{u.followersCount || 0}</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Followers</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-black">{u.followingCount || 0}</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Following</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <Button className="flex-1 h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-bold gap-2">
                                                    <UserPlus size={18} /> Follow
                                                </Button>
                                                <Button variant="outline" className="h-12 w-12 rounded-2xl border-white/10 text-white/40 hover:text-white">
                                                    <MessageSquare size={18} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : query && !loading && (
                            <div className="col-span-full text-center py-20 space-y-6">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-20">
                                    <Compass size={48} className="animate-spin-slow" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white tracking-tighter">NO TRAVELERS FOUND</h3>
                                    <p className="text-white/20 max-w-xs mx-auto font-medium italic">Try a different name or browse trending explorers.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SocialSearchPage;
