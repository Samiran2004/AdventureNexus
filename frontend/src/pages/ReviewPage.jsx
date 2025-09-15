import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import {
    MapPin,
    Star,
    Filter,
    Search,
    Heart,
    Share2,
    ThumbsUp,
    Calendar,
    Camera,
    Users,
    Compass,
    Menu,
    X,
    ChevronDown,
    ArrowLeft,
    TrendingUp,
    Award,
    Globe,
    CheckCircle,
    Edit3,
    Send,
    Image as ImageIcon,
    StarIcon,
    Clock
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

const AdventureNexusReviews = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    // Refs for GSAP animations
    const headerRef = useRef(null);
    const statsRef = useRef(null);
    const reviewsRef = useRef(null);
    const writeReviewRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Header animation
            gsap.from(headerRef.current, {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });

            // Stats animation
            gsap.from(".stat-card", {
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            });

            // Reviews animation
            gsap.from(".review-card", {
                scrollTrigger: {
                    trigger: reviewsRef.current,
                    start: "top 80%",
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out"
            });
        });

        return () => ctx.revert();
    }, []);

    // Sample review data
    const reviews = [
        {
            id: 1,
            user: "Sarah Mitchell",
            avatar: "SM",
            location: "Bangkok, Thailand",
            rating: 5,
            date: "2 days ago",
            trip: "Southeast Asia Adventure",
            duration: "14 days",
            travelers: "Solo",
            content: "AdventureNexus completely transformed my travel experience! The AI recommendations were incredibly accurate - every restaurant, temple, and hidden spot was exactly my style. The itinerary flow was perfect, and I discovered places I would have never found on my own. The local insights were invaluable!",
            images: 3,
            helpful: 24,
            verified: true,
            category: "solo"
        },
        {
            id: 2,
            user: "David & Emma Chen",
            avatar: "DC",
            location: "Tokyo, Japan",
            rating: 5,
            date: "5 days ago",
            trip: "Family Japan Discovery",
            duration: "10 days",
            travelers: "Family (2 kids)",
            content: "Planning a family trip with young kids is usually overwhelming, but AdventureNexus made it effortless. The AI perfectly balanced kid-friendly activities with cultural experiences. The timing suggestions were spot-on, and the restaurant recommendations were all hits with the children!",
            images: 8,
            helpful: 31,
            verified: true,
            category: "family"
        },
        {
            id: 3,
            user: "Maria Rodriguez",
            avatar: "MR",
            location: "Patagonia, Chile",
            rating: 5,
            date: "1 week ago",
            trip: "Patagonia Expedition",
            duration: "21 days",
            travelers: "Couple",
            content: "The adventure planning was phenomenal! Every hiking trail, viewpoint, and accommodation recommendation exceeded our expectations. The AI understood our fitness level and preferences perfectly. This was our dream trip executed flawlessly.",
            images: 12,
            helpful: 45,
            verified: true,
            category: "adventure"
        },
        {
            id: 4,
            user: "James Thompson",
            avatar: "JT",
            location: "Rome, Italy",
            rating: 4,
            date: "2 weeks ago",
            trip: "European Culture Tour",
            duration: "12 days",
            travelers: "Solo",
            content: "Great experience overall! The historical site recommendations were excellent and the local food suggestions were amazing. Only minor issue was some timing could have been optimized better, but overall fantastic value and saved me hours of planning.",
            images: 5,
            helpful: 18,
            verified: true,
            category: "cultural"
        },
        {
            id: 5,
            user: "Lisa Park",
            avatar: "LP",
            location: "Bali, Indonesia",
            rating: 5,
            date: "3 weeks ago",
            trip: "Digital Nomad Base Setup",
            duration: "30 days",
            travelers: "Solo",
            content: "Perfect for digital nomads! The AI found the best coworking spaces, reliable wifi cafes, and productive environments. The balance between work-friendly spots and amazing experiences was exactly what I needed. Productivity and adventure combined!",
            images: 6,
            helpful: 28,
            verified: true,
            category: "business"
        },
        {
            id: 6,
            user: "Michael Johnson",
            avatar: "MJ",
            location: "Iceland",
            rating: 4,
            date: "1 month ago",
            trip: "Northern Lights Quest",
            duration: "8 days",
            travelers: "Couple",
            content: "Incredible northern lights viewing spots! The AI's weather predictions and location recommendations were very accurate. We saw the aurora on 5 out of 8 nights. The accommodation and restaurant suggestions were also excellent.",
            images: 9,
            helpful: 22,
            verified: true,
            category: "nature"
        }
    ];

    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            review.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            review.trip.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedFilter === 'all' || review.category === selectedFilter;
        const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
        return matchesSearch && matchesCategory && matchesRating;
    });

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-black">
            <NavBar/>

            {/* Header Section */}
            <section ref={headerRef} className="py-12 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Link to="/" className="text-gray-400 hover:text-white flex items-center">
                                <ArrowLeft size={20} className="mr-2" />
                                Back to Home
                            </Link>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Traveler Reviews
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Real experiences from our community of adventurers. See why travelers trust AdventureNexus to plan their perfect trips.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section ref={statsRef} className="py-12 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <Card className="stat-card bg-gray-900 border-gray-700 text-center">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold text-blue-400 mb-2">4.9</div>
                                <div className="text-sm text-gray-400">Average Rating</div>
                                <div className="flex justify-center mt-2">
                                    {renderStars(5)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="stat-card bg-gray-900 border-gray-700 text-center">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold text-green-400 mb-2">12.5K</div>
                                <div className="text-sm text-gray-400">Total Reviews</div>
                                <div className="flex items-center justify-center mt-2 text-green-400">
                                    <TrendingUp size={16} className="mr-1" />
                                    <span className="text-sm">+28% this month</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="stat-card bg-gray-900 border-gray-700 text-center">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold text-purple-400 mb-2">195</div>
                                <div className="text-sm text-gray-400">Countries Reviewed</div>
                                <div className="flex items-center justify-center mt-2 text-purple-400">
                                    <Globe size={16} className="mr-1" />
                                    <span className="text-sm">Worldwide</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="stat-card bg-gray-900 border-gray-700 text-center">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
                                <div className="text-sm text-gray-400">Would Recommend</div>
                                <div className="flex items-center justify-center mt-2 text-yellow-400">
                                    <Award size={16} className="mr-1" />
                                    <span className="text-sm">Excellence</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Filters and Search */}
            <section className="py-8 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    placeholder="Search reviews..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                                />
                            </div>

                            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="solo">Solo Travel</SelectItem>
                                    <SelectItem value="family">Family</SelectItem>
                                    <SelectItem value="couple">Couple</SelectItem>
                                    <SelectItem value="adventure">Adventure</SelectItem>
                                    <SelectItem value="cultural">Cultural</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="nature">Nature</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={selectedRating} onValueChange={setSelectedRating}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                    <SelectValue placeholder="Rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Ratings</SelectItem>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4+ Stars</SelectItem>
                                    <SelectItem value="3">3+ Stars</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="highest">Highest Rated</SelectItem>
                                    <SelectItem value="helpful">Most Helpful</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                onClick={() => setShowWriteReview(!showWriteReview)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Edit3 size={16} className="mr-2" />
                                Write Review
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Write Review Section */}
            {showWriteReview && (
                <section ref={writeReviewRef} className="py-8 bg-gray-900 border-b border-gray-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Edit3 className="mr-2" size={20} />
                                    Share Your Adventure
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Help fellow travelers by sharing your experience with AdventureNexus
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Trip destination"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <Input
                                        placeholder="Trip duration"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-white mb-2 block">Your Rating</label>
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={24}
                                                className="text-gray-400 hover:text-yellow-400 cursor-pointer"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Textarea
                                    placeholder="Tell us about your experience with AdventureNexus. How did our AI recommendations work out? What made your trip special?"
                                    className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                                />

                                <div className="flex justify-between items-center">
                                    <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700">
                                        <ImageIcon size={16} className="mr-2" />
                                        Add Photos
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowWriteReview(false)}
                                            className="text-gray-400 hover:bg-gray-700"
                                        >
                                            Cancel
                                        </Button>
                                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                                            <Send size={16} className="mr-2" />
                                            Submit Review
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Reviews Section */}
            <section ref={reviewsRef} className="py-12 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {filteredReviews.map((review, index) => (
                            <Card key={review.id} className="review-card bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {review.avatar}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-semibold text-white">{review.user}</h3>
                                                    {review.verified && (
                                                        <Badge className="bg-green-900/50 text-green-400 border border-green-700/50">
                                                            <CheckCircle size={12} className="mr-1" />
                                                            Verified
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                                                    <span className="flex items-center">
                                                        <MapPin size={14} className="mr-1" />
                                                        {review.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock size={14} className="mr-1" />
                                                        {review.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-white mb-2">{review.trip}</h4>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                                <Calendar size={12} className="mr-1" />
                                                {review.duration}
                                            </Badge>
                                            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                                <Users size={12} className="mr-1" />
                                                {review.travelers}
                                            </Badge>
                                            {review.images > 0 && (
                                                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                                    <Camera size={12} className="mr-1" />
                                                    {review.images} photos
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-300 leading-relaxed mb-4">
                                        {review.content}
                                    </p>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                                        <div className="flex space-x-4">
                                            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                                <ThumbsUp size={16} />
                                                <span className="text-sm">Helpful ({review.helpful})</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                                                <Heart size={16} />
                                                <span className="text-sm">Save</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                                <Share2 size={16} />
                                                <span className="text-sm">Share</span>
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredReviews.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Search size={48} className="mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No reviews found</h3>
                                <p>Try adjusting your filters or search terms</p>
                            </div>
                        </div>
                    )}

                    {filteredReviews.length > 0 && (
                        <div className="text-center mt-12">
                            <Button variant="outline" className="border-gray-600 text- bg-green-600 hover:text-amber-50 hover:bg-gray-800">
                                Load More Reviews
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                    <Compass size={24} />
                                </div>
                                <span className="text-2xl font-bold">AdventureNexus</span>
                            </div>
                            <p className="text-gray-400">
                                Empowering travelers with AI-powered trip planning and personalized recommendations for unforgettable adventures.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">Product</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">AI Trip Planner</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Flight Search</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Hotel Booking</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">Company</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Travel Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Travel Guides</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 AdventureNexus. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdventureNexusReviews;
