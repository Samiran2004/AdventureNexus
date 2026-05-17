import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import {
    Users,
    MapPin,
    Calendar,
    MessageSquare,
    UserPlus,
    UserMinus,
    Heart,
    Share2,
    Loader2,
    ArrowLeft,
    Image as ImageIcon,
    User,
    Compass,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { communityService } from '@/services/communityService';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import toast from 'react-hot-toast';

const PublicProfilePage = () => {
    const { clerkUserId } = useParams();
    const navigate = useNavigate();
    const { userId: currentUserId, getToken } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    // Messaging State
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [activeTab, setActiveTab] = useState('stories'); // 'stories' | 'discussions' | 'trips'

    // Edit Profile State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [editForm, setEditForm] = useState({
        fullname: '',
        bio: '',
        country: '',
        gender: '',
        isPrivate: false,
        preferences: []
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const token = currentUserId ? await getToken() : null;
                const res = await communityService.getProfile(clerkUserId, token);
                if (res.success) {
                    setProfileData(res.data);
                    setIsFollowing(res.data.profile.isFollowing);
                    setEditForm({
                        fullname: res.data.profile.fullname || '',
                        bio: res.data.profile.bio || '',
                        country: res.data.profile.country || '',
                        gender: res.data.profile.gender || '',
                        isPrivate: res.data.profile.isPrivate || false,
                        preferences: res.data.profile.preferences || []
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('User profile not found');
                navigate('/community');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [clerkUserId, navigate, currentUserId]);

    const handleToggleFollow = async () => {
        if (!currentUserId) {
            toast.error('Please sign in to follow users');
            return;
        }

        try {
            setIsFollowLoading(true);
            const token = await getToken();
            const res = await communityService.toggleFollow(clerkUserId, token);
            if (res.success) {
                setIsFollowing(res.data.isFollowing);
                // Optimistically update counts if needed, but let's refresh for reliability or just toggle
                setProfileData(prev => ({
                    ...prev,
                    profile: {
                        ...prev.profile,
                        followersCount: res.data.isFollowing
                            ? prev.profile.followersCount + 1
                            : prev.profile.followersCount - 1
                    }
                }));
                toast.success(res.data.isFollowing ? `Following ${profileData.profile.username}` : `Unfollowed ${profileData.profile.username}`);
            }
        } catch (error) {
            toast.error('Failed to update follow status');
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageContent.trim()) return toast.error('Please enter a message');

        try {
            setIsSendingMessage(true);
            const token = await getToken();
            const res = await communityService.sendMessage({
                recipientClerkUserId: clerkUserId,
                content: messageContent
            }, token);

            if (res.success) {
                toast.success('Message sent to the Nexus!');
                setIsMessageOpen(false);
                setMessageContent('');
            }
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setIsSavingProfile(true);
            const token = await getToken();
            const res = await communityService.updateProfile(editForm, token);
            if (res.success) {
                toast.success('Travel profile updated successfully!');
                setIsEditOpen(false);
                setProfileData(prev => ({
                    ...prev,
                    profile: {
                        ...prev.profile,
                        fullname: editForm.fullname,
                        bio: editForm.bio,
                        country: editForm.country,
                        gender: editForm.gender,
                        isPrivate: editForm.isPrivate,
                        preferences: editForm.preferences
                    }
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSavingProfile(false);
        }
    };

    if (isLoading || !profileData) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
                    {isLoading ? "Loading Journey..." : "User Not Found"}
                </p>
            </div>
        );
    }

    const { profile, activity } = profileData;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <NavBar />

            {/* Cover Image */}
            <div className="relative h-[350px] md:h-[450px] overflow-hidden group">
                <img 
                    src={profile.coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"} 
                    alt="Cover" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="absolute top-24 left-8 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-black/60 group transition-all"
                >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} /> Back
                </Button>
            </div>

            <main className="max-w-6xl mx-auto px-4 -mt-24 relative z-10 pb-20">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-8 items-end mb-16">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-48 h-48 rounded-[3.5rem] p-1.5 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
                            <div className="w-full h-full rounded-[3.2rem] overflow-hidden border-4 border-black bg-[#111]">
                                <img 
                                    src={profile.profilepicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.username} 
                                    alt={profile.username} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-emerald-500 border-4 border-black shadow-lg" />
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex-1 pb-4 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">
                                    {profile.fullname || profile.username}
                                </h1>
                                <p className="text-xl text-white/40 font-medium tracking-tight">@{profile.username}</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {currentUserId !== profile.clerkUserId ? (
                                    <>
                                        <Button 
                                            onClick={handleToggleFollow}
                                            disabled={isFollowLoading}
                                            className={`h-14 px-8 rounded-2xl font-bold gap-2 ${isFollowing ? 'bg-white/10 text-white border border-white/10' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'}`}
                                        >
                                            {isFollowing ? 'Following' : <><UserPlus size={20} /> Follow</>}
                                        </Button>
                                        <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    className="h-14 px-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold gap-2"
                                                >
                                                    <MessageSquare size={20} /> Message
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-3xl p-8">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-black italic tracking-tight">Direct Message</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleSendMessage} className="space-y-6 mt-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">To: {profile.username}</label>
                                                        <Textarea
                                                            placeholder="Type your message here..."
                                                            className="min-h-[150px] rounded-2xl bg-muted/20 border-border resize-none"
                                                            value={messageContent}
                                                            onChange={(e) => setMessageContent(e.target.value)}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px]"
                                                        disabled={isSendingMessage}
                                                    >
                                                        {isSendingMessage ? <Loader2 className="animate-spin" /> : "Send Signal"}
                                                    </Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                ) : (
                                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="h-14 px-8 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 gap-2 border border-primary/20">
                                                ⚙️ Edit Profile
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px] bg-slate-950 border-white/5 rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black italic tracking-tight text-white flex items-center gap-3">
                                                    🗺️ Update Travel Identity
                                                </DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleUpdateProfile} className="space-y-6 mt-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Display Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Your full name"
                                                        className="w-full h-12 px-4 rounded-xl bg-white/[0.02] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary transition-all font-medium"
                                                        value={editForm.fullname}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, fullname: e.target.value }))}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Travel Bio</label>
                                                    <Textarea
                                                        placeholder="Share your traveler soul..."
                                                        className="min-h-[100px] rounded-xl bg-white/[0.02] border-white/5 text-white placeholder-white/20 text-sm focus:border-primary transition-all font-medium resize-none"
                                                        value={editForm.bio}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Homebase (Country)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. India, Japan"
                                                            className="w-full h-12 px-4 rounded-xl bg-white/[0.02] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary transition-all font-medium"
                                                            value={editForm.country}
                                                            onChange={(e) => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Gender</label>
                                                        <select
                                                            className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-white/5 text-white text-sm focus:outline-none focus:border-primary transition-all font-medium"
                                                            value={editForm.gender}
                                                            onChange={(e) => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                                                        >
                                                            <option value="" disabled>Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Profile Visibility Toggle */}
                                                <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-white uppercase tracking-wider">Private Profile</span>
                                                            <span className="text-[10px] text-white/40 mt-0.5">Restrict details only to your followers.</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditForm(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                                                            className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${editForm.isPrivate ? 'bg-primary' : 'bg-white/10'}`}
                                                        >
                                                            <div className={`w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-md ${editForm.isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Preference Tag Toggles */}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Travel Style (Preferences)</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Solo', 'Adventure', 'Nature', 'Luxury', 'Budget', 'Culture', 'Foodie', 'Road Trip', 'Beach', 'Mountain'].map((pref) => {
                                                            const isSelected = editForm.preferences.includes(pref);
                                                            return (
                                                                <button
                                                                    key={pref}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditForm(prev => {
                                                                            const isSel = prev.preferences.includes(pref);
                                                                            const newPref = isSel
                                                                                ? prev.preferences.filter(p => p !== pref)
                                                                                : [...prev.preferences, pref];
                                                                            return { ...prev, preferences: newPref };
                                                                        });
                                                                    }}
                                                                    className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 border ${isSelected ? 'bg-primary/20 text-primary border-primary/40 shadow-lg shadow-primary/5' : 'bg-white/[0.02] text-white/40 border-white/5 hover:text-white hover:bg-white/[0.05]'}`}
                                                                >
                                                                    {pref}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="w-full h-14 rounded-xl font-black uppercase tracking-widest text-[10px]"
                                                    disabled={isSavingProfile}
                                                >
                                                    {isSavingProfile ? <Loader2 className="animate-spin" /> : "Save Traveler Log"}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-white/60">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-xl">{profile.followersCount}</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/20">Followers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-xl">{profile.followingCount}</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/20">Following</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-xl">{activity.stories.length + activity.posts.length + (activity.savedPlans?.length || 0)}</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/20">Contributions</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                            <CardContent className="p-0 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">About</h3>
                                    <p className="text-white/60 leading-relaxed font-medium text-sm">
                                        {profile.bio || "No bio yet. Exploring the Nexus!"}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Traveler Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-white/60">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                <MapPin size={18} className="text-blue-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-white/20 tracking-wider">Homebase</span>
                                                <span className="font-semibold text-white/80 text-sm">{profile.country || "Earth Explorer"}</span>
                                            </div>
                                        </div>

                                        {profile.gender && (
                                            <div className="flex items-center gap-4 text-white/60 capitalize">
                                                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                                                    <User size={18} className="text-pink-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-white/20 tracking-wider">Gender</span>
                                                    <span className="font-semibold text-white/80 text-sm">{profile.gender}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 text-white/60">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <Calendar size={18} className="text-emerald-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-white/20 tracking-wider">Joined Nexus</span>
                                                <span className="font-semibold text-white/80 text-sm">
                                                    {profile.createdAt 
                                                        ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
                                                        : "A long time ago"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {profile.preferences && profile.preferences.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Travel Style</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.preferences.map((pref, idx) => (
                                                <Badge key={idx} variant="outline" className="bg-primary/5 border-primary/20 text-primary capitalize rounded-xl py-1.5 px-3 font-bold tracking-wider text-[10px]">
                                                    {pref}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Activity Section */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Premium Glassmorphic Tab Selector */}
                        <div className="flex flex-wrap gap-3 bg-white/[0.02] border border-white/5 p-2 rounded-3xl backdrop-blur-md">
                            <button 
                                onClick={() => setActiveTab('stories')}
                                className={`flex-1 min-w-[120px] px-6 py-3.5 rounded-2xl font-black uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'stories' ? 'text-primary bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5' : 'text-muted-foreground hover:text-white bg-transparent border border-transparent'}`}
                            >
                                <ImageIcon size={14} /> Stories ({activity.stories.length})
                            </button>
                            <button 
                                onClick={() => setActiveTab('discussions')}
                                className={`flex-1 min-w-[120px] px-6 py-3.5 rounded-2xl font-black uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'discussions' ? 'text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 shadow-lg shadow-indigo-500/5' : 'text-muted-foreground hover:text-white bg-transparent border border-transparent'}`}
                            >
                                <MessageSquare size={14} /> Discussions ({activity.posts.length})
                            </button>
                            <button 
                                onClick={() => setActiveTab('trips')}
                                className={`flex-1 min-w-[120px] px-6 py-3.5 rounded-2xl font-black uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'trips' ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 shadow-lg shadow-emerald-500/5' : 'text-muted-foreground hover:text-white bg-transparent border border-transparent'}`}
                            >
                                <Compass size={14} /> Trips ({activity.savedPlans?.length || 0})
                            </button>
                        </div>

                        {/* Animated Tab Contents */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {activeTab === 'stories' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                            <h2 className="text-xl font-black italic tracking-tight flex items-center gap-3">
                                                📖 Recent Travel Stories
                                            </h2>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{activity.stories.length} Shared</span>
                                        </div>
                                        {activity.stories.length === 0 ? (
                                            <div className="p-16 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[2.5rem] backdrop-blur-xl">
                                                <p className="text-muted-foreground italic font-medium">No stories shared yet.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {activity.stories.map((story) => (
                                                    <motion.div
                                                        key={story._id}
                                                        whileHover={{ y: -6 }}
                                                        className="group cursor-pointer"
                                                        onClick={() => navigate(`/stories`)}
                                                    >
                                                        <Card className="rounded-[2.5rem] overflow-hidden bg-white/[0.02] border-white/5 shadow-2xl hover:border-primary/30 transition-all duration-500">
                                                            <div className="aspect-[4/3] overflow-hidden relative">
                                                                {story.images?.[0] ? (
                                                                    <img src={story.images[0]} alt={story.title} className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-[1.5s]" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-primary/5 flex items-center justify-center"><ImageIcon className="opacity-10 text-primary" size={48} /></div>
                                                                )}
                                                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                                                    <Badge className="mb-2.5 bg-primary/20 text-white backdrop-blur-md border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">{story.location}</Badge>
                                                                    <h3 className="text-lg font-black text-white leading-snug line-clamp-2">{story.title}</h3>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'discussions' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                            <h2 className="text-xl font-black italic tracking-tight flex items-center gap-3">
                                                💬 Community Discussions
                                            </h2>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{activity.posts.length} Posts</span>
                                        </div>
                                        {activity.posts.length === 0 ? (
                                            <div className="p-16 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[2.5rem] backdrop-blur-xl">
                                                <p className="text-muted-foreground italic font-medium">No discussions started yet.</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-4">
                                                {activity.posts.map((post) => (
                                                    <Card
                                                        key={post._id}
                                                        className="rounded-3xl bg-white/[0.02] border-white/5 hover:border-indigo-500/20 transition-all duration-300 cursor-pointer group"
                                                        onClick={() => navigate('/community')}
                                                    >
                                                        <CardContent className="p-6">
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                <div className="space-y-1.5">
                                                                    <Badge variant="secondary" className="text-[9px] font-black uppercase bg-indigo-500/10 text-indigo-400 border-none px-2.5 py-0.5">{post.category || 'General'}</Badge>
                                                                    <h3 className="text-base font-black text-white group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-xs font-black uppercase text-white/40">
                                                                    <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors"><Heart size={14} /> {post.likes?.length || 0}</span>
                                                                    <span className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"><MessageSquare size={14} /> {post.repliesCount || 0}</span>
                                                                    <span className="text-[9px] ml-auto md:ml-0 opacity-40">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'trips' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                            <h2 className="text-xl font-black italic tracking-tight flex items-center gap-3">
                                                🗺️ AI Planned Itineraries
                                            </h2>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{(activity.savedPlans?.length || 0)} Planned</span>
                                        </div>
                                        {(!activity.savedPlans || activity.savedPlans.length === 0) ? (
                                            <div className="p-16 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[2.5rem] backdrop-blur-xl">
                                                <p className="text-muted-foreground italic font-medium">No trips planned yet.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {activity.savedPlans.map((plan) => (
                                                    <motion.div
                                                        key={plan._id}
                                                        whileHover={{ y: -6 }}
                                                        className="group cursor-pointer"
                                                        onClick={() => navigate(`/shared-plan/${plan._id}`)}
                                                    >
                                                        <Card className="rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl hover:border-emerald-500/30 transition-all duration-500">
                                                            <div className="aspect-[16/10] overflow-hidden relative">
                                                                <img 
                                                                    src={plan.image_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop"} 
                                                                    alt={plan.to} 
                                                                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-[1.5s]" 
                                                                />
                                                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                                                    <Badge className="mb-2.5 bg-emerald-500/20 text-emerald-300 backdrop-blur-md border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                                                                        {plan.travel_style || "Explorer"}
                                                                    </Badge>
                                                                    <h3 className="text-lg font-black text-white leading-snug line-clamp-1">{plan.name || plan.to}</h3>
                                                                </div>
                                                            </div>
                                                            <CardContent className="p-6 space-y-4">
                                                                <div className="flex items-center justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                                    <span>{plan.days || 3} Days</span>
                                                                    <span>•</span>
                                                                    <span>{plan.travelers || 1} Pax</span>
                                                                    <span>•</span>
                                                                    <span className="text-emerald-400">${plan.budget || 0} USD</span>
                                                                </div>
                                                                {plan.destination_overview && (
                                                                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                                                                        {plan.destination_overview}
                                                                    </p>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PublicProfilePage;
