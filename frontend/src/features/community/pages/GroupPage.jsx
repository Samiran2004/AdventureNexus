import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Users, Shield, Lock, Globe, Plus, MessageSquare, Heart, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { communityService } from '@/services/communityService';
import { PostCard } from '../components/PostCard';
import { CommentTree } from '../components/CommentTree';
import toast from 'react-hot-toast';
import NavBar from '@/components/NavBar';

export const GroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user, getToken } = useAuth();

  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isGroupLoading, setIsGroupLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  // Modal / Drawer state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  // Composer Form for posting inside this group
  const [composerData, setComposerData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: '',
    images: ''
  });

  const isUserMember = group?.members?.some(m => m === user?.id || m._id === user?.id);
  const isUserAdmin = group?.admins?.some(a => a === user?.id || a._id === user?.id) || group?.createdBy?._id === user?.id;

  const fetchGroupDetails = async () => {
    try {
      setIsGroupLoading(true);
      const token = await getToken();
      const res = await communityService.getGroupById(groupId, token);
      if (res.success) {
        setGroup(res.group);
      } else {
        toast.error("Could not load group info");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading group details");
    } finally {
      setIsGroupLoading(false);
    }
  };

  const fetchGroupFeed = async () => {
    try {
      setIsPostsLoading(true);
      const token = await getToken();
      const res = await communityService.getGroupPosts(groupId, token);
      if (res.success) {
        setPosts(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupFeed();
  }, [groupId, user]);

  const handleJoinLeave = async () => {
    if (!user) return toast.error("Please login to join this group");
    try {
      const token = await getToken();
      if (isUserMember) {
        // Leave Group
        const res = await communityService.leaveGroup(groupId, token);
        if (res.success) {
          toast.success("Left group successfully");
          // Optimistic state
          setGroup(prev => ({
            ...prev,
            memberCount: prev.memberCount - 1,
            members: prev.members.filter(m => m !== user.id && m._id !== user.id)
          }));
        }
      } else {
        // Join Group
        const res = await communityService.joinGroup(groupId, token);
        if (res.success) {
          toast.success(res.message || "Joined group!");
          setGroup(prev => ({
            ...prev,
            memberCount: prev.memberCount + 1,
            members: [...prev.members, user.id]
          }));
        }
      }
    } catch (error) {
      toast.error("Failed to update membership");
    }
  };

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
      }
    } catch (error) {
      toast.error("Failed to like post");
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
      toast.success("Link copied to clipboard!");
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
        images: imagesArray,
        groupId: groupId // Explicitly pass this group ID
      };

      const res = await communityService.createPost(postPayload, token);
      if (res.success) {
        toast.success("Discussion added inside group!");
        setIsCreatePostOpen(false);
        setComposerData({ title: '', content: '', category: 'General', tags: '', images: '' });
        fetchGroupFeed(); // Refresh feed
      }
    } catch (error) {
      toast.error("Failed to create post. Are you a member of this private group?");
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
        toast.success("Reply added!");
        setCommentContent('');
        setReplyingTo(null);
        handleOpenDetail(selectedPost);
      }
    } catch (error) {
      toast.error("Failed to reply");
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

      <div className="container mx-auto px-4 max-w-5xl relative z-10 space-y-8">
        
        {/* Header Navigation */}
        <button 
          onClick={() => navigate('/community')}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus Hub
        </button>

        {isGroupLoading ? (
          <div className="h-96 bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] animate-pulse" />
        ) : !group ? (
          <div className="text-center py-20 bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-white/5">
            <Lock className="mx-auto text-muted-foreground mb-4 opacity-50" size={48} />
            <p className="font-black text-lg">Group not found</p>
            <p className="text-sm text-muted-foreground mt-1">This group may have been removed or made hidden.</p>
          </div>
        ) : (
          <>
            {/* Banner Cover and Profile Header */}
            <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <div className="h-64 relative bg-gradient-to-r from-indigo-900 to-purple-900 overflow-hidden">
                {group.coverImage ? (
                  <img src={group.coverImage} alt="Cover" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-25">
                    <Users size={120} className="text-white" />
                  </div>
                )}
                {/* Privacy Badge */}
                <div className="absolute top-6 right-6 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                  {group.privacy === 'PRIVATE' || group.isPrivate ? (
                    <>
                      <Lock size={12} className="text-pink-500" /> Private Group
                    </>
                  ) : (
                    <>
                      <Globe size={12} className="text-emerald-500" /> Public Group
                    </>
                  )}
                </div>
              </div>

              {/* Group Info Overlay */}
              <div className="p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 bg-card/60 backdrop-blur-3xl border-t border-white/5">
                <div className="space-y-2">
                  <h1 className="text-xl sm:text-3xl font-black tracking-tight">{group.name}</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">{group.description || 'No description provided for this wanderlust group.'}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2">
                    <span className="flex items-center gap-1.5"><Users size={14} /> {group.memberCount} members</span>
                    {isUserAdmin && <span className="flex items-center gap-1.5 text-primary"><Shield size={14} /> Group Admin</span>}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-4">
                  <Button 
                    onClick={handleJoinLeave}
                    disabled={!user}
                    variant={isUserMember ? 'outline' : 'default'}
                    className={`h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 w-full md:w-auto ${
                      isUserMember 
                        ? 'border-white/10 hover:border-pink-500/50 hover:text-pink-500' 
                        : 'bg-primary hover:bg-primary/80 text-white'
                    }`}
                  >
                    {isUserMember ? 'Leave Group' : 'Join Group'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Group Content Block */}
            <div className="grid md:grid-cols-12 gap-8 items-start">
              
              {/* Left Details Panel */}
              <div className="md:col-span-4 order-2 md:order-1 space-y-6">
                <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Group Creator</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <img 
                          src={group.createdBy?.profilepicture || 'https://via.placeholder.com/150'} 
                          alt="Creator" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{group.createdBy?.username || 'NexusExplorer'}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Founder</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">About Group</h3>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      Welcome to {group.name}! Participate in local meetups, discuss itineraries, share premium travel deals, or post solo traveling checklists with group members.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Feed Panel */}
              <div className="md:col-span-8 order-1 md:order-2 space-y-6">
                {/* Check privacy block */}
                {((group.privacy === 'PRIVATE' || group.isPrivate) && !isUserMember) ? (
                  <div className="text-center py-20 bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8">
                    <Lock className="mx-auto text-muted-foreground mb-4 opacity-50 animate-bounce" size={48} />
                    <p className="font-black text-lg">Private Group Discussions Locked</p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                      Only joined members can view discussions or post stories within private groups. Click "Join Group" to gain access.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Compose input inside group */}
                    {isUserMember && (
                      <div 
                        onClick={() => setIsCreatePostOpen(true)}
                        className="bg-card/60 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-4 cursor-pointer group hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                          <img src={user?.imageUrl || 'https://via.placeholder.com/150'} alt="Me" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 h-12 bg-muted/40 rounded-full flex items-center px-6 text-muted-foreground font-medium group-hover:bg-muted/60 transition-colors border border-transparent group-hover:border-primary/20">
                          Post an update to {group.name}...
                        </div>
                      </div>
                    )}

                    {/* Group Posts Feed */}
                    <div className="space-y-6">
                      {isPostsLoading ? (
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
                          <p className="font-black text-lg">No group posts yet</p>
                          <p className="text-sm text-muted-foreground mt-1">Be the first to share an update inside this group!</p>
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
                          />
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

            </div>
          </>
        )}
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
              <h2 className="text-2xl font-black mb-6">Post in {group?.name}</h2>
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
                    placeholder="Give your group post a title..." 
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
                    placeholder="Tell group members all about your tips, experiences, or recommendations..." 
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
                  Publish to Group
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
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Group Responses</h4>
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
