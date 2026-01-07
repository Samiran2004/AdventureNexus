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
    BookOpen,
    Camera,
    Mountain,
    Compass,
    Clock,
    ThermometerSun,
    Plane,
    ArrowRight,
    Eye,
    TrendingUp,
    Bot,
    User,
    Baby,
    HeartHandshake,
    Wallet,
    TreePine,
    Waves,
    Coffee,
    Sunrise,
    Sunset,
    Snowflake,
    Flower,
    Sun,
    Leaf,
    ChevronRight,
    Play,
    BookmarkPlus,
    MessageCircle,
    ThumbsUp,
    Share2,
    CalendarDays,
    Globe,
    Target,
    Zap,
    Award,
    Lightbulb,
    Navigation,
    PiggyBank,
    ShoppingBag,
    Utensils,
    Bed,
    Train,
    Camera as CameraIcon,
    Map,
    Backpack
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/components/NavBar';
import NumberCounter from '@/components/NumberCounter';

gsap.registerPlugin(ScrollTrigger);

// TripInspirationPage displays curated travel stories, seasonal guides, and travel tips
const TripInspirationPage = () => {
    // Sample data for different inspiration categories including stories, guides, and tips
    const [inspirationData] = useState({
        featuredStories: [
            {
                id: 1,
                title: "Solo Backpacking Through Southeast Asia: A Journey of Self-Discovery",
                excerpt: "How 30 days alone in Thailand, Vietnam, and Cambodia changed my perspective on life and travel forever.",
                author: "Sarah Mitchell",
                authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=100",
                readTime: "8 min read",
                publishDate: "2025-01-15",
                image: "https://images.unsplash.com/photo-1539650116574-75c0c6d4d6d7?w=800",
                category: "Solo Travel",
                tags: ["Solo Travel", "Adventure", "Budget", "Southeast Asia"],
                likes: 247,
                comments: 32,
                featured: true
            },
            {
                id: 2,
                title: "Family Adventures in Japan: Creating Magic for All Ages",
                excerpt: "Discovering how Japan's perfect blend of tradition and technology creates unforgettable family memories.",
                author: "Michael Chen",
                authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
                readTime: "12 min read",
                publishDate: "2025-01-10",
                image: "https://images.unsplash.com/photo-1551398628-7f9d99b55241?w=800",
                category: "Family Travel",
                tags: ["Family Travel", "Japan", "Culture", "Kids"],
                likes: 189,
                comments: 24,
                featured: true
            },
            {
                id: 3,
                title: "Romantic Escapes: Hidden Gems for Couples in Europe",
                excerpt: "Discover intimate destinations beyond the typical tourist trail for your next romantic getaway.",
                author: "Emma & James Wilson",
                authorImage: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100",
                readTime: "10 min read",
                publishDate: "2025-01-08",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                category: "Couple Travel",
                tags: ["Couple Travel", "Romance", "Europe", "Hidden Gems"],
                likes: 312,
                comments: 45,
                featured: true
            }
        ],
        seasonalGuides: [
            {
                season: "Spring",
                icon: <Flower className="text-pink-400" size={24} />,
                color: "pink",
                destinations: [
                    {
                        name: "Japan Cherry Blossoms",
                        image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400",
                        bestMonths: "March - May",
                        highlights: ["Sakura season", "Mild weather", "Festival season"],
                        averageTemp: "10-20°C"
                    },
                    {
                        name: "Netherlands Tulip Season",
                        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
                        bestMonths: "April - May",
                        highlights: ["Tulip gardens", "Perfect cycling weather", "Longer days"],
                        averageTemp: "8-16°C"
                    }
                ]
            },
            {
                season: "Summer",
                icon: <Sun className="text-yellow-400" size={24} />,
                color: "yellow",
                destinations: [
                    {
                        name: "Greek Islands",
                        image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400",
                        bestMonths: "June - August",
                        highlights: ["Beach weather", "Long daylight", "Island hopping"],
                        averageTemp: "25-35°C"
                    },
                    {
                        name: "Scandinavia Midnight Sun",
                        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                        bestMonths: "June - July",
                        highlights: ["Midnight sun", "White nights", "Hiking season"],
                        averageTemp: "15-25°C"
                    }
                ]
            },
            {
                season: "Autumn",
                icon: <Leaf className="text-orange-400" size={24} />,
                color: "orange",
                destinations: [
                    {
                        name: "New England Fall Foliage",
                        image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400",
                        bestMonths: "September - October",
                        highlights: ["Fall colors", "Cozy weather", "Apple picking"],
                        averageTemp: "10-20°C"
                    },
                    {
                        name: "Morocco Desert Adventures",
                        image: "https://images.unsplash.com/photo-1539650116574-75c0c6d4d6d7?w=400",
                        bestMonths: "October - November",
                        highlights: ["Perfect desert weather", "Clear skies", "Comfortable temperatures"],
                        averageTemp: "20-28°C"
                    }
                ]
            },
            {
                season: "Winter",
                icon: <Snowflake className="text-blue-400" size={24} />,
                color: "blue",
                destinations: [
                    {
                        name: "Northern Lights in Iceland",
                        image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400",
                        bestMonths: "October - March",
                        highlights: ["Aurora viewing", "Ice caves", "Hot springs"],
                        averageTemp: "-5-5°C"
                    },
                    {
                        name: "Southeast Asia Dry Season",
                        image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400",
                        bestMonths: "December - February",
                        highlights: ["Dry weather", "Cool temperatures", "Peak season"],
                        averageTemp: "24-30°C"
                    }
                ]
            }
        ],
        budgetTips: [
            {
                category: "Accommodation",
                icon: <Bed className="text-blue-400" size={20} />,
                tips: [
                    {
                        title: "Book hostels with kitchen facilities",
                        description: "Save 60% on food costs by cooking your own meals",
                        savings: "$30-50/day"
                    },
                    {
                        title: "Use house-sitting platforms",
                        description: "Free accommodation in exchange for pet/house sitting",
                        savings: "$80-200/night"
                    },
                    {
                        title: "Travel during shoulder seasons",
                        description: "Same destinations, 40-60% cheaper accommodation",
                        savings: "$40-100/night"
                    }
                ]
            },
            {
                category: "Transportation",
                icon: <Train className="text-green-400" size={20} />,
                tips: [
                    {
                        title: "Use budget airlines strategically",
                        description: "Book domestic flights 2-3 months in advance",
                        savings: "$100-300/flight"
                    },
                    {
                        title: "Invest in rail passes",
                        description: "Eurail, JR Pass for unlimited train travel",
                        savings: "$200-500/week"
                    },
                    {
                        title: "Walk or rent bikes",
                        description: "Explore cities slowly while saving money",
                        savings: "$10-20/day"
                    }
                ]
            },
            {
                category: "Food & Dining",
                icon: <Utensils className="text-orange-400" size={20} />,
                tips: [
                    {
                        title: "Eat like a local",
                        description: "Street food and local markets over tourist restaurants",
                        savings: "$15-30/meal"
                    },
                    {
                        title: "Pack snacks for long trips",
                        description: "Avoid expensive airport and station food",
                        savings: "$5-15/trip"
                    },
                    {
                        title: "Take advantage of free breakfast",
                        description: "Start your day with included hotel breakfast",
                        savings: "$8-15/day"
                    }
                ]
            },
            {
                category: "Activities",
                icon: <Camera className="text-purple-400" size={20} />,
                tips: [
                    {
                        title: "Find free walking tours",
                        description: "Tip-based tours offer great value and local insights",
                        savings: "$20-40/tour"
                    },
                    {
                        title: "Visit museums on free days",
                        description: "Many museums offer free admission certain days",
                        savings: "$10-25/visit"
                    },
                    {
                        title: "Explore nature and parks",
                        description: "Hiking, beaches, and parks are often free",
                        savings: "$20-50/day"
                    }
                ]
            }
        ],
        travelStyles: {
            adventure: {
                title: "Adventure Travel",
                description: "For thrill-seekers and adrenaline junkies",
                icon: <Mountain className="text-red-400" size={32} />,
                color: "red",
                activities: [
                    "Mountain climbing", "Skydiving", "White water rafting",
                    "Bungee jumping", "Rock climbing", "Paragliding"
                ],
                destinations: [
                    {
                        name: "Queenstown, New Zealand",
                        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
                        activities: ["Bungee jumping", "Skydiving", "Jet boating"]
                    },
                    {
                        name: "Interlaken, Switzerland",
                        image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300",
                        activities: ["Paragliding", "Canyoning", "Alpine hiking"]
                    }
                ]
            },
            relaxation: {
                title: "Relaxation Travel",
                description: "Perfect for unwinding and recharging",
                icon: <Waves className="text-blue-400" size={32} />,
                color: "blue",
                activities: [
                    "Spa treatments", "Beach lounging", "Yoga retreats",
                    "Meditation", "Scenic walks", "Luxury resorts"
                ],
                destinations: [
                    {
                        name: "Maldives",
                        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
                        activities: ["Overwater villas", "Snorkeling", "Spa treatments"]
                    },
                    {
                        name: "Bali, Indonesia",
                        image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300",
                        activities: ["Yoga retreats", "Beach clubs", "Temple visits"]
                    }
                ]
            }
        },
        travelTypes: [
            {
                type: "Solo Travel",
                icon: <User className="text-purple-400" size={32} />,
                description: "Discover yourself while discovering the world",
                benefits: [
                    "Complete freedom and flexibility",
                    "Personal growth and confidence building",
                    "Authentic cultural connections",
                    "Self-discovery and independence"
                ],
                bestDestinations: ["Thailand", "New Zealand", "Portugal", "Japan", "Costa Rica"],
                tips: [
                    "Start with safe, tourist-friendly destinations",
                    "Stay in hostels to meet other travelers",
                    "Learn basic local phrases",
                    "Trust your instincts and stay aware"
                ],
                averageDailyCost: "$50-80"
            },
            {
                type: "Family Travel",
                icon: <Baby className="text-green-400" size={32} />,
                description: "Creating magical memories for all generations",
                benefits: [
                    "Quality bonding time away from distractions",
                    "Educational experiences for children",
                    "Strengthened family relationships",
                    "Shared adventures and stories"
                ],
                bestDestinations: ["Disney World", "Iceland", "Singapore", "Australia", "Morocco"],
                tips: [
                    "Plan activities for different age groups",
                    "Pack extra snacks and entertainment",
                    "Book family-friendly accommodations",
                    "Allow for flexible schedules and rest time"
                ],
                averageDailyCost: "$200-400"
            },
            {
                type: "Couple Travel",
                icon: <HeartHandshake className="text-pink-400" size={32} />,
                description: "Romance and adventure for two",
                benefits: [
                    "Strengthen your relationship bond",
                    "Create romantic memories together",
                    "Experience new cultures as a team",
                    "Disconnect from daily stress"
                ],
                bestDestinations: ["Santorini", "Paris", "Bali", "Tuscany", "Kyoto"],
                tips: [
                    "Balance activities both partners enjoy",
                    "Plan some surprise elements",
                    "Choose romantic accommodations",
                    "Document your journey together"
                ],
                averageDailyCost: "$150-300"
            }
        ]
    });

    // State management
    const [selectedCategory, setSelectedCategory] = useState('stories');
    const [selectedTravelType, setSelectedTravelType] = useState('solo');
    const [selectedSeason, setSelectedSeason] = useState('spring');
    const [searchTerm, setSearchTerm] = useState('');

    // Refs for animations
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero animation
            gsap.from(heroRef.current, {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power2.out"
            });

            // Content sections animation
            gsap.from(".inspiration-section", {
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 80%",
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });

            // Cards animation
            gsap.from(".inspiration-card", {
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 60%",
                },
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)"
            });
        });

        return () => ctx.revert();
    }, []);

    const StoryCard = ({ story, size = "normal" }) => (
        <Card className={`inspiration-card group cursor-pointer hover:scale-105 transition-all duration-300 bg-card border-border overflow-hidden ${size === 'featured' ? 'md:col-span-2' : ''}`}>
            <div className="relative">
                <img
                    src={story.image}
                    alt={story.title}
                    className={`w-full ${size === 'featured' ? 'h-64' : 'h-48'} object-cover group-hover:scale-110 transition-transform duration-500`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {story.featured && (
                    <Badge className="absolute top-3 left-3 bg-yellow-600 text-white">
                        <Star size={12} className="mr-1" />
                        Featured
                    </Badge>
                )}

                {/* Play button for video content */}
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <Play className="text-white" size={24} />
                    </div>
                </button>
            </div>

            <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                        {story.category}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{story.readTime}</span>
                </div>

                <h3 className={`${size === 'featured' ? 'text-xl' : 'text-lg'} font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2`}>
                    {story.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                    {story.excerpt}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img
                            src={story.authorImage}
                            alt={story.author}
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="text-muted-foreground text-sm">{story.author}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-muted-foreground text-sm">
                        <div className="flex items-center">
                            <ThumbsUp size={14} className="mr-1" />
                            {story.likes}
                        </div>
                        <div className="flex items-center">
                            <MessageCircle size={14} className="mr-1" />
                            {story.comments}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavBar />

            {/* Hero Section */}
            <section ref={heroRef} className="py-20 bg-background relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-primary/20 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/20 rounded-full opacity-30 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
                                Find Your Next
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Adventure</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                Get inspired with curated travel stories, seasonal guides, and personalized recommendations for every type of journey.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Search for inspiration, destinations, or travel styles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 pr-4 py-3 bg-card/90 border-border text-foreground placeholder:text-muted-foreground rounded-xl backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <BookOpen className="mr-2" size={16} />
                                <NumberCounter targetNumber={500} duration={2} />+ Travel Stories
                            </div>
                            <div className="flex items-center">
                                <MapPin className="mr-2" size={16} />
                                <NumberCounter targetNumber={100} duration={2.5} />+ Destinations
                            </div>
                            <div className="flex items-center">
                                <Users className="mr-2" size={16} />
                                <NumberCounter targetNumber={25000} duration={3} />+ Travelers Inspired
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section ref={contentRef} className="py-16 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2 mb-12 justify-center">
                        {[
                            { id: 'stories', label: 'Travel Stories', icon: BookOpen },
                            { id: 'seasonal', label: 'Seasonal Guides', icon: CalendarDays },
                            { id: 'budget', label: 'Budget Tips', icon: PiggyBank },
                            { id: 'styles', label: 'Adventure vs Relaxation', icon: Mountain },
                            { id: 'types', label: 'Travel Types', icon: Users }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedCategory(tab.id)}
                                className={`flex items-center px-6 py-3 rounded-full transition-all ${selectedCategory === tab.id
                                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                                    }`}
                            >
                                <tab.icon size={16} className="mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Curated Travel Stories */}
                    {selectedCategory === 'stories' && (
                        <div className="inspiration-section space-y-8">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                    Inspiring Travel Stories
                                </h2>
                                <p className="text-xl text-muted-foreground">
                                    Real adventures from real travelers around the world
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {inspirationData.featuredStories.map((story, index) => (
                                    <StoryCard
                                        key={story.id}
                                        story={story}
                                        size={index === 0 ? 'featured' : 'normal'}
                                    />
                                ))}
                            </div>

                            {/* Categories */}
                            <div className="grid md:grid-cols-3 gap-6 mt-12">
                                {['Adventure Stories', 'Cultural Immersion', 'Food & Travel'].map((category, index) => (
                                    <Card key={index} className="bg-card border-border hover:border-primary transition-colors cursor-pointer">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-4xl mb-4">
                                                {index === 0 ? '🏔️' : index === 1 ? '🎭' : '🍜'}
                                            </div>
                                            <h3 className="text-lg font-semibold text-card-foreground mb-2">{category}</h3>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                {index === 0 ? 'Thrilling adventures and outdoor experiences' :
                                                    index === 1 ? 'Deep cultural connections and local experiences' :
                                                        'Culinary journeys and food discoveries'}
                                            </p>
                                            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                                                Explore Stories
                                                <ArrowRight className="ml-2" size={14} />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seasonal Travel Guides */}
                    {selectedCategory === 'seasonal' && (
                        <div className="inspiration-section space-y-8">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                    Seasonal Travel Guides
                                </h2>
                                <p className="text-xl text-muted-foreground">
                                    Discover the perfect destinations for every season
                                </p>
                            </div>

                            {/* Season Selection */}
                            <div className="flex justify-center space-x-4 mb-8">
                                {inspirationData.seasonalGuides.map((season, index) => (
                                    <button
                                        key={season.season.toLowerCase()}
                                        onClick={() => setSelectedSeason(season.season.toLowerCase())}
                                        className={`flex items-center px-6 py-3 rounded-lg transition-all ${selectedSeason === season.season.toLowerCase()
                                            ? `bg-${season.color}-600 text-white`
                                            : 'bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {season.icon}
                                        <span className="ml-2 font-medium">{season.season}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Selected Season Content */}
                            {inspirationData.seasonalGuides.map(season => (
                                selectedSeason === season.season.toLowerCase() && (
                                    <div key={season.season} className="grid md:grid-cols-2 gap-8">
                                        {season.destinations.map((destination, index) => (
                                            <Card key={index} className="inspiration-card bg-card border-border overflow-hidden hover:scale-105 transition-transform">
                                                <div className="relative">
                                                    <img
                                                        src={destination.image}
                                                        alt={destination.name}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                    <div className="absolute bottom-4 left-4">
                                                        <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                                                        <p className="text-gray-300">{destination.bestMonths}</p>
                                                    </div>
                                                </div>
                                                <CardContent className="p-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Average Temperature</h4>
                                                            <p className="text-card-foreground font-medium">{destination.averageTemp}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Highlights</h4>
                                                            <div className="space-y-1">
                                                                {destination.highlights.map((highlight, i) => (
                                                                    <div key={i} className="flex items-center text-sm text-muted-foreground">
                                                                        <CheckCircle className="text-green-600 dark:text-green-400 mr-2" size={12} />
                                                                        {highlight}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                                                            Plan Trip
                                                            <ArrowRight className="ml-2" size={16} />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )
                            ))}
                        </div>
                    )}

                    {/* Budget Travel Tips */}
                    {selectedCategory === 'budget' && (
                        <div className="inspiration-section space-y-8">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center">
                                    <PiggyBank className="mr-3 text-green-600 dark:text-green-400" />
                                    Budget Travel Tips
                                </h2>
                                <p className="text-xl text-muted-foreground">
                                    Travel more for less with these money-saving strategies
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {inspirationData.budgetTips.map((category, index) => (
                                    <Card key={index} className="inspiration-card bg-card border-border">
                                        <CardHeader>
                                            <CardTitle className="text-card-foreground flex items-center">
                                                {category.icon}
                                                <span className="ml-3">{category.category}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {category.tips.map((tip, tipIndex) => (
                                                <div key={tipIndex} className="p-4 bg-muted/50 rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-card-foreground font-medium flex-1">{tip.title}</h4>
                                                        <Badge className="bg-green-600 text-white ml-2">
                                                            {tip.savings}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-muted-foreground text-sm">{tip.description}</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Budget Calculator CTA */}
                            <Card className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 border-green-200 dark:border-green-700/30">
                                <CardContent className="p-8 text-center">
                                    <div className="flex items-center justify-center mb-4">
                                        <Bot className="text-green-600 dark:text-green-400" size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Get AI-Powered Budget Planning</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Let our AI analyze your preferences and create a personalized budget breakdown for your next trip.
                                    </p>
                                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                        <Calculator className="mr-2" size={20} />
                                        Calculate My Trip Budget
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Adventure vs Relaxation */}
                    {selectedCategory === 'styles' && (
                        <div className="inspiration-section space-y-8">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                    Adventure vs Relaxation
                                </h2>
                                <p className="text-xl text-muted-foreground">
                                    Discover your perfect travel style
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {Object.entries(inspirationData.travelStyles).map(([key, style]) => (
                                    <Card key={key} className="inspiration-card bg-card border-border hover:border-red-500 transition-colors">
                                        <CardHeader className="text-center pb-4">
                                            <div className="flex justify-center mb-4">
                                                {style.icon}
                                            </div>
                                            <CardTitle className="text-2xl text-card-foreground">{style.title}</CardTitle>
                                            <CardDescription className="text-muted-foreground">
                                                {style.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div>
                                                <h4 className="text-card-foreground font-medium mb-3">Popular Activities</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {style.activities.map((activity, index) => (
                                                        <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground text-xs justify-center py-1">
                                                            {activity}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-card-foreground font-medium mb-3">Top Destinations</h4>
                                                <div className="space-y-3">
                                                    {style.destinations.map((dest, index) => (
                                                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                                                            <img
                                                                src={dest.image}
                                                                alt={dest.name}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <h5 className="text-card-foreground font-medium">{dest.name}</h5>
                                                                <p className="text-muted-foreground text-sm">
                                                                    {dest.activities.slice(0, 2).join(', ')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Button className={`w-full bg-gradient-to-r ${key === 'adventure'
                                                ? 'from-red-600 to-orange-600'
                                                : 'from-blue-600 to-teal-600'
                                                }`}>
                                                <Compass className="mr-2" size={16} />
                                                Explore {style.title}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Style Quiz CTA */}
                            <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-purple-200 dark:border-purple-700/30">
                                <CardContent className="p-8 text-center">
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Not Sure Which Style Suits You?</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Take our AI-powered travel personality quiz to discover your perfect travel style.
                                    </p>
                                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                                        <Zap className="mr-2" size={20} />
                                        Take Travel Style Quiz
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Travel Types */}
                    {selectedCategory === 'types' && (
                        <div className="inspiration-section space-y-8">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                    Solo, Family & Couple Travel
                                </h2>
                                <p className="text-xl text-muted-foreground">
                                    Find inspiration for every type of journey
                                </p>
                            </div>

                            {/* Travel Type Selection */}
                            <div className="flex justify-center space-x-4 mb-8">
                                {['solo', 'family', 'couple'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedTravelType(type)}
                                        className={`px-6 py-3 rounded-lg capitalize transition-all ${selectedTravelType === type
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {type} Travel
                                    </button>
                                ))}
                            </div>

                            {/* Selected Travel Type Content */}
                            {inspirationData.travelTypes.map(travelType => (
                                travelType.type.toLowerCase().includes(selectedTravelType) && (
                                    <div key={travelType.type}>
                                        <Card className="bg-card border-border mb-8">
                                            <CardHeader className="text-center">
                                                <div className="flex justify-center mb-4">
                                                    {travelType.icon}
                                                </div>
                                                <CardTitle className="text-2xl text-card-foreground">{travelType.type}</CardTitle>
                                                <CardDescription className="text-muted-foreground text-lg">
                                                    {travelType.description}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Benefits */}
                                            <Card className="bg-card border-border">
                                                <CardHeader>
                                                    <CardTitle className="text-card-foreground flex items-center">
                                                        <Award className="mr-2 text-yellow-400" />
                                                        Benefits
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-2">
                                                        {travelType.benefits.map((benefit, index) => (
                                                            <li key={index} className="flex items-start text-muted-foreground">
                                                                <CheckCircle className="text-green-600 dark:text-green-400 mr-2 mt-1 flex-shrink-0" size={14} />
                                                                {benefit}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            {/* Tips */}
                                            <Card className="bg-card border-border">
                                                <CardHeader>
                                                    <CardTitle className="text-card-foreground flex items-center">
                                                        <Lightbulb className="mr-2 text-blue-400" />
                                                        Essential Tips
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-2">
                                                        {travelType.tips.map((tip, index) => (
                                                            <li key={index} className="flex items-start text-muted-foreground">
                                                                <Zap className="text-yellow-400 mr-2 mt-1 flex-shrink-0" size={14} />
                                                                {tip}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Destinations and Cost */}
                                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                                            <Card className="bg-card border-border">
                                                <CardHeader>
                                                    <CardTitle className="text-card-foreground flex items-center">
                                                        <MapPin className="mr-2 text-green-600 dark:text-green-400" />
                                                        Best Destinations
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-wrap gap-2">
                                                        {travelType.bestDestinations.map((destination, index) => (
                                                            <Badge key={index} variant="secondary" className="bg-green-700 text-green-300">
                                                                {destination}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-card border-border">
                                                <CardHeader>
                                                    <CardTitle className="text-card-foreground flex items-center">
                                                        <DollarSign className="mr-2 text-orange-400" />
                                                        Average Daily Cost
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold text-card-foreground mb-2">
                                                        {travelType.averageDailyCost}
                                                    </div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Per day for accommodation, food, and activities
                                                    </p>
                                                    <Button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600">
                                                        <Bot className="mr-2" size={16} />
                                                        Get Personalized Budget
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready to Turn Inspiration into Adventure?
                        </h2>
                        <p className="text-xl opacity-90">
                            Let our AI create your perfect itinerary based on the inspiration that speaks to you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
                                <Bot className="mr-2" size={20} />
                                Create AI Itinerary
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-primary">
                                <BookmarkPlus className="mr-2" size={20} />
                                Save Inspiration
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TripInspirationPage;
