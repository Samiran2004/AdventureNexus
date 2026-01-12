import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Share,
  MapPin,
  Clock,
  Users,
  Star,
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';

const ExperiencesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Adventure', 'Cultural', 'Food & Drink', 'Relaxation', 'Nature'];

  // Mock Data for Experiences
  const experiences = [
    {
      id: 1,
      title: "Hot Air Balloon Over Cappadocia",
      location: "Cappadocia, Turkey",
      image: "https://images.unsplash.com/photo-1540304383669-7be2194d35d1?w=800&auto=format&fit=crop&q=60",
      price: 250,
      rating: 4.9,
      reviews: 128,
      duration: "3 hours",
      groupSize: "Small Group",
      category: "Adventure",
      tags: ["Bucket List", "Sunrise"]
    },
    {
      id: 2,
      title: "Traditional Tea Ceremony",
      location: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1545620573-04b3941b3438?w=800&auto=format&fit=crop&q=60",
      price: 85,
      rating: 4.8,
      reviews: 95,
      duration: "2 hours",
      groupSize: "Private",
      category: "Cultural",
      tags: ["History", "Peaceful"]
    },
    {
      id: 3,
      title: "Santorini Sunset Wine Tasting",
      location: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1515967008889-be260b457c4f?w=800&auto=format&fit=crop&q=60",
      price: 120,
      rating: 4.9,
      reviews: 210,
      duration: "4 hours",
      groupSize: "Medium Group",
      category: "Food & Drink",
      tags: ["Romantic", "Views"]
    },
    {
      id: 4,
      title: "Bali Jungle Trek & Waterfall",
      location: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&auto=format&fit=crop&q=60",
      price: 65,
      rating: 4.7,
      reviews: 156,
      duration: "6 hours",
      groupSize: "Medium Group",
      category: "Nature",
      tags: ["Hiking", "Photography"]
    },
    {
      id: 5,
      title: "Northern Lights Photography Tour",
      location: "Reykjavik, Iceland",
      image: "https://images.unsplash.com/photo-1483347752404-8fe7960f26d1?w=800&auto=format&fit=crop&q=60",
      price: 180,
      rating: 4.8,
      reviews: 89,
      duration: "5 hours",
      groupSize: "Small Group",
      category: "Adventure",
      tags: ["Night", "Cold"]
    },
    {
      id: 6,
      title: "Tuscan Cooking Class",
      location: "Florence, Italy",
      image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&auto=format&fit=crop&q=60",
      price: 110,
      rating: 5.0,
      reviews: 342,
      duration: "4 hours",
      groupSize: "Small Group",
      category: "Food & Drink",
      tags: ["Authentic", "Fun"]
    }
  ];

  const filteredExperiences = selectedCategory === 'All' 
    ? experiences 
    : experiences.filter(exp => exp.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container relative z-10 text-center px-4">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 text-sm py-1 px-4 border border-primary/20 backdrop-blur-md">
            Discover the Extraordinary
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Curated Experiences <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-400">
              For Every Traveler
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 font-light">
            From hot air balloon rides to intimate cooking classes, explore activities that make your journey unforgettable.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
              Explore Now
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full px-8 backdrop-blur-sm">
              <Sparkles size={18} className="mr-2" />
              AI Recommendations
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex-grow">
        
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar scroll-smooth">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full whitespace-nowrap ${
                  selectedCategory === category 
                    ? "bg-primary text-white" 
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" className="hidden md:flex items-center gap-2 border-border text-muted-foreground hover:text-foreground">
            <Filter size={16} />
            More Filters
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperiences.map((experience) => (
            <Card key={experience.id} className="group bg-card border-border overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={experience.image} 
                  alt={experience.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Top Buttons (Fixed Styles) */}
                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-sm hover:shadow-md w-9 h-9 transition-colors"
                  >
                    <Heart size={18} className="fill-current" />
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white text-primary hover:text-primary/80 shadow-sm hover:shadow-md w-9 h-9 transition-colors"
                  >
                    <Share size={18} />
                  </Button>
                </div>

                {/* Badge Category */}
                <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
                  {experience.category}
                </span>

                {/* Bottom Info on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1 text-sm text-gray-200 mb-1">
                    <MapPin size={14} />
                    {experience.location}
                  </div>
                  <h3 className="text-xl font-bold leading-tight mb-2">{experience.title}</h3>
                  <div className="flex items-center gap-3 text-xs font-medium">
                     <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                        <Clock size={12} /> {experience.duration}
                     </span>
                     <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                        <Users size={12} /> {experience.groupSize}
                     </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Starting from</span>
                    <span className="text-2xl font-bold text-foreground">${experience.price}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-lg">
                    <Star size={16} className="fill-current" />
                    <span className="font-bold">{experience.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({experience.reviews})</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {experience.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg group-hover:shadow-primary/25 transition-all">
                  Book Experience
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredExperiences.length === 0 && (
          <div className="text-center py-20">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Sparkles size={32} className="text-muted-foreground" />
             </div>
             <h3 className="text-xl font-bold mb-2">No experiences found</h3>
             <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default ExperiencesPage;
