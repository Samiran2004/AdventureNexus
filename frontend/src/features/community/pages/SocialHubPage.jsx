import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useSocket } from '@/context/appContext';
import { Compass, Users, Map, Globe, Search, Bell, Sparkles, X, Heart, MessageSquare, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { communityService } from '@/services/communityService';
import toast from 'react-hot-toast';
import NavBar from '@/components/NavBar';

import { PostCard } from '../components/PostCard';
import { StoryBar } from '../components/StoryBar';
import { CommentTree } from '../components/CommentTree';

export const SocialHubPage = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('global'); // global, communities, groups
  
  const [communities, setCommunities] = useState([]);
  const [groups, setGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- V3 Core States ---
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isStoriesLoading, setIsStoriesLoading] = useState(true);

  // Modals & Panels
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  // Community Feed Filters & Group Creation Modals
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupComposer, setGroupComposer] = useState({
    name: '',
    description: '',
    coverImage: '',
    privacy: 'PUBLIC'
  });

  // Composer Form
  const [composerData, setComposerData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: '',
    images: ''
  });

  // --- API DATA FETCHING ---
  const fetchSidebarData = async () => {
    try {
      const token = await getToken();
      
      const [commRes, myGroupsRes, allGroupsRes] = await Promise.all([
        communityService.getCommunities(),
        token ? communityService.getMyGroups(token) : { groups: [] },
        token ? communityService.getGroups(token) : { groups: [] }
      ]);

      if (commRes.success) setCommunities(commRes.communities);
      
      if (myGroupsRes.success) {
        const uniqueMyGroups = [];
        const seen = new Set();
        (myGroupsRes.groups || []).forEach(g => {
          if (g && g._id && !seen.has(g._id)) {
            seen.add(g._id);
            uniqueMyGroups.push(g);
          }
        });
        setGroups(uniqueMyGroups);
      }

      if (allGroupsRes.success) {
        const myGroupIds = new Set((myGroupsRes.groups || []).map(g => g && g._id));
        const uniqueDiscoverGroups = [];
        const seen = new Set();
        (allGroupsRes.groups || []).forEach(g => {
          if (g && g._id && !seen.has(g._id) && !myGroupIds.has(g._id)) {
            seen.add(g._id);
            uniqueDiscoverGroups.push(g);
          }
        });
        setDiscoverGroups(uniqueDiscoverGroups);
      }
    } catch (error) {
      console.error("Failed to load sidebar data:", error);
    }
  };

  const fetchFeedData = async () => {
    try {
      setIsPostsLoading(true);
      setIsStoriesLoading(true);

      const clerkUserId = user?.id || '';
      
      const categoryFilter = (activeTab === 'global' || activeTab === 'groups') ? '' : (activeTab === 'communities' ? 'General' : activeTab);
      const groupFilter = activeTab === 'groups' ? 'all_groups' : 'none';
      const communityFilter = selectedCommunity?._id || '';

      const [postRes, storyRes] = await Promise.all([
        communityService.getPosts(categoryFilter, '', clerkUserId, groupFilter, communityFilter),
        communityService.getStories()
      ]);

      if (postRes.success) {
        setPosts(postRes.data || []);
      }
      if (storyRes.success) {
        setStories(storyRes.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch feed data:", error);
      toast.error("Could not load discussions");
    } finally {
      setIsPostsLoading(false);
      setIsStoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchSidebarData();
  }, [user]);

  useEffect(() => {
    fetchFeedData();
  }, [activeTab, selectedCommunity, user]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingLike = (data) => {
      const { targetType, targetId, likes } = data;
      if (targetType === 'post') {
        setPosts(prev => prev.map(p => p._id === targetId ? { ...p, likes } : p));
        setSelectedPost(prev => prev && prev._id === targetId ? { ...prev, likes } : prev);
      }
    };

    const handleIncomingComment = (data) => {
      const { postId, comment } = data;
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, repliesCount: (p.repliesCount || 0) + 1 } : p));
      setSelectedPost(prev => {
        if (prev && prev._id === postId) {
          const commentsList = prev.comments || [];
          if (commentsList.some(c => c._id === comment._id)) return prev;
          return { 
            ...prev, 
            repliesCount: (prev.repliesCount || 0) + 1,
            comments: [...commentsList, comment] 
          };
        }
        return prev;
      });
    };

    const handleIncomingPost = (data) => {
      const { post } = data;
      setPosts(prev => {
        if (prev.some(p => p._id === post._id)) return prev;
        return [post, ...prev];
      });
    };

    socket.on('community:like', handleIncomingLike);
    socket.on('community:comment', handleIncomingComment);
    socket.on('community:post', handleIncomingPost);

    return () => {
      socket.off('community:like', handleIncomingLike);
      socket.off('community:comment', handleIncomingComment);
      socket.off('community:post', handleIncomingPost);
    };
  }, [socket]);

  // --- ACTION HANDLERS ---
  const handlePostDelete = async (postId) => {
    const confirm = window.confirm("Are you sure you want to delete this discussion?");
    if (!confirm) return;
    try {
      const token = await getToken();
      const res = await communityService.deletePost(postId, token);
      if (res.success) {
        toast.success("Post deleted successfully");
        setPosts(prev => prev.filter(p => p._id !== postId));
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handlePostEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.content) {
      toast.error("Title and Content are required");
      return;
    }
    try {
      const token = await getToken();
      const payload = {
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category || 'General',
        destinationTags: Array.isArray(editingPost.destinationTags)
          ? editingPost.destinationTags
          : typeof editingPost.destinationTags === 'string'
            ? editingPost.destinationTags.split(',').map(t => t.trim()).filter(Boolean)
            : []
      };

      const res = await communityService.updatePost(editingPost._id, payload, token);
      if (res.success) {
        toast.success("Post updated successfully");
        setPosts(prev => prev.map(p => p._id === editingPost._id ? { ...p, ...res.data } : p));
        setEditingPost(null);
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Failed to update post");
    }
  };
  const handleCreateGroup = () => {
    if (!user) return toast.error("Please login to create a group");
    setIsCreateGroupOpen(true);
  };

  const handleCreateGroupSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to create a group");
    if (!groupComposer.name.trim()) return toast.error("Group name is required");

    try {
      const token = await getToken();
      const res = await communityService.createGroup(groupComposer, token);
      if (res.success) {
        toast.success(`Group "${groupComposer.name}" created successfully!`);
        setGroups(prev => {
          const exists = prev.some(g => g._id === res.group._id);
          if (exists) return prev;
          return [...prev, res.group];
        });
        setIsCreateGroupOpen(false);
        setGroupComposer({ name: '', description: '', coverImage: '', privacy: 'PUBLIC' });
      }
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  const handleJoinCommunity = async (communityId) => {
    if (!user) return toast.error("Please login first");
    try {
      const token = await getToken();
      const res = await communityService.joinCommunity(communityId, token);
      if (res.success) {
        toast.success("Joined community!");
        // Optimistic update count
        setCommunities(prev => prev.map(c => 
          c._id === communityId ? { ...c, followersCount: c.followersCount + 1 } : c
        ));
      }
    } catch (error) {
      toast.error("Failed to join community");
    }
  };

  // --- INTERACTION HANDLERS ---
  const handleLike = async (postId) => {
    if (!user) return toast.error("Please login to like this post");
    try {
      const token = await getToken();
      const res = await communityService.toggleLike('post', postId, token);
      if (res.success) {
        setPosts(prev => prev.map(p => {
          if (p._id === postId) {
            const alreadyLiked = p.likes?.includes(user.id);
            const newLikes = alreadyLiked 
              ? p.likes.filter(id => id !== user.id) 
              : [...(p.likes || []), user.id];
            return { ...p, likes: newLikes };
          }
          return p;
        }));
        if (selectedPost && selectedPost._id === postId) {
          const alreadyLiked = selectedPost.likes?.includes(user.id);
          const newLikes = alreadyLiked 
            ? selectedPost.likes.filter(id => id !== user.id) 
            : [...(selectedPost.likes || []), user.id];
          setSelectedPost(prev => ({ ...prev, likes: newLikes }));
        }
      }
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleSave = async (postId) => {
    if (!user) return toast.error("Please login to save this post");
    try {
      const token = await getToken();
      const res = await communityService.toggleSavePost(postId, token);
      if (res.success) {
        toast.success(res.message || "Post saved!");
      }
    } catch (error) {
      toast.error("Failed to save post");
    }
  };

  const handleShare = (postId, title, content) => {
    if (navigator.share) {
      navigator.share({
        title,
        text: content,
        url: `${window.location.origin}/community/posts/${postId}`
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/community/posts/${postId}`);
      toast.success("Post link copied to clipboard!");
    }
  };

  const handleOpenDetail = async (post) => {
    try {
      const res = await communityService.getPostById(post._id);
      if (res.success) {
        setSelectedPost(res.data);
      }
    } catch (error) {
      toast.error("Could not load comments");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first");
    
    try {
      const token = await getToken();
      const tagsArray = composerData.tags.split(',').map(t => t.trim()).filter(Boolean);
      const imagesArray = composerData.images.split(',').map(t => t.trim()).filter(Boolean);

      const postPayload = {
        title: composerData.title,
        content: composerData.content,
        category: composerData.category,
        destinationTags: tagsArray,
        images: imagesArray
      };

      const res = await communityService.createPost(postPayload, token);
      if (res.success) {
        toast.success("Post created successfully!");
        setIsCreatePostOpen(false);
        setComposerData({ title: '', content: '', category: 'General', tags: '', images: '' });
        fetchFeedData(); // Refresh feed
      }
    } catch (error) {
      toast.error("Failed to publish post");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first");
    if (!commentContent.trim()) return;

    try {
      const token = await getToken();
      const res = await communityService.addComment({
        postId: selectedPost._id,
        content: commentContent,
        parentId: replyingTo
      }, token);

      if (res.success) {
        toast.success("Comment added!");
        setCommentContent('');
        setReplyingTo(null);
        // Refresh detail view
        handleOpenDetail(selectedPost);
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 relative overflow-hidden">
      <NavBar />
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Top Navigation / Search Bar */}
        <div className="flex items-center justify-between mb-8 bg-card/40 backdrop-blur-2xl p-4 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-inner">
              <Globe size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">Nexus <span className="text-primary">Hub</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Discover The World</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search communities, groups, or destinations..." 
              className="w-full bg-muted/40 border-none rounded-full pl-12 h-12 text-sm font-medium focus-visible:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
              <Bell size={20} />
            </Button>
            {user && (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 cursor-pointer hover:scale-105 transition-transform">
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR: Navigation & Communities */}
          <div className="hidden lg:block lg:col-span-3 space-y-8">
            
            {/* Communities Section */}
            <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 shadow-xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Compass size={14} /> Discover Communities
              </h3>
              <div className="space-y-3">
                {communities.map(community => {
                  const isSelected = selectedCommunity?._id === community._id;
                  return (
                    <div 
                      key={community._id} 
                      className={`flex items-center justify-between group p-2 rounded-xl transition-all duration-300 ${
                        isSelected 
                          ? 'bg-primary/20 border border-primary/20 shadow-md scale-[1.02]' 
                          : 'hover:bg-primary/5 border border-transparent'
                      }`}
                    >
                      <div 
                        onClick={() => setSelectedCommunity(isSelected ? null : community)} 
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-lg shadow-inner transition-colors shrink-0 ${
                          isSelected ? 'bg-primary/30 text-primary' : 'group-hover:bg-primary/25'
                        }`}>
                          {community.icon || '🌍'}
                        </div>
                        <div className="truncate">
                          <div className={`font-bold text-sm truncate transition-colors ${
                            isSelected ? 'text-primary' : 'group-hover:text-primary'
                          }`}>{community.name}</div>
                          <div className="text-[10px] text-muted-foreground">{community.followersCount} followers</div>
                        </div>
                      </div>
                      <button 
                        disabled={!user}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinCommunity(community._id);
                        }}
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-primary border-primary text-white hover:bg-primary/80' 
                            : 'border-white/10 hover:border-primary/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {isSelected ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* My Groups Section */}
            <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <Users size={14} /> My Groups
              </h3>
              <div className="space-y-4">
                {groups.length === 0 && <div className="text-xs text-muted-foreground italic">You haven't joined any groups yet.</div>}
                {groups.map(group => (
                  <div 
                    key={group._id} 
                    onClick={() => navigate(`/community/group/${group._id}`)}
                    className="flex flex-col gap-1 cursor-pointer p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-white/5 hover:border-primary/20 group"
                  >
                    <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">{group.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{group.privacy} Group</div>
                  </div>
                ))}
              </div>
              <Button onClick={handleCreateGroup} className="w-full mt-6 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-xs font-bold">
                + Create Group
              </Button>
            </div>

            {/* Discover Groups Section */}
            <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-pink-400 mb-6 flex items-center gap-2">
                <Globe size={14} className="text-pink-400 animate-pulse" /> Discover Groups
              </h3>
              <div className="space-y-4">
                {discoverGroups.length === 0 && <div className="text-xs text-muted-foreground italic">No new groups to discover.</div>}
                {discoverGroups.map(group => (
                  <div 
                    key={group._id} 
                    onClick={() => navigate(`/community/group/${group._id}`)}
                    className="flex flex-col gap-1 cursor-pointer p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-white/5 hover:border-pink-500/20 group"
                  >
                    <div className="font-bold text-sm truncate group-hover:text-pink-400 transition-colors">{group.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{group.privacy} Group</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Feed & Stories */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Feed Tabs */}
            <div className="flex items-center justify-center gap-1.5 p-1 bg-muted/30 backdrop-blur-md rounded-full w-max mx-auto border border-white/5 shadow-inner">
              {['global', 'communities', 'groups'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab !== 'communities') setSelectedCommunity(null);
                  }}
                  className={`px-4 sm:px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-[1.02]' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Story Bar */}
            <StoryBar stories={stories} isStoriesLoading={isStoriesLoading} />

            {/* Selected Community Filter Header */}
            {selectedCommunity && (
              <div className="bg-primary/10 border border-primary/20 p-5 rounded-[2rem] flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl shadow-inner">
                    {selectedCommunity.icon || '🌍'}
                  </div>
                  <div>
                    <h4 className="text-sm font-black">Filtered by {selectedCommunity.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Showing discussions in this community</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCommunity(null)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Post Composer Input (Functional) */}
            {user && (
              <div 
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-card/60 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-4 cursor-pointer group hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                  <img src={user?.imageUrl || 'https://via.placeholder.com/150'} alt="Me" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 h-12 bg-muted/40 rounded-full flex items-center px-6 text-muted-foreground font-medium group-hover:bg-muted/60 transition-colors border border-transparent group-hover:border-primary/20">
                  Share your latest adventure...
                </div>
              </div>
            )}

            {/* Feed Content */}
            <div className="space-y-6">
              
              {/* Mobile-only Communities View */}
              {activeTab === 'communities' && !selectedCommunity && (
                <div className="lg:hidden bg-card/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 shadow-xl space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Compass size={14} /> Discover Communities
                  </h3>
                  <div className="space-y-3">
                    {communities.map(community => {
                      const isSelected = selectedCommunity?._id === community._id;
                      return (
                        <div 
                          key={community._id} 
                          className="flex items-center justify-between group p-2 rounded-xl border border-transparent hover:bg-primary/5 transition-all duration-300"
                        >
                          <div 
                            onClick={() => setSelectedCommunity(community)} 
                            className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                          >
                            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-lg shadow-inner shrink-0 group-hover:bg-primary/30 transition-colors">
                              {community.icon || '🌍'}
                            </div>
                            <div className="truncate">
                              <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">{community.name}</div>
                              <div className="text-[10px] text-muted-foreground">{community.followersCount} followers</div>
                            </div>
                          </div>
                          <button 
                            disabled={!user}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinCommunity(community._id);
                            }}
                            className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all"
                          >
                            Join
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mobile-only Groups View */}
              {activeTab === 'groups' && (
                <div className="lg:hidden bg-card/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Users size={14} /> My Groups
                    </h3>
                    <Button onClick={handleCreateGroup} className="h-8 px-3 rounded-xl bg-primary/15 text-primary hover:bg-primary hover:text-white text-[10px] font-black uppercase tracking-wider transition-colors">
                      + Create Group
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {groups.length === 0 && <div className="text-xs text-muted-foreground italic text-center py-4">You haven't joined any groups yet.</div>}
                    {groups.map(group => (
                      <div 
                        key={group._id} 
                        onClick={() => navigate(`/community/group/${group._id}`)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-white/5 hover:border-primary/20 group cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-sm group-hover:text-primary transition-colors">{group.name}</div>
                          <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">{group.privacy} Group</div>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider shrink-0">{group.memberCount || 1} members</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Feed List (Only shown if browsing general Global posts, or if a Community filter is active) */}
              {!(activeTab === 'communities' && !selectedCommunity) && (
                isPostsLoading ? (
                  [1, 2].map(i => (
                    <div key={i} className="h-96 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/5 shadow-xl animate-pulse flex flex-col p-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted/50" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted/50 rounded-full" />
                          <div className="h-3 w-24 bg-muted/50 rounded-full" />
                        </div>
                      </div>
                      <div className="flex-1 bg-muted/30 rounded-2xl" />
                    </div>
                  ))
                ) : posts.length === 0 ? (
                  <div className="text-center py-20 bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-white/5">
                    <Globe className="mx-auto text-muted-foreground mb-4 opacity-50" size={48} />
                    <p className="font-black text-lg">No posts yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Be the first to share an adventure on this tab!</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <PostCard 
                      key={post._id}
                      discussion={post}
                      clerkUserId={user?.id}
                      onLike={handleLike}
                      onSave={handleSave}
                      onShare={handleShare}
                      onOpenDetail={handleOpenDetail}
                      onEdit={(post) => setEditingPost(post)}
                      onDelete={handlePostDelete}
                    />
                  ))
                )
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR: Trends & Activity */}
          <div className="hidden lg:block lg:col-span-3 space-y-8">
            <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2 relative z-10">
                <Sparkles size={14} className="text-pink-400" /> Trending Now
              </h3>
              <div className="space-y-4 relative z-10">
                {['#KyotoAutumn', '#SwissAlps', '#BaliLife', '#VanLife'].map((tag, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <span className="font-bold text-sm group-hover:text-pink-400 transition-colors">{tag}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{Math.floor(Math.random() * 50) + 10} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- OVERLAY MODALS --- */}
      <AnimatePresence>
        {/* Create Post Modal */}
        {isCreatePostOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatePostOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsCreatePostOpen(false)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black mb-6">Create New Post</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Category</label>
                  <select 
                    value={composerData.category}
                    onChange={(e) => setComposerData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-muted/50 border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary"
                  >
                    <option value="General">General</option>
                    <option value="Solo Backpackers">Solo Backpackers</option>
                    <option value="Luxury Escapes">Luxury Escapes</option>
                    <option value="Digital Nomads">Digital Nomads</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Title</label>
                  <Input 
                    required
                    placeholder="Give your adventure a catchy title..." 
                    value={composerData.title}
                    onChange={(e) => setComposerData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-muted/50 border-white/5 rounded-2xl h-12 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Adventure Description</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell your fellow travelers all about your itinerary, tips, or experiences..." 
                    value={composerData.content}
                    onChange={(e) => setComposerData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-muted/50 border border-white/5 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Destination Tags (comma separated)</label>
                  <Input 
                    placeholder="kyoto, autumn, japan" 
                    value={composerData.tags}
                    onChange={(e) => setComposerData(prev => ({ ...prev, tags: e.target.value }))}
                    className="bg-muted/50 border-white/5 rounded-2xl h-12 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Image URLs (comma separated)</label>
                  <Input 
                    placeholder="https://image1.jpg, https://image2.jpg" 
                    value={composerData.images}
                    onChange={(e) => setComposerData(prev => ({ ...prev, images: e.target.value }))}
                    className="bg-muted/50 border-white/5 rounded-2xl h-12 text-sm font-medium"
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-xs mt-6">
                  Publish Adventure
                </Button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Post Modal */}
        {editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPost(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0f0f13] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setEditingPost(null)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black mb-6">✏️ Edit Discussion</h2>
              <form onSubmit={handlePostEditSubmit} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Category</label>
                  <select 
                    value={editingPost.category || 'General'}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#16161a] border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-primary"
                  >
                    <option value="General">General</option>
                    <option value="Solo Backpackers">Solo Backpackers</option>
                    <option value="Luxury Escapes">Luxury Escapes</option>
                    <option value="Digital Nomads">Digital Nomads</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Title</label>
                  <Input 
                    required
                    placeholder="Give your post a title..." 
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-[#16161a] border-white/10 rounded-2xl h-12 text-sm font-medium text-white focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Description</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Update your adventure description..." 
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-[#16161a] border border-white/10 rounded-2xl p-4 text-sm font-medium text-white focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Destination Tags (comma separated)</label>
                  <Input 
                    placeholder="kyoto, autumn, japan" 
                    value={Array.isArray(editingPost.destinationTags) ? editingPost.destinationTags.join(', ') : editingPost.destinationTags || ''}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, destinationTags: e.target.value }))}
                    className="bg-[#16161a] border-white/10 rounded-2xl h-12 text-sm font-medium text-white focus-visible:ring-primary"
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <Button 
                    type="button" 
                    onClick={() => setEditingPost(null)}
                    variant="outline" 
                    className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-xs border-white/10 text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-xs bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-0"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Create Group Modal */}
        {isCreateGroupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateGroupOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsCreateGroupOpen(false)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black mb-6">Create Wanderlust Group</h2>
              <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Group Name</label>
                  <Input 
                    required
                    placeholder="e.g. Kyoto Solo Backpackers" 
                    value={groupComposer.name}
                    onChange={(e) => setGroupComposer(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-muted/50 border-white/5 rounded-2xl h-12 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Description</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="What is this group about? Talk about travel preferences, tips, or guidelines..." 
                    value={groupComposer.description}
                    onChange={(e) => setGroupComposer(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-muted/50 border border-white/5 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Cover Image URL</label>
                  <Input 
                    placeholder="https://images.unsplash.com/photo-..." 
                    value={groupComposer.coverImage}
                    onChange={(e) => setGroupComposer(prev => ({ ...prev, coverImage: e.target.value }))}
                    className="bg-muted/50 border-white/5 rounded-2xl h-12 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-2">Privacy</label>
                  <select 
                    value={groupComposer.privacy}
                    onChange={(e) => setGroupComposer(prev => ({ ...prev, privacy: e.target.value }))}
                    className="w-full bg-muted/50 border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary"
                  >
                    <option value="PUBLIC">Public (Anyone can browse and join)</option>
                    <option value="PRIVATE">Private (Approval required, members-only posts)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-xs mt-6">
                  Build Group
                </Button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Detailed Post Comments Drawer */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedPost(null); setReplyingTo(null); }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card border-l border-white/10 w-full max-w-2xl h-full shadow-2xl relative z-10 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-black text-lg">Discussions & Replies</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Posted by {selectedPost.userId?.username}</p>
                </div>
                <button 
                  onClick={() => { setSelectedPost(null); setReplyingTo(null); }}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Post Summary */}
                <div className="bg-muted/30 p-6 rounded-[2rem] border border-white/5 space-y-4">
                  <h2 className="text-xl font-black">{selectedPost.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{selectedPost.content}</p>
                  <div className="flex items-center gap-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Heart size={14} className="text-pink-500" /> {selectedPost.likes?.length || 0} Likes</span>
                    <span className="flex items-center gap-1"><MessageSquare size={14} className="text-indigo-400" /> {selectedPost.comments?.length || 0} Replies</span>
                  </div>
                </div>

                {/* Comment Section */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Community Responses</h4>
                  <CommentTree 
                    comments={selectedPost.comments} 
                    selectedPost={selectedPost} 
                    getTimeAgo={getTimeAgo} 
                    setReplyingTo={setReplyingTo} 
                  />
                </div>
              </div>

              {/* Footer Composer Input */}
              {user && (
                <div className="p-6 border-t border-white/5 bg-card/60 backdrop-blur-xl shrink-0">
                  {replyingTo && (
                    <div className="mb-3 flex items-center justify-between bg-primary/10 px-4 py-2 rounded-xl text-xs font-black text-primary uppercase tracking-wider">
                      Replying to thread...
                      <button onClick={() => setReplyingTo(null)} className="hover:bg-primary/20 p-1 rounded-full"><X size={14} /></button>
                    </div>
                  )}
                  <form onSubmit={handleAddComment} className="flex gap-4">
                    <Input 
                      required
                      placeholder={replyingTo ? "Write a reply to this comment..." : "Share your thoughts on this adventure..."}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="bg-muted/50 border-white/5 rounded-2xl flex-1 h-12 text-sm font-medium"
                    />
                    <Button type="submit" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-xs shrink-0">
                      Reply
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialHubPage;
