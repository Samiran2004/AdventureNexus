import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Search,
    MapPin,
    Star,
    Heart,
    Share,
    Calendar,
    Users,
    DollarSign,
    Filter,
    Grid,
    List,
    Plane,
    Camera,
    Mountain,
    Compass,
    Clock,
    ThermometerSun,
    Wifi,
    Car,
    Utensils,
    Shield,
    Award,
    TrendingUp,
    Bot,
    ChevronDown,
    ChevronRight,
    Eye,
    BookOpen,
    Navigation,
    Globe,
    Play,
    ArrowRight,
    X,
    SlidersHorizontal,
    MapIcon
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/components/NavBar';
import NumberCounter from '@/components/NumberCounter';

gsap.registerPlugin(ScrollTrigger);

// DestinationsPage component displays a grid of travel destinations
const DestinationsPage = () => {
    // Sample destinations data used for rendering the cards
    const [destinations, setDestinations] = useState([
        {
            id: 1,
            name: 'Tokyo, Japan',
            country: 'Japan',
            continent: 'Asia',
            rating: 4.8,
            reviews: 2547,
            price: 1800,
            duration: '7 days',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
            gallery: [
                'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
                'https://images.unsplash.com/photo-1554797589-7241bb691973?w=800',
                'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800'
            ],
            category: 'Cultural',
            bestTime: 'March - May',
            temperature: '15-25°C',
            description: 'Experience the perfect blend of traditional culture and modern innovation in Japan\'s vibrant capital.',
            highlights: ['Cherry Blossoms', 'Shibuya Crossing', 'Mt. Fuji Views', 'Traditional Temples'],
            activities: ['City Tours', 'Cultural Experiences', 'Food Tours', 'Shopping'],
            difficulty: 'Easy',
            groupSize: '2-12',
            includes: ['Accommodation', 'Daily Breakfast', 'Airport Transfers', 'City Tours'],
            coordinates: { lat: 35.6762, lng: 139.6503 },
            trending: true,
            aiRecommended: true,
            featured: true,
            tags: ['Culture', 'City', 'Food', 'Technology']
        },
        {
            id: 2,
            name: 'Santorini, Greece',
            country: 'Greece',
            continent: 'Europe',
            rating: 4.9,
            reviews: 1823,
            price: 2200,
            duration: '5 days',
            image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
            gallery: [
                'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
                'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
                'https://images.unsplash.com/photo-1504554318364-c4d2851efc84?w=800'
            ],
            category: 'Beach',
            bestTime: 'April - October',
            temperature: '20-28°C',
            description: 'Discover the stunning white-washed buildings and crystal-clear waters of this Greek island paradise.',
            highlights: ['Blue Domed Churches', 'Sunset Views', 'Ancient Ruins', 'Local Wineries'],
            activities: ['Beach Activities', 'Photography', 'Wine Tasting', 'Boat Tours'],
            difficulty: 'Easy',
            groupSize: '2-8',
            includes: ['Accommodation', 'Daily Breakfast', 'Airport Transfers', 'Sunset Tour'],
            coordinates: { lat: 36.3932, lng: 25.4615 },
            trending: false,
            aiRecommended: true,
            featured: true,
            tags: ['Beach', 'Romance', 'Photography', 'Sunset']
        },
        {
            id: 3,
            name: 'Machu Picchu, Peru',
            country: 'Peru',
            continent: 'South America',
            rating: 4.7,
            reviews: 3421,
            price: 1600,
            duration: '4 days',
            image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
            gallery: [
                'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
                'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
                'https://images.unsplash.com/photo-1531065208531-4036c0dba3f5?w=800'
            ],
            category: 'Adventure',
            bestTime: 'May - September',
            temperature: '10-20°C',
            description: 'Trek to the ancient Incan citadel and witness one of the world\'s most spectacular archaeological sites.',
            highlights: ['Ancient Ruins', 'Mountain Views', 'Inca Trail', 'Sunrise Experience'],
            activities: ['Hiking', 'Photography', 'Cultural Tours', 'Adventure Sports'],
            difficulty: 'Moderate',
            groupSize: '4-16',
            includes: ['Accommodation', 'All Meals', 'Professional Guide', 'Entry Tickets'],
            coordinates: { lat: -13.1631, lng: -72.5450 },
            trending: true,
            aiRecommended: false,
            featured: true,
            tags: ['Adventure', 'History', 'Hiking', 'Mountains']
        },
        {
            id: 4,
            name: 'Bali, Indonesia',
            country: 'Indonesia',
            continent: 'Asia',
            rating: 4.6,
            reviews: 4156,
            price: 1200,
            duration: '8 days',
            image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
            gallery: [
                'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
                'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
                'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800'
            ],
            category: 'Beach',
            bestTime: 'April - October',
            temperature: '24-30°C',
            description: 'Immerse yourself in Balinese culture while enjoying pristine beaches and lush landscapes.',
            highlights: ['Rice Terraces', 'Beach Clubs', 'Hindu Temples', 'Volcanic Mountains'],
            activities: ['Beach Activities', 'Temple Visits', 'Spa Treatments', 'Water Sports'],
            difficulty: 'Easy',
            groupSize: '2-10',
            includes: ['Accommodation', 'Daily Breakfast', 'Airport Transfers', 'Temple Tours'],
            coordinates: { lat: -8.3405, lng: 115.0920 },
            trending: true,
            aiRecommended: true,
            featured: false,
            tags: ['Beach', 'Culture', 'Relaxation', 'Spa']
        },
        {
            id: 5,
            name: 'Swiss Alps, Switzerland',
            country: 'Switzerland',
            continent: 'Europe',
            rating: 4.9,
            reviews: 1934,
            price: 3200,
            duration: '6 days',
            image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
            gallery: [
                'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                'https://images.unsplash.com/photo-1573160103600-193fc42da8b8?w=800'
            ],
            category: 'Adventure',
            bestTime: 'June - September',
            temperature: '5-20°C',
            description: 'Experience breathtaking alpine scenery and world-class outdoor adventures in the heart of Europe.',
            highlights: ['Mountain Railways', 'Alpine Lakes', 'Glacier Views', 'Charming Villages'],
            activities: ['Hiking', 'Cable Car Rides', 'Photography', 'Mountain Biking'],
            difficulty: 'Moderate',
            groupSize: '2-12',
            includes: ['Accommodation', 'Daily Breakfast', 'Train Passes', 'Mountain Excursions'],
            coordinates: { lat: 46.8182, lng: 8.2275 },
            trending: false,
            aiRecommended: true,
            featured: false,
            tags: ['Mountains', 'Adventure', 'Nature', 'Luxury']
        },
        {
            id: 6,
            name: 'Dubai, UAE',
            country: 'UAE',
            continent: 'Asia',
            rating: 4.5,
            reviews: 2891,
            price: 2500,
            duration: '5 days',
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
            gallery: [
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
                'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
            ],
            category: 'Luxury',
            bestTime: 'November - March',
            temperature: '20-30°C',
            description: 'Experience luxury and innovation in this futuristic desert metropolis.',
            highlights: ['Burj Khalifa', 'Desert Safari', 'Luxury Shopping', 'Beach Resorts'],
            activities: ['City Tours', 'Desert Adventures', 'Shopping', 'Beach Activities'],
            difficulty: 'Easy',
            groupSize: '2-8',
            includes: ['Luxury Accommodation', 'Daily Breakfast', 'Airport Transfers', 'City Tours'],
            coordinates: { lat: 25.2048, lng: 55.2708 },
            trending: true,
            aiRecommended: false,
            featured: true,
            tags: ['Luxury', 'City', 'Desert', 'Modern']
        }
    ]);

    // State management
    const [filteredDestinations, setFilteredDestinations] = useState(destinations);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedContinent, setSelectedContinent] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [sortBy, setSortBy] = useState('popular');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);

    // Refs for animations
    const heroRef = useRef(null);
    const searchRef = useRef(null);
    const filtersRef = useRef(null);
    const destinationsRef = useRef(null);
    const mapRef = useRef(null);

    // Categories and continents
    const categories = ['all', 'Cultural', 'Beach', 'Adventure', 'Luxury', 'Nature'];
    const continents = ['all', 'Asia', 'Europe', 'South America', 'North America', 'Africa', 'Oceania'];

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero animation
            gsap.from(heroRef.current, {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power2.out"
            });

            // Search bar animation
            gsap.from(searchRef.current, {
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                delay: 0.3,
                ease: "back.out(1.7)"
            });

            // Destinations cards animation
            gsap.from(".destination-card", {
                scrollTrigger: {
                    trigger: destinationsRef.current,
                    start: "top 80%",
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
        });

        return () => ctx.revert();
    }, []);

    // Filter and search logic
    useEffect(() => {
        let filtered = destinations.filter(dest => {
            const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
            const matchesContinent = selectedContinent === 'all' || dest.continent === selectedContinent;
            const matchesPrice = dest.price >= priceRange[0] && dest.price <= priceRange[10];

            return matchesSearch && matchesCategory && matchesContinent && matchesPrice;
        });

        // Sort destinations
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'reviews':
                filtered.sort((a, b) => b.reviews - a.reviews);
                break;
            default: // popular
                filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    if (a.trending && !b.trending) return -1;
                    if (!a.trending && b.trending) return 1;
                    return b.rating - a.rating;
                });
        }

        setFilteredDestinations(filtered);
    }, [searchTerm, selectedCategory, selectedContinent, priceRange, sortBy, destinations]);

    // Favorite functionality
    const toggleFavorite = (destinationId) => {
        setFavorites(prev =>
            prev.includes(destinationId)
                ? prev.filter(id => id !== destinationId)
                : [...prev, destinationId]
        );
    };

    // Get AI recommendations
    const aiRecommendations = destinations.filter(dest => dest.aiRecommended).slice(0, 3);

    // Get trending destinations
    const trendingDestinations = destinations.filter(dest => dest.trending).slice(0, 4);

    const DestinationCard = ({ destination, className = "" }) => (
        <Card className={`destination-card group cursor-pointer hover:scale-105 transition-all duration-300 bg-gray-900 border-gray-700 overflow-hidden ${className}`}
            onClick={() => setSelectedDestination(destination)}>
            <div className="relative">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {destination.trending && (
                        <Badge className="bg-red-600 text-white text-xs">
                            <TrendingUp size={12} className="mr-1" />
                            Trending
                        </Badge>
                    )}
                    {destination.aiRecommended && (
                        <Badge className="bg-blue-600 text-white text-xs">
                            <Bot size={12} className="mr-1" />
                            AI Pick
                        </Badge>
                    )}
                    {destination.featured && (
                        <Badge className="bg-yellow-600 text-white text-xs">
                            <Award size={12} className="mr-1" />
                            Featured
                        </Badge>
                    )}
                </div>

                {/* Favorite button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(destination.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                    <Heart
                        size={16}
                        className={`${favorites.includes(destination.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                    />
                </button>

                {/* Price */}
                <div className="absolute bottom-3 right-3 bg-black/70 rounded-lg px-2 py-1">
                    <span className="text-white font-semibold text-sm">${destination.price}</span>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {destination.name}
                        </h3>
                        <p className="text-gray-400 text-sm flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {destination.country}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <Star size={14} className="text-yellow-400 fill-current mr-1" />
                        <span className="text-white font-medium">{destination.rating}</span>
                        <span className="text-gray-400 text-sm ml-1">({destination.reviews})</span>
                    </div>
                </div>

                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{destination.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                    {destination.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-400">
                    <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {destination.duration}
                    </div>
                    <div className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {destination.groupSize}
                    </div>
                    <div className="flex items-center">
                        <ThermometerSun size={12} className="mr-1" />
                        {destination.temperature}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <NavBar />

            {/* Hero Section with Search */}
            <section ref={heroRef} className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-900/20 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-900/20 rounded-full opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                                Discover Your Next
                                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Adventure</span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                                Explore handpicked destinations from around the world, powered by AI recommendations tailored just for you.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div ref={searchRef} className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Search destinations, countries, or activities..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 pr-4 py-4 text-lg bg-gray-800/90 border-gray-700 text-white placeholder-gray-400 rounded-xl backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center space-x-8 text-sm text-gray-400">
                            <div className="flex items-center">
                                <Globe className="mr-2" size={16} />
                                <NumberCounter targetNumber={195} duration={2} />+ Countries
                            </div>
                            <div className="flex items-center">
                                <MapPin className="mr-2" size={16} />
                                <NumberCounter targetNumber={5} duration={2.5} />+ Destinations
                            </div>
                            <div className="flex items-center">
                                <Users className="mr-2" size={16} />
                                <NumberCounter targetNumber={5} duration={3} />+ Travelers
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Recommendations */}
            <section className="py-16 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                                <Bot className="mr-3 text-blue-400" size={28} />
                                AI Recommended for You
                            </h2>
                            <p className="text-gray-400 mt-2">Personalized suggestions based on your preferences</p>
                        </div>
                        <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                            View All AI Picks
                            <ArrowRight className="ml-2" size={16} />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {aiRecommendations.map(destination => (
                            <DestinationCard key={destination.id} destination={destination} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Filters and Controls */}
            <section ref={filtersRef} className="py-8 bg-black border-t border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        {/* Filter Toggle */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="border-gray-600 text-blue-800 hover:text-black hover:border-white"
                            >
                                <SlidersHorizontal className="mr-2" size={16} />
                                Filters {showFilters && <ChevronDown className="ml-2" size={16} />}
                            </Button>
                            <span className="text-gray-400">
                                {filteredDestinations.length} destinations found
                            </span>
                        </div>

                        {/* View Controls */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-400 text-sm">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 text-sm"
                                >
                                    <option value="popular">Popular</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="reviews">Most Reviewed</option>
                                </select>
                            </div>

                            <div className="flex border border-gray-700 rounded">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-gray-900 rounded-lg border border-gray-700">
                            <div className="grid md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category === 'all' ? 'All Categories' : category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Continent</label>
                                    <select
                                        value={selectedContinent}
                                        onChange={(e) => setSelectedContinent(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                                    >
                                        {continents.map(continent => (
                                            <option key={continent} value={continent}>
                                                {continent === 'all' ? 'All Continents' : continent}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="100"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedCategory('all');
                                            setSelectedContinent('all');
                                            setPriceRange([0, 5000]);
                                            setSearchTerm('');
                                        }}
                                        className="border-gray-600 text-red-500 hover:text-black hover:border-white"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Destinations Grid */}
            <section ref={destinationsRef} className="py-16 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {viewMode === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredDestinations.map(destination => (
                                <DestinationCard key={destination.id} destination={destination} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredDestinations.map(destination => (
                                <Card key={destination.id} className="destination-card bg-gray-900 border-gray-700 overflow-hidden">
                                    <div className="flex">
                                        <div className="w-1/3">
                                            <img
                                                src={destination.image}
                                                alt={destination.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                        <CardContent className="w-2/3 p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white">{destination.name}</h3>
                                                    <p className="text-gray-400 flex items-center">
                                                        <MapPin size={14} className="mr-1" />
                                                        {destination.country}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center">
                                                        <Star size={16} className="text-yellow-400 fill-current mr-1" />
                                                        <span className="text-white font-medium">{destination.rating}</span>
                                                    </div>
                                                    <div className="text-xl font-bold text-white">${destination.price}</div>
                                                </div>
                                            </div>
                                            <p className="text-gray-300 mb-4">{destination.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {destination.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex space-x-4 text-sm text-gray-400">
                                                    <span>{destination.duration}</span>
                                                    <span>{destination.groupSize} people</span>
                                                    <span>{destination.bestTime}</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                                                    onClick={() => setSelectedDestination(destination)}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {filteredDestinations.length === 0 && (
                        <div className="text-center py-20">
                            <Compass className="mx-auto text-gray-600 mb-4" size={64} />
                            <h3 className="text-xl font-semibold text-white mb-2">No destinations found</h3>
                            <p className="text-gray-400">Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Trending Destinations */}
            <section className="py-16 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                                <TrendingUp className="mr-3 text-red-400" size={28} />
                                Trending Now
                            </h2>
                            <p className="text-gray-400 mt-2">Popular destinations this month</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingDestinations.map(destination => (
                            <DestinationCard key={destination.id} destination={destination} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Plan Your Dream Trip?</h2>
                        <p className="text-xl opacity-90">
                            Let our AI create a personalized itinerary for any destination. Start planning your perfect adventure today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-50">
                                <Bot className="mr-2" size={20} />
                                Get AI Recommendations
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text - bg-green-400 border-white hover:bg-white hover:text-green-500">
                                <Plane className="mr-2" size={20} />
                                Plan Custom Trip
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Destination Detail Modal would go here */}
            {selectedDestination && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            <img
                                src={selectedDestination.image}
                                alt={selectedDestination.name}
                                className="w-full h-64 object-cover rounded-t-xl"
                            />
                            <button
                                onClick={() => setSelectedDestination(null)}
                                className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedDestination.name}</h2>
                                    <p className="text-gray-400">{selectedDestination.country}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">${selectedDestination.price}</div>
                                    <div className="text-gray-400">per person</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
                                    <p className="text-gray-300 mb-4">{selectedDestination.description}</p>

                                    <h4 className="text-md font-semibold text-white mb-2">Highlights</h4>
                                    <ul className="space-y-1">
                                        {selectedDestination.highlights.map((highlight, index) => (
                                            <li key={index} className="text-gray-300 text-sm flex items-center">
                                                <ChevronRight size={12} className="mr-2 text-blue-400" />
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Trip Details</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Duration:</span>
                                            <span className="text-white">{selectedDestination.duration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Best Time:</span>
                                            <span className="text-white">{selectedDestination.bestTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Temperature:</span>
                                            <span className="text-white">{selectedDestination.temperature}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Group Size:</span>
                                            <span className="text-white">{selectedDestination.groupSize}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Difficulty:</span>
                                            <span className="text-white">{selectedDestination.difficulty}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                                    <Plane className="mr-2" size={16} />
                                    Book Now
                                </Button>
                                <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-white">
                                    <Heart size={16} />
                                </Button>
                                <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-white">
                                    <Share size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DestinationsPage;
