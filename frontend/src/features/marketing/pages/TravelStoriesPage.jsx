import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import {
    Plus,
    Search,
    MapPin,
    Heart,
    MessageSquare,
    Share2,
    ImageIcon,
    Loader2,
    Filter,
    ArrowRight,
    Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { communityService } from '@/services/communityService';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import toast from 'react-hot-toast';

const TravelStoriesPage = () => {
    const navigate = useNavigate();
    const { userId: currentClerkId, getToken } = useAuth();
    const { user } = useUser();
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // New Story State
    const [newStory, setNewStory] = useState({ title: '', content: '', location: '', images: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchStories = async () => {
        try {
            setIsLoading(true);
            const res = await communityService.getStories(search, locationFilter);
            if (res.success) setStories(res.data);
        } catch (error) {
            toast.error('Failed to load stories');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, [search, locationFilter]);

    const handleCreateStory = async (e) => {
        e.preventDefault();
        if (!newStory.title || !newStory.content || !newStory.location) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            const token = await getToken();
            const res = await communityService.createStory(newStory, token);
            if (res.success) {
                toast.success('Your story has been shared with the Nexus!');
                setIsCreateOpen(false);
                setNewStory({ title: '', content: '', location: '', images: [] });
                fetchStories();
            }
        } catch (error) {
            toast.error('Failed to share story');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikeStory = async (storyId) => {
        if (!currentClerkId) return toast.error('Please sign in to like stories');
        try {
            const token = await getToken();
            const res = await communityService.toggleLikeStory(storyId, token);
            if (res.success) {
                setStories(stories.map(s => s._id === storyId ? { ...s, liked: res.data.isLiked, likesCount: res.data.likesCount } : s));
            }
        } catch (error) {
            toast.error('Like failed');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <NavBar />

            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="relative mb-20 overflow-hidden rounded-[3rem] bg-muted/30 p-12 lg:p-20 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10"
                    >
                        <Badge className="mb-6 bg-primary/20 text-primary border-none px-4 py-1 font-black text-[10px] uppercase tracking-[0.2em]">Travel Stories</Badge>
                        <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-none mb-6">
                            Share Your <span className="text-primary italic">Adventure.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed opacity-80">
                            Explore the journeys of fellow Nexus travelers or share your own legendary voyages with the community.
                        </p>
                    </motion.div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between">
                    <div className="flex flex-1 gap-4 w-full md:max-w-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Search adventures..."
                                className="pl-12 h-14 rounded-2xl bg-muted/40 border-none shadow-none focus-visible:ring-2 ring-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="relative w-40">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Location"
                                className="pl-12 h-14 rounded-2xl bg-muted/40 border-none shadow-none focus-visible:ring-2 ring-primary/20"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 hover:scale-105 transition-transform group">
                                <Plus className="mr-2 group-hover:rotate-90 transition-transform" size={20} /> Share My Story
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-card border-border shadow-2xl rounded-3xl">
                            <DialogHeader className="p-8 border-b border-border bg-muted/20">
                                <DialogTitle className="text-3xl font-black italic tracking-tight">Post adventure story</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateStory} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Catchy Title</label>
                                    <Input
                                        placeholder="E.g. The Night the Aurora Danced in Norway"
                                        className="h-14 rounded-xl border-border bg-background"
                                        value={newStory.title}
                                        onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Location</label>
                                        <Input
                                            placeholder="City, Country"
                                            className="h-14 rounded-xl border-border bg-background"
                                            value={newStory.location}
                                            onChange={(e) => setNewStory({ ...newStory, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Images (Links)</label>
                                        <Input
                                            placeholder="Paste image URL"
                                            className="h-14 rounded-xl border-border bg-background"
                                            onChange={(e) => setNewStory({ ...newStory, images: [e.target.value] })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">The Journey Details</label>
                                    <Textarea
                                        placeholder="Write your story here..."
                                        className="min-h-[200px] rounded-xl border-border bg-background resize-none"
                                        value={newStory.content}
                                        onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                                    />
                                </div>
                                <Button
                                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[11px]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Publish Story"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stories Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-40 bg-muted/10 rounded-[4rem] border-2 border-dashed border-border">
                        <Navigation size={48} className="mx-auto mb-6 text-muted-foreground opacity-30" />
                        <p className="text-2xl font-black italic tracking-tight text-muted-foreground opacity-50">No stories found. Reset filters or start a new one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {stories.map((story, idx) => (
                            <motion.div
                                key={story._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative"
                            >
                                <Card className="h-full rounded-[2.5rem] overflow-hidden bg-card border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_80px_rgba(79,70,229,0.15)] transition-all duration-700">
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        {story.images?.[0] ? (
                                            <img src={story.images[0]} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center"><ImageIcon className="text-primary/20" size={60} /></div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Badge className="bg-primary/20 text-white border-none rounded-full px-4 py-1 font-black text-[8px] tracking-widest uppercase backdrop-blur-md">{story.location}</Badge>
                                            </div>
                                            <h3 className="text-3xl font-black text-white italic tracking-tighter leading-[0.9] mb-4 group-hover:text-primary transition-colors">{story.title}</h3>

                                            <div className="flex items-center justify-between">
                                                <div
                                                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => navigate(`/user/profile/${story.clerkUserId}`)}
                                                >
                                                    <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/20">
                                                        <img src={story.userId?.profilepicture} alt={story.userId?.username} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{story.userId?.username || 'Nexus Traveler'}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-white">
                                                    <button
                                                        onClick={() => handleLikeStory(story._id)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 transition-all ${story.likes?.includes(currentClerkId) ? 'bg-primary/20 border-primary/40' : 'bg-white/5 hover:bg-white/10'}`}
                                                    >
                                                        <Heart size={14} className={story.likes?.includes(currentClerkId) ? 'fill-primary text-primary' : ''} />
                                                        <span className="text-[10px] font-black">{story.likes?.length || 0}</span>
                                                    </button>
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                                                        <MessageSquare size={14} />
                                                        <span className="text-[10px] font-black">{story.commentsCount || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 pb-10">
                                        <p className="text-muted-foreground line-clamp-3 text-sm font-medium leading-relaxed mb-6 opacity-70 italic">
                                            "{story.content}"
                                        </p>
                                        <Button
                                            variant="ghost"
                                            className="w-full rounded-2xl border border-primary/10 hover:bg-primary/5 font-black uppercase tracking-widest text-[9px] group"
                                            onClick={() => navigate(`/user/profile/${story.clerkUserId}`)}
                                        >
                                            View Full Journey <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default TravelStoriesPage;
