import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, MapPin, Star, Heart, TrendingUp, Filter,
    Grid, List, X, ChevronDown, SlidersHorizontal,
    ArrowRight, Globe, Users, Clock, ThermometerSun,
    Calendar, CheckCircle, Ticket
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';

// Mock Data (Enriched)
const initialDestinations = [
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
        category: 'Cultural',
        description: 'Experience the perfect blend of traditional culture and modern innovation in Tokyo.',
        tags: ['Culture', 'City', 'Food'],
        trending: true,
        highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Akihabara', 'Meiji Shrine'],
        includes: ['Hotel', 'Breakfast', 'Metro Pass'],
        gallery: [
            'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800',
            'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800'
        ]
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
        category: 'Beach',
        description: 'Discover white-washed buildings and crystal-clear waters in this Aegean paradise.',
        tags: ['Beach', 'Romance', 'Sunset'],
        trending: false,
        highlights: ['Oia Sunset', 'Volcano Tour', 'Red Beach', 'Wine Tasting'],
        includes: ['Villa Stay', 'Ferry Transfer', 'Wine Tour'],
        gallery: [
            'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
            'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed92?w=800'
        ]
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
        category: 'Adventure',
        description: 'Trek to the ancient Incan citadel in the Andes Mountains for a life-changing experience.',
        tags: ['Adventure', 'History', 'Hiking'],
        trending: true,
        highlights: ['The Citadel', 'Inca Trail', 'Sun Gate', 'Llama Watching'],
        includes: ['Camping Gear', 'Expert Guide', 'All Meals'],
        gallery: [
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
            'https://images.unsplash.com/photo-1509216242873-7786f446f465?w=800'
        ]
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
        category: 'Beach',
        description: 'Immerse yourself in Balinese culture, lush rice terraces, and pristine beaches.',
        tags: ['Beach', 'Culture', 'Spa'],
        trending: true,
        highlights: ['Ubud Monkey Forest', 'Uluwatu Temple', 'Tegallalang Rice Terrace', 'Surfing'],
        includes: ['Resort Stay', 'Spa Treatment', 'Scooter Rental'],
        gallery: [
            'https://images.unsplash.com/photo-1555400038-63f5ba517a97?w=800',
            'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800'
        ]
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
        category: 'Adventure',
        description: 'Breathtaking alpine scenery, skiing, and outdoor adventures in the heart of Europe.',
        tags: ['Mountains', 'Nature', 'Luxury'],
        trending: false,
        highlights: ['Matterhorn', 'Zermatt', 'Glacier Express', 'Chocolate Tasting'],
        includes: ['Chalet Stay', 'Ski Pass', 'Fondue Dinner'],
        gallery: [
            'https://images.unsplash.com/photo-1496531693211-14051a9b5877?w=800',
            'https://images.unsplash.com/photo-1628169222582-73010b40eb94?w=800'
        ]
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
        category: 'Luxury',
        description: 'Experience futuristic luxury, desert safaris, and world-class shopping.',
        tags: ['Luxury', 'City', 'Shopping'],
        trending: true,
        highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Desert Safari', 'Gold Souk'],
        includes: ['5-Star Hotel', 'Private Driver', 'VIP Access'],
        gallery: [
            'https://images.unsplash.com/photo-1579482569502-36476142c125?w=800',
            'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=800'
        ]
    }
];

const categories = ['all', 'Cultural', 'Beach', 'Adventure', 'Luxury', 'Nature'];

