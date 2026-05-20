import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart, MessageCircle, Bookmark, Share2, MapPin, Star, X, Send,
  Plus, Image as ImageIcon, Tag, Compass, TrendingUp, Clock, ChevronLeft,
  DollarSign, Mountain, Users, Loader2, Trash2
} from 'lucide-react';
import { experiencesService } from '../../../services/experiencesService';
import toast from 'react-hot-toast';

const ExperiencesPage = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  // Feed state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedSort, setFeedSort] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', location: '', tags: '', rating: 5, images: [], estimatedCost: '', currency: '₹', difficultyLevel: 'Easy', crowdType: 'Solo' });
  const [creating, setCreating] = useState(false);

  // Detail view
  const [selectedPost, setSelectedPost] = useState(null);
  const [detailComments, setDetailComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch feed
  const fetchFeed = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await experiencesService.getFeed({
        sort: feedSort,
        search: searchQuery || undefined,
        location: searchLocation || undefined,
        ...params
      }, token);
      if (res.success) setPosts(res.data || []);
    } catch (err) {
      console.warn('[Experiences] Feed fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [getToken, feedSort, searchQuery, searchLocation]);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  // Search with debounce
  useEffect(() => {
    const t = setTimeout(() => fetchFeed(), 400);
    return () => clearTimeout(t);
  }, [searchQuery, searchLocation]);

  // Create post
  const handleCreate = async () => {
    if (!createForm.title || !createForm.description || !createForm.location) {
      toast.error('Title, story, and location are required!');
      return;
    }
    setCreating(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append('title', createForm.title);
      fd.append('description', createForm.description);
      fd.append('location', createForm.location);
      fd.append('rating', createForm.rating);
      fd.append('estimatedCost', createForm.estimatedCost);
      fd.append('currency', createForm.currency);
      fd.append('difficultyLevel', createForm.difficultyLevel);
      fd.append('crowdType', createForm.crowdType);
      if (createForm.tags) fd.append('tags', createForm.tags);
      if (createForm.images.length > 0) {
        createForm.images.forEach(img => fd.append('images', img));
      }
      const res = await experiencesService.create(fd, token);
      if (res.success) {
        toast.success('Experience shared! 🎉');
        setShowCreate(false);
        setCreateForm({ title: '', description: '', location: '', tags: '', rating: 5, images: [], estimatedCost: '', currency: '₹', difficultyLevel: 'Easy', crowdType: 'Solo' });
        fetchFeed();
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to create experience');
    } finally {
      setCreating(false);
    }
  };

  // Like
  const handleLike = async (postId, e) => {
    e?.stopPropagation();
    try {
      const token = await getToken();
      const clerkId = user?.id;
      setPosts(prev => prev.map(p => {
        if (p._id !== postId) return p;
        const liked = p.likes?.includes(clerkId);
        return { ...p, likes: liked ? p.likes.filter(l => l !== clerkId) : [...(p.likes || []), clerkId] };
      }));
      await experiencesService.toggleLike(postId, token);
    } catch (err) { fetchFeed(); }
  };

  // Save
  const handleSave = async (postId, e) => {
    e?.stopPropagation();
    try {
      const token = await getToken();
      const clerkId = user?.id;
      setPosts(prev => prev.map(p => {
        if (p._id !== postId) return p;
        const saved = p.saves?.includes(clerkId);
        return { ...p, saves: saved ? p.saves.filter(s => s !== clerkId) : [...(p.saves || []), clerkId] };
      }));
      await experiencesService.toggleSave(postId, token);
      toast.success('Updated!');
    } catch (err) { fetchFeed(); }
  };

  // Share
  const handleShare = (post, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/experiences?id=${post._id}`);
    toast.success('Link copied! 🔗');
  };

  // Open detail
  const openDetail = async (post) => {
    setSelectedPost(post);
    setLoadingDetail(true);
    try {
      const token = await getToken();
      const res = await experiencesService.getById(post._id, token);
      if (res.success) {
        setSelectedPost(res.data);
        setDetailComments(res.comments || []);
      }
    } catch (err) {
      setDetailComments([]);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const token = await getToken();
      const res = await experiencesService.addComment({ postId: selectedPost._id, content: commentText }, token);
      if (res.success) {
        setDetailComments(prev => [res.data, ...prev]);
        setCommentText('');
        toast.success('Comment added!');
      }
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  // Delete post
  const handleDelete = async (postId, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this experience post?")) return;
    try {
      const token = await getToken();
      const res = await experiencesService.delete(postId, token);
      if (res.success) {
        toast.success('Experience deleted successfully!');
        setSelectedPost(null); // Close detail drawer if open
        fetchFeed(); // Refresh the feed
      }
    } catch (err) {
      toast.error('Failed to delete experience');
    }
  };

  const clerkId = user?.id;
  const sortTabs = [
    { key: 'latest', label: 'Latest', icon: Clock },
    { key: 'popular', label: 'Popular', icon: TrendingUp },
    { key: 'trending', label: 'Trending', icon: Compass },
  ];

  const getUserDisplay = (p) => {
    const u = p.userId;
    if (!u || typeof u === 'string') return { name: 'Traveler', avatar: '', initials: 'T' };
    const name = u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : (u.username || 'Traveler');
    return { name, avatar: u.profilepicture || '', initials: name.charAt(0).toUpperCase() };
  };

  return (
    <div className="min-h-screen bg-[#030406] text-white flex flex-col font-outfit relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none z-0" />
      <NavBar />

      {/* HERO */}
      <div className="relative pt-32 pb-16 px-6 max-w-4xl mx-auto w-full z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">
          Real Stories.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-purple-400">Real Journeys.</span>
        </h1>
        <p className="text-sm text-white/40 max-w-xl mx-auto mb-8">
          Discover how real travelers explore the world. Share your own adventures.
        </p>
        {user && (
          <Button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 h-12 text-xs font-black uppercase tracking-widest">
            <Plus size={16} className="mr-2" /> Share Your Experience
          </Button>
        )}
      </div>

      {/* SEARCH + SORT */}
      <div className="max-w-4xl mx-auto w-full px-6 z-10 mb-8">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center bg-white/[0.03] border border-white/5 rounded-2xl px-4 h-12">
            <Compass size={16} className="text-white/30 mr-3" />
            <input type="text" placeholder="Search experiences..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30 w-full" />
          </div>
          <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-2xl px-4 h-12 md:w-64">
            <MapPin size={16} className="text-white/30 mr-3" />
            <input type="text" placeholder="Location..." value={searchLocation} onChange={e => setSearchLocation(e.target.value)} className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30 w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          {sortTabs.map(tab => (
            <button key={tab.key} onClick={() => setFeedSort(tab.key)} className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${feedSort === tab.key ? 'bg-white text-black' : 'border border-white/5 text-white/40 hover:text-white'}`}>
              <tab.icon size={12} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FEED */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-20 z-10 flex-grow">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <Compass size={40} className="mx-auto text-indigo-400 mb-4" />
            <h3 className="text-lg font-black mb-2 uppercase tracking-wider">No experiences yet</h3>
            <p className="text-xs text-white/40 mb-6">Be the first to share your travel story!</p>
            {user && <Button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 text-xs font-bold">Share Now</Button>}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => {
              const u = getUserDisplay(post);
              const isLiked = post.likes?.includes(clerkId);
              const isSaved = post.saves?.includes(clerkId);
              return (
                <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#090A0F]/80 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/10 transition-all cursor-pointer" onClick={() => openDetail(post)}>
                  {/* User Header */}
                  <div className="flex items-center gap-3 p-5 pb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-white/10 flex items-center justify-center text-sm font-bold text-indigo-400 overflow-hidden shrink-0">
                      {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-white/30 flex items-center gap-1"><MapPin size={10} />{post.location}</p>
                    </div>
                    <span className="text-[9px] text-white/20">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Images */}
                  {post.images?.length > 0 && (
                    <div className="relative h-72 md:h-96 overflow-hidden">
                      <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                      {post.images.length > 1 && <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm">+{post.images.length - 1} more</span>}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 pt-3">
                    <h3 className="text-lg font-black text-white mb-2 leading-tight">{post.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed line-clamp-3 mb-4">{post.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags?.slice(0, 5).map(tag => (
                        <Badge key={tag} className="bg-white/[0.03] border border-white/5 text-white/50 text-[9px] font-bold py-0.5 px-2 rounded-lg">{tag}</Badge>
                      ))}
                    </div>

                    {/* Auto Insights */}
                    <div className="flex flex-wrap gap-3 mb-4 text-[9px] font-black uppercase tracking-widest text-white/30">
                      <span className="flex items-center gap-1"><DollarSign size={10} className="text-emerald-500" />{post.currency || '₹'}{post.estimatedCost || 'N/A'}</span>
                      <span className="flex items-center gap-1"><Mountain size={10} className="text-yellow-500" />{post.difficultyLevel || 'Easy'}</span>
                      <span className="flex items-center gap-1"><Users size={10} className="text-indigo-400" />{post.crowdType || 'Solo'}</span>
                      {post.rating && <span className="flex items-center gap-1"><Star size={10} className="text-yellow-500 fill-yellow-500" />{post.rating}/5</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                      <button onClick={e => handleLike(post._id, e)} className={`flex items-center gap-1.5 text-xs font-bold transition-all ${isLiked ? 'text-rose-500' : 'text-white/40 hover:text-rose-500'}`}>
                        <Heart size={16} className={isLiked ? 'fill-current' : ''} />{post.likes?.length || 0}
                      </button>
                      <button onClick={e => { e.stopPropagation(); openDetail(post); }} className="flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-indigo-400 transition-all">
                        <MessageCircle size={16} />{post.commentsCount || 0}
                      </button>
                      <button onClick={e => handleSave(post._id, e)} className={`flex items-center gap-1.5 text-xs font-bold transition-all ${isSaved ? 'text-indigo-400' : 'text-white/40 hover:text-indigo-400'}`}>
                        <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
                      </button>
                      <button onClick={e => handleShare(post, e)} className="flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-white ml-auto transition-all">
                        <Share2 size={16} />
                      </button>
                      {post.clerkUserId === clerkId && (
                        <button onClick={e => handleDelete(post._id, e)} className="flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-rose-500 transition-all border-l border-white/5 pl-3">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="w-full max-w-2xl bg-[#090A0F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.01]">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Share Your Journey</h3>
                  <p className="text-[10px] text-white/40 mt-1">Fill details and see how your post looks in real-time</p>
                </div>
                <button onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-2 rounded-full"><X size={18} /></button>
              </div>

              {/* Mode Tabs */}
              <div className="flex border-b border-white/5 bg-white/[0.01]">
                <button type="button" onClick={() => setCreateForm(p => ({ ...p, showPreviewTab: false }))} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${!createForm.showPreviewTab ? 'border-b-2 border-indigo-500 text-white' : 'text-white/40 hover:text-white'}`}>
                  ✍️ Editor
                </button>
                <button type="button" onClick={() => setCreateForm(p => ({ ...p, showPreviewTab: true }))} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${createForm.showPreviewTab ? 'border-b-2 border-indigo-500 text-white' : 'text-white/40 hover:text-white'}`}>
                  👁️ Live Preview
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {!createForm.showPreviewTab ? (
                  <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Story Title</label>
                      <input type="text" placeholder="e.g., Magical Sunset over Himalayan Peaks" value={createForm.title} onChange={e => setCreateForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500/30 transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Story Details</label>
                      <textarea placeholder="Describe your route, experience, highlights, and travel tips..." rows={4} value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500/30 resize-none transition-all" />
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Location</label>
                        <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3.5">
                          <MapPin size={14} className="text-white/30 mr-2" />
                          <input type="text" placeholder="e.g., Manali, Himachal Pradesh" value={createForm.location} onChange={e => setCreateForm(p => ({ ...p, location: e.target.value }))} className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full" />
                        </div>
                      </div>
                      <div className="w-28 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Rating (1-5)</label>
                        <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3.5">
                          <Star size={14} className="text-yellow-500 mr-2 shrink-0" />
                          <input type="number" min="1" max="5" value={createForm.rating} onChange={e => setCreateForm(p => ({ ...p, rating: Math.max(1, Math.min(5, Number(e.target.value))) }))} className="bg-transparent border-none outline-none text-sm text-white w-full font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Tags</label>
                      <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3.5">
                        <Tag size={14} className="text-white/30 mr-2" />
                        <input type="text" placeholder="trekking, winter, camping, budget" value={createForm.tags} onChange={e => setCreateForm(p => ({ ...p, tags: e.target.value }))} className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full" />
                      </div>
                    </div>

                    {/* Trip Insights */}
                    <div className="border-t border-white/5 pt-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Trip Specifications</p>
                      
                      {/* Estimated Cost + Currency */}
                      <div className="flex gap-3 mb-3">
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Budget Range</label>
                          <div className="flex gap-2">
                            <select value={createForm.currency} onChange={e => setCreateForm(p => ({ ...p, currency: e.target.value }))} className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-3.5 text-sm text-white outline-none w-20 appearance-none cursor-pointer text-center">
                              <option value="₹" className="bg-[#0A0B10]">₹ (INR)</option>
                              <option value="$" className="bg-[#0A0B10]">$ (USD)</option>
                              <option value="€" className="bg-[#0A0B10]">€ (EUR)</option>
                              <option value="£" className="bg-[#0A0B10]">£ (GBP)</option>
                            </select>
                            <div className="flex-1 flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3.5">
                              <DollarSign size={14} className="text-emerald-500 mr-2" />
                              <input type="text" placeholder="e.g. 2,000 - 5,000" value={createForm.estimatedCost} onChange={e => setCreateForm(p => ({ ...p, estimatedCost: e.target.value }))} className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Difficulty & Crowd */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Difficulty</label>
                          <div className="flex gap-2">
                            {['Easy', 'Moderate', 'Hard'].map(level => (
                              <button key={level} type="button" onClick={() => setCreateForm(p => ({ ...p, difficultyLevel: level }))} className={`flex-1 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${createForm.difficultyLevel === level ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10'}`}>
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Ideal For</label>
                          <div className="flex gap-2">
                            {['Solo', 'Couple', 'Group', 'Family'].map(ct => (
                              <button key={ct} type="button" onClick={() => setCreateForm(p => ({ ...p, crowdType: ct }))} className={`flex-1 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${createForm.crowdType === ct ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10'}`}>
                                {ct}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Selector & Previews */}
                    <div className="border-t border-white/5 pt-4 space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Adventure Photos</label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-indigo-500/30 rounded-2xl p-6 bg-white/[0.01] transition-all relative cursor-pointer group">
                        <ImageIcon size={28} className="text-white/20 group-hover:text-indigo-400 mb-2 transition-all" />
                        <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white">Choose adventure files</span>
                        <span className="text-[9px] text-white/20 mt-1">Support JPG, PNG, WEBP (Max 5 photos)</span>
                        <input type="file" accept="image/*" multiple onChange={e => {
                          const files = Array.from(e.target.files || []);
                          setCreateForm(p => ({ ...p, images: [...p.images, ...files].slice(0, 5) }));
                        }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>

                      {/* Preview Thumbnails */}
                      {createForm.images.length > 0 && (
                        <div className="grid grid-cols-5 gap-2 pt-2">
                          {createForm.images.map((img, i) => {
                            const url = URL.createObjectURL(img);
                            return (
                              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 group">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setCreateForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))} className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white rounded-full p-1 transition-all"><X size={10} /></button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* LIVE PREVIEW OF CARD */
                  <div className="py-4 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 text-center mb-2">Post Preview Card</p>
                    <div className="bg-[#0D0E15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto">
                      {/* Author */}
                      <div className="flex items-center gap-3 p-4">
                        <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-white/10 flex items-center justify-center text-xs font-bold text-indigo-400">
                          {user?.imageUrl ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover rounded-full" /> : 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{user?.fullName || 'Traveler'}</p>
                          <p className="text-[9px] text-white/30 flex items-center gap-1"><MapPin size={9} />{createForm.location || 'Your Location'}</p>
                        </div>
                      </div>

                      {/* Preview Image */}
                      <div className="relative h-60 bg-white/[0.02] flex items-center justify-center overflow-hidden">
                        {createForm.images.length > 0 ? (
                          <img src={URL.createObjectURL(createForm.images[0])} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-white/20">
                            <ImageIcon size={32} className="mx-auto mb-2" />
                            <p className="text-[10px] uppercase font-black tracking-widest">No Photos Selected</p>
                          </div>
                        )}
                        {createForm.images.length > 1 && <span className="absolute top-3 right-3 bg-black/60 text-white text-[9px] px-2 py-1 rounded-lg">+{createForm.images.length - 1} more</span>}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h4 className="text-sm font-bold text-white leading-tight">{createForm.title || 'Untitled Adventure Story'}</h4>
                        <p className="text-[11px] text-white/40 leading-relaxed line-clamp-3">{createForm.description || 'No description yet. Add details inside the editor tab!'}</p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {(createForm.tags ? createForm.tags.split(',').map(t => t.trim()) : []).filter(t => t).slice(0, 3).map(tag => (
                            <Badge key={tag} className="bg-white/[0.03] border border-white/5 text-white/40 text-[8px] font-bold py-0.5 px-1.5 rounded">#{tag}</Badge>
                          ))}
                        </div>

                        {/* Specs */}
                        <div className="flex flex-wrap gap-3 pt-2 text-[8px] font-black uppercase tracking-widest text-white/30 border-t border-white/5">
                          <span className="flex items-center gap-1"><DollarSign size={8} className="text-emerald-500" />{createForm.currency}{createForm.estimatedCost || 'N/A'}</span>
                          <span className="flex items-center gap-1"><Mountain size={8} className="text-yellow-500" />{createForm.difficultyLevel}</span>
                          <span className="flex items-center gap-1"><Users size={8} className="text-indigo-400" />{createForm.crowdType}</span>
                          <span className="flex items-center gap-1"><Star size={8} className="text-yellow-500 fill-current" />{createForm.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-white/[0.01] flex gap-3">
                <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 h-12 border-white/10 hover:bg-white/5 text-white rounded-2xl text-xs font-black uppercase tracking-widest">
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={creating} className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/10">
                  {creating ? 'Publishing...' : 'Publish Experience'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL DRAWER */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 overflow-y-auto">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 120 }} className="min-h-screen bg-[#07080C] max-w-4xl mx-auto border-x border-white/5">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-[#07080C]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-3">
                <button onClick={() => setSelectedPost(null)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white"><ChevronLeft size={18} /></button>
                <span className="text-xs font-black uppercase tracking-widest text-white/60">Experience Detail</span>
                {selectedPost.clerkUserId === clerkId && (
                  <button onClick={e => handleDelete(selectedPost._id, e)} className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
                    <Trash2 size={12} /> Delete Post
                  </button>
                )}
              </div>

              {loadingDetail ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Author */}
                  {(() => { const u = getUserDisplay(selectedPost); return (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-white/10 flex items-center justify-center text-sm font-bold text-indigo-400 overflow-hidden">
                        {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-white/30 flex items-center gap-1"><MapPin size={10} />{selectedPost.location} · {new Date(selectedPost.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ); })()}

                  {/* Images */}
                  {selectedPost.images?.length > 0 && (
                    <div className="grid grid-cols-1 gap-3">
                      {selectedPost.images.map((img, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border border-white/5">
                          <img src={img} alt="" className="w-full max-h-[500px] object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <h2 className="text-2xl font-black text-white leading-tight">{selectedPost.title}</h2>
                  <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{selectedPost.description}</p>

                  {/* Insights */}
                  <div className="flex flex-wrap gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold"><DollarSign size={14} />{selectedPost.currency || '₹'}{selectedPost.estimatedCost || 'N/A'}</span>
                    <span className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold"><Mountain size={14} />{selectedPost.difficultyLevel}</span>
                    <span className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold"><Users size={14} />{selectedPost.crowdType}</span>
                    {selectedPost.rating && <span className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold"><Star size={14} className="fill-current" />{selectedPost.rating}/5</span>}
                    <span className="flex items-center gap-1.5 text-xs text-white/30 font-bold ml-auto">{selectedPost.viewCount || 0} views</span>
                  </div>

                  {/* Tags */}
                  {selectedPost.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map(tag => <Badge key={tag} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] py-1 px-3 rounded-lg">#{tag}</Badge>)}
                    </div>
                  )}

                  {/* Comments Section */}
                  <div className="border-t border-white/5 pt-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Comments ({detailComments.length})</h4>
                    {user && (
                      <div className="flex gap-2 mb-6">
                        <input type="text" placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddComment()} className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-500/30" />
                        <Button onClick={handleAddComment} className="bg-indigo-600 hover:bg-indigo-500 rounded-xl px-4"><Send size={16} /></Button>
                      </div>
                    )}
                    <div className="space-y-4">
                      {detailComments.map(c => {
                        const cu = c.userId && typeof c.userId === 'object' ? c.userId : {};
                        const cName = cu.firstName ? `${cu.firstName} ${cu.lastName || ''}`.trim() : (cu.username || 'Traveler');
                        return (
                          <div key={c._id} className={`flex gap-3 ${c.parentId ? 'ml-8' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 shrink-0 overflow-hidden">
                              {cu.profilepicture ? <img src={cu.profilepicture} alt="" className="w-full h-full object-cover" /> : cName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{cName}</span>
                                <span className="text-[9px] text-white/20">{new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-white/50 mt-1">{c.content}</p>
                            </div>
                          </div>
                        );
                      })}
                      {detailComments.length === 0 && <p className="text-xs text-white/20 text-center py-6">No comments yet. Be the first!</p>}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ExperiencesPage;
