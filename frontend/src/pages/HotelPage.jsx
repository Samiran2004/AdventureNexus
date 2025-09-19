import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    Bed,
    Bath,
    Coffee,
    Tv,
    ParkingCircle,
    Waves,
    Mountain,
    TreePine,
    Home,
    Building,
    Castle,
    Tent,
    Ship,
    ArrowRight,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    Clock,
    Phone,
    Mail,
    Globe,
    Navigation,
    Zap,
    SlidersHorizontal,
    Target,
    Sparkles
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/components/NavBar';
import NumberCounter from '@/components/NumberCounter';

gsap.registerPlugin(ScrollTrigger);

const AccommodationsPage = () => {
    // Sample accommodations data
    const [accommodationsData] = useState({
        hotels: [
            {
                id: 1,
                name: 'Grand Palace Hotel',
                type: 'Luxury Hotel',
                category: 'hotel',
                location: 'Tokyo, Japan',
                rating: 4.8,
                reviews: 2547,
                price: 350,
                originalPrice: 450,
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                gallery: [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
                    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'
                ],
                amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking'],
                description: 'Luxury hotel in the heart of Tokyo with stunning city views and world-class amenities.',
                checkIn: '15:00',
                checkOut: '11:00',
                roomTypes: ['Standard Room', 'Deluxe Suite', 'Presidential Suite'],
                coordinates: { lat: 35.6762, lng: 139.6503 },
                featured: true,
                budgetFriendly: false,
                unique: false,
                bookingUrl: 'https://booking.com/hotel/grand-palace-tokyo',
                provider: 'Booking.com',
                cancellation: 'Free cancellation until 24 hours before check-in'
            },
            {
                id: 2,
                name: 'Cozy Downtown Hostel',
                type: 'Budget Hostel',
                category: 'budget',
                location: 'Bangkok, Thailand',
                rating: 4.2,
                reviews: 892,
                price: 25,
                originalPrice: 35,
                image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
                gallery: [
                    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
                ],
                amenities: ['Free WiFi', 'Kitchen', 'Laundry', 'Common Area'],
                description: 'Clean and affordable hostel perfect for backpackers and budget travelers.',
                checkIn: '14:00',
                checkOut: '10:00',
                roomTypes: ['Dorm Bed', 'Private Room'],
                coordinates: { lat: 13.7563, lng: 100.5018 },
                featured: false,
                budgetFriendly: true,
                unique: false,
                bookingUrl: 'https://hostelworld.com/cozy-downtown-bangkok',
                provider: 'Hostelworld',
                cancellation: 'Free cancellation until 48 hours before check-in'
            },
            {
                id: 3,
                name: 'Sakura Traditional Ryokan',
                type: 'Traditional Inn',
                category: 'unique',
                location: 'Kyoto, Japan',
                rating: 4.9,
                reviews: 456,
                price: 280,
                originalPrice: 320,
                image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
                gallery: [
                    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
                    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800'
                ],
                amenities: ['Traditional Meals', 'Hot Springs', 'Garden View', 'Tea Ceremony'],
                description: 'Authentic Japanese experience in a traditional ryokan with tatami rooms and kaiseki dining.',
                checkIn: '15:00',
                checkOut: '10:00',
                roomTypes: ['Traditional Room', 'Garden View Room'],
                coordinates: { lat: 35.0116, lng: 135.7681 },
                featured: true,
                budgetFriendly: false,
                unique: true,
                bookingUrl: 'https://japanican.com/sakura-ryokan',
                provider: 'Japanican',
                cancellation: 'Free cancellation until 72 hours before check-in'
            },
            {
                id: 4,
                name: 'Mountain View B&B',
                type: 'Bed & Breakfast',
                category: 'bnb',
                location: 'Swiss Alps, Switzerland',
                rating: 4.7,
                reviews: 234,
                price: 120,
                originalPrice: 150,
                image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                gallery: [
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
                ],
                amenities: ['Free Breakfast', 'Mountain View', 'Hiking Trails', 'Free WiFi'],
                description: 'Charming B&B with breathtaking mountain views and homemade breakfast.',
                checkIn: '15:00',
                checkOut: '10:00',
                roomTypes: ['Standard Room', 'Mountain View Room'],
                coordinates: { lat: 46.5197, lng: 7.9628 },
                featured: false,
                budgetFriendly: false,
                unique: false,
                bookingUrl: 'https://bedandbreakfast.com/mountain-view-swiss',
                provider: 'BedandBreakfast.com',
                cancellation: 'Free cancellation until 24 hours before check-in'
            },
            {
                id: 5,
                name: 'Casa Maria Homestay',
                type: 'Homestay',
                category: 'homestay',
                location: 'Barcelona, Spain',
                rating: 4.6,
                reviews: 189,
                price: 65,
                originalPrice: 80,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                gallery: [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
                ],
                amenities: ['Local Host', 'Home-cooked Meals', 'City Guide', 'Free WiFi'],
                description: 'Stay with a local family and experience authentic Spanish culture and cuisine.',
                checkIn: '16:00',
                checkOut: '11:00',
                roomTypes: ['Private Room', 'Shared Room'],
                coordinates: { lat: 41.3851, lng: 2.1734 },
                featured: false,
                budgetFriendly: true,
                unique: false,
                bookingUrl: 'https://homestay.com/casa-maria-barcelona',
                provider: 'Homestay.com',
                cancellation: 'Free cancellation until 48 hours before check-in'
            },
            {
                id: 6,
                name: 'Treehouse Lodge',
                type: 'Eco Lodge',
                category: 'unique',
                location: 'Costa Rica',
                rating: 4.8,
                reviews: 342,
                price: 200,
                originalPrice: 250,
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
                gallery: [
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
                    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'
                ],
                amenities: ['Jungle View', 'Wildlife Tours', 'Canopy Access', 'Eco-Friendly'],
                description: 'Unique treehouse experience in the heart of Costa Rican rainforest.',
                checkIn: '15:00',
                checkOut: '11:00',
                roomTypes: ['Treehouse Suite', 'Canopy Room'],
                coordinates: { lat: 9.7489, lng: -83.7534 },
                featured: true,
                budgetFriendly: false,
                unique: true,
                bookingUrl: 'https://ecolodges.com/treehouse-costa-rica',
                provider: 'EcoLodges.com',
                cancellation: 'Free cancellation until 72 hours before check-in'
            }
        ]
    });

    // State management
    const [accommodations, setAccommodations] = useState(accommodationsData.hotels);
    const [filteredAccommodations, setFilteredAccommodations] = useState(accommodationsData.hotels);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [sortBy, setSortBy] = useState('popular');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [favorites, setFavorites] = useState([]);

    // Search and filter states
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [location, setLocation] = useState('');

    // Refs for animations
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const accommodationsRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero animation
            gsap.from(heroRef.current, {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power2.out"
            });

            // Accommodations cards animation
            gsap.from(".accommodation-card", {
                scrollTrigger: {
                    trigger: accommodationsRef.current,
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

    // Filter logic
    useEffect(() => {
        let filtered = accommodations.filter(acc => {
            const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                acc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                acc.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || acc.category === selectedCategory;
            const matchesPrice = acc.price >= priceRange[0] && acc.price <= priceRange[1];
            const matchesLocation = location === '' || acc.location.toLowerCase().includes(location.toLowerCase());

            return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
        });

        // Sort accommodations
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
                    return b.rating - a.rating;
                });
        }

        setFilteredAccommodations(filtered);
    }, [searchTerm, selectedCategory, priceRange, sortBy, accommodations, location]);

    // Toggle favorite
    const toggleFavorite = (accommodationId) => {
        setFavorites(prev => 
            prev.includes(accommodationId) 
                ? prev.filter(id => id !== accommodationId)
                : [...prev, accommodationId]
        );
    };

    // Get category counts
    const getCategoryCounts = () => {
        const counts = {
            all: accommodations.length,
            hotel: accommodations.filter(acc => acc.category === 'hotel').length,
            budget: accommodations.filter(acc => acc.budgetFriendly).length,
            unique: accommodations.filter(acc => acc.unique).length,
            homestay: accommodations.filter(acc => acc.category === 'homestay').length,
            bnb: accommodations.filter(acc => acc.category === 'bnb').length
        };
        return counts;
    };

    const categoryCounts = getCategoryCounts();

    const AccommodationCard = ({ accommodation, className = "" }) => (
        <Card className={`accommodation-card group cursor-pointer hover:scale-105 transition-all duration-300 bg-gray-900 border-gray-700 overflow-hidden ${className}`}
              onClick={() => setSelectedAccommodation(accommodation)}>
            <div className="relative">
                <img 
                    src={accommodation.image} 
                    alt={accommodation.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {accommodation.featured && (
                        <Badge className="bg-yellow-600 text-white text-xs">
                            <Star size={12} className="mr-1" />
                            Featured
                        </Badge>
                    )}
                    {accommodation.budgetFriendly && (
                        <Badge className="bg-green-600 text-white text-xs">
                            <DollarSign size={12} className="mr-1" />
                            Budget
                        </Badge>
                    )}
                    {accommodation.unique && (
                        <Badge className="bg-purple-600 text-white text-xs">
                            <Sparkles size={12} className="mr-1" />
                            Unique
                        </Badge>
                    )}
                </div>

                {/* Favorite button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(accommodation.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                    <Heart 
                        size={16} 
                        className={`${favorites.includes(accommodation.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                    />
                </button>

                {/* Price */}
                <div className="absolute bottom-3 right-3 bg-black/70 rounded-lg px-2 py-1">
                    <div className="text-white font-semibold">
                        ${accommodation.price}
                        {accommodation.originalPrice > accommodation.price && (
                            <span className="text-gray-400 text-sm line-through ml-1">
                                ${accommodation.originalPrice}
                            </span>
                        )}
                    </div>
                    <div className="text-gray-300 text-xs">per night</div>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {accommodation.name}
                        </h3>
                        <p className="text-gray-400 text-sm flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {accommodation.location}
                        </p>
                        <p className="text-gray-500 text-xs">{accommodation.type}</p>
                    </div>
                    <div className="flex items-center">
                        <Star size={14} className="text-yellow-400 fill-current mr-1" />
                        <span className="text-white font-medium">{accommodation.rating}</span>
                        <span className="text-gray-400 text-sm ml-1">({accommodation.reviews})</span>
                    </div>
                </div>

                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{accommodation.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                    {accommodation.amenities.slice(0, 3).map(amenity => (
                        <Badge key={amenity} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                            {amenity}
                        </Badge>
                    ))}
                    {accommodation.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                            +{accommodation.amenities.length - 3} more
                        </Badge>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                        via {accommodation.provider}
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Book Now
                        <ExternalLink className="ml-1" size={12} />
                    </Button>
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
                                Find Your Perfect
                                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Stay</span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                                From luxury hotels to cozy homestays, discover accommodations that match your style and budget.
                            </p>
                        </div>

                        {/* Search Form */}
                        <Card className="bg-gray-900/90 border-gray-700 backdrop-blur-sm max-w-4xl mx-auto">
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-5 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                        <Input
                                            placeholder="Where are you going?"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="bg-gray-800 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Check-in</label>
                                        <Input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            className="bg-gray-800 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Check-out</label>
                                        <Input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            className="bg-gray-800 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Guests</label>
                                        <select
                                            value={guests}
                                            onChange={(e) => setGuests(parseInt(e.target.value))}
                                            className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                                        >
                                            {[1,2,3,4,5,6,7,8].map(num => (
                                                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                            <Search className="mr-2" size={16} />
                                            Search
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <div className="flex justify-center space-x-8 text-sm text-gray-400">
                            <div className="flex items-center">
                                <Building className="mr-2" size={16} />
                                <NumberCounter targetNumber={50000} duration={2} />+ Properties
                            </div>
                            <div className="flex items-center">
                                <MapPin className="mr-2" size={16} />
                                <NumberCounter targetNumber={195} duration={2.5} />+ Countries
                            </div>
                            <div className="flex items-center">
                                <Users className="mr-2" size={16} />
                                <NumberCounter targetNumber={1000000} duration={3} />+ Happy Guests
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="py-8 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { id: 'all', label: 'All Properties', icon: Building, count: categoryCounts.all },
                            { id: 'hotel', label: 'Hotels & Resorts', icon: Building, count: categoryCounts.hotel },
                            { id: 'budget', label: 'Budget Friendly', icon: DollarSign, count: categoryCounts.budget },
                            { id: 'unique', label: 'Unique Stays', icon: Sparkles, count: categoryCounts.unique },
                            { id: 'homestay', label: 'Homestays', icon: Home, count: categoryCounts.homestay },
                            { id: 'bnb', label: 'B&Bs', icon: Coffee, count: categoryCounts.bnb }
                        ].map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center px-4 py-2 rounded-full transition-all text-sm ${
                                    selectedCategory === category.id 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                <category.icon size={14} className="mr-2" />
                                {category.label}
                                <Badge variant="secondary" className="ml-2 bg-gray-700 text-gray-300 text-xs">
                                    {category.count}
                                </Badge>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filters and Controls */}
            <section className="py-6 bg-black border-t border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        {/* Filter Toggle and Results Count */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="border-gray-600 text-gray-300 hover:text - to-blue-400 hover: bg-black hover:border-white"
                            >
                                <SlidersHorizontal className="mr-2" size={16} />
                                Filters {showFilters && <ChevronDown className="ml-2" size={16} />}
                            </Button>
                            <span className="text-gray-400">
                                {filteredAccommodations.length} properties found
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
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        step="10"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Property Type</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="hotel">Hotels</option>
                                        <option value="budget">Budget Options</option>
                                        <option value="unique">Unique Stays</option>
                                        <option value="homestay">Homestays</option>
                                        <option value="bnb">B&Bs</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedCategory('all');
                                            setPriceRange([0, 500]);
                                            setSearchTerm('');
                                            setLocation('');
                                        }}
                                        className="border-gray-600 text-gray-300 hover:text - text-black hover:bg-green-400 hover:border-white"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Accommodations Grid/List */}
            <section ref={accommodationsRef} className="py-16 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {viewMode === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredAccommodations.map(accommodation => (
                                <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredAccommodations.map(accommodation => (
                                <Card key={accommodation.id} className="accommodation-card bg-gray-900 border-gray-700 overflow-hidden">
                                    <div className="flex">
                                        <div className="w-1/3">
                                            <img 
                                                src={accommodation.image} 
                                                alt={accommodation.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                        <CardContent className="w-2/3 p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white">{accommodation.name}</h3>
                                                    <p className="text-gray-400 flex items-center">
                                                        <MapPin size={14} className="mr-1" />
                                                        {accommodation.location}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">{accommodation.type}</p>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center">
                                                        <Star size={16} className="text-yellow-400 fill-current mr-1" />
                                                        <span className="text-white font-medium">{accommodation.rating}</span>
                                                        <span className="text-gray-400 text-sm ml-1">({accommodation.reviews})</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold text-white">${accommodation.price}</div>
                                                        <div className="text-gray-400 text-sm">per night</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-300 mb-4">{accommodation.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {accommodation.amenities.slice(0, 4).map(amenity => (
                                                    <Badge key={amenity} variant="secondary" className="bg-gray-700 text-gray-300">
                                                        {amenity}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-400">
                                                    via {accommodation.provider}
                                                </div>
                                                <Button 
                                                    size="sm"
                                                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                                                    onClick={() => window.open(accommodation.bookingUrl, '_blank')}
                                                >
                                                    Book Now
                                                    <ExternalLink className="ml-1" size={12} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {filteredAccommodations.length === 0 && (
                        <div className="text-center py-20">
                            <Building className="mx-auto text-gray-600 mb-4" size={64} />
                            <h3 className="text-xl font-semibold text-white mb-2">No accommodations found</h3>
                            <p className="text-gray-400">Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Booking Platforms Integration */}
            <section className="py-16 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Integrated Booking Platforms
                        </h2>
                        <p className="text-xl text-gray-400">
                            Book directly through our trusted partners
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Booking.com', logo: '🏨', description: 'Hotels & Apartments', url: 'https://booking.com' },
                            { name: 'Airbnb', logo: '🏠', description: 'Homes & Experiences', url: 'https://airbnb.com' },
                            { name: 'Hostelworld', logo: '🎒', description: 'Hostels & Budget', url: 'https://hostelworld.com' },
                            { name: 'Homestay.com', logo: '👨‍👩‍👧‍👦', description: 'Local Families', url: 'https://homestay.com' }
                        ].map((platform, index) => (
                            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                                  onClick={() => window.open(platform.url, '_blank')}>
                                <CardContent className="p-6 text-center">
                                    <div className="text-4xl mb-4">{platform.logo}</div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{platform.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{platform.description}</p>
                                    <Button variant="outline" size="sm" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                                        Browse Deals
                                        <ExternalLink className="ml-2" size={14} />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Book Your Perfect Stay?</h2>
                        <p className="text-xl opacity-90">
                            Get AI-powered recommendations and exclusive deals on accommodations worldwide.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-50">
                                <Bot className="mr-2" size={20} />
                                Get AI Recommendations
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text - bg text-black hover:bg-black border-white hover:text-white">
                                <Heart className="mr-2" size={20} />
                                View Favorites
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accommodation Detail Modal */}
            {selectedAccommodation && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            <img 
                                src={selectedAccommodation.image} 
                                alt={selectedAccommodation.name}
                                className="w-full h-64 object-cover rounded-t-xl"
                            />
                            <button
                                onClick={() => setSelectedAccommodation(null)}
                                className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedAccommodation.name}</h2>
                                    <p className="text-gray-400 flex items-center">
                                        <MapPin size={16} className="mr-1" />
                                        {selectedAccommodation.location}
                                    </p>
                                    <p className="text-gray-500">{selectedAccommodation.type}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">${selectedAccommodation.price}</div>
                                    <div className="text-gray-400">per night</div>
                                    <div className="flex items-center mt-1">
                                        <Star size={16} className="text-yellow-400 fill-current mr-1" />
                                        <span className="text-white">{selectedAccommodation.rating}</span>
                                        <span className="text-gray-400 ml-1">({selectedAccommodation.reviews} reviews)</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                                    <p className="text-gray-300 mb-4">{selectedAccommodation.description}</p>
                                    
                                    <h4 className="text-md font-semibold text-white mb-2">Amenities</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedAccommodation.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center text-gray-300">
                                                <CheckCircle className="text-green-400 mr-2" size={14} />
                                                <span className="text-sm">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Check-in:</span>
                                            <span className="text-white">{selectedAccommodation.checkIn}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Check-out:</span>
                                            <span className="text-white">{selectedAccommodation.checkOut}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Room Types:</span>
                                            <span className="text-white">{selectedAccommodation.roomTypes.length}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                                        <div className="flex items-start space-x-2">
                                            <CheckCircle className="text-green-400 mt-0.5" size={16} />
                                            <div>
                                                <h4 className="text-white font-medium text-sm">Free Cancellation</h4>
                                                <p className="text-green-300 text-xs">{selectedAccommodation.cancellation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <Button 
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                                    onClick={() => window.open(selectedAccommodation.bookingUrl, '_blank')}
                                >
                                    <ExternalLink className="mr-2" size={16} />
                                    Book on {selectedAccommodation.provider}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="border-gray-600 text-gray-300 hover:text-white hover:border-white"
                                    onClick={() => toggleFavorite(selectedAccommodation.id)}
                                >
                                    <Heart className={`${favorites.includes(selectedAccommodation.id) ? 'fill-current text-red-500' : ''}`} size={16} />
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

export default AccommodationsPage;