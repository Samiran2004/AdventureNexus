import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, SignedIn } from '@clerk/clerk-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    User, Mail, Phone, MapPin, Calendar, Camera, Edit3, Trash2,
    Heart, Globe, Shield, MessageSquare, Compass, Users, Sparkles,
    Lock, Unlock, Award, CheckCircle, ArrowRight, Loader2, Info
} from 'lucide-react';
import { useProfile } from '../../../hooks/useProfile';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user: clerkUser } = useUser();
    const {
        profile,
        stats,
        loadingProfile,
        tabData,
        loadingTab,
        fetchTabData,
        updateProfileData,
        deleteCommunityPost,
        deleteExperiencePost,
        deleteUserComment,
        refreshProfile
    } = useProfile();

    const [activeTab, setActiveTab] = useState('posts');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Edit form states
    const [formFirstName, setFormFirstName] = useState('');
    const [formLastName, setFormLastName] = useState('');
    const [formUsername, setFormUsername] = useState('');
    const [formBio, setFormBio] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formCountry, setFormCountry] = useState('');
    const [formGender, setFormGender] = useState('other');
    const [formIsPrivate, setFormIsPrivate] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Sync form state when profile is fetched
    useEffect(() => {
        if (profile) {
            setFormFirstName(profile.firstName || '');
            setFormLastName(profile.lastName || '');
            setFormUsername(profile.username || '');
            setFormBio(profile.bio || '');
            setFormPhone(profile.phonenumber || '');
            setFormCountry(profile.country || '');
            setFormGender(profile.gender || 'other');
            setFormIsPrivate(profile.isPrivate || false);
        }
    }, [profile]);

    // Lazily fetch data for active tab
    useEffect(() => {
        if (profile) {
            fetchTabData(activeTab);
        }
    }, [activeTab, profile, fetchTabData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const formData = new FormData();
            formData.append('firstName', formFirstName);
            formData.append('lastName', formLastName);
            formData.append('fullname', `${formFirstName} ${formLastName}`.trim());
            formData.append('username', formUsername);
            formData.append('bio', formBio);
            formData.append('phonenumber', formPhone);
            formData.append('country', formCountry);
            formData.append('gender', formGender);
            formData.append('isPrivate', formIsPrivate);
            formData.append('imageType', 'profile');

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const success = await updateProfileData(formData);
            if (success) {
                setIsEditModalOpen(false);
                setSelectedImage(null);
                setImagePreview(null);
                refreshProfile();
            }
        } catch (err) {
            toast.error('Failed to save profile changes');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleConfirmDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to permanently delete this post?')) {
            await deleteCommunityPost(postId);
        }
    };

    const handleConfirmDeleteExperience = async (expId) => {
        if (window.confirm('Are you sure you want to permanently delete this experience story?')) {
            await deleteExperiencePost(expId);
        }
    };

    const handleConfirmDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            await deleteUserComment(commentId);
        }
    };

    // Tabs definition
    const tabsList = [
        { id: 'posts', label: 'My Posts', icon: MessageSquare },
        { id: 'experiences', label: 'Experiences', icon: Compass },
        { id: 'comments', label: 'Comments', icon: Users },
        { id: 'likes', label: 'Liked Posts', icon: Heart },
        { id: 'groups', label: 'My Groups', icon: Globe }
    ];

    if (loadingProfile) {
        return (
            <div className="min-h-screen bg-[#07080C] text-white flex flex-col justify-center items-center gap-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-white/60 font-black uppercase tracking-widest text-[10px]">Loading Profile Control Center...</p>
            </div>
        );
    }

    const initials = `${profile?.firstName?.charAt(0) || ''}${profile?.lastName?.charAt(0) || ''}`.toUpperCase();

    return (
        <div className="min-h-screen bg-[#07080C] text-white relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none"></div>

            <NavBar />

            <div className="container mx-auto px-4 md:px-8 py-24 max-w-7xl">
                {/* Dashboard Grid Layout */}
                <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
                    
                    {/* LEFT PANEL - Glassmorphic Sticky Sidebar */}
                    <div className="sticky top-24 z-10 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-3xl p-6 flex flex-col items-center">
                        
                        {/* Profile Avatar / Photo Container */}
                        <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500/30 p-1 mb-5">
                            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-black text-white">
                                {profile?.profilepicture ? (
                                    <img src={profile.profilepicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    initials || 'TR'
                                )}
                            </div>
                            
                            {/* Hover Edit Overlay */}
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                            >
                                <Camera className="w-6 h-6 text-white mb-1" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-white/80">Change Pic</span>
                            </button>
                        </div>

                        {/* Name and Basic User Metadata */}
                        <h2 className="text-xl font-black tracking-tight text-white text-center flex items-center gap-2">
                            {profile?.fullname}
                            {profile?.isPrivate ? <Lock size={14} className="text-white/40" /> : <Unlock size={14} className="text-emerald-400" />}
                        </h2>
                        
                        <p className="text-xs text-indigo-400 font-bold mb-3">@{profile?.username || 'traveler'}</p>
                        
                        {profile?.bio ? (
                            <p className="text-xs text-white/60 text-center leading-relaxed max-w-xs mb-5 px-3 italic">
                                "{profile.bio}"
                            </p>
                        ) : (
                            <p className="text-xs text-white/30 text-center mb-5 italic">
                                "Add a bio to let other adventurers know who you are!"
                            </p>
                        )}

                        {/* Meta Tags Row */}
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {profile?.country && (
                                <Badge className="bg-white/5 border border-white/10 text-white/70 text-[9px] uppercase font-black tracking-widest px-2.5 py-1">
                                    <MapPin size={9} className="mr-1 text-indigo-400" /> {profile.country}
                                </Badge>
                            )}
                            <Badge className="bg-white/5 border border-white/10 text-white/70 text-[9px] uppercase font-black tracking-widest px-2.5 py-1">
                                <Calendar size={9} className="mr-1 text-emerald-400" /> Joined {new Date(profile?.createdAt).getFullYear()}
                            </Badge>
                        </div>

                        <hr className="w-full border-white/5 mb-6" />

                        {/* STATS CONTROL BOX - Metric Cards with dynamic counts */}
                        <div className="w-full grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-3 text-center hover:bg-white/[0.03] transition-all duration-300">
                                <span className="block text-lg font-black text-white">{stats.postsCount}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Posts</span>
                            </div>
                            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-3 text-center hover:bg-white/[0.03] transition-all duration-300">
                                <span className="block text-lg font-black text-white">{stats.experiencesCount}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Stories</span>
                            </div>
                            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-3 text-center hover:bg-white/[0.03] transition-all duration-300 col-span-2">
                                <span className="block text-lg font-black text-indigo-400">{stats.commentsCount}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Active Comments</span>
                            </div>
                        </div>

                        {/* Interactive Edit Profile Action Trigger */}
                        <Button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-widest py-5 rounded-2xl shadow-lg shadow-indigo-500/20"
                        >
                            <Edit3 size={14} className="mr-2" /> Edit Social Identity
                        </Button>

                    </div>

                    {/* RIGHT PANEL - Tabbed System Content Panel */}
                    <div className="flex flex-col gap-6">
                        
                        {/* Tab Selector Header */}
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-1.5 flex flex-wrap gap-1">
                            {tabsList.map(tab => {
                                const Icon = tab.icon;
                                const isSelected = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <Icon size={13} /> {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content Display */}
                        <div className="min-h-[400px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {loadingTab[activeTab] ? (
                                        <div className="py-20 flex flex-col justify-center items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                            <p className="text-white/40 font-black uppercase tracking-widest text-[9px]">Fetching your {activeTab}...</p>
                                        </div>
                                    ) : (
                                        <div>
                                            
                                            {/* ── 1. MY POSTS TAB CONTENT ── */}
                                            {activeTab === 'posts' && (
                                                <div className="flex flex-col gap-4">
                                                    {!tabData.posts || tabData.posts.length === 0 ? (
                                                        <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                                                            <MessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                                            <p className="text-sm font-bold text-white/50">You haven't posted in the community yet.</p>
                                                        </div>
                                                    ) : (
                                                        tabData.posts.map(post => (
                                                            <Card key={post._id} className="bg-white/[0.02] border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
                                                                <CardContent className="p-5 flex flex-col gap-4">
                                                                    <div className="flex justify-between items-start gap-4">
                                                                        <div>
                                                                            <h3 className="text-sm font-bold text-white mb-1">{post.title || 'Community Post'}</h3>
                                                                            <p className="text-xs text-white/60 line-clamp-3">{post.content}</p>
                                                                        </div>
                                                                        <button 
                                                                            onClick={() => handleConfirmDeletePost(post._id)}
                                                                            className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                    
                                                                    {post.images && post.images.length > 0 && (
                                                                        <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                                                                            {post.images.slice(0, 3).map((img, idx) => (
                                                                                <img key={idx} src={img} alt="Post Content" className="w-full h-24 object-cover" />
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/30 pt-3 border-t border-white/5">
                                                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                                        <div className="flex gap-4">
                                                                            <span className="flex items-center gap-1"><Heart size={10} className="text-rose-500" /> {post.likes?.length || 0} Likes</span>
                                                                            <span className="flex items-center gap-1"><MessageSquare size={10} className="text-indigo-400" /> {post.repliesCount || 0} Replies</span>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))
                                                    )}
                                                </div>
                                            )}

                                            {/* ── 2. MY EXPERIENCES TAB CONTENT ── */}
                                            {activeTab === 'experiences' && (
                                                <div className="flex flex-col gap-4">
                                                    {!tabData.experiences || tabData.experiences.length === 0 ? (
                                                        <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                                                            <Compass className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                                            <p className="text-sm font-bold text-white/50">No travel experiences shared yet.</p>
                                                        </div>
                                                    ) : (
                                                        tabData.experiences.map(exp => (
                                                            <Card key={exp._id} className="bg-white/[0.02] border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
                                                                <CardContent className="p-0">
                                                                    <div className="grid md:grid-cols-[200px_1fr] items-stretch">
                                                                        
                                                                        {/* Cover image */}
                                                                        <div className="h-44 md:h-auto relative bg-indigo-900/10">
                                                                            {exp.images && exp.images[0] ? (
                                                                                <img src={exp.images[0]} alt={exp.title} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center"><Compass className="w-8 h-8 text-white/20" /></div>
                                                                            )}
                                                                        </div>

                                                                        {/* Details body */}
                                                                        <div className="p-5 flex flex-col justify-between gap-4">
                                                                            <div className="flex justify-between items-start gap-4">
                                                                                <div>
                                                                                    <Badge className="bg-indigo-600/20 text-indigo-400 border-none text-[9px] uppercase font-black px-2 py-0.5 mb-2">Adventure Story</Badge>
                                                                                    <h3 className="text-sm font-bold text-white mb-1.5">{exp.title}</h3>
                                                                                    <p className="text-xs text-white/60 line-clamp-2">{exp.description}</p>
                                                                                </div>
                                                                                <button 
                                                                                    onClick={() => handleConfirmDeleteExperience(exp._id)}
                                                                                    className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>

                                                                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/30 pt-3 border-t border-white/5">
                                                                                <span className="flex items-center gap-1"><MapPin size={10} className="text-emerald-400" /> {exp.location}</span>
                                                                                <span>{exp.difficultyLevel || 'Moderate'}</span>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))
                                                    )}
                                                </div>
                                            )}

                                            {/* ── 3. MY COMMENTS TAB CONTENT ── */}
                                            {activeTab === 'comments' && (
                                                <div className="flex flex-col gap-3">
                                                    {!tabData.comments || tabData.comments.length === 0 ? (
                                                        <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                                                            <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                                            <p className="text-sm font-bold text-white/50">You haven't commented on any posts.</p>
                                                        </div>
                                                    ) : (
                                                        tabData.comments.map(comment => (
                                                            <Card key={comment._id} className="bg-white/[0.02] border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300">
                                                                <CardContent className="p-4 flex justify-between items-center gap-4">
                                                                    <div>
                                                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Commented on "{comment.postTitle}"</span>
                                                                        <p className="text-xs text-white mt-1">"{comment.content}"</p>
                                                                        <span className="text-[8px] text-white/20 block mt-2">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => handleConfirmDeleteComment(comment._id)}
                                                                        className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                                                                    >
                                                                        <Trash2 size={13} />
                                                                    </button>
                                                                </CardContent>
                                                            </Card>
                                                        ))
                                                    )}
                                                </div>
                                            )}

                                            {/* ── 4. LIKED POSTS TAB CONTENT ── */}
                                            {activeTab === 'likes' && (
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {!tabData.likes || tabData.likes.length === 0 ? (
                                                        <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl col-span-2">
                                                            <Heart className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                                            <p className="text-sm font-bold text-white/50">No liked posts in your logs.</p>
                                                        </div>
                                                    ) : (
                                                        tabData.likes.map(post => (
                                                            <Card key={post._id} className="bg-white/[0.02] border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
                                                                <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                                                                    <div>
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <span className="text-[10px] font-bold text-white/40">@{post.userId?.username || 'traveler'}</span>
                                                                        </div>
                                                                        <h3 className="text-xs font-bold text-white mb-1.5">{post.title || 'Community Post'}</h3>
                                                                        <p className="text-xs text-white/60 line-clamp-2">{post.content}</p>
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/30 pt-3 border-t border-white/5">
                                                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                                        <span className="flex items-center gap-1"><Heart size={10} className="text-rose-500 fill-rose-500" /> {post.likes?.length || 0}</span>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))
                                                    )}
                                                </div>
                                            )}

                                            {/* ── 5. GROUPS TAB CONTENT ── */}
                                            {activeTab === 'groups' && (
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {!tabData.groups || tabData.groups.length === 0 ? (
                                                        <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl col-span-2">
                                                            <Globe className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                                            <p className="text-sm font-bold text-white/50">You haven't joined any travel groups yet.</p>
                                                        </div>
                                                    ) : (
                                                        tabData.groups.map(membership => {
                                                            const g = membership.groupId;
                                                            if (!g) return null;
                                                            return (
                                                                <Card key={membership._id} className="bg-white/[0.02] border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
                                                                    <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                                                                        <div>
                                                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] uppercase font-black tracking-widest">{membership.role}</Badge>
                                                                                <span className="text-[9px] text-white/30 flex items-center gap-1"><Users size={10} /> {g.membersCount || 1} members</span>
                                                                            </div>
                                                                            <h3 className="text-sm font-bold text-white mb-1">{g.name}</h3>
                                                                            <p className="text-xs text-white/60 line-clamp-2">{g.description}</p>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>

                </div>
            </div>

            {/* EDIT SOCIAL IDENTITY MODAL */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-[#07080C]/80 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#0D0F16] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden z-10 relative flex flex-col max-h-[85vh]"
                        >
                            
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-[#0D0F16]/90 backdrop-blur-md px-6 py-5 border-b border-white/5 flex justify-between items-center z-10">
                                <h3 className="text-md font-black uppercase tracking-wider text-white flex items-center gap-2"><Sparkles className="text-indigo-400" size={16} /> Edit Social Profile</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                            </div>

                            {/* Modal Form Content */}
                            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-5 flex-1">
                                
                                {/* Photo Upload Section */}
                                <div className="flex items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-indigo-600/20 border border-white/10 flex items-center justify-center text-lg font-bold">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : profile?.profilepicture ? (
                                            <img src={profile.profilepicture} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-1">Adventure Avatar</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="text-xs text-white/50 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 file:cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">First Name</label>
                                        <Input 
                                            value={formFirstName}
                                            onChange={e => setFormFirstName(e.target.value)}
                                            className="bg-white/5 border-white/10 rounded-xl focus:border-indigo-500 text-white text-xs h-10"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Last Name</label>
                                        <Input 
                                            value={formLastName}
                                            onChange={e => setFormLastName(e.target.value)}
                                            className="bg-white/5 border-white/10 rounded-xl focus:border-indigo-500 text-white text-xs h-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Username</label>
                                    <Input 
                                        value={formUsername}
                                        onChange={e => setFormUsername(e.target.value)}
                                        className="bg-white/5 border-white/10 rounded-xl focus:border-indigo-500 text-white text-xs h-10"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Explorer Bio</label>
                                    <Textarea 
                                        value={formBio}
                                        onChange={e => setFormBio(e.target.value)}
                                        placeholder="Digital nomad, hiking geek..."
                                        className="bg-white/5 border-white/10 rounded-xl focus:border-indigo-500 text-white text-xs min-h-[80px]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Country</label>
                                        <Input 
                                            value={formCountry}
                                            onChange={e => setFormCountry(e.target.value)}
                                            className="bg-white/5 border-white/10 rounded-xl focus:border-indigo-500 text-white text-xs h-10"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Phone</label>
                                        <Input 
                                            value={formPhone}
                                            onChange={e => setFormPhone(e.target.value)}
                                            className="bg-white/5 border-white/10 rounded-xl focus:border-indigo-500 text-white text-xs h-10"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                                    <div>
                                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                            {formIsPrivate ? <Lock size={12} className="text-rose-400" /> : <Unlock size={12} className="text-emerald-400" />} Account Privacy
                                        </h4>
                                        <p className="text-[9px] text-white/40 mt-0.5">Toggle profile search visibility and stats</p>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        checked={formIsPrivate}
                                        onChange={e => setFormIsPrivate(e.target.checked)}
                                        className="w-4 h-4 accent-indigo-600 rounded bg-white/5 border-white/10"
                                    />
                                </div>

                                {/* Form Action Buttons */}
                                <div className="sticky bottom-0 bg-[#0D0F16] pt-4 border-t border-white/5 flex gap-3">
                                    <Button 
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        variant="outline"
                                        className="flex-1 border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-xs font-black uppercase tracking-widest rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit"
                                        disabled={isSavingProfile}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl h-10"
                                    >
                                        {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile'}
                                    </Button>
                                </div>

                            </form>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default ProfilePage;