import Footer from "@/components/mvpblocks/footer-newsletter";
import NavBar from "@/components/NavBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import {
  Bot,
  Calendar,
  CalendarDays,
  ChevronDown,
  Clock,
  Heart,
  Hotel,
  IndianRupee,
  Info,
  Lightbulb,
  MapPin,
  MapPinned,
  Plane,
  Search,
  Share,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Utensils,
  X
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react"


// SearchPage component allows users to search for trips using AI-powered criteria
const SearchPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [budgetRange, setBudgetRange] = useState([1000, 5000]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


  const handleActivityToggle = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleViewDetails = (result) => {
    setSelectedDestination(result);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDestination(null), 300);
  };


  // Sample search results data - Updated to match API structure
  const sampleSearchResults = [
    {
      ai_score: "98%",
      image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      name: "Bali, Indonesia",
      days: 7,
      cost: 85000,
      star: 4.8,
      total_reviews: 124,
      destination_overview: "Experience pristine beaches, ancient temples, and vibrant culture in this tropical paradise.",
      perfect_for: ["Beach", "Culture", "Wellness", "Adventure"],
      budget_breakdown: {
        flights: "Approx 60% of budget",
        accommodation: "Approx 20% of budget",
        food: "Approx 10% of budget",
        activities: "Approx 10% of budget"
      },
      trip_highlights: [
        { name: "Surfing", description: "World-class waves at Uluwatu and Canggu", match_reason: "Perfect for adventure seekers" },
        { name: "Temples", description: "Ancient sacred sites like Tanah Lot", match_reason: "Cultural immersion" },
        { name: "Yoga", description: "Wellness retreats in Ubud", match_reason: "Relaxation and rejuvenation" }
      ],
      suggested_itinerary: [
        { day: 1, morning: "Arrive in Bali, check-in", afternoon: "Beach relaxation", evening: "Sunset at Tanah Lot" },
        { day: 2, morning: "Surfing lessons", afternoon: "Temple visit", evening: "Traditional dance show" },
        { day: 3, morning: "Yoga session", afternoon: "Rice terrace tour", evening: "Spa treatment" }
      ],
      local_tips: [
        "Best time to visit is April-October (dry season)",
        "Rent a scooter for easy transportation",
        "Try local warungs for authentic Indonesian food"
      ],
      activities: ["Surfing", "Yoga", "Temples"]
    },
    {
      ai_score: "96%",
      image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      name: "Kyoto, Japan",
      days: 10,
      cost: 180000,
      star: 4.9,
      total_reviews: 89,
      destination_overview: "Immerse yourself in traditional Japanese culture with stunning temples and gardens.",
      perfect_for: ["History", "Nature", "Food", "Culture"],
      budget_breakdown: {
        flights: "Approx 50% of budget",
        accommodation: "Approx 25% of budget",
        food: "Approx 15% of budget",
        activities: "Approx 10% of budget"
      },
      trip_highlights: [
        { name: "Fushimi Inari", description: "Thousand torii gates", match_reason: "Iconic experience" },
        { name: "Tea Ceremony", description: "Traditional ritual", match_reason: "Cultural depth" },
        { name: "Arashiyama Bamboo", description: "Enchanting bamboo grove", match_reason: "Natural beauty" }
      ],
      suggested_itinerary: [
        { day: 1, morning: "Arrive Kyoto", afternoon: "Gion district walk", evening: "Kaiseki dinner" },
        { day: 2, morning: "Fushimi Inari hike", afternoon: "Nishiki Market", evening: "Pontocho alley" }
      ],
      local_tips: [
        "Purchase a JR Pass before arrival",
        "Spring (cherry blossoms) and autumn are peak seasons",
        "Reserve restaurants in advance"
      ],
      activities: ["Temples", "Tea Ceremony", "Hiking"]
    },
    {
      ai_score: "94%",
      image_url: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80",
      name: "Reykjavik, Iceland",
      days: 5,
      cost: 135000,
      star: 4.7,
      total_reviews: 56,
      destination_overview: "Witness breathtaking natural wonders from northern lights to glaciers.",
      perfect_for: ["Nature", "Adventure", "Photography"],
      budget_breakdown: {
        flights: "Approx 55% of budget",
        accommodation: "Approx 20% of budget",
        food: "Approx 15% of budget",
        activities: "Approx 10% of budget"
      },
      trip_highlights: [
        { name: "Northern Lights", description: "Aurora viewing tours", match_reason: "Once-in-lifetime experience" },
        { name: "Blue Lagoon", description: "Geothermal spa", match_reason: "Relaxation in nature" },
        { name: "Golden Circle", description: "Geysers and waterfalls", match_reason: "Scenic road trip" }
      ],
      suggested_itinerary: [
        { day: 1, morning: "Arrive Reykjavik", afternoon: "City tour", evening: "Northern lights hunt" },
        { day: 2, morning: "Golden Circle tour", afternoon: "Geyser viewing", evening: "Hot spring soak" }
      ],
      local_tips: [
        "September-March best for Northern Lights",
        "Rent a 4WD vehicle for Ring Road",
        "Groceries are expensive, stock up in Reykjavik"
      ],
      activities: ["Northern Lights", "Glaciers", "Geysers"]
    }
  ];


  // Initialize state with sample data - Now as an array
  const [searchResults, setSearchResults] = useState(sampleSearchResults);
  const [isLoading, setIsLoading] = useState(false);
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [budget, setBudget] = useState("mid");
  const { getToken } = useAuth();



  const handleSearchResult = async () => {
    if (!to || !from || !fromDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);

      const token = await getToken();

      const payload = {
        to,
        from,
        date: fromDate,
        travelers: Number(travelers),
        budget: 250000,
        budget_range: budget,
      };

      const response = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/plans/search/destination`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSearchResults([response.data.data]);
      toast.success("Plan generated successfully");
      setIsLoading(false);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to generate plan");
      setIsLoading(false);
    }
  };



  const activities = [
    "Adventure",
    "Culture",
    "Food",
    "Beach",
    "Nature",
    "Photography",
    "Romance",
    "Wellness",
    "Shopping",
    "Nightlife",
    "History",
    "Art",
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Navbar with padding for fixed positioning */}
      <NavBar />
      <div className="h-6"></div>


      {/* Search Header */}
      <section className="py-8 bg-gradient-to-br from-background via-background to-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Find Your Perfect
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {" "}
                  Adventure
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Let AI curate personalized travel experiences just for you
              </p>
            </div>


            {/* Search Form */}
            <Card className="bg-card/80 border-border backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  {/* where to */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="destination"
                      className="text-foreground text-sm font-medium"
                    >
                      Where to?
                    </Label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-3 text-muted-foreground"
                        size={19}
                      />
                      <Input
                        id="destination"
                        placeholder="Enter destination"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="pl-10 bg-input border-input text-foreground placeholder-muted-foreground focus:border-primary"
                      />
                    </div>
                  </div>


                  {/* Where from */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="from-destination"
                      className="text-foreground text-sm font-medium"
                    >
                      Where from?
                    </Label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-3 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="from-destination"
                        placeholder="Enter origin"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="pl-10 bg-input border-input text-foreground placeholder-muted-foreground focus:border-primary"
                      />
                    </div>
                  </div>


                  {/* From Date */}
                  <div className="space-y-2">
                    <Label htmlFor="dates" className="text-foreground text-sm font-medium">
                      From
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-muted-foreground pointer-events-none" size={18} />
                      <Input
                        id="dates"
                        type="date"
                        className="pl-10 bg-input border-input text-foreground placeholder-muted-foreground focus:border-primary cursor-pointer"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>


                  {/* To Date */}
                  <div className="space-y-2">
                    <Label htmlFor="dates-to" className="text-foreground text-sm font-medium">
                      To
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-muted-foreground pointer-events-none" size={18} />
                      <Input
                        id="dates-to"
                        type="date"
                        className="pl-10 bg-input border-input text-foreground placeholder-muted-foreground focus:border-primary cursor-pointer"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        min={fromDate}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>
                </div>


                {/* Select total travelers */}
                <div className="space-y-2 mb-4">
                  <Label
                    htmlFor="travelers"
                    className="text-foreground text-sm font-medium"
                  >
                    Travelers
                  </Label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-3 text-muted-foreground"
                      size={18}
                    />
                    <Select value={travelers} onValueChange={(value) => setTravelers(value)}>
                      <SelectTrigger className="pl-10 bg-input border-input text-foreground cursor-pointer">
                        <SelectValue placeholder="2 travelers" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border cursor-pointer">
                        <SelectItem value="1" className="cursor-pointer">1 traveler</SelectItem>
                        <SelectItem value="2" className="cursor-pointer">2 travelers</SelectItem>
                        <SelectItem value="3" className="cursor-pointer">3 travelers</SelectItem>
                        <SelectItem value="4" className="cursor-pointer">4+ travelers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>


                {/* Select Budget */}
                <div className="space-y-2 mb-4">
                  <Label className="text-foreground text-sm font-medium">
                    Budget Range
                  </Label>
                  <div className="relative">
                    <IndianRupee
                      className="absolute left-3 top-3 text-muted-foreground"
                      size={18}
                    />
                    <Select value={budget} onValueChange={(value) => setBudget(value)}>
                      <SelectTrigger className="pl-10 bg-input border-input text-foreground cursor-pointer">
                        <SelectValue placeholder="Any budget range" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border cursor-pointer">
                        <SelectItem value="budget" className="cursor-pointer">
                          Budget (₹5000-₹15000)
                        </SelectItem>
                        <SelectItem value="mid" className="cursor-pointer">
                          Mid-range (₹15000-₹30000)
                        </SelectItem>
                        <SelectItem value="luxury" className="cursor-pointer">
                          Luxury (₹30000+)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>


                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 cursor-pointer"
                    size="lg"
                    onClick={() => handleSearchResult()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 size-5 text-primary-foreground animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2" size={20} />
                        Search with AI
                        <Sparkles className="ml-2" size={16} />
                      </>
                    )}
                  </Button>


                  <Button
                    variant="outline"
                    className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="mr-2" size={18} />
                    Filters
                    <ChevronDown
                      className={`ml-2 transition-transform ${showFilters ? "rotate-180" : ""
                        }`}
                      size={16}
                    />
                  </Button>
                </div>


                {/* Advanced Filters */}
                {showFilters && (
                  <div className="mt-6 pt-6 border-t border-border cursor-pointer">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-foreground font-semibold">
                          Budget Range
                        </h3>
                        <div className="px-2">
                          <Slider
                            value={budgetRange}
                            onValueChange={setBudgetRange}
                            max={10000}
                            min={500}
                            step={100}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>${budgetRange[0]}</span>
                            <span>${budgetRange[1]}</span>
                          </div>
                        </div>
                      </div>


                      <div className="space-y-4">
                        <h3 className="text-foreground font-semibold">Activities</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {activities.slice(0, 6).map((activity) => (
                            <div
                              key={activity}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={activity}
                                checked={selectedActivities.includes(activity)}
                                onCheckedChange={() =>
                                  handleActivityToggle(activity)
                                }
                                className="border-input"
                              />
                              <Label
                                htmlFor={activity}
                                className="text-sm text-muted-foreground"
                              >
                                {activity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>


                      <div className="space-y-4">
                        <h3 className="text-foreground font-semibold">
                          Travel Style
                        </h3>
                        <div className="space-y-2">
                          {[
                            "Solo Travel",
                            "Family Friendly",
                            "Romantic",
                            "Group Travel",
                          ].map((style) => (
                            <div
                              key={style}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={style}
                                className="border-input"
                              />
                              <Label
                                htmlFor={style}
                                className="text-sm text-muted-foreground"
                              >
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
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                AI-Curated Travel Plans
              </h2>
              <p className="text-muted-foreground">
                Found {searchResults?.length || 0} personalized adventures • Powered by AI
              </p>
            </div>


            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-input border-input text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="recommended">AI Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner className="size-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground text-lg">Finding your perfect adventure...</p>
            </div>
          )}


          {/* Empty State */}
          {!isLoading && (!searchResults || searchResults.length === 0) && (
            <div className="text-center py-20">
              <div className="text-muted-foreground mb-4">
                <Search size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">No results found</p>
                <p className="text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            </div>
          )}


          {/* Search Results Grid */}
          {!isLoading && searchResults && searchResults.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result, index) => (
                <Card
                  key={index}
                  className="result-card bg-card border-border hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={result.image_url}
                        alt={result.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                        }}
                        loading="lazy"
                      />


                      {/* AI Score Badge */}
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                        <Bot className="mr-1" size={12} />
                        AI Score: {result.ai_score}
                      </Badge>


                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-background/90 hover:bg-background"
                        >
                          <Heart size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-background/90 hover:bg-background"
                        >
                          <Share size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>


                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-card-foreground mb-1">
                            {result.name}
                          </h3>
                          <p className="text-muted-foreground text-sm flex items-center">
                            <Clock className="mr-1" size={14} />
                            {result.days} {result.days === 1 ? 'Day' : 'Days'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-card-foreground">
                            ₹{result.cost?.toLocaleString() || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">per person</div>
                        </div>
                      </div>


                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={
                                i < Math.floor(result.star)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-card-foreground font-semibold">
                          {result.star}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({result.total_reviews} reviews)
                        </span>
                      </div>


                      {/* Destination Overview */}
                      {result.destination_overview && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {result.destination_overview}
                        </p>
                      )}


                      {/* Trip Highlights */}
                      {result.trip_highlights && result.trip_highlights.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-card-foreground font-medium text-sm">
                            Trip Highlights:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {result.trip_highlights.slice(0, 3).map((highlight, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-muted text-muted-foreground text-xs"
                              >
                                {highlight.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* Perfect For / Activities */}
                      {(result.perfect_for || result.activities) && (
                        <div className="space-y-2">
                          <h4 className="text-card-foreground font-medium text-sm">
                            Perfect for:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {(result.perfect_for || result.activities)?.slice(0, 4).map((activity, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="border-primary/30 text-primary text-xs"
                              >
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}


                      <div className="pt-4 border-t border-border">
                        <div className="flex space-x-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 cursor-pointer text-primary-foreground"
                            onClick={() => handleViewDetails(result)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <Bot size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}


          {/* Load More */}
          {!isLoading && searchResults && searchResults.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-input text-foreground hover:bg-accent hover:text-accent-foreground px-8"
                size="lg"
              >
                Load More Adventures
                <TrendingUp className="ml-2" size={18} />
              </Button>
            </div>
          )}
        </div>
      </section>


      {/* Detailed Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] bg-card border-border text-foreground p-0 overflow-hidden">
          {selectedDestination && (
            <>
              {/* Modal Header with Image */}
              <div className="relative h-64 w-full">
                <img
                  src={selectedDestination.image_url}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>


                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground mb-3">
                        <Bot className="mr-1" size={12} />
                        AI Score: {selectedDestination.ai_score}
                      </Badge>
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        {selectedDestination.name}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="mr-1" size={16} />
                          {selectedDestination.days} Days
                        </span>
                        <span className="flex items-center">
                          <Star className="mr-1 text-yellow-500" size={16} fill="currentColor" />
                          {selectedDestination.star} ({selectedDestination.total_reviews} reviews)
                        </span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ₹{selectedDestination.cost?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/50 hover:bg-background/70 text-foreground rounded-full"
                  onClick={handleCloseModal}
                >
                  <X size={20} />
                </Button>
              </div>


              {/* Scrollable Content */}
              <ScrollArea className="h-[calc(90vh-16rem)] px-6 pb-6">
                <div className="space-y-6 mt-6">
                  {/* Overview */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                      <Info className="mr-2 text-primary" size={20} />
                      Overview
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedDestination.destination_overview}
                    </p>
                  </div>


                  {/* Perfect For Tags */}
                  {selectedDestination.perfect_for && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">Perfect For</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDestination.perfect_for.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-primary/50 text-primary bg-primary/20 px-4 py-2"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}


                  {/* Tabs for Detailed Info */}
                  <Tabs defaultValue="highlights" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted mb-6">
                      <TabsTrigger value="highlights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">
                        Highlights
                      </TabsTrigger>
                      <TabsTrigger value="itinerary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">
                        Itinerary
                      </TabsTrigger>
                      <TabsTrigger value="budget" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">
                        Budget
                      </TabsTrigger>
                      <TabsTrigger value="tips" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">
                        Tips
                      </TabsTrigger>
                    </TabsList>


                    {/* Highlights Tab */}
                    <TabsContent value="highlights" className="space-y-4">
                      {selectedDestination.trip_highlights && selectedDestination.trip_highlights.length > 0 ? (
                        selectedDestination.trip_highlights.map((highlight, idx) => (
                          <Card key={idx} className="bg-card border-border">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <div className="bg-primary/20 p-3 rounded-lg">
                                  <MapPinned className="text-primary" size={24} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-card-foreground mb-1">
                                    {highlight.name}
                                  </h4>
                                  <p className="text-muted-foreground text-sm mb-2">
                                    {highlight.description}
                                  </p>
                                  <Badge variant="secondary" className="bg-secondary/30 text-secondary-foreground text-xs">
                                    {highlight.match_reason}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No highlights available</p>
                      )}
                    </TabsContent>


                    {/* Itinerary Tab */}
                    <TabsContent value="itinerary" className="space-y-4">
                      {selectedDestination.suggested_itinerary && selectedDestination.suggested_itinerary.length > 0 ? (
                        selectedDestination.suggested_itinerary.map((day, idx) => (
                          <Card key={idx} className="bg-card border-border">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <div className="bg-secondary/20 p-3 rounded-lg flex items-center justify-center min-w-[60px]">
                                  <div className="text-center">
                                    <CalendarDays className="text-secondary mx-auto mb-1" size={20} />
                                    <span className="text-secondary font-bold text-sm">Day {day.day}</span>
                                  </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Morning</span>
                                    <p className="text-muted-foreground text-sm">{day.morning}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Afternoon</span>
                                    <p className="text-muted-foreground text-sm">{day.afternoon}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Evening</span>
                                    <p className="text-muted-foreground text-sm">{day.evening}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No itinerary available</p>
                      )}
                    </TabsContent>


                    {/* Budget Tab */}
                    <TabsContent value="budget" className="space-y-4">
                      {selectedDestination.budget_breakdown ? (
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(selectedDestination.budget_breakdown).map(([category, amount], idx) => (
                            <Card key={idx} className="bg-card border-border">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-green-600/20 p-2 rounded-lg">
                                    {category === 'flights' && <Plane className="text-green-600 dark:text-green-400" size={20} />}
                                    {category === 'accommodation' && <Hotel className="text-green-600 dark:text-green-400" size={20} />}
                                    {category === 'food' && <Utensils className="text-green-600 dark:text-green-400" size={20} />}
                                    {category === 'activities' && <MapPinned className="text-green-600 dark:text-green-400" size={20} />}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-card-foreground capitalize">
                                      {category}
                                    </h4>
                                    <p className="text-muted-foreground text-sm">{amount}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No budget breakdown available</p>
                      )}
                    </TabsContent>


                    {/* Tips Tab */}
                    <TabsContent value="tips" className="space-y-3">
                      {selectedDestination.local_tips && selectedDestination.local_tips.length > 0 ? (
                        selectedDestination.local_tips.map((tip, idx) => (
                          <Card key={idx} className="bg-card border-border">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <Lightbulb className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                                <p className="text-muted-foreground text-sm">{tip}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No tips available</p>
                      )}
                    </TabsContent>
                  </Tabs>


                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-border mb-5">
                    <Button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 cursor-pointer text-primary-foreground">
                      <Heart className="mr-2" size={18} />
                      Save to Favorites
                    </Button>
                    <Button variant="outline" className="flex-1 border-input text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">
                      <Share className="mr-2" size={18} />
                      Share Trip
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>


      {/* AI Assistant CTA */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Bot size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need Help Finding the Perfect Trip?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Chat with our AI travel assistant for personalized recommendations
              based on your preferences, budget, and travel style.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8 text-primary-foreground"
            >
              <Bot className="mr-2" size={20} />
              Chat with AI Assistant
              <Sparkles className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};


export default SearchPage;