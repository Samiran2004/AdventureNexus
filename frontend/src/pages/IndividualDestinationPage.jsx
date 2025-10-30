import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Bed,
    BookOpen,
    Bot,
    Calendar,
    Camera,
    Car,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    CloudRain,
    DollarSign,
    Download,
    Eye,
    Globe,
    Heart,
    MapPin,
    Mountain,
    Phone,
    Plane,
    Share,
    Shield,
    Star,
    Sun,
    ThermometerSun,
    Users,
    Utensils,
    Wind,
    Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

// GSAP Imports
import NavBar from '@/components/NavBar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IndividualDestinationPage = () => {
    const { country, city } = useParams();
    
    // Sample destination data - in real app, fetch based on country/city params
    const [destinationData, setDestinationData] = useState({
        id: 1,
        name: 'Tokyo',
        country: 'Japan',
        continent: 'Asia',
        rating: 4.8,
        reviews: 2547,
        coordinates: { lat: 35.6762, lng: 139.6503 },
        heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
        gallery: [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
            'https://images.unsplash.com/photo-1554797589-7241bb691973?w=800',
            'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800',
            'https://images.unsplash.com/photo-1551598486-75f2d36b7b13?w=800',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
        ],
        description: 'Tokyo, Japan\'s bustling capital, seamlessly blends cutting-edge technology with traditional culture. From ancient temples to neon-lit districts, the city offers an unforgettable experience where past and future coexist in perfect harmony.',
        highlights: [
            'Cherry blossom season in spring',
            'Vibrant neighborhoods like Shibuya and Harajuku',
            'World-class cuisine and street food',
            'Historic temples and modern architecture',
            'Efficient public transportation system'
        ],
        bestTimeToVisit: {
            optimal: 'March - May & September - November',
            seasons: {
                spring: {
                    months: 'March - May',
                    description: 'Cherry blossoms bloom, mild temperatures, perfect for outdoor activities',
                    temperature: '10-20°C',
                    rainfall: 'Moderate',
                    crowdLevel: 'High',
                    pros: ['Cherry blossoms', 'Pleasant weather', 'Many festivals'],
                    cons: ['Crowded', 'Higher prices', 'Rainy season starts in May']
                },
                summer: {
                    months: 'June - August',
                    description: 'Hot and humid with occasional typhoons, but many festivals',
                    temperature: '25-35°C',
                    rainfall: 'High',
                    crowdLevel: 'Medium',
                    pros: ['Summer festivals', 'Longer daylight', 'Beach nearby'],
                    cons: ['Very hot', 'Humid', 'Typhoon season']
                },
                autumn: {
                    months: 'September - November',
                    description: 'Comfortable weather with beautiful fall foliage',
                    temperature: '15-25°C',
                    rainfall: 'Low',
                    crowdLevel: 'Medium',
                    pros: ['Fall colors', 'Comfortable weather', 'Clear skies'],
                    cons: ['Can be busy on weekends', 'Shorter days']
                },
                winter: {
                    months: 'December - February',
                    description: 'Cold but clear skies, fewer crowds, illuminations',
                    temperature: '0-10°C',
                    rainfall: 'Low',
                    crowdLevel: 'Low',
                    pros: ['Winter illuminations', 'Fewer crowds', 'Clear weather'],
                    cons: ['Cold temperatures', 'Some attractions closed']
                }
            }
        },
        weather: {
            current: {
                temperature: 22,
                condition: 'Partly Cloudy',
                humidity: 65,
                windSpeed: 12,
                uvIndex: 6,
                visibility: 10
            },
            forecast: [
                { day: 'Mon', high: 24, low: 18, condition: 'Sunny', icon: '☀️' },
                { day: 'Tue', high: 26, low: 20, condition: 'Partly Cloudy', icon: '⛅' },
                { day: 'Wed', high: 23, low: 17, condition: 'Rainy', icon: '🌧️' },
                { day: 'Thu', high: 25, low: 19, condition: 'Sunny', icon: '☀️' },
                { day: 'Fri', high: 27, low: 21, condition: 'Partly Cloudy', icon: '⛅' },
                { day: 'Sat', high: 24, low: 18, condition: 'Cloudy', icon: '☁️' },
                { day: 'Sun', high: 22, low: 16, condition: 'Rainy', icon: '🌧️' }
            ]
        },
        hiddenGems: [
            {
                name: 'Golden Gai',
                description: 'Tiny bar district with over 200 micro-bars in a maze of narrow alleys',
                image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
                location: 'Shinjuku',
                type: 'Nightlife',
                difficulty: 'Easy',
                timeToSpend: '2-3 hours',
                bestTime: 'Evening',
                tips: ['Bring cash', 'Be respectful of bar owners', 'Start early to bar hop']
            },
            {
                name: 'Todoroki Valley',
                description: 'Hidden gorge in urban Tokyo offering peaceful nature walks',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                location: 'Setagaya',
                type: 'Nature',
                difficulty: 'Easy',
                timeToSpend: '1-2 hours',
                bestTime: 'Morning',
                tips: ['Wear comfortable shoes', 'Visit the nearby temple', 'Perfect for photos']
            },
            {
                name: 'Omoide Yokocho',
                description: 'Memory Lane filled with tiny yakitori stalls and traditional atmosphere',
                image: 'https://images.unsplash.com/photo-1578219635112-5eb5d4b32d8c?w=400',
                location: 'Shinjuku',
                type: 'Food & Culture',
                difficulty: 'Easy',
                timeToSpend: '1-2 hours',
                bestTime: 'Evening',
                tips: ['Try yakitori', 'Practice basic Japanese', 'Cash only']
            },
            {
                name: 'Nezu Shrine',
                description: 'Beautiful shrine with thousands of torii gates and azalea garden',
                image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400',
                location: 'Bunkyo',
                type: 'Cultural',
                difficulty: 'Easy',
                timeToSpend: '45 minutes',
                bestTime: 'Morning',
                tips: ['Best in April/May for flowers', 'Quiet alternative to Fushimi Inari', 'Free entrance']
            }
        ],
        sampleItineraries: [
            {
                title: '3-Day Tokyo Highlights',
                duration: '3 days',
                type: 'First Timer',
                difficulty: 'Easy',
                estimatedCost: 450,
                description: 'Perfect introduction to Tokyo covering major attractions and experiences',
                days: [
                    {
                        day: 1,
                        title: 'Traditional Tokyo',
                        activities: [
                            {
                                time: '9:00 AM',
                                activity: 'Senso-ji Temple',
                                duration: '2 hours',
                                cost: 0,
                                description: 'Explore Tokyo\'s oldest temple and traditional Nakamise shopping street'
                            },
                            {
                                time: '12:00 PM',
                                activity: 'Traditional Lunch in Asakusa',
                                duration: '1 hour',
                                cost: 25,
                                description: 'Try tempura or traditional Japanese set meal'
                            },
                            {
                                time: '2:00 PM',
                                activity: 'Imperial Palace East Gardens',
                                duration: '2 hours',
                                cost: 0,
                                description: 'Beautiful gardens with cherry blossoms (seasonal)'
                            },
                            {
                                time: '5:00 PM',
                                activity: 'Ginza District',
                                duration: '2 hours',
                                cost: 30,
                                description: 'Upscale shopping and dining district'
                            }
                        ]
                    },
                    {
                        day: 2,
                        title: 'Modern Tokyo',
                        activities: [
                            {
                                time: '9:00 AM',
                                activity: 'Shibuya Crossing & Hachiko Statue',
                                duration: '1 hour',
                                cost: 0,
                                description: 'Experience the world\'s busiest pedestrian crossing'
                            },
                            {
                                time: '11:00 AM',
                                activity: 'Meiji Shrine',
                                duration: '2 hours',
                                cost: 0,
                                description: 'Peaceful shrine dedicated to Emperor Meiji'
                            },
                            {
                                time: '2:00 PM',
                                activity: 'Harajuku & Takeshita Street',
                                duration: '2 hours',
                                cost: 40,
                                description: 'Youth culture and quirky fashion street'
                            },
                            {
                                time: '5:00 PM',
                                activity: 'Tokyo Skytree',
                                duration: '2 hours',
                                cost: 25,
                                description: 'Panoramic city views from 634m tower'
                            }
                        ]
                    },
                    {
                        day: 3,
                        title: 'Food & Culture',
                        activities: [
                            {
                                time: '6:00 AM',
                                activity: 'Tsukiji Outer Market',
                                duration: '2 hours',
                                cost: 30,
                                description: 'Fresh sushi breakfast and market exploration'
                            },
                            {
                                time: '10:00 AM',
                                activity: 'teamLab Borderless',
                                duration: '3 hours',
                                cost: 35,
                                description: 'Digital art museum with interactive exhibits'
                            },
                            {
                                time: '3:00 PM',
                                activity: 'Traditional Tea Ceremony',
                                duration: '1.5 hours',
                                cost: 45,
                                description: 'Learn about Japanese tea culture'
                            },
                            {
                                time: '6:00 PM',
                                activity: 'Shinjuku Nightlife',
                                duration: '3 hours',
                                cost: 60,
                                description: 'Experience Tokyo\'s vibrant nightlife scene'
                            }
                        ]
                    }
                ]
            },
            {
                title: '5-Day Deep Dive',
                duration: '5 days',
                type: 'Explorer',
                difficulty: 'Moderate',
                estimatedCost: 780,
                description: 'Comprehensive Tokyo experience including day trips and local neighborhoods'
            },
            {
                title: '7-Day Local Experience',
                duration: '7 days',
                type: 'Culture Immersion',
                difficulty: 'Moderate',
                estimatedCost: 1100,
                description: 'Live like a local with neighborhood exploration and authentic experiences'
            }
        ],
        costEstimate: {
            budget: {
                title: 'Budget Travel',
                dailyCost: 50,
                accommodation: 25,
                food: 15,
                transportation: 8,
                activities: 2,
                description: 'Hostels, street food, public transport, free attractions'
            },
            mid: {
                title: 'Mid-Range',
                dailyCost: 120,
                accommodation: 60,
                food: 35,
                transportation: 15,
                activities: 10,
                description: 'Business hotels, mix of restaurants, some paid attractions'
            },
            luxury: {
                title: 'Luxury',
                dailyCost: 300,
                accommodation: 180,
                food: 80,
                transportation: 25,
                activities: 15,
                description: 'High-end hotels, fine dining, private tours, premium experiences'
            }
        },
        practicalInfo: {
            language: 'Japanese',
            currency: 'Japanese Yen (¥)',
            timeZone: 'JST (UTC+9)',
            electricity: '100V, Type A/B plugs',
            emergency: '110 (Police), 119 (Fire/Ambulance)',
            internet: 'Excellent WiFi coverage',
            tipping: 'Not customary',
            dressCode: 'Modest, remove shoes indoors'
        },
        transportation: {
            airport: 'Narita (NRT) or Haneda (HND)',
            publicTransport: 'Excellent subway and train system',
            averageCost: '$15-25/day for transport pass',
            tips: ['Get a JR Pass for tourists', 'Download Google Translate', 'Keep cash handy']
        }
    });

    // State management
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedItinerary, setSelectedItinerary] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    // Refs for animations
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero animation
            gsap.from(heroRef.current, {
                opacity: 0,
                scale: 1.1,
                duration: 1.5,
                ease: "power2.out"
            });

            // Content animation
            gsap.from(".content-section", {
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
        });

        return () => ctx.revert();
    }, []);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % destinationData.gallery.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + destinationData.gallery.length) % destinationData.gallery.length);
    };

    const WeatherCard = ({ weather }) => (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                    <ThermometerSun className="mr-2 text-orange-400" size={20} />
                    Current Weather
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-3xl font-bold text-white">{weather.current.temperature}°C</div>
                        <div className="text-gray-400">{weather.current.condition}</div>
                    </div>
                    <div className="text-4xl">⛅</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-400">
                        <Wind className="mr-2" size={14} />
                        {weather.current.windSpeed} km/h
                    </div>
                    <div className="flex items-center text-gray-400">
                        <Eye className="mr-2" size={14} />
                        {weather.current.visibility} km
                    </div>
                    <div className="flex items-center text-gray-400">
                        <CloudRain className="mr-2" size={14} />
                        {weather.current.humidity}% humidity
                    </div>
                    <div className="flex items-center text-gray-400">
                        <Sun className="mr-2" size={14} />
                        UV {weather.current.uvIndex}
                    </div>
                </div>
                
                {/* 7-Day Forecast */}
                <div className="mt-6">
                    <h4 className="text-white font-medium mb-3">7-Day Forecast</h4>
                    <div className="space-y-2">
                        {weather.forecast.map((day, index) => (
                            <div key={index} className="flex items-center justify-between py-1">
                                <span className="text-gray-400 w-10">{day.day}</span>
                                <span className="text-lg">{day.icon}</span>
                                <span className="text-gray-300 text-sm flex-1 ml-2">{day.condition}</span>
                                <span className="text-white font-medium">
                                    {day.high}° / {day.low}°
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const CostBreakdown = ({ costs }) => (
        <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(costs).map(([key, cost]) => (
                <Card key={key} className={`bg-gray-800 border-gray-700 ${key === 'mid' ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center justify-between">
                            {cost.title}
                            {key === 'mid' && <Badge className="bg-blue-600">Most Popular</Badge>}
                        </CardTitle>
                        <div className="text-2xl font-bold text-white">
                            ${cost.dailyCost}
                            <span className="text-sm text-gray-400 font-normal">/day</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-gray-400 text-sm">{cost.description}</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 flex items-center">
                                    <Bed className="mr-2" size={14} />
                                    Accommodation
                                </span>
                                <span className="text-white">${cost.accommodation}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 flex items-center">
                                    <Utensils className="mr-2" size={14} />
                                    Food
                                </span>
                                <span className="text-white">${cost.food}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 flex items-center">
                                    <Car className="mr-2" size={14} />
                                    Transport
                                </span>
                                <span className="text-white">${cost.transportation}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 flex items-center">
                                    <Camera className="mr-2" size={14} />
                                    Activities
                                </span>
                                <span className="text-white">${cost.activities}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <NavBar />

            {/* Hero Section with Image Gallery */}
            <section className="relative h-screen overflow-hidden">
                <div ref={heroRef} className="absolute inset-0">
                    <img
                        src={destinationData.gallery[currentImageIndex]}
                        alt={destinationData.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all z-10"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all z-10"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {destinationData.gallery.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-end z-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                        <div className="max-w-4xl">
                            <div className="flex items-center space-x-4 mb-4">
                                <Badge className="bg-blue-600 text-white">
                                    <Bot size={12} className="mr-1" />
                                    AI Recommended
                                </Badge>
                                <div className="flex items-center text-yellow-400">
                                    <Star size={16} className="fill-current mr-1" />
                                    <span className="text-white font-medium">{destinationData.rating}</span>
                                    <span className="text-gray-300 ml-1">({destinationData.reviews} reviews)</span>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {destinationData.name}
                            </h1>
                            <p className="text-xl text-gray-300 mb-6 flex items-center">
                                <MapPin className="mr-2" size={20} />
                                {destinationData.country}, {destinationData.continent}
                            </p>
                            <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
                                {destinationData.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <Button 
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    <Plane className="mr-2" size={20} />
                                    Plan Your Trip
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-black"
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    <Heart className={`mr-2 ${isFavorite ? 'fill-current text-red-500' : ''}`} size={20} />
                                    {isFavorite ? 'Saved' : 'Save'}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-black"
                                >
                                    <Share className="mr-2" size={20} />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section ref={contentRef} className="py-16 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Overview */}
                            <div className="content-section">
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white text-2xl">Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-3">Why Visit {destinationData.name}?</h3>
                                            <p className="text-gray-300 leading-relaxed mb-4">
                                                {destinationData.description}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-md font-semibold text-white mb-3">Top Highlights</h4>
                                            <div className="grid md:grid-cols-2 gap-2">
                                                {destinationData.highlights.map((highlight, index) => (
                                                    <div key={index} className="flex items-start">
                                                        <CheckCircle className="text-green-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                                        <span className="text-gray-300 text-sm">{highlight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Best Time to Visit */}
                            <div className="content-section">
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white text-2xl flex items-center">
                                            <Calendar className="mr-2 text-blue-400" />
                                            Best Time to Visit
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Optimal time: <span className="text-blue-400 font-medium">{destinationData.bestTimeToVisit.optimal}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {Object.entries(destinationData.bestTimeToVisit.seasons).map(([season, data]) => (
                                                <div key={season} className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-lg font-semibold text-white capitalize">{season}</h4>
                                                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                                            {data.months}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{data.description}</p>
                                                    
                                                    <div className="grid grid-cols-3 gap-4 text-xs">
                                                        <div>
                                                            <span className="text-gray-400">Temperature</span>
                                                            <p className="text-white font-medium">{data.temperature}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400">Rainfall</span>
                                                            <p className="text-white font-medium">{data.rainfall}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400">Crowds</span>
                                                            <p className="text-white font-medium">{data.crowdLevel}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="text-green-400 text-xs font-medium">Pros:</span>
                                                            <ul className="text-xs text-gray-300 ml-2">
                                                                {data.pros.map((pro, index) => (
                                                                    <li key={index}>• {pro}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <span className="text-red-400 text-xs font-medium">Cons:</span>
                                                            <ul className="text-xs text-gray-300 ml-2">
                                                                {data.cons.map((con, index) => (
                                                                    <li key={index}>• {con}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Hidden Gems */}
                            <div className="content-section">
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white text-2xl flex items-center">
                                            <Eye className="mr-2 text-purple-400" />
                                            Hidden Gems
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Discover secret spots only locals know about
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {destinationData.hiddenGems.map((gem, index) => (
                                                <div key={index} className="space-y-3">
                                                    <img 
                                                        src={gem.image} 
                                                        alt={gem.name}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-lg font-semibold text-white">{gem.name}</h4>
                                                            <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                                                                {gem.type}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-gray-300 text-sm mb-3">{gem.description}</p>
                                                        
                                                        <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                                                            <div>
                                                                <span className="text-gray-400">Location:</span>
                                                                <p className="text-white">{gem.location}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Time needed:</span>
                                                                <p className="text-white">{gem.timeToSpend}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Best time:</span>
                                                                <p className="text-white">{gem.bestTime}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Difficulty:</span>
                                                                <p className="text-white">{gem.difficulty}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <span className="text-yellow-400 text-xs font-medium">Local Tips:</span>
                                                            <ul className="text-xs text-gray-300 mt-1">
                                                                {gem.tips.map((tip, tipIndex) => (
                                                                    <li key={tipIndex} className="flex items-start">
                                                                        <Zap className="mr-1 mt-0.5 flex-shrink-0 text-yellow-400" size={10} />
                                                                        {tip}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sample Itineraries */}
                            <div className="content-section">
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white text-2xl flex items-center">
                                            <BookOpen className="mr-2 text-green-400" />
                                            Sample Itineraries
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Curated itineraries for different travel styles and durations
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Itinerary Selection */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {destinationData.sampleItineraries.map((itinerary, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedItinerary(index)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                        selectedItinerary === index
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {itinerary.title}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Selected Itinerary Details */}
                                        {destinationData.sampleItineraries[selectedItinerary] && (
                                            <div className="space-y-6">
                                                <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-800 rounded-lg">
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 text-blue-400" size={16} />
                                                        <span className="text-white font-medium">
                                                            {destinationData.sampleItineraries[selectedItinerary].duration}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="mr-2 text-green-400" size={16} />
                                                        <span className="text-white font-medium">
                                                            {destinationData.sampleItineraries[selectedItinerary].type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Mountain className="mr-2 text-orange-400" size={16} />
                                                        <span className="text-white font-medium">
                                                            {destinationData.sampleItineraries[selectedItinerary].difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <DollarSign className="mr-2 text-yellow-400" size={16} />
                                                        <span className="text-white font-medium">
                                                            ${destinationData.sampleItineraries[selectedItinerary].estimatedCost}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-300">
                                                    {destinationData.sampleItineraries[selectedItinerary].description}
                                                </p>

                                                {/* Daily Breakdown (only for detailed itinerary) */}
                                                {destinationData.sampleItineraries[selectedItinerary].days && (
                                                    <div className="space-y-6">
                                                        {destinationData.sampleItineraries[selectedItinerary].days.map((day) => (
                                                            <div key={day.day} className="bg-gray-800 rounded-lg p-4">
                                                                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                                                        {day.day}
                                                                    </div>
                                                                    {day.title}
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {day.activities.map((activity, actIndex) => (
                                                                        <div key={actIndex} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                                                                            <div className="text-blue-400 font-medium text-sm min-w-fit">
                                                                                {activity.time}
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center justify-between mb-1">
                                                                                    <h5 className="text-white font-medium">{activity.activity}</h5>
                                                                                    <div className="flex items-center space-x-2 text-sm">
                                                                                        <span className="text-gray-400">{activity.duration}</span>
                                                                                        <Badge variant="secondary" className="bg-green-700 text-green-300">
                                                                                            ${activity.cost}
                                                                                        </Badge>
                                                                                    </div>
                                                                                </div>
                                                                                <p className="text-gray-300 text-sm">{activity.description}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex gap-3">
                                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                                                        <Download className="mr-2" size={16} />
                                                        Download Itinerary
                                                    </Button>
                                                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-white">
                                                        <Bot className="mr-2" size={16} />
                                                        Customize with AI
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Cost Estimates */}
                            <div className="content-section">
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white text-2xl flex items-center">
                                            <DollarSign className="mr-2 text-green-400" />
                                            Cost Estimates
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Daily budget breakdown for different travel styles
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <CostBreakdown costs={destinationData.costEstimate} />
                                        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                                            <div className="flex items-start space-x-3">
                                                <Bot className="text-blue-400 mt-1" size={20} />
                                                <div>
                                                    <h4 className="text-white font-medium mb-1">Get Personalized Cost Estimate</h4>
                                                    <p className="text-gray-300 text-sm mb-3">
                                                        Our AI can provide more accurate cost estimates based on your preferences, travel dates, and group size.
                                                    </p>
                                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                        Get AI Estimate
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Weather Widget */}
                            <WeatherCard weather={destinationData.weather} />

                            {/* Quick Facts */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-white flex items-center">
                                        <Globe className="mr-2 text-green-400" size={20} />
                                        Quick Facts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {Object.entries(destinationData.practicalInfo).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center py-1">
                                            <span className="text-gray-400 capitalize text-sm">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </span>
                                            <span className="text-white text-sm font-medium text-right flex-1 ml-2">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Transportation */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-white flex items-center">
                                        <Plane className="mr-2 text-blue-400" size={20} />
                                        Getting There
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <span className="text-gray-400 text-sm">Airport:</span>
                                        <p className="text-white text-sm">{destinationData.transportation.airport}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Public Transport:</span>
                                        <p className="text-white text-sm">{destinationData.transportation.publicTransport}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Average Cost:</span>
                                        <p className="text-white text-sm">{destinationData.transportation.averageCost}</p>
                                    </div>
                                    <div>
                                        <span className="text-yellow-400 text-sm font-medium">Tips:</span>
                                        <ul className="text-sm text-gray-300 mt-1 space-y-1">
                                            {destinationData.transportation.tips.map((tip, index) => (
                                                <li key={index} className="flex items-start">
                                                    <Zap className="mr-1 mt-0.5 flex-shrink-0 text-yellow-400" size={10} />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-white">Plan Your Trip</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                                        <Bot className="mr-2" size={16} />
                                        Create AI Itinerary
                                    </Button>
                                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-white">
                                        <Plane className="mr-2" size={16} />
                                        Find Flights
                                    </Button>
                                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-white">
                                        <Bed className="mr-2" size={16} />
                                        Book Hotels
                                    </Button>
                                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-white">
                                        <Phone className="mr-2" size={16} />
                                        Contact Expert
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Emergency Contacts */}
                            <Card className="bg-red-900/20 border-red-700/30">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-white flex items-center">
                                        <Shield className="mr-2 text-red-400" size={20} />
                                        Emergency Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="text-sm">
                                        <span className="text-gray-400">Emergency:</span>
                                        <p className="text-white font-medium">{destinationData.practicalInfo.emergency}</p>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-400">Tourist Helpline:</span>
                                        <p className="text-white font-medium">+81-3-3201-3331</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                                        <Download className="mr-2" size={14} />
                                        Download Emergency Guide
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready to Experience {destinationData.name}?
                        </h2>
                        <p className="text-xl opacity-90">
                            Let our AI create your perfect {destinationData.name} adventure based on your preferences and budget.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-50">
                                <Bot className="mr-2" size={20} />
                                Create AI Itinerary
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-blue-600">
                                <Plane className="mr-2" size={20} />
                                Book Trip Now
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default IndividualDestinationPage;
