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
    Image as ImageIcon
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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const token = currentUserId ? await getToken() : null;
                const res = await communityService.getProfile(clerkUserId, token);
                if (res.success) {
                    setProfileData(res.data);
                    setIsFollowing(res.data.profile.isFollowing);
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
                                    <Button onClick={() => navigate('/profile')} className="h-14 px-8 bg-white text-black hover:bg-white/90 rounded-2xl font-bold">
                                        Own Profile
                                    </Button>
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
                                <span className="text-white font-black text-xl">{activity.stories.length + activity.posts.length}</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/20">Contributions</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] p-8">
                            <CardContent className="p-0 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">About</h3>
                                    <p className="text-white/60 leading-relaxed font-medium">
                                        {profile.bio || "No bio yet. Exploring the Nexus!"}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-white/60">
                                            <MapPin size={20} className="text-blue-500" />
                                            <span className="font-medium">{profile.country || "Earth Explorer"}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Activity Section */}
                    <div className="lg:col-span-8 space-y-12">
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tight mb-8 flex items-center gap-3">
                                <ImageIcon className="text-primary" /> Recent Travel Stories
                            </h2>
                            {activity.stories.length === 0 ? (
                                <div className="p-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-[2.5rem]">
                                    <p className="text-muted-foreground italic font-medium">No stories shared yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {activity.stories.map((story) => (
                                        <motion.div
                                            key={story._id}
                                            whileHover={{ y: -5 }}
                                            className="group cursor-pointer"
                                            onClick={() => navigate(`/stories`)}
                                        >
                                            <Card className="rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md border-white/5 shadow-2xl hover:shadow-primary/5 transition-all">
                                                <div className="aspect-[4/3] overflow-hidden relative">
                                                    {story.images?.[0] ? (
                                                        <img src={story.images[0]} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center"><ImageIcon className="opacity-20 text-primary" size={48} /></div>
                                                    )}
                                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                        <Badge className="mb-2 bg-primary/20 text-white backdrop-blur-md border-none font-black text-[9px] uppercase tracking-widest">{story.location}</Badge>
                                                        <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">{story.title}</h3>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-black italic tracking-tight mb-8 flex items-center gap-3">
                                <MessageSquare className="text-indigo-400" /> Community Discussions
                            </h2>
                            {activity.posts.length === 0 ? (
                                <div className="p-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-[2.5rem]">
                                    <p className="text-muted-foreground italic font-medium">No discussions started yet.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {activity.posts.map((post) => (
                                        <Card
                                            key={post._id}
                                            className="rounded-3xl bg-card border-border/50 hover:border-primary/20 transition-all cursor-pointer group"
                                            onClick={() => navigate('/community')}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <Badge variant="secondary" className="text-[9px] font-black uppercase bg-secondary/30">{post.category}</Badge>
                                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{post.title}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs font-black uppercase text-muted-foreground">
                                                        <span className="flex items-center gap-1.5"><Heart size={14} /> {post.likes?.length || 0}</span>
                                                        <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {post.repliesCount}</span>
                                                        <span className="text-[9px] ml-auto md:ml-0 opacity-50 underline">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PublicProfilePage;
