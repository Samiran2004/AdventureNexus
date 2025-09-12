import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import {
    MapPin,
    Search,
    Calendar,
    Users,
    DollarSign,
    Filter,
    SlidersHorizontal,
    Star,
    Clock,
    Compass,
    Menu,
    X,
    Heart,
    Share,
    Navigation,
    Plane,
    Hotel,
    Camera,
    Utensils,
    Mountain,
    Wifi,
    Car,
    Shield,
    ChevronDown,
    Sparkles,
    Bot,
    TrendingUp,
    Globe,
    CheckCircle
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const SearchPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [budgetRange, setBudgetRange] = useState([1000, 5000]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [sortBy, setSortBy] = useState('recommended');

    // Refs for animations
    const navRef = useRef(null);
    const searchBarRef = useRef(null);
    const filtersRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Initial animations
            gsap.from(navRef.current, {
                y: -50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });

            gsap.from(searchBarRef.current, {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: "power2.out"
            });

            gsap.from(".result-card", {
                scrollTrigger: {
                    trigger: resultsRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
        });

        return () => ctx.revert();
    }, []);

    const handleActivityToggle = (activity) => {
        setSelectedActivities(prev => 
            prev.includes(activity) 
                ? prev.filter(a => a !== activity)
                : [...prev, activity]
        );
    };

    // Sample search results data
    const searchResults = [
        {
            id: 1,
            destination: "Tokyo, Japan",
            duration: "7 days",
            price: "$2,450",
            rating: 4.9,
            reviews: 342,
            image: "/api/placeholder/400/250",
            highlights: ["Cherry Blossoms", "Modern Culture", "Traditional Temples"],
            aiScore: 98,
            activities: ["Culture", "Food", "Photography", "Shopping"]
        },
        {
            id: 2,
            destination: "Santorini, Greece",
            duration: "5 days",
            price: "$1,890",
            rating: 4.8,
            reviews: 567,
            image: "/api/placeholder/400/250",
            highlights: ["Sunset Views", "White Architecture", "Wine Tasting"],
            aiScore: 95,
            activities: ["Romance", "Photography", "Relaxation"]
        },
        {
            id: 3,
            destination: "Bali, Indonesia",
            duration: "10 days",
            price: "$1,650",
            rating: 4.7,
            reviews: 789,
            image: "/api/placeholder/400/250",
            highlights: ["Tropical Beaches", "Ancient Temples", "Wellness Retreats"],
            aiScore: 92,
            activities: ["Adventure", "Wellness", "Culture", "Beach"]
        },
        {
            id: 4,
            destination: "Patagonia, Chile",
            duration: "14 days",
            price: "$3,200",
            rating: 4.9,
            reviews: 234,
            image: "/api/placeholder/400/250",
            highlights: ["Glacier Hiking", "Wildlife Viewing", "Pristine Nature"],
            aiScore: 96,
            activities: ["Adventure", "Nature", "Hiking", "Photography"]
        },
        {
            id: 5,
            destination: "Marrakech, Morocco",
            duration: "6 days",
            price: "$1,320",
            rating: 4.6,
            reviews: 445,
            image: "/api/placeholder/400/250",
            highlights: ["Vibrant Souks", "Desert Experience", "Rich History"],
            aiScore: 89,
            activities: ["Culture", "Adventure", "Food", "Shopping"]
        },
        {
            id: 6,
            destination: "Reykjavik, Iceland",
            duration: "8 days",
            price: "$2,890",
            rating: 4.8,
            reviews: 312,
            image: "/api/placeholder/400/250",
            highlights: ["Northern Lights", "Blue Lagoon", "Volcanic Landscapes"],
            aiScore: 94,
            activities: ["Nature", "Photography", "Adventure", "Relaxation"]
        }
    ];

    const activities = [
        "Adventure", "Culture", "Food", "Beach", "Nature", "Photography", 
        "Romance", "Wellness", "Shopping", "Nightlife", "History", "Art"
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black z-50 md:hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-800">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                <Compass size={20} />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                AdventureNexus
                            </span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X size={24} className="text-white" />
                        </button>
                    </div>
                    <div className="flex flex-col space-y-4 p-4">
                        <a href="/" className="text-gray-400 hover:text-white py-2">Home</a>
                        <a href="/search" className="text-white py-2 font-semibold">Search</a>
                        <a href="/destinations" className="text-gray-400 hover:text-white py-2">Destinations</a>
                        <a href="/my-trips" className="text-gray-400 hover:text-white py-2">My Trips</a>
                        <Button variant="ghost" className="justify-start text-white hover:bg-gray-800">Sign In</Button>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav ref={navRef} className="border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                <Compass size={24} />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                AdventureNexus
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a>
                            <a href="/search" className="text-white font-semibold">Search</a>
                            <a href="/destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</a>
                            <a href="/my-trips" className="text-gray-400 hover:text-white transition-colors">My Trips</a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Button variant="ghost" className="text-white hover:bg-gray-800">
                                <SignedOut>
                                    <SignInButton />
                                </SignedOut>
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search Header */}
            <section ref={searchBarRef} className="py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Find Your Perfect 
                                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Adventure</span>
                            </h1>
                            <p className="text-lg text-gray-400">Let AI curate personalized travel experiences just for you</p>
                        </div>

                        {/* Search Form */}
                        <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-4 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="destination" className="text-white text-sm font-medium">Where to?</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <Input
                                                id="destination"
                                                placeholder="Enter destination"
                                                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dates" className="text-white text-sm font-medium">From</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <Input
                                                id="dates"
                                                placeholder="Select dates"
                                                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dates" className="text-white text-sm font-medium">To</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <Input
                                                id="dates"
                                                placeholder="Select dates"
                                                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="travelers" className="text-white text-sm font-medium">Travelers</Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <Select>
                                                <SelectTrigger className="pl-10 bg-gray-800 border-gray-600 text-white">
                                                    <SelectValue placeholder="2 travelers" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-800 border-gray-600">
                                                    <SelectItem value="1">1 traveler</SelectItem>
                                                    <SelectItem value="2">2 travelers</SelectItem>
                                                    <SelectItem value="3">3 travelers</SelectItem>
                                                    <SelectItem value="4">4+ travelers</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-white text-sm font-medium">Budget</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <Select>
                                                <SelectTrigger className="pl-10 bg-gray-800 border-gray-600 text-white">
                                                    <SelectValue placeholder="Any budget" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-800 border-gray-600">
                                                    <SelectItem value="budget">Budget ($500-$1500)</SelectItem>
                                                    <SelectItem value="mid">Mid-range ($1500-$3000)</SelectItem>
                                                    <SelectItem value="luxury">Luxury ($3000+)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <Button 
                                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                                        size="lg"
                                    >
                                        <Search className="mr-2" size={20} />
                                        Search with AI
                                        <Sparkles className="ml-2" size={16} />
                                    </Button>
                                    
                                    <Button
                                        variant="outline"
                                        className="border-gray-600 text-white hover:bg-gray-800"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <SlidersHorizontal className="mr-2" size={18} />
                                        Filters
                                        <ChevronDown className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
                                    </Button>
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                    <div ref={filtersRef} className="mt-6 pt-6 border-t border-gray-700">
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="text-white font-semibold">Budget Range</h3>
                                                <div className="px-2">
                                                    <Slider
                                                        value={budgetRange}
                                                        onValueChange={setBudgetRange}
                                                        max={10000}
                                                        min={500}
                                                        step={100}
                                                        className="w-full"
                                                    />
                                                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                                                        <span>${budgetRange[0]}</span>
                                                        <span>${budgetRange[1]}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-white font-semibold">Activities</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {activities.slice(0, 6).map((activity) => (
                                                        <div key={activity} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={activity}
                                                                checked={selectedActivities.includes(activity)}
                                                                onCheckedChange={() => handleActivityToggle(activity)}
                                                                className="border-gray-600"
                                                            />
                                                            <Label htmlFor={activity} className="text-sm text-gray-300">
                                                                {activity}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-white font-semibold">Travel Style</h3>
                                                <div className="space-y-2">
                                                    {["Solo Travel", "Family Friendly", "Romantic", "Group Travel"].map((style) => (
                                                        <div key={style} className="flex items-center space-x-2">
                                                            <Checkbox id={style} className="border-gray-600" />
                                                            <Label htmlFor={style} className="text-sm text-gray-300">
                                                                {style}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section ref={resultsRef} className="py-8 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                AI-Curated Travel Plans
                            </h2>
                            <p className="text-gray-400">
                                Found 247 personalized adventures • Powered by AI
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                    <SelectItem value="recommended">AI Recommended</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                    <SelectItem value="duration">Duration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Search Results Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((result) => (
                            <Card key={result.id} className="result-card bg-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                                <div className="relative">
                                    <div className="h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-t-lg flex items-center justify-center">
                                        <Camera className="text-gray-400" size={48} />
                                    </div>
                                    
                                    {/* AI Score Badge */}
                                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600">
                                        <Bot className="mr-1" size={12} />
                                        AI Score: {result.aiScore}%
                                    </Badge>
                                    
                                    {/* Action Buttons */}
                                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                                            <Heart size={16} />
                                        </Button>
                                        <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                                            <Share size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">
                                                    {result.destination}
                                                </h3>
                                                <p className="text-gray-400 text-sm flex items-center">
                                                    <Clock className="mr-1" size={14} />
                                                    {result.duration}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-white">
                                                    {result.price}
                                                </div>
                                                <div className="text-sm text-gray-400">per person</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} fill={i < Math.floor(result.rating) ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                            <span className="text-white font-semibold">{result.rating}</span>
                                            <span className="text-gray-400 text-sm">({result.reviews} reviews)</span>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-white font-medium text-sm">Trip Highlights:</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {result.highlights.map((highlight, index) => (
                                                    <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                                                        {highlight}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-white font-medium text-sm">Perfect for:</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {result.activities.map((activity, index) => (
                                                    <Badge key={index} variant="outline" className="border-blue-600/30 text-blue-400 text-xs">
                                                        {activity}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-700">
                                            <div className="flex space-x-2">
                                                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                    View Details
                                                </Button>
                                                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                                                    <Bot size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <Button 
                            variant="outline" 
                            className="border-gray-600 text-white hover:bg-gray-800 px-8"
                            size="lg"
                        >
                            Load More Adventures
                            <TrendingUp className="ml-2" size={18} />
                        </Button>
                    </div>
                </div>
            </section>

            {/* AI Assistant CTA */}
            <section className="py-12 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-y border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                            <Bot size={32} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Need Help Finding the Perfect Trip?
                        </h2>
                        <p className="text-lg text-gray-400 mb-8">
                            Chat with our AI travel assistant for personalized recommendations based on your preferences, budget, and travel style.
                        </p>
                        <Button 
                            size="lg" 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                        >
                            <Bot className="mr-2" size={20} />
                            Chat with AI Assistant
                            <Sparkles className="ml-2" size={16} />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SearchPage;