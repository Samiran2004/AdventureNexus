import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { Compass, Users, Map, Globe, Search, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { communityService } from '@/services/communityService';
import toast from 'react-hot-toast';

export const SocialHubPage = () => {
  const { user, getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('global'); // global, communities, groups
  
  const [communities, setCommunities] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- API DATA FETCHING ---
  const fetchSidebarData = async () => {
    try {
      const token = await getToken();
      
      const [commRes, groupRes] = await Promise.all([
        communityService.getCommunities(),
        token ? communityService.getMyGroups(token) : { groups: [] }
      ]);

      if (commRes.success) setCommunities(commRes.communities);
      if (groupRes.success) setGroups(groupRes.groups);
    } catch (error) {
      console.error("Failed to load sidebar data:", error);
      toast.error("Could not load communities & groups");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSidebarData();
  }, [user]);

  // --- ACTION HANDLERS ---
  const handleCreateGroup = async () => {
    if (!user) return toast.error("Please login to create a group");
    const name = window.prompt("Enter new group name:");
    if (!name) return;
    
    try {
      const token = await getToken();
      const res = await communityService.createGroup({ name, privacy: 'PUBLIC' }, token);
      if (res.success) {
        toast.success(`Group "${name}" created successfully!`);
        setGroups(prev => [...prev, res.group]); // Optimistic UI
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

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 relative overflow-hidden">
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
            <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <Compass size={14} /> Discover Communities
              </h3>
              <div className="space-y-4">
                {communities.map(community => (
                  <div key={community._id} onClick={() => handleJoinCommunity(community._id)} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-lg shadow-inner group-hover:bg-primary/20 transition-colors">
                        {community.icon || '🌍'}
                      </div>
                      <div>
                        <div className="font-bold text-sm group-hover:text-primary transition-colors">{community.name}</div>
                        <div className="text-[10px] text-muted-foreground">{community.followersCount} followers</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 rounded-xl border-dashed border-white/10 hover:border-primary/50 text-xs font-bold">
                View All Communities
              </Button>
            </div>

            {/* My Groups Section */}
            <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <Users size={14} /> My Groups
              </h3>
              <div className="space-y-4">
                {groups.length === 0 && <div className="text-xs text-muted-foreground italic">You haven't joined any groups yet.</div>}
                {groups.map(group => (
                  <div key={group._id} className="flex flex-col gap-1 cursor-pointer p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-white/5">
                    <div className="font-bold text-sm truncate">{group.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{group.privacy} Group</div>
                  </div>
                ))}
              </div>
              <Button onClick={handleCreateGroup} className="w-full mt-6 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-xs font-bold">
                + Create Group
              </Button>
            </div>
          </div>

          {/* CENTER COLUMN: Feed & Stories */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Feed Tabs */}
            <div className="flex items-center justify-center gap-2 p-1 bg-muted/30 backdrop-blur-md rounded-full w-max mx-auto border border-white/5 shadow-inner">
              {['global', 'communities', 'groups'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.4)]' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Post Composer Input (Mock) */}
            <div className="bg-card/60 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-4 cursor-pointer group">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                <img src={user?.imageUrl || 'https://via.placeholder.com/150'} alt="Me" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 h-12 bg-muted/40 rounded-full flex items-center px-6 text-muted-foreground font-medium group-hover:bg-muted/60 transition-colors border border-transparent group-hover:border-primary/20">
                Share your latest adventure...
              </div>
            </div>

            {/* Feed Placeholder */}
            <div className="space-y-6">
              {[1, 2].map(i => (
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
              ))}
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
    </div>
  );
};

export default SocialHubPage;
