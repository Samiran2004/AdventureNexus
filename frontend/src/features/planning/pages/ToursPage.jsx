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
  Calendar,
  Users,
  Star,
  ArrowRight,
  Filter,
  CheckCircle2,
  Plane,
  Hotel
} from 'lucide-react';

const ToursPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Popular', 'Europe', 'Asia', 'Adventure', 'Luxury', 'Ecotourism'];

  // Mock Data for Tours
  const tours = [
    {
      id: 1,
      title: "Best of Japan: From Tokyo to Kyoto",
      locations: ["Tokyo", "Kyoto", "Osaka"],
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=60",
      price: 2499,
      rating: 4.9,
      reviews: 320,
      duration: "10 Days",
      groupSize: "Max 12",
      category: "Asia",
      inclusions: ["Flights", "Hotels", "Trains", "Guide"],
      featured: true
    },
    {
      id: 2,
      title: "Italian Amalfi Coast & Rome",
      locations: ["Rome", "Florence", "Positano"],
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=60",
      price: 1899,
      rating: 4.8,
      reviews: 215,
      duration: "8 Days",
      groupSize: "Max 15",
      category: "Europe",
      inclusions: ["Hotels", "Breakfast", "Transfers"],
      featured: false
    },
    {
      id: 3,
      title: "Swiss Alps & Chocolate Express",
      locations: ["Zurich", "Interlaken", "Zermatt"],
      image: "https://images.unsplash.com/photo-1483347752404-8fe7960f26d1?w=800&auto=format&fit=crop&q=60",
      price: 2150,
      rating: 5.0,
      reviews: 189,
      duration: "7 Days",
      groupSize: "Max 10",
      category: "Luxury",
      inclusions: ["5* Hotels", "Train Pass", "Chocolates"],
      featured: true
    },
    {
      id: 4,
      title: "Vietnam & Cambodia Discovery",
      locations: ["Hanoi", "Ha Long Bay", "Siem Reap"],
      image: "https://images.unsplash.com/photo-1528127269322-53995332718d?w=800&auto=format&fit=crop&q=60",
      price: 1450,
      rating: 4.7,
      reviews: 410,
      duration: "12 Days",
      groupSize: "Max 14",
      category: "Asia",
      inclusions: ["Ha Long Cruise", "Domestic Flights"],
      featured: false
    },
    {
      id: 5,
      title: "Peru: Inca Trail & Machu Picchu",
      locations: ["Cusco", "Sacred Valley", "Machu Picchu"],
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=60",
      price: 1750,
      rating: 4.9,
      reviews: 560,
      duration: "9 Days",
      groupSize: "Max 8",
      category: "Adventure",
      inclusions: ["Trek Permits", "Camping", "Meals"],
      featured: false
    },
    {
      id: 6,
      title: "Costa Rica Wildlife Eco-Tour",
      locations: ["San Jose", "Monteverde", "Manuel Antonio"],
      image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&auto=format&fit=crop&q=60",
      price: 1599,
      rating: 4.8,
      reviews: 134,
      duration: "8 Days",
      groupSize: "Max 10",
      category: "Ecotourism",
      inclusions: ["Eco-Lodges", "Guide", "Park Fees"],
      featured: true
    }
  ];

  const filteredTours = selectedCategory === 'All' 
    ? tours 
    : tours.filter(tour => tour.category === selectedCategory || (selectedCategory === 'Popular' && tour.featured));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="container relative z-10 text-center px-4">
          <Badge className="mb-4 bg-secondary/80 text-white hover:bg-secondary text-sm py-1 px-4 border-none backdrop-blur-md">
            World Class Adventures
          </Badge>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Epic Journeys <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
               Await You
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 max-w-3xl mx-auto mb-10 font-light drop-shadow-md">
            Discover multi-day guided tours that take you deeper into culture, nature, and adventure.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              Find Your Trip
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 flex-grow">
        
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex overflow-x-auto pb-4 md:pb-0 gap-3 w-full md:w-auto no-scrollbar scroll-smooth p-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 whitespace-nowrap transition-all ${
                  selectedCategory === category 
                    ? "bg-primary text-white shadow-md transform scale-105" 
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary/5"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-sm text-muted-foreground whitespace-nowrap">{filteredTours.length} tours found</span>
             <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2 text-primary hover:bg-primary/5">
                <Filter size={16} /> Filters
             </Button>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredTours.map((tour) => (
            <Card key={tour.id} className="group bg-card border-border overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={tour.image} 
                  alt={tour.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Top Buttons (The Fixed Styles) */}
                <div className="absolute top-4 right-4 flex gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-md hover:shadow-lg w-10 h-10 transition-colors"
                  >
                    <Heart size={20} className="fill-current" />
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white text-primary hover:text-primary/80 shadow-md hover:shadow-lg w-10 h-10 transition-colors"
                  >
                    <Share size={20} />
                  </Button>
                </div>

                {/* Featured Badge */}
                {tour.featured && (
                   <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      FEATURED
                   </span>
                )}
                
                {/* Image Info */}
                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-sm text-gray-200 mb-2 font-medium">
                    <MapPin size={16} className="text-secondary" />
                    {tour.locations.join(' • ')}
                  </div>
                  <h3 className="text-2xl font-bold leading-tight mb-3 drop-shadow-md">{tour.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold tracking-wide">
                     <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <Calendar size={14} /> {tour.duration}
                     </span>
                     <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <Users size={14} /> {tour.groupSize}
                     </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-6 flex flex-col flex-grow">
                
                {/* Inclusions */}
                <div className="flex flex-wrap gap-2 mb-6">
                   {tour.inclusions.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                         <CheckCircle2 size={12} className="text-green-500" /> {inc}
                      </div>
                   ))}
                   {tour.inclusions.length > 3 && (
                      <span className="text-xs text-muted-foreground flex items-center px-1">+{tour.inclusions.length - 3} more</span>
                   )}
                </div>

                <div className="mt-auto pt-6 border-t border-border flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">From Price</span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-bold text-primary">${tour.price}</span>
                       <span className="text-sm text-muted-foreground">/ person</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                     <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={18} className="fill-current" /> {tour.rating}
                     </div>
                     <Button variant="ghost" className="text-primary p-0 h-auto font-semibold hover:bg-transparent hover:text-primary/80 group/btn">
                        View Itinerary <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                     </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredTours.length === 0 && (
          <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border mt-8">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Plane size={40} className="text-muted-foreground opacity-50" />
             </div>
             <h3 className="text-2xl font-bold mb-3">No tours found</h3>
             <p className="text-muted-foreground max-w-md mx-auto">We couldn't find any tours matching "{selectedCategory}". Try exploring other categories or our popular trips.</p>
             <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setSelectedCategory('All')}
             >
                Show All Tours
             </Button>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default ToursPage;
