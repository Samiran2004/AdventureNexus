import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    UserPlus, MessageSquare, MapPin, Link as LinkIcon, 
    Calendar, Shield, Award, Zap, Globe, Heart, 
    Share2, MoreHorizontal, Settings, Camera,
    Users, Compass, TrendingUp
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';

const ProfilePage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useUser();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`/api/v1/social/profile/${username}`);
            if (res.data.success) {
                setProfileUser(res.data.data);
                // Check if following
                if (currentUser && res.data.data.followers.includes(currentUser.id)) {
                    setIsFollowing(true);
                }
            }
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        // Logic to follow/unfollow
    };

    const handleMessage = async () => {
        try {
            const res = await axios.post('/api/v1/messaging/conversation', {
                recipientClerkUserId: profileUser.clerkUserId
            });
            if (res.data.success) {
                navigate(`/chat`);
            }
        } catch (error) {
            console.error("Error starting conversation", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    if (!profileUser) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
            <h1 className="text-4xl font-black tracking-tighter uppercase">User Not Found</h1>
            <Button onClick={() => navigate('/')} variant="outline" className="border-white/10">Go Home</Button>
        </div>
    );

    const isOwnProfile = currentUser?.id === profileUser.clerkUserId;

    return (
        <div className="min-h-screen bg-black font-inter pb-20">
            {/* Cover Image */}
            <div className="relative h-[350px] md:h-[450px] overflow-hidden group">
                <img 
                    src={profileUser.coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"} 
                    alt="Cover" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                {isOwnProfile && (
                    <Button className="absolute bottom-8 right-8 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-black/60 gap-2">
                        <Camera size={18} /> Edit Cover
                    </Button>
                )}
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 -mt-24 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-end">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-48 h-48 rounded-[3.5rem] p-1.5 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
                            <div className="w-full h-full rounded-[3.2rem] overflow-hidden border-4 border-black bg-[#111]">
                                <img 
                                    src={profileUser.profilepicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profileUser.username} 
                                    alt={profileUser.username} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {isOwnProfile && (
                            <div className="absolute inset-0 rounded-[3.5rem] bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera size={32} className="text-white" />
                            </div>
                        )}
                        <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-emerald-500 border-4 border-black shadow-lg" />
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex-1 pb-4 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">
                                    {profileUser.fullname || profileUser.username}
                                </h1>
                                <p className="text-xl text-white/40 font-medium tracking-tight">@{profileUser.username}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {isOwnProfile ? (
                                    <>
                                        <Button className="h-14 px-8 bg-white text-black hover:bg-white/90 rounded-2xl font-bold gap-2">
                                            <Settings size={20} /> Edit Profile
                                        </Button>
                                        <Button variant="outline" className="h-14 w-14 border-white/10 rounded-2xl">
                                            <Share2 size={20} className="text-white" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button 
                                            onClick={handleFollow}
                                            className={`h-14 px-8 rounded-2xl font-bold gap-2 ${isFollowing ? 'bg-white/10 text-white border border-white/10' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'}`}
                                        >
                                            {isFollowing ? 'Following' : <><UserPlus size={20} /> Follow</>}
                                        </Button>
                                        <Button 
                                            onClick={handleMessage}
                                            className="h-14 px-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold gap-2"
                                        >
                                            <MessageSquare size={20} /> Message
                                        </Button>
                                        <Button variant="outline" className="h-14 w-14 border-white/10 rounded-2xl">
                                            <MoreHorizontal size={20} className="text-white" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-white/60">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-xl">{profileUser.followers.length}</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/20">Followers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-xl">{profileUser.following.length}</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/20">Following</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-xl">42</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/20">Trips</span>
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
                                        {profileUser.bio || "No bio yet. Adventure is out there!"}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-white/60">
                                            <MapPin size={20} className="text-blue-500" />
                                            <span className="font-medium">{profileUser.country || "Earth Explorer"}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-white/60">
                                            <LinkIcon size={20} className="text-purple-500" />
                                            <span className="font-medium">adventure-nexus.com</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-white/60">
                                            <Calendar size={20} className="text-emerald-500" />
                                            <span className="font-medium">Joined May 2024</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-4">
                                    <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Badges</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white"><Award size={20} /></div>
                                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white"><Shield size={20} /></div>
                                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white"><Zap size={20} /></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <Tabs defaultValue="posts" className="space-y-8">
                            <TabsList className="bg-white/5 border border-white/5 p-1.5 rounded-2xl h-16 w-full md:w-auto">
                                <TabsTrigger value="posts" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:text-black">Posts</TabsTrigger>
                                <TabsTrigger value="trips" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:text-black">Trips</TabsTrigger>
                                <TabsTrigger value="media" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:text-black">Media</TabsTrigger>
                            </TabsList>

                            <TabsContent value="posts" className="space-y-6">
                                {[...Array(3)].map((_, i) => (
                                    <Card key={i} className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden group">
                                        <CardContent className="p-0">
                                            <div className="p-8 space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10" />
                                                        <div>
                                                            <div className="font-bold text-white">Exploring the Alps</div>
                                                            <div className="text-xs text-white/20 font-bold uppercase tracking-widest">2 Days Ago</div>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5"><MoreHorizontal size={20} className="text-white/40" /></Button>
                                                </div>
                                                <p className="text-white/70 leading-relaxed">
                                                    Just reached the summit! The view is absolutely breathtaking. AdventureNexus really helped me find this hidden trail.
                                                </p>
                                                <div className="h-96 rounded-3xl overflow-hidden border border-white/5">
                                                    <img 
                                                        src={`https://images.unsplash.com/photo-${1501785888041 + i}-af3ef285b470?q=80&w=1000&auto=format&fit=crop`} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
                                                        alt="Post"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                                    <button className="flex items-center gap-2 text-white/40 hover:text-pink-500 transition-colors">
                                                        <Heart size={20} /> <span className="font-bold text-sm">1.2k</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 text-white/40 hover:text-blue-500 transition-colors">
                                                        <MessageSquare size={20} /> <span className="font-bold text-sm">84</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 text-white/40 hover:text-emerald-500 transition-colors">
                                                        <Share2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
