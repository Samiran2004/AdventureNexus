import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Users,
  Calendar as CalendarIcon,
  TrendingUp,
  MapPin,
  Heart,
  Loader2,
  PlusCircle,
  X,
  Send,
  Zap,
  Globe,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { communityService } from '@/services/communityService';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

const CommunityPage = () => {
  const navigate = useNavigate();
  const { getToken, userId: clerkUserId, isLoaded: isAuthLoaded } = useAuth();
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Events and Spotlight state
  const [events, setEvents] = useState([]);
  const [spotlight, setSpotlight] = useState(null);
  const [stats, setStats] = useState({ members: 0, online: 0, stories: 0, meetups: 0 });
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isSpotlightLoading, setIsSpotlightLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Form state
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Travel Hacks' });
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { name: "Travel Hacks", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Solo Travel", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Photography", icon: MapPin, color: "text-pink-500", bg: "bg-pink-500/10" },
    { name: "Gear Talk", icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await communityService.getPosts(activeCategory, searchQuery);
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Could not load discussions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setIsEventsLoading(true);
      const data = await communityService.getEvents();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsEventsLoading(false);
    }
  };

  const fetchSpotlight = async () => {
    try {
      setIsSpotlightLoading(true);
      const data = await communityService.getSpotlight();
      if (data.success) {
        setSpotlight(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch spotlight:', error);
    } finally {
      setIsSpotlightLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setIsStatsLoading(true);
      const data = await communityService.getStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    fetchEvents();
    fetchSpotlight();
    fetchStats();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!clerkUserId) {
      toast.error('Please sign in to post');
      return;
    }
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      const response = await communityService.createPost(newPost, token);
      if (response.success) {
        toast.success('Discussion started!');
        setIsPostModalOpen(false);
        setNewPost({ title: '', content: '', category: 'Travel Hacks' });
        fetchPosts();
      }
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!clerkUserId) {
      toast.error('Please sign in to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const token = await getToken();
      const response = await communityService.addComment({
        postId: selectedPost._id,
        content: newComment
      }, token);

      if (response.success) {
        setNewComment('');
        // Refresh selected post to show new comment
        const updatedPost = await communityService.getPostById(selectedPost._id);
        setSelectedPost(updatedPost.data);
        fetchPosts(); // Refresh list to update count
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId, targetType = 'post') => {
    if (!clerkUserId) {
      toast.error('Please sign in to like');
      return;
    }
    try {
      const token = await getToken();
      const response = await communityService.toggleLike(targetType, postId, token);
      if (response.success) {
        if (targetType === 'post' && selectedPost?._id === postId) {
          const updatedPost = await communityService.getPostById(postId);
          setSelectedPost(updatedPost.data);
        }
        fetchPosts();
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleRSVP = async (eventId) => {
    if (!clerkUserId) {
      toast.error('Please sign in to RSVP');
      return;
    }
    try {
      const token = await getToken();
      const response = await communityService.toggleRSVP(eventId, token);
      if (response.success) {
        toast.success(response.data.isAttending ? 'RSVP confirmed!' : 'RSVP cancelled');
        fetchEvents();
      }
    } catch (error) {
      toast.error('Failed to update RSVP');
    }
  };

  const openPostDetail = async (post) => {
    try {
      const response = await communityService.getPostById(post._id);
      if (response.success) {
        setSelectedPost(response.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      toast.error('Failed to load discussion details');
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <NavBar />

      {/* Hero Section */}
      <div className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-md">
            Community Hub
          </Badge>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
            Connect with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">Fellow Travelers</span>
          </h1>
          <p className="text-lg md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Share stories, get advice, and meet adventure seekers from around the globe.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 rounded-full px-8 text-lg font-semibold flex items-center gap-2">
                  <PlusCircle size={20} /> Join the Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Start a New Discussion</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      className="w-full bg-muted border-none rounded-lg p-2.5 outline-none focus:ring-1 ring-primary/50"
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    >
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Best packing tips for carry-on only?"
                      className="w-full bg-muted border-none rounded-lg p-2.5 outline-none focus:ring-1 ring-primary/50"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      placeholder="What's on your mind?"
                      className="min-h-[150px] bg-muted border-none focus-visible:ring-1 ring-primary/50"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full py-6 text-lg font-bold" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Post Discussion
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 text-lg">
              Explore Events
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
        {/* Left Column: Discussions */}
        <div className="lg:col-span-2 space-y-12">

          {/* Categories */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, index) => (
                <Card
                  key={index}
                  onClick={() => setActiveCategory(activeCategory === cat.name ? '' : cat.name)}
                  className={`hover:border-primary/50 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${activeCategory === cat.name ? 'border-primary ring-1 ring-primary/20' : ''}`}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className={`p-3 ${cat.bg} ${cat.color} rounded-full mb-3`}>
                      <cat.icon size={20} />
                    </div>
                    <div className="font-bold">{cat.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Discussions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Trending Discussions</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    className="bg-muted pl-10 pr-4 py-1.5 rounded-full text-sm border-none focus:ring-1 ring-primary/50 w-full md:w-64"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                </div>
                <Button variant="ghost" className="text-primary hover:text-primary/80 flex items-center gap-2" onClick={() => fetchPosts()}>
                  <Loader2 size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-muted-foreground font-bold tracking-tight">Gathering community wisdom...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-border/50">
                <p className="text-muted-foreground mb-4 font-black italic text-lg uppercase tracking-tighter opacity-70">No discussions found.</p>
                <Button variant="outline" onClick={() => { setActiveCategory(''); setSearchQuery(''); }} className="rounded-full px-8 h-12 border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">Clear Filters</Button>
              </div>
            ) : (
              <motion.div
                layout
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {posts.map((discussion) => (
                  <motion.div
                    key={discussion._id}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                  >
                    <Card className="hover:border-primary/50 transition-all hover:-translate-y-2 group bg-card/40 backdrop-blur-sm border-white/5 shadow-xl hover:shadow-primary/5 rounded-[2rem] overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                          <div
                            className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/10 shrink-0 group-hover:scale-110 transition-transform shadow-inner cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/user/profile/${discussion.userId?.clerkUserId || discussion.clerkUserId}`);
                            }}
                          >
                            {discussion.userId?.profilepicture ? (
                              <img src={discussion.userId.profilepicture} alt={discussion.userId.username} className="w-full h-full object-cover" />
                            ) : (
                              <Users size={32} className="text-primary opacity-50" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="font-black text-sm hover:text-primary cursor-pointer transition-colors leading-none uppercase tracking-tighter"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/user/profile/${discussion.userId?.clerkUserId || discussion.clerkUserId}`);
                                }}
                              >
                                {discussion.userId?.fullname || discussion.userId?.username || 'Traveler'}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">• {getTimeAgo(discussion.createdAt)}</span>
                              <Badge className="text-[9px] h-5 px-3 ml-auto bg-primary/20 text-primary border-none font-black uppercase tracking-widest">
                                {discussion.category}
                              </Badge>
                            </div>
                            <h3
                              className="text-2xl font-black mb-3 group-hover:text-primary cursor-pointer transition-colors leading-[1.1] tracking-tighter"
                              onClick={() => openPostDetail(discussion)}
                            >
                              {discussion.title}
                            </h3>
                            <p className="text-base text-muted-foreground line-clamp-2 mb-6 leading-relaxed font-medium opacity-80">
                              {discussion.content}
                            </p>
                            <div className="flex items-center gap-8 text-sm font-black uppercase tracking-widest">
                              <span
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                onClick={() => openPostDetail(discussion)}
                              >
                                <MessageSquare size={18} className="text-indigo-400" /> {discussion.repliesCount} <span className="hidden md:inline">Replies</span>
                              </span>
                              <span
                                className={`flex items-center gap-2 cursor-pointer transition-all ${discussion.likes?.includes(clerkUserId) ? 'text-pink-500 scale-110' : 'text-muted-foreground hover:text-pink-500'}`}
                                onClick={() => handleLike(discussion._id)}
                              >
                                <Heart size={18} fill={discussion.likes?.includes(clerkUserId) ? 'currentColor' : 'none'} /> {discussion.likes?.length || 0} <span className="hidden md:inline">Likes</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">

          {/* Community Stats - REAL Data */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 backdrop-blur-xl shadow-xl border-dashed overflow-hidden relative">
              {isStatsLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                  <Loader2 size={24} className="animate-spin text-primary" />
                </div>
              )}
              <CardContent className="p-6 grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors">
                  <div className="text-2xl font-black text-indigo-400">
                    {stats.members >= 1000 ? `${(stats.members / 1000).toFixed(1)}k` : stats.members}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Members</div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors">
                  <div className="text-2xl font-black text-orange-400">{stats.online}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Online</div>
                </div>
                <motion.div
                  whileHover={{ y: -5, backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                  className="p-4 rounded-[2rem] border border-white/5 bg-white/5 cursor-pointer transition-all border-indigo-500/10"
                  onClick={() => navigate('/stories')}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Stories</div>
                  <div className="text-2xl font-black text-indigo-400">
                    {isStatsLoading ? <Loader2 size={16} className="animate-spin" /> : (stats.stories >= 1000 ? `${(stats.stories / 1000).toFixed(1)}k` : stats.stories)}
                  </div>
                </motion.div>
                <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors">
                  <div className="text-2xl font-black text-emerald-400">{stats.meetups}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Meetups</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-xl font-black tracking-tight">
                  <div className="flex items-center gap-2 text-primary uppercase font-black tracking-widest text-sm">
                    <CalendarIcon size={20} /> Upcoming Events
                  </div>
                  {isEventsLoading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEventsLoading && events.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-muted/20 border border-dashed border-border/50 rounded-2xl flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground opacity-30">
                      <CalendarIcon size={24} />
                    </div>
                    <p className="text-xs text-muted-foreground italic font-medium">No upcoming events. Stay tuned for Nexus meetups!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {events.slice(0, 2).map((event, idx) => (
                      <motion.div
                        key={event._id}
                        whileHover={{ scale: 1.02 }}
                        className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0"
                      >
                        <div className="bg-primary/20 text-primary rounded-xl p-2.5 text-center min-w-[65px] border border-primary/20 shadow-inner">
                          <div className="text-[10px] font-black uppercase opacity-70">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-2xl font-black leading-none mt-1">
                            {new Date(event.date).getDate()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                            <Badge variant="secondary" className="bg-white/5 text-[9px] h-4 px-1 px-1.5 font-bold uppercase border-none text-muted-foreground">
                              {event.type}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                              <Users size={10} /> {event.attendees?.length || 0}+
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="link"
                            className={`h-auto p-0 mt-3 font-black text-xs uppercase tracking-tighter ${event.attendees?.includes(clerkUserId) ? 'text-emerald-400' : 'text-primary'}`}
                            onClick={() => handleRSVP(event._id)}
                          >
                            {event.attendees?.includes(clerkUserId) ? '✓ Attending' : 'RSVP Now'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                <Button
                  className="w-full font-black h-12 rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary transition-all shadow-lg hover:shadow-primary/20"
                  variant="outline"
                  onClick={() => setIsCalendarOpen(true)}
                >
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Community Spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {isSpotlightLoading ? (
              <div className="h-64 bg-muted animate-pulse rounded-3xl" />
            ) : spotlight ? (
              <Card className="overflow-hidden border-none bg-slate-900 text-white relative group shadow-2xl rounded-3xl min-h-[350px] flex flex-col justify-end">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${spotlight.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <CardContent className="relative z-10 p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Badge className="bg-orange-500 text-white hover:bg-orange-600 mb-4 border-none shadow-xl px-4 py-1 font-black text-[10px] uppercase tracking-widest">
                      Member Spotlight
                    </Badge>
                    <h3 className="text-3xl font-black mb-3 leading-tight tracking-tighter">
                      {spotlight.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-6 leading-relaxed font-medium line-clamp-3">
                      {spotlight.description}
                    </p>
                    <Button className="bg-white text-slate-950 hover:bg-indigo-50 font-black px-8 h-12 rounded-full shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2">
                      Read Story <Zap size={18} className="fill-slate-950" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            ) : null}
          </motion.div>

          {/* Join Newsletter - Unique UI */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Globe size={120} />
            </div>
            <Award className="mb-4 text-indigo-200" size={32} />
            <h3 className="text-2xl font-black mb-2">Nexus Rewards</h3>
            <p className="text-sm text-indigo-100 mb-6 font-medium leading-relaxed">
              Connect your accounts and earn badges for your travel contributions.
            </p>
            <div className="h-2 w-full bg-indigo-500 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '65%' }}
                className="h-full bg-white shadow-[0_0_10px_white]"
              />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-200">Level 4: Trailblazer</div>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {/* Calendar Modal - NEW */}
        {isCalendarOpen && (
          <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-card border-border shadow-2xl rounded-3xl">
              <DialogHeader className="p-6 border-b border-border bg-muted/20">
                <DialogTitle className="text-3xl font-black italic flex items-center gap-3 tracking-tighter">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="text-primary" size={20} />
                  </div>
                  Community <span className="text-primary">Nexus</span> Calendar
                </DialogTitle>
              </DialogHeader>
              <div className="p-6 flex flex-col items-center">
                <Calendar
                  mode="single"
                  className="rounded-md border-none shadow-none"
                  modifiers={{
                    event: events.map(e => new Date(e.date))
                  }}
                  modifiersClassNames={{
                    event: "bg-primary/20 text-primary font-black ring-2 ring-primary/30 rounded-full"
                  }}
                  onSelect={(date) => {
                    const dayEvents = events.filter(e =>
                      new Date(e.date).toDateString() === date?.toDateString()
                    );
                    if (dayEvents.length > 0) {
                      toast.success(`${dayEvents.length} event(s) on this day: ${dayEvents[0].title}`);
                    }
                  }}
                />
                <div className="mt-6 w-full space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Zap size={12} /> Highlights This Month
                  </h4>
                  {events.length === 0 ? (
                    <div className="text-sm italic text-muted-foreground">No events scheduled.</div>
                  ) : (
                    events.slice(0, 3).map(event => (
                      <div key={event._id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-white/5">
                        <div className="text-sm font-bold truncate max-w-[200px]">{event.title}</div>
                        <Badge variant="outline" className="text-[10px] font-black uppercase border-primary/20 text-primary">
                          {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="p-4 bg-muted/10 border-t border-border flex justify-end">
                <Button onClick={() => setIsCalendarOpen(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px]">Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Discussion Detail Modal */}
        {isDetailModalOpen && (
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-card border-border shadow-2xl rounded-3xl">
              {selectedPost && (
                <>
                  <DialogHeader className="p-8 border-b border-border bg-muted/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <Badge className="bg-primary/20 text-primary border-none font-black px-3 py-1 uppercase tracking-widest text-[10px]">{selectedPost.category}</Badge>
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{getTimeAgo(selectedPost.createdAt)}</span>
                    </div>
                    <DialogTitle className="text-4xl font-black leading-none tracking-tighter relative z-10">{selectedPost.title}</DialogTitle>
                    <div
                      className="flex items-center gap-4 mt-8 relative z-10 cursor-pointer group/user"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/profile/${selectedPost.userId?.clerkUserId}`);
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 overflow-hidden border-2 border-primary/20 shadow-xl group-hover/user:border-primary transition-colors">
                        {selectedPost.userId?.profilepicture ? (
                          <img src={selectedPost.userId.profilepicture} alt={selectedPost.userId.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-black text-primary text-xl">{selectedPost.userId?.username?.charAt(0).toUpperCase()}</div>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-base leading-tight group-hover/user:text-primary transition-colors">{selectedPost.userId?.fullname || selectedPost.userId?.username || 'Traveler'}</div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Community Member</div>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                    {/* Post Content */}
                    <div className="text-xl leading-relaxed text-foreground/90 font-medium p-6 rounded-3xl bg-muted/30 border border-white/5 shadow-inner">
                      {selectedPost.content}
                    </div>

                    {/* Interactions */}
                    <div className="flex items-center gap-8 border-y border-white/5 py-6">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`flex items-center gap-2 cursor-pointer text-lg font-black transition-colors ${selectedPost.likes?.includes(clerkUserId) ? 'text-pink-500' : 'text-muted-foreground hover:text-pink-500'}`}
                        onClick={() => handleLike(selectedPost._id)}
                      >
                        <Heart size={24} fill={selectedPost.likes?.includes(clerkUserId) ? 'currentColor' : 'none'} /> {selectedPost.likes?.length || 0}
                      </motion.span>
                      <span className="flex items-center gap-2 text-lg font-black text-muted-foreground">
                        <MessageSquare size={24} /> {selectedPost.comments?.length || 0}
                      </span>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-8">
                      <h4 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                        Replies <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-none shadow-none text-base px-3">{selectedPost.comments?.length || 0}</Badge>
                      </h4>
                      {selectedPost.comments?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground italic bg-muted/10 rounded-[2rem] border border-dashed border-border/50">
                          No replies yet. Be the first to start the conversation!
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {selectedPost.comments.map((comment, i) => (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={comment._id}
                              className="flex gap-5 group"
                            >
                              <div
                                className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 border-2 border-border/50 shadow-lg group-hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/user/profile/${comment.clerkUserId}`);
                                }}
                              >
                                {comment.userId?.profilepicture ? (
                                  <img src={comment.userId.profilepicture} alt={comment.userId.username} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-sm font-black bg-secondary/30">{comment.userId?.username?.charAt(0)}</div>
                                )}
                              </div>
                              <div className="flex-1 bg-muted/40 p-5 rounded-[1.5rem] rounded-tl-none group-hover:bg-muted/60 transition-all shadow-sm border border-transparent group-hover:border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                  <span
                                    className="font-black text-sm tracking-tight cursor-pointer hover:text-primary transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/user/profile/${comment.clerkUserId}`);
                                    }}
                                  >
                                    {comment.userId?.fullname || comment.userId?.username || 'Traveler'}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{getTimeAgo(comment.createdAt)}</span>
                                </div>
                                <p className="text-sm leading-relaxed text-foreground/80 font-medium">{comment.content}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reply Input */}
                  <div className="p-6 border-t border-border bg-card/80 backdrop-blur-xl">
                    <form onSubmit={handleAddComment} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Write a reply..."
                          className="min-h-[100px] bg-muted/50 border-none focus-visible:ring-2 ring-primary/20 resize-none rounded-2xl p-4 text-base font-medium placeholder:font-bold"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="h-[100px] w-[100px] rounded-2xl shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all flex flex-col items-center justify-center gap-2" disabled={isSubmitting || !newComment.trim()}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={28} className="rotate-12" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">Send</span>
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CommunityPage;
