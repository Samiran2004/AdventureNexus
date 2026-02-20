import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from '@clerk/clerk-react';
import reviewService from '@/services/reviewService';
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
    Clock,
    Loader2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import toast from 'react-hot-toast';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// AdventureNexusReviews component displays user reviews and testimonials from travelers
const AdventureNexusReviews = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form Stats
    const [newReview, setNewReview] = useState({
        location: '',
        tripDuration: '',
        rating: 0,
        comment: '',
        tripType: 'solo',
        travelers: 'Solo'
    });

    // Refs for GSAP animations
    const headerRef = useRef(null);
    const categoriesRef = useRef(null);
    const reviewsRef = useRef(null);
    const writeReviewRef = useRef(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const filters = {
                category: selectedFilter,
                rating: selectedRating,
                search: searchQuery,
                sortBy: sortBy,
                page: currentPage,
                limit: 3 // Show 3 reviews per batch as requested
            };
            const response = await reviewService.getReviews(filters);
            if (response.success) {
                setReviews(response.data);
                setTotalPages(response.totalPages);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 when filters change
    }, [selectedFilter, selectedRating, searchQuery, sortBy]);

    useEffect(() => {
        fetchReviews();
        // Scroll to top of reviews section when page changes
        if (reviewsRef.current && currentPage > 1) {
            reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentPage, selectedFilter, selectedRating, searchQuery, sortBy]);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Header animation
            gsap.from(headerRef.current, {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });

            window.scrollTo(0, 0); // Keep top scroll
        }, []);

        return () => ctx.revert();
    }, []);

    // Effect for staggering reviews when they load
    useEffect(() => {
        if (!loading && reviews.length > 0) {
            gsap.from(".review-card", {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                clearProps: "all"
            });
        }
    }, [loading, reviews]);


    const handleReviewSubmit = async () => {
        if (!user) {
            toast.error("You must be signed in to write a review");
            return;
        }
        if (newReview.rating === 0) {
            toast.error("Please provide a rating");
            return;
        }
        if (!newReview.location || !newReview.comment || !newReview.tripDuration) {
            toast.error("Please fill in all required fields (Location, Duration, Comment)");
            return;
        }

        setSubmitting(true);
        try {
            const reviewData = {
                ...newReview,
                userName: user.fullName || user.username || 'Traveler',
                userAvatar: user.imageUrl,
                userId: user.id, // Clerk ID stored as string in this model
                clerkUserId: user.id
            };

            const token = await getToken();
            await reviewService.createReview(reviewData, token);
            toast.success("Review submitted successfully!");
            setShowWriteReview(false);
            setNewReview({
                location: '',
                tripDuration: '',
                rating: 0,
                comment: '',
                tripType: 'solo',
                travelers: 'Solo'
            });
            fetchReviews();
        } catch (error) {
            console.error("Submission Error:", error);
            const errorMessage = error.response?.data?.message || "Failed to submit review";
            const errorDetails = error.response?.data?.error ? JSON.stringify(error.response.data.error) : "";
            toast.error(`${errorMessage} ${errorDetails ? `(${errorDetails})` : ''}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (id) => {
        try {
            const token = await getToken();
            await reviewService.likeReview(id, token);
            // Optimistic update or refetch
            setReviews(reviews.map(r =>
                r._id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
            ));
        } catch (error) {
            toast.error("Failed to like review");
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <NavBar />

            {/* Header Section */}
            <section ref={headerRef} className="pt-32 pb-12 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full opacity-30 blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full opacity-20 blur-[100px]"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center space-y-6 pt-10">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <Link to="/" className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center transition-colors group px-3 py-1 rounded-full border border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 uppercase tracking-widest">
                                <ArrowLeft size={12} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                Return Home
                            </Link>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground tracking-tighter pb-4 leading-none">
                            VOICES
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
                            Authentic experiences from the global community. <span className="text-foreground font-medium">Verified.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Pro - Control Bar & Pulse Strip */}
            <section className="py-8 border-b border-border bg-muted/10 backdrop-blur-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Filter Pills */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            {[
                                { id: 'all', label: 'All Reviews' },
                                { id: 'adventure', label: 'Adventure' },
                                { id: 'cultural', label: 'Cultural' },
                                { id: 'solo', label: 'Solo' },
                                { id: 'nature', label: 'Nature' },
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id === 'all' ? 'all' : filter.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${(selectedFilter === filter.id || (selectedFilter === 'all' && filter.id === 'all'))
                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Community Pulse (Technical Look) */}
                        <div className="flex items-center gap-6 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                            <div className="flex flex-col items-center md:items-end">
                                <span className="mb-1">Avg. Rating</span>
                                <span className="text-emerald-400 font-bold text-base flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    4.92 / 5.0
                                </span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex flex-col items-center md:items-end">
                                <span className="mb-1">Total Verified</span>
                                <span className="text-foreground font-bold text-base">12,543</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters and Search */}
            <section className="py-4 sticky top-20 z-40 bg-background/80 backdrop-blur-lg border-y border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
                            <div className="relative w-full max-w-md group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    placeholder="Search by location, content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 bg-muted/20 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/50 focus:bg-muted/30 rounded-xl transition-all"
                                />
                            </div>

                            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                <SelectTrigger className="w-[180px] h-10 bg-white/10 border-white/10 text-white rounded-xl hover:bg-white/15 transition-colors">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border text-foreground">
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
                                <SelectTrigger className="w-[140px] h-10 bg-white/10 border-white/10 text-white rounded-xl hover:bg-white/15 transition-colors">
                                    <SelectValue placeholder="Rating" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border text-foreground">
                                    <SelectItem value="all">All Ratings</SelectItem>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4+ Stars</SelectItem>
                                    <SelectItem value="3">3+ Stars</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto justify-end">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[160px] h-10 bg-white/10 border-white/10 text-white rounded-xl hover:bg-white/15 transition-colors">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border text-foreground">
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="highest">Highest Rated</SelectItem>
                                    <SelectItem value="helpful">Most Helpful</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                onClick={() => setShowWriteReview(!showWriteReview)}
                                className="h-10 bg-primary hover:bg-primary/90 text-white rounded-xl px-6 transition-all hover:scale-105 shadow-lg shadow-primary/25 font-medium"
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
                <section ref={writeReviewRef} className="py-8 bg-muted/30 border-b border-border">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="bg-card/40 border-border backdrop-blur-sm max-w-3xl mx-auto shadow-2xl">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center text-2xl">
                                    <Edit3 className="mr-2 text-primary" size={24} />
                                    Share Your Adventure
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Help fellow travelers by sharing your experience.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Trip destination (e.g. Tokyo, Japan)"
                                        value={newReview.location}
                                        onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                                        className="h-10 bg-white/10 border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:bg-white/15 transition-all"
                                    />
                                    <Input
                                        placeholder="Trip duration (e.g. 10 days)"
                                        value={newReview.tripDuration}
                                        onChange={(e) => setNewReview({ ...newReview, tripDuration: e.target.value })}
                                        className="h-10 bg-white/10 border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:bg-white/15 transition-all"
                                    />
                                    <Select
                                        value={newReview.tripType}
                                        onValueChange={(val) => setNewReview({ ...newReview, tripType: val })}
                                    >
                                        <SelectTrigger className="h-10 bg-white/10 border-white/10 text-white rounded-xl hover:bg-white/15 transition-colors">
                                            <SelectValue placeholder="Trip Type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                            <SelectItem value="solo">Solo</SelectItem>
                                            <SelectItem value="couple">Couple</SelectItem>
                                            <SelectItem value="family">Family</SelectItem>
                                            <SelectItem value="adventure">Adventure</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="cultural">Cultural</SelectItem>
                                            <SelectItem value="nature">Nature</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={newReview.travelers}
                                        onValueChange={(val) => setNewReview({ ...newReview, travelers: val })}
                                    >
                                        <SelectTrigger className="h-10 bg-white/10 border-white/10 text-white rounded-xl hover:bg-white/15 transition-colors">
                                            <SelectValue placeholder="Travelers" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                            <SelectItem value="Solo">Solo</SelectItem>
                                            <SelectItem value="Couple">Couple</SelectItem>
                                            <SelectItem value="Family">Family</SelectItem>
                                            <SelectItem value="Group">Group</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-slate-300 mb-2 block text-sm font-medium">Your Rating</label>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={32}
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                className={`cursor-pointer transition-transform hover:scale-110 ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-slate-700'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Textarea
                                    placeholder="Tell us about your experience..."
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white min-h-[120px]"
                                />

                                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowWriteReview(false)}
                                        className="text-slate-400 hover:text-white hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleReviewSubmit}
                                        disabled={submitting}
                                        className="bg-primary text-white"
                                    >
                                        {submitting ? <Loader2 className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
                                        Submit Review
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Reviews Section */}
            <section ref={reviewsRef} className="py-12 min-h-[600px] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review, index) => (
                                <Card key={review._id || index} className="review-card backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group overflow-hidden shadow-lg shadow-black/20">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <CardContent className="p-6 md:p-8 relative">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* User Info */}
                                            <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-4 md:w-48">
                                                <div className="relative">
                                                    <div
                                                        className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20 cursor-pointer overflow-hidden transform hover:scale-105 transition-transform"
                                                        onClick={() => navigate(`/user/profile/${review.clerkUserId || review.userId}`)}
                                                    >
                                                        <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                                                            {review.userAvatar ? (
                                                                <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white uppercase bg-zinc-800">
                                                                    {review.userName.substring(0, 2)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {review.isVerified && (
                                                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-black shadow-sm">
                                                            <CheckCircle size={10} className="text-white" fill="currentColor" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <h3
                                                        className="font-semibold text-white text-lg tracking-tight cursor-pointer hover:text-primary transition-colors"
                                                        onClick={() => navigate(`/user/profile/${review.clerkUserId || review.userId}`)}
                                                    >
                                                        {review.userName}
                                                    </h3>
                                                    <div className="flex items-center justify-center md:justify-start text-xs text-zinc-400 mt-1 font-medium">
                                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Review Content */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                    <div className="flex items-center space-x-2 text-zinc-300">
                                                        <MapPin size={16} className="text-primary" />
                                                        <span className="font-medium">{review.location}</span>
                                                    </div>
                                                    <div className="flex items-center bg-white/5 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                                                        <div className="flex mr-2">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <span className="text-sm font-bold text-white">{review.rating}.0</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20 transition-colors px-3 py-1">
                                                        <Compass size={12} className="mr-1.5" />
                                                        {review.tripType}
                                                    </Badge>
                                                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20 transition-colors px-3 py-1">
                                                        <Calendar size={12} className="mr-1.5" />
                                                        {review.tripDuration}
                                                    </Badge>
                                                    <Badge variant="secondary" className="bg-pink-500/10 text-pink-300 border-pink-500/20 hover:bg-pink-500/20 transition-colors px-3 py-1">
                                                        <Users size={12} className="mr-1.5" />
                                                        {review.travelers}
                                                    </Badge>
                                                </div>

                                                <p className="text-zinc-300 leading-relaxed text-lg font-light italic border-l-2 border-primary/30 pl-4 py-1">
                                                    "{review.comment}"
                                                </p>

                                                <div className="flex items-center gap-6 pt-4 mt-2 border-t border-white/5">
                                                    <button
                                                        onClick={() => handleLike(review._id)}
                                                        className="flex items-center space-x-2 text-zinc-400 hover:text-primary transition-colors group"
                                                    >
                                                        <ThumbsUp size={18} className="group-hover:scale-110 transition-transform" />
                                                        <span className="text-sm font-medium">Helpful ({review.helpfulCount || 0})</span>
                                                    </button>
                                                    <button className="flex items-center space-x-2 text-zinc-400 hover:text-pink-500 transition-colors text-sm font-medium">
                                                        <Heart size={18} />
                                                        <span>Save</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Load More / Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12 gap-6">
                            {currentPage > 1 && (
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium flex items-center gap-2 group"
                                >
                                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    Previous Batch
                                </button>
                            )}

                            {currentPage < totalPages && (
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all font-bold flex items-center gap-2 group hover:scale-105"
                                >
                                    Load Next 3 Reviews
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && reviews.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                            <div className="text-slate-500 mb-4 inline-block p-6 rounded-full bg-white/5">
                                <Search size={48} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-2">No reviews found</h3>
                            <p className="text-slate-400 max-w-md mx-auto">
                                We couldn't find any reviews matching your criteria. Try adjusting your filters or be the first to write one!
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedFilter('all');
                                    setSelectedRating('all');
                                }}
                                className="mt-6 border-white/20 text-white hover:bg-white/10"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AdventureNexusReviews;
