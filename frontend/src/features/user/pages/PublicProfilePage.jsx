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

            <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 hover:bg-muted rounded-2xl group transition-all"
                >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} /> Back
                </Button>

                {/* Profile Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] overflow-hidden border-4 border-primary shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                {profile.profilepicture ? (
                                    <img src={profile.profilepicture} alt={profile.username} className="w-full h-full object-cover scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                        <Users size={64} className="text-primary opacity-50" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-background shadow-lg" />
                        </motion.div>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">
                                {profile.fullname || profile.username || 'Traveler'}
                            </h1>
                            <p className="text-lg text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2 opacity-80">
                                <MapPin size={20} className="text-primary" /> {profile.bio || 'Exploring the Nexus'}
                            </p>

                            <div className="flex items-center justify-center md:justify-start gap-6 mt-6">
                                <div className="text-center md:text-left">
                                    <div className="text-2xl font-black leading-none">{profile.followersCount}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Followers</div>
                                </div>
                                <div className="text-center md:text-left border-x border-border px-6">
                                    <div className="text-2xl font-black leading-none">{profile.followingCount}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Following</div>
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="text-2xl font-black leading-none">{activity.stories.length + activity.posts.length}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Contributions</div>
                                </div>
                            </div>
                        </div>

                        {currentUserId !== profile.clerkUserId && (
                            <div className="flex gap-4 w-full">
                                <Button
                                    onClick={handleToggleFollow}
                                    disabled={isFollowLoading}
                                    className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl ${isFollowing ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground hover:scale-105 transition-transform'}`}
                                >
                                    {isFollowing ? <><UserMinus className="mr-2" size={18} /> Unfollow</> : <><UserPlus className="mr-2" size={18} /> Follow</>}
                                </Button>
                                <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
                                        >
                                            <MessageSquare size={20} />
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
                            </div>
                        )}
                    </div>

                    {/* Activity Section */}
                    <div className="md:col-span-2 space-y-12">
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
