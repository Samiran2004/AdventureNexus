import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Plane,
    Calendar,
    Clock,
    Users,
    Filter,
    Search,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Wifi,
    Coffee,
    Utensils,
    Luggage,
    Leaf,
    Star,
    Bell,
    Bot,
    Zap,
    DollarSign,
    Globe,
    AlertTriangle,
    CheckCircle,
    MessageSquare,
    Compass,
    BarChart3,
    Settings,
    RefreshCw,
    Heart,
    Share2,
    Download,
    Calendar as CalendarIcon,
    Plus,
    Minus
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';

gsap.registerPlugin(ScrollTrigger);

// FlightsPage component for searching and booking flights
const FlightsPage = () => {
    const navigate = useNavigate();
    const pageRef = useRef(null);
    const searchRef = useRef(null);
    const resultsRef = useRef(null);

    // Search form state
    const [searchForm, setSearchForm] = useState({
        from: '',
        to: '',
        departure: '',
        return: '',
        passengers: 1,
        class: 'economy',
        tripType: 'roundTrip'
    });

    // Flight search state
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [priceAlerts, setPriceAlerts] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [aiAssistant, setAiAssistant] = useState(false);
    const [carbonOffset, setCarbonOffset] = useState(true);

    // Filter states
    const [filters, setFilters] = useState({
        maxPrice: 1000,
        airlines: [],
        stops: 'any',
        departureTime: 'any',
        duration: 'any',
        baggage: false,
        wifi: false,
        meals: false
    });

    // Mock flight data
    const [flights] = useState([
        {
            id: 1,
            airline: 'Air India',
            logo: '🇮🇳',
            from: 'DEL',
            to: 'NYC',
            fromCity: 'New Delhi',
            toCity: 'New York',
            departure: '08:00',
            arrival: '14:30',
            duration: '15h 30m',
            stops: 1,
            stopover: 'DXB',
            price: 850,
            originalPrice: 950,
            class: 'Economy',
            aircraft: 'Boeing 777',
            amenities: ['wifi', 'meals', 'entertainment'],
            carbonFootprint: 2.1,
            baggage: '23kg',
            rating: 4.2,
            priceChange: -10.5,
            isRecommended: true,
            aiInsights: ['Best value for money', 'Preferred airline in your history']
        },
        {
            id: 2,
            airline: 'Emirates',
            logo: '🇦🇪',
            from: 'DEL',
            to: 'NYC',
            fromCity: 'New Delhi',
            toCity: 'New York',
            departure: '02:15',
            arrival: '09:45',
            duration: '16h 30m',
            stops: 1,
            stopover: 'DXB',
            price: 1200,
            originalPrice: 1200,
            class: 'Economy',
            aircraft: 'Airbus A380',
            amenities: ['wifi', 'meals', 'entertainment', 'lounge'],
            carbonFootprint: 1.8,
            baggage: '30kg',
            rating: 4.8,
            priceChange: 0,
            isRecommended: false,
            aiInsights: ['Premium experience', 'Lower carbon footprint']
        },
        {
            id: 3,
            airline: 'Lufthansa',
            logo: '🇩🇪',
            from: 'DEL',
            to: 'NYC',
            fromCity: 'New Delhi',
            toCity: 'New York',
            departure: '23:45',
            arrival: '12:15+1',
            duration: '14h 30m',
            stops: 1,
            stopover: 'FRA',
            price: 920,
            originalPrice: 920,
            class: 'Economy',
            aircraft: 'Airbus A350',
            amenities: ['wifi', 'meals', 'entertainment'],
            carbonFootprint: 1.9,
            baggage: '23kg',
            rating: 4.5,
            priceChange: +5.2,
            isRecommended: false,
            aiInsights: ['Fastest route', 'Modern aircraft']
        }
    ]);

    // AI Assistant messages
    const [chatMessages, setChatMessages] = useState([
        {
            type: 'ai',
            message: "Hi! I'm your AI flight assistant. I can help you find the best flights, predict price changes, and optimize your travel plans. What would you like to know?"
        }
    ]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Page entrance animation
            gsap.from(searchRef.current, {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });

            // Results animation
            if (showResults) {
                gsap.from(".flight-card", {
                    scrollTrigger: {
                        trigger: resultsRef.current,
                        start: "top 80%",
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out"
                });
            }
        }, pageRef);

        return () => ctx.revert();
    }, [showResults]);

    const handleSearch = () => {
        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
            setShowResults(true);
        }, 2000);
    };

    const handleFlightSelect = (flight) => {
        setSelectedFlight(flight);
    };

    const addPriceAlert = (flight) => {
        setPriceAlerts([...priceAlerts, {
            id: Date.now(),
            flight: flight.airline,
            route: `${flight.from}-${flight.to}`,
            currentPrice: flight.price,
            targetPrice: Math.floor(flight.price * 0.9)
        }]);
    };

    const getAmenityIcon = (amenity) => {
        switch (amenity) {
            case 'wifi': return <Wifi size={16} />;
            case 'meals': return <Utensils size={16} />;
            case 'entertainment': return <Star size={16} />;
            case 'lounge': return <Coffee size={16} />;
            default: return <CheckCircle size={16} />;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground" ref={pageRef}>
            <NavBar />

            {/* Hero Search Section */}
            <section className="py-20 bg-gradient-to-br from-background via-background to-background relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-primary/20 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/20 rounded-full opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center space-y-6 mb-12">
                        <Badge className="bg-primary/10 text-primary border border-primary/20">
                            ✈️ AI-Powered Flight Search
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            Find Your Perfect Flight
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> with AI</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Smart price predictions, carbon footprint tracking, and personalized recommendations powered by advanced AI.
                        </p>
                    </div>

                    {/* Advanced Search Form */}
                    <Card ref={searchRef} className="bg-card/80 border-border backdrop-blur-sm max-w-6xl mx-auto">
                        <CardContent className="p-8">
                            {/* Trip Type Selector */}
                            <div className="flex space-x-4 mb-6">
                                <Button
                                    variant={searchForm.tripType === 'roundTrip' ? 'default' : 'outline'}
                                    onClick={() => setSearchForm({ ...searchForm, tripType: 'roundTrip' })}
                                    className={searchForm.tripType === 'roundTrip' ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground" : "border-border"}
                                >
                                    Round Trip
                                </Button>
                                <Button
                                    variant={searchForm.tripType === 'oneWay' ? 'default' : 'outline'}
                                    onClick={() => setSearchForm({ ...searchForm, tripType: 'oneWay' })}
                                    className="border-border"
                                >
                                    One Way
                                </Button>
                                <Button
                                    variant={searchForm.tripType === 'multiCity' ? 'default' : 'outline'}
                                    onClick={() => setSearchForm({ ...searchForm, tripType: 'multiCity' })}
                                    className="border-border"
                                >
                                    Multi-City
                                </Button>
                            </div>

                            {/* Search Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">From</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                        <Input
                                            placeholder="Departure city"
                                            value={searchForm.from}
                                            onChange={(e) => setSearchForm({ ...searchForm, from: e.target.value })}
                                            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">To</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                        <Input
                                            placeholder="Destination city"
                                            value={searchForm.to}
                                            onChange={(e) => setSearchForm({ ...searchForm, to: e.target.value })}
                                            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Departure</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                        <Input
                                            type="date"
                                            value={searchForm.departure}
                                            onChange={(e) => setSearchForm({ ...searchForm, departure: e.target.value })}
                                            className="pl-10 bg-input border-border text-foreground"
                                        />
                                    </div>
                                </div>

                                {searchForm.tripType === 'roundTrip' && (
                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Return</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                            <Input
                                                type="date"
                                                value={searchForm.return}
                                                onChange={(e) => setSearchForm({ ...searchForm, return: e.target.value })}
                                                className="pl-10 bg-input border-border text-foreground"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Passengers and Class */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Passengers</label>
                                    <div className="flex items-center space-x-3 bg-input rounded-md border border-border">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSearchForm({ ...searchForm, passengers: Math.max(1, searchForm.passengers - 1) })}
                                            className="h-10 text-foreground hover:bg-muted"
                                        >
                                            <Minus size={16} />
                                        </Button>
                                        <span className="flex-1 text-center text-foreground">{searchForm.passengers}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSearchForm({ ...searchForm, passengers: searchForm.passengers + 1 })}
                                            className="h-10 text-foreground hover:bg-muted"
                                        >
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Class</label>
                                    <select
                                        value={searchForm.class}
                                        onChange={(e) => setSearchForm({ ...searchForm, class: e.target.value })}
                                        className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-ring focus:border-border"
                                    >
                                        <option value="economy">Economy</option>
                                        <option value="premium">Premium Economy</option>
                                        <option value="business">Business</option>
                                        <option value="first">First Class</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Advanced Options</label>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="border-border flex-1 text-foreground hover:bg-muted"
                                        >
                                            <Filter size={16} className="mr-2" />
                                            Filters
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAiAssistant(!aiAssistant)}
                                            className="border-border flex-1 text-foreground hover:bg-muted"
                                        >
                                            <Bot size={16} className="mr-2" />
                                            AI Help
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <Card className="bg-muted/50 border-border mb-6">
                                    <CardContent className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm text-muted-foreground">Max Price</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="2000"
                                                    value={filters.maxPrice}
                                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                                    className="w-full accent-primary"
                                                />
                                                <span className="text-sm text-foreground">${filters.maxPrice}</span>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm text-muted-foreground">Stops</label>
                                                <select
                                                    value={filters.stops}
                                                    onChange={(e) => setFilters({ ...filters, stops: e.target.value })}
                                                    className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground text-sm"
                                                >
                                                    <option value="any">Any</option>
                                                    <option value="direct">Direct only</option>
                                                    <option value="1stop">1 stop max</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm text-muted-foreground">Amenities</label>
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        variant={filters.wifi ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setFilters({ ...filters, wifi: !filters.wifi })}
                                                        className="text-xs"
                                                    >
                                                        <Wifi size={14} className="mr-1" />
                                                        WiFi
                                                    </Button>
                                                    <Button
                                                        variant={filters.meals ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setFilters({ ...filters, meals: !filters.meals })}
                                                        className="text-xs"
                                                    >
                                                        <Utensils size={14} className="mr-1" />
                                                        Meals
                                                    </Button>
                                                    <Button
                                                        variant={filters.baggage ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setFilters({ ...filters, baggage: !filters.baggage })}
                                                        className="text-xs"
                                                    >
                                                        <Luggage size={14} className="mr-1" />
                                                        Free Bag
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Search Button */}
                            <Button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 py-6 text-lg text-primary-foreground"
                            >
                                {isSearching ? (
                                    <>
                                        <RefreshCw className="animate-spin mr-2" size={20} />
                                        Searching with AI...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2" size={20} />
                                        Search Flights
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Flight Results */}
            {showResults && (
                <section ref={resultsRef} className="py-16 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Results Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-2">Flight Results</h2>
                                <p className="text-muted-foreground">Found {flights.length} flights • Sorted by AI recommendations</p>
                            </div>

                            {/* AI Insights */}
                            <Card className="bg-primary/10 border-primary/20 mt-4 md:mt-0">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Zap className="text-yellow-500" size={16} />
                                        <span className="text-sm font-semibold text-primary">AI Insights</span>
                                    </div>
                                    <ul className="text-xs text-primary/80 space-y-1">
                                        <li>• Prices likely to increase by 15% next week</li>
                                        <li>• Tuesday departures are 20% cheaper</li>
                                        <li>• Consider carbon offset for this route</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Flight Cards */}
                        <div className="space-y-4">
                            {flights.map((flight) => (
                                <Card
                                    key={flight.id}
                                    className={`flight-card bg-card border-border hover:border-primary transition-all cursor-pointer ${flight.isRecommended ? 'ring-2 ring-primary/50' : ''
                                        }`}
                                    onClick={() => handleFlightSelect(flight)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                                            {/* Flight Info */}
                                            <div className="flex-1 space-y-4">
                                                {/* Airline and Recommendation */}
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-2xl">{flight.logo}</span>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-card-foreground">{flight.airline}</h3>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-muted-foreground">{flight.aircraft}</span>
                                                                <div className="flex items-center">
                                                                    <Star className="text-yellow-500 mr-1" size={14} />
                                                                    <span className="text-sm text-muted-foreground">{flight.rating}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {flight.isRecommended && (
                                                        <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                                                            <Bot size={12} className="mr-1" />
                                                            AI Pick
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Route and Time */}
                                                <div className="flex items-center space-x-6">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-card-foreground">{flight.departure}</div>
                                                        <div className="text-sm text-muted-foreground">{flight.from}</div>
                                                        <div className="text-xs text-muted-foreground/80">{flight.fromCity}</div>
                                                    </div>

                                                    <div className="flex-1 relative">
                                                        <div className="flex items-center justify-center">
                                                            <div className="h-px bg-border flex-1"></div>
                                                            <div className="mx-4 text-center">
                                                                <Plane className="text-primary mb-1" size={20} />
                                                                <div className="text-xs text-muted-foreground">{flight.duration}</div>
                                                                {flight.stops > 0 && (
                                                                    <div className="text-xs text-yellow-500">{flight.stops} stop</div>
                                                                )}
                                                            </div>
                                                            <div className="h-px bg-border flex-1"></div>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-card-foreground">{flight.arrival}</div>
                                                        <div className="text-sm text-muted-foreground">{flight.to}</div>
                                                        <div className="text-xs text-muted-foreground/80">{flight.toCity}</div>
                                                    </div>
                                                </div>

                                                {/* Amenities and Details */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center space-x-1">
                                                        <Luggage size={14} />
                                                        <span>{flight.baggage}</span>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        {flight.amenities.map((amenity, idx) => (
                                                            <div key={idx} className="flex items-center space-x-1">
                                                                {getAmenityIcon(amenity)}
                                                                <span className="capitalize">{amenity}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center space-x-1">
                                                        <Leaf className="text-green-500" size={14} />
                                                        <span>{flight.carbonFootprint} tons CO₂</span>
                                                    </div>
                                                </div>

                                                {/* AI Insights */}
                                                {flight.aiInsights.length > 0 && (
                                                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <Bot className="text-primary" size={14} />
                                                            <span className="text-xs font-semibold text-primary">AI Insights</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {flight.aiInsights.map((insight, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs border-primary text-primary">
                                                                    {insight}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price and Actions */}
                                            <div className="flex lg:flex-col items-center lg:items-end space-x-4 lg:space-x-0 lg:space-y-3">
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2">
                                                        {flight.originalPrice > flight.price && (
                                                            <span className="text-sm text-muted-foreground line-through">
                                                                ${flight.originalPrice}
                                                            </span>
                                                        )}
                                                        <div className="text-3xl font-bold text-card-foreground">
                                                            ${flight.price}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-end space-x-1 mt-1">
                                                        {flight.priceChange > 0 ? (
                                                            <TrendingUp className="text-destructive" size={14} />
                                                        ) : flight.priceChange < 0 ? (
                                                            <TrendingDown className="text-green-500" size={14} />
                                                        ) : null}
                                                        <span className={`text-xs ${flight.priceChange > 0 ? 'text-destructive' :
                                                            flight.priceChange < 0 ? 'text-green-500' : 'text-muted-foreground'
                                                            }`}>
                                                            {flight.priceChange > 0 ? '+' : ''}{flight.priceChange}%
                                                        </span>
                                                    </div>

                                                    <div className="text-xs text-muted-foreground mt-1">per person</div>
                                                </div>

                                                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                                                    <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90">
                                                        Select Flight
                                                    </Button>

                                                    <div className="flex space-x-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addPriceAlert(flight);
                                                            }}
                                                            className="border-border hover:bg-muted"
                                                        >
                                                            <Bell size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-border hover:bg-muted"
                                                        >
                                                            <Heart size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-border hover:bg-muted"
                                                        >
                                                            <Share2 size={14} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="text-center mt-8">
                            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                                Load More Flights
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* AI Assistant Chat */}
            {aiAssistant && (
                <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] z-50">
                    <Card className="bg-card border-border shadow-2xl">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Bot className="text-primary" size={20} />
                                    <CardTitle className="text-lg text-card-foreground">Flight Assistant</CardTitle>
                                    <Badge className="bg-green-500/10 text-green-500">Online</Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setAiAssistant(false)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    ✕
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${msg.type === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-foreground'
                                        }`}>
                                        <p className="text-sm">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-4 border-t border-border">
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Ask about flights, prices, or travel tips..."
                                    className="bg-input border-border flex-1"
                                />
                                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                                    <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Price Alerts Sidebar */}
            {priceAlerts.length > 0 && (
                <div className="fixed top-20 right-4 w-80 z-40">
                    <Card className="bg-card border-border shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg text-card-foreground flex items-center">
                                <Bell className="mr-2 text-yellow-500" size={18} />
                                Price Alerts ({priceAlerts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {priceAlerts.map((alert) => (
                                <div key={alert.id} className="bg-muted p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium text-foreground">{alert.flight}</div>
                                            <div className="text-sm text-muted-foreground">{alert.route}</div>
                                            <div className="text-xs text-green-500">
                                                Alert when below ${alert.targetPrice}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-foreground">
                                                ${alert.currentPrice}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default FlightsPage;