const DestinationsPage = () => {
    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [destinations, setDestinations] = useState(initialDestinations);
    const [viewMode, setViewMode] = useState('grid');
    const [favorites, setFavorites] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);

    // Logic
    const toggleFavorite = (id) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const filteredDestinations = destinations.filter(dest => {
        const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.country.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <NavBar />

            {/* Immersive Hero Section */}
            <section className="relative pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Unseen</span>
                    </motion.h1>
                    <motion.p
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Handpicked destinations for your next unforgettable journey.
                    </motion.p>

                    {/* Floating Search Bar */}
                    <motion.div
                        className="max-w-2xl mx-auto relative z-20"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl flex items-center p-2">
                                <Search className="w-6 h-6 text-muted-foreground ml-4" />
                                <input
                                    type="text"
                                    placeholder="Where do you want to go?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-lg px-4 py-3 focus:outline-none placeholder:text-muted-foreground/50 text-foreground"
                                />
                                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                                    Search
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Sticky Filter Bar */}
            <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-y border-border/50 py-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {cat === 'all' ? 'All' : cat}
                            </button>
                        ))}
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Destinations Grid */}
            <section className="py-12 px-6 max-w-7xl mx-auto min-h-[60vh]">
                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    <AnimatePresence mode="popLayout">
                        {filteredDestinations.map((dest) => (
                            <motion.div
                                key={dest.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={`group relative bg-card rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                                    }`}
                                onClick={() => setSelectedDestination(dest)}
                            >
                                {/* Image */}
                                <div className={`relative overflow-hidden cursor-pointer ${viewMode === 'list' ? 'w-full md:w-1/3 aspect-video md:aspect-auto' : 'aspect-[4/3]'}`}>
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                    {/* Floating Badges */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {dest.trending && (
                                            <span className="px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1">
                                                <TrendingUp size={12} /> Trending
                                            </span>
                                        )}
                                        <span className="px-3 py-1 rounded-full bg-black/40 text-white text-xs font-medium backdrop-blur-md border border-white/10">
                                            {dest.category}
                                        </span>
                                    </div>

                                    {/* Favorite Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(dest.id); }}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all duration-300 z-10"
                                    >
                                        <Heart size={18} className={favorites.includes(dest.id) ? "fill-red-500 text-red-500" : ""} />
                                    </button>

                                    {/* Price Badge */}
                                    <div className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold">
                                        ${dest.price}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col justify-between flex-1 cursor-pointer">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{dest.name}</h3>
                                                <div className="flex items-center text-muted-foreground text-sm">
                                                    <MapPin size={14} className="mr-1 text-primary" />
                                                    {dest.country}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-lg">
                                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                <span className="font-bold text-sm">{dest.rating}</span>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                                            {dest.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {dest.tags.map(tag => (
                                                <span key={tag} className="text-xs px-3 py-1 rounded-lg bg-muted text-muted-foreground font-medium">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} /> {dest.duration}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={14} /> Group
                                            </div>
                                        </div>

                                        <button
                                            className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDestination(dest);
                                            }}
                                        >
                                            Details <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredDestinations.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No destinations found</h3>
                        <p className="text-muted-foreground mt-2">Try adjusting your filters or search term.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                            className="mt-6 text-primary font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </section>

            {/* Destination Modal */}
            <AnimatePresence>
                {selectedDestination && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDestination(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
                        >
                            <div className="min-h-screen px-4 flex items-center justify-center py-10">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-card w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-border relative flex flex-col md:flex-row max-h-[90vh]"
                                >
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setSelectedDestination(null)}
                                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10 transition-colors backdrop-blur-md"
                                    >
                                        <X size={20} />
                                    </button>

                                    {/* Left: Images */}
                                    <div className="md:w-2/5 relative h-64 md:h-auto">
                                        <img
                                            src={selectedDestination.image}
                                            alt={selectedDestination.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 md:opacity-60" />
                                        <div className="absolute bottom-6 left-6 text-white">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium border border-white/10">
                                                    {selectedDestination.duration}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs font-medium text-yellow-400">
                                                    <Star size={12} fill="currentColor" /> {selectedDestination.rating}
                                                </span>
                                            </div>
                                            <h2 className="text-3xl font-bold leading-tight mb-1">{selectedDestination.name}</h2>
                                            <p className="opacity-90 flex items-center gap-1 text-sm">
                                                <MapPin size={14} /> {selectedDestination.country}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Content */}
                                    <div className="md:w-3/5 p-8 overflow-y-auto custom-scrollbar">
                                        <div className="space-y-6">
                                            {/* Description */}
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-2">About The Trip</h3>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {selectedDestination.description}
                                                    {selectedDestination.description} {/* Doubled for mock length */}
                                                </p>
                                            </div>

                                            {/* Highlights */}
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-3">Highlights</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {selectedDestination.highlights?.map((highlight, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                                                            <CheckCircle size={16} className="text-primary shrink-0" />
                                                            {highlight}
                                                        </div>
                                                    )) || <p className="text-muted-foreground text-sm">Highlights loading...</p>}
                                                </div>
                                            </div>

                                            {/* What's Included */}
                                            <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                                                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Includes</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedDestination.includes?.map((item, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-background rounded-lg border border-border text-xs font-medium text-muted-foreground shadow-sm">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Gallery */}
                                            {selectedDestination.gallery && (
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground mb-3">Gallery</h3>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {selectedDestination.gallery.map((img, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={img}
                                                                alt="Gallery"
                                                                className="rounded-xl w-full h-24 object-cover hover:opacity-90 transition-opacity cursor-pointer block"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                                            <div>
                                                <div className="text-sm text-muted-foreground">Total Price</div>
                                                <div className="text-2xl font-bold text-foreground">
                                                    ${selectedDestination.price}
                                                    <span className="text-sm text-muted-foreground font-normal"> / person</span>
                                                </div>
                                            </div>
                                            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2">
                                                Book Now <Ticket size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DestinationsPage;
