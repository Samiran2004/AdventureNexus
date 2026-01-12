import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Download,
  Mail,
  Newspaper,
  ArrowRight,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  Video,
  FileText
} from 'lucide-react';

const PressPage = () => {
  const pressReleases = [
    {
      id: 1,
      title: "AdventureNexus Raises Series B Funding to Expand Global Operations",
      date: "October 15, 2025",
      snippet: "Leading travel tech platform secures $50M to enhance AI capabilities and expand into new markets across Asia and South America.",
      category: "Company News"
    },
    {
      id: 2,
      title: "New 'Eco-Tours' Initiative Launched for Sustainable Travel",
      date: "September 22, 2025",
      snippet: "AdventureNexus partners with local conservation groups to offer certified eco-friendly tours that give back to the community.",
      category: "Product Launch"
    },
    {
      id: 3,
      title: "AdventureNexus Named 'Best Travel App of 2025' by TechWeekly",
      date: "August 10, 2025",
      snippet: "Recognized for its innovative use of AI in itinerary planning and seamless booking experience.",
      category: "Awards"
    }
  ];

  const mediaMentions = [
    { name: "TechCrunch", logo: "TC", color: "text-green-600" },
    { name: "Forbes", logo: "F", color: "text-blue-900" },
    { name: "Wired", logo: "W", color: "text-black" },
    { name: "Travel+Leisure", logo: "T+L", color: "text-red-700" },
    { name: "The Verge", logo: "V", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <NavBar />

      {/* Hero Section */}
      <div className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent -z-10 blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-4 py-1.5 text-sm uppercase tracking-wider">
            Press Center
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Newsroom & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Media Resources</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Latest updates, press releases, and brand assets from AdventureNexus. <br/>
            Helping journalists tell the story of the future of travel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Download size={18} /> Download Media Kit
            </Button>
            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 gap-2">
              <Mail size={18} /> Contact Press Team
            </Button>
          </div>
        </div>
      </div>

      {/* Featured In Section */}
      <div className="border-y border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            Featured In
          </p>
          <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
             {mediaMentions.map((media, idx) => (
                <div key={idx} className="flex items-center gap-2 group cursor-pointer">
                   <div className={`text-2xl font-black ${media.color} group-hover:scale-110 transition-transform`}>{media.logo}</div>
                   <span className="text-xl font-bold hidden md:block">{media.name}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
        {/* Left Column: Latest News */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Newspaper className="text-primary" /> Latest News
            </h2>
            <Button variant="link" className="text-primary hover:no-underline group">
              View Archive <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="space-y-6">
            {pressReleases.map((news) => (
              <Card key={news.id} className="group hover:border-primary/50 transition-colors border-border bg-card">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {news.category}
                        </Badge>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar size={14} /> {news.date}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {news.snippet}
                      </p>
                    </div>
                    <Button variant="ghost" className="shrink-0 hidden md:flex h-12 w-12 rounded-full border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                      <ExternalLink size={20} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Media Kit & Contact */}
        <div className="space-y-8">
          {/* Media Kit Card */}
          <Card className="bg-gradient-to-br from-card to-secondary/5 border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-secondary" /> Brand Assets
              </CardTitle>
              <CardDescription>
                High-quality official assets for media use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-auto py-3 border-border hover:bg-background/50">
                <div className="p-2 bg-primary/10 rounded mr-3 text-primary">
                   <ImageIcon size={18} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Logo Pack</div>
                  <div className="text-xs text-muted-foreground">PNG, SVG, EPS</div>
                </div>
                <Download size={16} className="ml-auto text-muted-foreground" />
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto py-3 border-border hover:bg-background/50">
                <div className="p-2 bg-blue-500/10 rounded mr-3 text-blue-500">
                   <ImageIcon size={18} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Product Screenshots</div>
                  <div className="text-xs text-muted-foreground">High-Res UI Mocks</div>
                </div>
                <Download size={16} className="ml-auto text-muted-foreground" />
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto py-3 border-border hover:bg-background/50">
                <div className="p-2 bg-purple-500/10 rounded mr-3 text-purple-500">
                   <Video size={18} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">B-Roll Footage</div>
                  <div className="text-xs text-muted-foreground">1080p, 4K</div>
                </div>
                <Download size={16} className="ml-auto text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="bg-primary text-primary-foreground border-none shadow-xl">
            <CardHeader>
              <CardTitle>Press Inquiries</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                For interviews, comments, or partnership opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="mailto:press@adventurenexus.com" className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Mail size={20} />
                <span className="font-medium">press@adventurenexus.com</span>
              </a>
              <div className="text-sm text-primary-foreground/70 text-center">
                We respond to all media requests within 24 hours.
              </div>
            </CardContent>
          </Card>

          {/* Subscribe Card */}
          <Card className="border-border shadow-sm">
             <CardHeader>
                <CardTitle className="text-base">Stay Updated</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                <Input placeholder="Enter your email" className="bg-background" />
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">Subscribe to News</Button>
             </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PressPage;
