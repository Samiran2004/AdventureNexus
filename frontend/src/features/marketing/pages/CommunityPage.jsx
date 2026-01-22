import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  MapPin,
  Heart,
  Share2,
  ArrowRight
} from 'lucide-react';

const CommunityPage = () => {
  const categories = [
    { name: "Travel Hacks", count: "2.4k", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Solo Travel", count: "1.8k", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Photography", count: "3.2k", icon: MapPin, color: "text-pink-500", bg: "bg-pink-500/10" },
    { name: "Gear Talk", count: "956", icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const discussions = [
    {
      id: 1,
      title: "Best hidden gems in Southeast Asia?",
      author: "Sarah J.",
      avatar: "https://i.pravatar.cc/150?u=1",
      replies: 45,
      likes: 128,
      tag: "Destinations",
      time: "2h ago"
    },
    {
      id: 2,
      title: "Tips for first-time solo travelers in Europe",
      author: "Mike T.",
      avatar: "https://i.pravatar.cc/150?u=2",
      replies: 89,
      likes: 342,
      tag: "Advice",
      time: "4h ago"
    },
    {
      id: 3,
      title: "Digital Nomad Visa requirements for 2026",
      author: "Elena R.",
      avatar: "https://i.pravatar.cc/150?u=3",
      replies: 120,
      likes: 567,
      tag: "Work & Travel",
      time: "6h ago"
    }
  ];

  const events = [
    {
      title: "Global Travel Photography Workshop",
      date: "Nov 15, 2025",
      type: "Webinar",
      attendees: 340
    },
    {
      title: "Community Meetup: Barcelona",
      date: "Dec 02, 2025",
      type: "In-Person",
      attendees: 45
    }
  ];

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
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 rounded-full px-8 text-lg font-semibold">
              Join the Discussion
            </Button>
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
                <Card key={index} className="hover:border-primary/50 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className={`p-3 ${cat.bg} ${cat.color} rounded-full mb-3`}>
                      <cat.icon size={20} />
                    </div>
                    <div className="font-bold">{cat.name}</div>
                    <div className="text-xs text-muted-foreground">{cat.count} posts</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Discussions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Trending Discussions</h2>
              <Button variant="ghost" className="text-primary hover:text-primary/80">View All</Button>
            </div>
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <Card key={discussion.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar Mock */}
                      <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                         <img src={discussion.avatar} alt={discussion.author} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{discussion.author}</span>
                          <span className="text-xs text-muted-foreground">• {discussion.time}</span>
                          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 ml-auto md:ml-2">
                             {discussion.tag}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold mb-2 hover:text-primary cursor-pointer transition-colors">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
                             <MessageSquare size={16} /> {discussion.replies} Replies
                          </span>
                          <span className="flex items-center gap-1.5 hover:text-pink-500 cursor-pointer transition-colors">
                             <Heart size={16} /> {discussion.likes} Likes
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          
          {/* Upcoming Events */}
          <Card className="bg-gradient-to-br from-card to-primary/5 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-primary" /> Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {events.map((event, idx) => (
                <div key={idx} className="flex gap-4 items-start pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="bg-primary/10 text-primary rounded-lg p-2 text-center min-w-[60px]">
                    <div className="text-xs font-bold uppercase">{event.date.split(' ')[0]}</div>
                    <div className="text-xl font-bold">{event.date.split(' ')[1].replace(',', '')}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight mb-1">{event.title}</h4>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="bg-secondary/20 text-secondary-foreground px-1.5 py-0.5 rounded">{event.type}</span>
                      <span>• {event.attendees} attending</span>
                    </div>
                    <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-primary">RSVP</Button>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">View Calendar</Button>
            </CardContent>
          </Card>

          {/* Community Spotlight */}
          <Card className="overflow-hidden border-border bg-slate-900 text-white relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=60')] bg-cover bg-center opacity-40"></div>
            <CardContent className="relative z-10 p-6 pt-32">
              <Badge className="bg-orange-500 hover:bg-orange-600 mb-3 border-none">Member Spotlight</Badge>
              <h3 className="text-xl font-bold mb-2">Alex's Journey Across the Andes</h3>
              <p className="text-sm text-gray-200 mb-4">Read how Alex planned a 3-month trek using AdventureNexus AI.</p>
              <Button size="sm" className="bg-white text-slate-900 hover:bg-gray-100">Read Story</Button>
            </CardContent>
          </Card>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommunityPage;
