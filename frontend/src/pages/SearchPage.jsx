import Footer from "@/components/mvpblocks/footer-newsletter";
import NavBar from "@/components/NavBar";
import ShareModal from "@/components/ShareModal";
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
import HighlightMap from "@/components/HighlightMap"; // Import Map component
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
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react"


// SearchPage component allows users to search for trips using AI-powered criteria
const SearchPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [budgetRange, setBudgetRange] = useState([15000, 45000]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null); // Lightbox state
  const [selectedHighlight, setSelectedHighlight] = useState(null); // State for map modal
  const [likedPlans, setLikedPlans] = useState(new Set()); // Track liked plan IDs
  const [likedPlansData, setLikedPlansData] = useState([]); // Full liked plans data
  const [activeTab, setActiveTab] = useState("all"); // Track active tab: "all" or "liked"
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedSharePlan, setSelectedSharePlan] = useState(null);

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
    setGalleryImages([]); // Reset images
    // Optional: Fetch images immediately or wait for tab click. 
    // Let's wait for tab click or just pre-fetch lightly. 
    // For now, I'll attach it to the tab change handler or just a useEffect on selectedDestination.
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDestination(null), 300);
    setGalleryImages([]);
  };

  const fetchGalleryImages = async (destinationName) => {
    if (!destinationName || galleryImages.length > 0) return; // Don't refetch if already have images

    try {
      setIsGalleryLoading(true);
      const token = await getToken();
      const response = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/plans/search/destination-images`,
        { query: destinationName, count: 12 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "Ok") {
        setGalleryImages(response.data.data);
      }
      setIsGalleryLoading(false);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setIsGalleryLoading(false);
      toast.error("Failed to load gallery images");
    }
  };

  // Lightbox Handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex < galleryImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else if (lightboxIndex !== null) {
      setLightboxIndex(0); // Loop back
    }
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else if (lightboxIndex !== null) {
      setLightboxIndex(galleryImages.length - 1); // Loop to end
    }
  };

  // Keyboard Navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, galleryImages]);


  // State
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading to fetch recommendations
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [budget, setBudget] = useState("mid");
  const { getToken } = useAuth();

  // Fetch Recommendations on Mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = await getToken();
        // If no token (not logged in), we might want to skip or handle gracefully.
        // But for this app, we assume user is logged in or public access? 
        // The backend requires a token for user history unless we made it optional.
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `${VITE_BACKEND_URL}/api/v1/plans/recommendations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status === "Ok") {
          setSearchResults(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        // On error, leave empty or show toast. 
        // We can just stop loading.
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [getToken, VITE_BACKEND_URL]);

  // Fetch Liked Plans on Mount
  useEffect(() => {
    const fetchLikedPlans = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await axios.get(
          `${VITE_BACKEND_URL}/api/v1/liked-plans`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          // Extract plan IDs from the response
          const plans = response.data.likedPlans;
          const likedIds = new Set(
            plans.map((plan) => plan._id || plan)
          );
          setLikedPlans(likedIds);
          setLikedPlansData(plans); // Store full plan objects
        }
      } catch (error) {
        console.error("Failed to fetch liked plans:", error);
      }
    };

    fetchLikedPlans();
  }, [getToken, VITE_BACKEND_URL]);

  // Handle Like/Unlike Plan
  const handleLikePlan = async (planId, e) => {
    if (e) e.stopPropagation();

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to like plans");
        return;
      }

      const isLiked = likedPlans.has(planId);

      if (isLiked) {
        // Unlike
        await axios.delete(
          `${VITE_BACKEND_URL}/api/v1/liked-plans/${planId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLikedPlans((prev) => {
          const newSet = new Set(prev);
          newSet.delete(planId);
          return newSet;
        });

        toast.success("Removed from liked plans");
      } else {
        // Like
        await axios.post(
          `${VITE_BACKEND_URL}/api/v1/liked-plans/${planId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLikedPlans((prev) => new Set([...prev, planId]));
        toast.success("Added to liked plans");
      }
    } catch (error) {
      console.error("Error liking/unliking plan:", error);
      toast.error(error.response?.data?.message || "Failed to update liked plans");
    }
  };


  const handleSharePlan = (plan, e) => {
    if (e) e.stopPropagation();
    setSelectedSharePlan(plan);
    setIsShareModalOpen(true);
  };


  const handleSearchResult = async () => {
    if (!to || !from || !fromDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);

      const token = await getToken();


      // Calculate duration in days
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = Math.abs(end - start);
      const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

      if (!toDate) {
        toast.error("Please select a return date");
        return;
      }

      if (end < start) {
        toast.error("Return date must be after departure date");
        return;
      }

      // Map budget tiers to approximate upper limits (INR)
      const budgetMap = {
        "budget": 25000,
        "mid": 65000,
        "luxury": 200000
      };

      // Default to mid if not found, or use a custom logic if "Any" is an option
      const budgetLimit = budgetMap[budget] || 30000;

      const payload = {
        to,
        from,
        date: fromDate,
        travelers: Number(travelers),
        budget: budgetLimit,
        budget_range: budget, // This sends "budget", "mid", or "luxury" string
        duration: duration
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

      // The backend now returns an array of plans
      setSearchResults(response.data.data);
      toast.success("Plans generated successfully");
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
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground font-outfit">
                  Find Your Perfect
                  <span className="bg-gradient-to-r from-primary via-secondary to-purple-600 bg-clip-text text-transparent animate-gradient"> Adventure</span>
                </h1>
                <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
              </div>
              <p className="text-lg text-muted-foreground">
                Let AI curate personalized travel experiences just for you
              </p>
            </div>


            {/* Search Form */}
            <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* where to */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="destination"
                      className="text-foreground text-sm font-semibold flex items-center gap-2"
                    >
                      <MapPin size={16} className="text-primary" />
                      Where to?
                    </Label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="destination"
                        placeholder="Enter destination"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="pl-12 h-12 bg-input border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  {/* Where from */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="from-destination"
                      className="text-foreground text-sm font-semibold flex items-center gap-2"
                    >
                      <Plane size={16} className="text-secondary" />
                      Where from?
                    </Label>
                    <div className="relative">
                      <Plane
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        id="from-destination"
                        placeholder="Enter origin"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="pl-12 h-12 bg-input border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  {/* From Date */}
                  <div className="space-y-3">
                    <Label htmlFor="dates" className="text-foreground text-sm font-semibold flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      Departure Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                      <Input
                        id="dates"
                        type="date"
                        className="pl-12 h-12 bg-input border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer rounded-xl transition-all"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>

                  {/* To Date */}
                  <div className="space-y-3">
                    <Label htmlFor="dates-to" className="text-foreground text-sm font-semibold flex items-center gap-2">
                      <Calendar size={16} className="text-secondary" />
                      Return Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                      <Input
                        id="dates-to"
                        type="date"
                        className="pl-12 h-12 bg-input border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer rounded-xl transition-all"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        min={fromDate}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>
                </div>


                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Select total travelers */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="travelers"
                      className="text-foreground text-sm font-semibold flex items-center gap-2"
                    >
                      <Users size={16} className="text-primary" />
                      Travelers
                    </Label>
                    <div className="relative">
                      <Users
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
                        size={18}
                      />
                      <Select value={travelers} onValueChange={(value) => setTravelers(value)}>
                        <SelectTrigger className="pl-12 h-12 bg-input border-input text-foreground cursor-pointer rounded-xl focus:ring-2 focus:ring-primary/20 transition-all">
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
                  <div className="space-y-3">
                    <Label className="text-foreground text-sm font-semibold flex items-center gap-2">
                      <IndianRupee size={16} className="text-secondary" />
                      Budget Range
                    </Label>
                    <div className="relative">
                      <IndianRupee
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
                        size={18}
                      />
                      <Select value={budget} onValueChange={(value) => setBudget(value)}>
                        <SelectTrigger className="pl-12 h-12 bg-input border-input text-foreground cursor-pointer rounded-xl focus:ring-2 focus:ring-primary/20 transition-all">
                          <SelectValue placeholder="Any budget range" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border cursor-pointer">
                          <SelectItem value="budget" className="cursor-pointer">
                            Budget (₹15000-₹25000)
                          </SelectItem>
                          <SelectItem value="mid" className="cursor-pointer">
                            Mid-range (₹25000-₹65000)
                          </SelectItem>
                          <SelectItem value="luxury" className="cursor-pointer">
                            Luxury (₹65000+)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>


                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <Button
                    className="w-full sm:flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 cursor-pointer shadow-xl hover:shadow-2xl hover-lift"
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
                    size="lg"
                    className="w-full sm:w-auto border-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/50 transition-all shadow-md hover:shadow-lg"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="mr-2" size={18} />
                    Filters
                    <ChevronDown
                      className={`ml-2 transition-transform duration-300 ${showFilters ? "rotate-180" : ""
                        }`}
                      size={16}
                    />
                  </Button>
                </div>


                {/* Advanced Filters */}
                {showFilters && (
                  <div className="mt-8 pt-8 border-t border-border/50 animate-in fade-in-50 duration-500">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Budget Range Card */}
                      <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-foreground font-bold text-base flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-br from-primary to-primary/70 rounded-lg shadow-md">
                            <IndianRupee size={16} className="text-white" />
                          </div>
                          Budget Range
                        </h3>
                        <div className="px-3 py-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50">
                          <div className="mb-3">
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-2">
                              <span>Min</span>
                              <span>Max</span>
                            </div>
                            <Slider
                              value={budgetRange}
                              onValueChange={setBudgetRange}
                              max={10000}
                              min={500}
                              step={100}
                              className="w-full"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                              <span>$500</span>
                              <span>$10K</span>
                            </div>
                          </div>
                          <div className="flex justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-muted-foreground mb-1 text-center">From</div>
                              <div className="px-2 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl shadow-lg text-center font-bold text-sm truncate">
                                ${budgetRange[0].toLocaleString()}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-muted-foreground mb-1 text-center">To</div>
                              <div className="px-2 py-2 bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-xl shadow-lg text-center font-bold text-sm truncate">
                                ${budgetRange[1].toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Activities Card */}
                      <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-secondary/5 via-transparent to-secondary/10 border border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-foreground font-bold text-base flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg shadow-md">
                            <Sparkles size={16} className="text-white" />
                          </div>
                          Activities
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {activities.slice(0, 6).map((activity) => (
                            <label
                              key={activity}
                              className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer ${selectedActivities.includes(activity)
                                ? 'bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary shadow-md scale-105'
                                : 'bg-background/50 border-border/50 hover:border-secondary/50 hover:bg-secondary/5'
                                }`}
                            >
                              <Checkbox
                                id={activity}
                                checked={selectedActivities.includes(activity)}
                                onCheckedChange={() => handleActivityToggle(activity)}
                                className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:border-secondary flex-shrink-0"
                              />
                              <span className="text-xs font-semibold text-foreground truncate">
                                {activity}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Travel Style Card */}
                      <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/10 border border-purple-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-foreground font-bold text-base flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                            <Users size={16} className="text-white" />
                          </div>
                          Travel Style
                        </h3>
                        <div className="space-y-2">
                          {[
                            "Solo Travel",
                            "Family Friendly",
                            "Romantic",
                            "Group Travel",
                          ].map((style) => (
                            <label
                              key={style}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-border/50 bg-background/50 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 cursor-pointer hover:scale-105"
                            >
                              <Checkbox
                                id={style}
                                className="border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 flex-shrink-0"
                              />
                              <span className="text-xs font-semibold text-foreground">
                                {style}
                              </span>
                            </label>
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
          {/* Tabs for All Plans vs Liked Plans */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-outfit">
                  Your Travel Plans
                </h2>
                <TabsList className="bg-muted/50 backdrop-blur-sm p-1 rounded-xl shadow-lg">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer rounded-lg transition-all duration-300 data-[state=active]:shadow-lg font-medium px-6"
                  >
                    <Sparkles size={16} className="mr-2" />
                    All Plans ({searchResults?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="liked"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer rounded-lg transition-all duration-300 data-[state=active]:shadow-lg font-medium px-6"
                  >
                    <Heart size={16} className="mr-2" />
                    Liked Plans ({likedPlansData?.length || 0})
                  </TabsTrigger>
                </TabsList>
              </div>

              {activeTab === "all" && (
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-56 h-11 bg-input border-input text-foreground rounded-xl shadow-md hover:shadow-lg transition-all">
                      <TrendingUp size={16} className="mr-2" />
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
              )}
            </div>


            <TabsContent value="all" className="mt-0">
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
                      className="result-card bg-card border-border hover:border-primary/50 transition-all duration-300 group shadow-xl hover:shadow-2xl hover-lift"
                    >
                      <div className="relative">
                        <div className="relative h-56 overflow-hidden rounded-t-lg">
                          <img
                            src={result.image_url}
                            alt={result.name}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                            }}
                            loading="lazy"
                          />

                          {/* Glassmorphism Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* AI Score Badge */}
                          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-xl backdrop-blur-sm">
                            <Bot className="mr-1 animate-pulse" size={14} />
                            {result.ai_score}
                          </Badge>


                          {/* Action Buttons */}
                          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-sm hover:shadow-md transition-all rounded-full w-8 h-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikePlan(result._id, e);
                              }}
                            >
                              <Heart size={16} className={likedPlans.has(result._id) ? "fill-current" : ""} />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white text-primary hover:text-primary/80 shadow-sm hover:shadow-md transition-all rounded-full w-8 h-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSharePlan(result, e);
                              }}
                            >
                              <Share size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>


                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-card-foreground mb-2 font-outfit group-hover:text-primary transition-colors">
                                {result.name}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {result.days} {result.days === 1 ? 'Day' : 'Days'}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className="text-yellow-500"
                                      fill={i < Math.floor(result.star) ? "currentColor" : "none"}
                                    />
                                  ))}
                                  <span className="ml-1 font-semibold text-card-foreground">{result.star}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                ₹{result.cost?.toLocaleString() || 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">per person</div>
                            </div>
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
                                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 cursor-pointer text-primary-foreground shadow-lg hover:shadow-xl transition-all"
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
            </TabsContent>

            {/* Tab Content for Liked Plans */}
            <TabsContent value="liked" className="mt-0">
              {/* Empty State for Liked Plans */}
              {likedPlansData.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-muted-foreground mb-4">
                    <Heart size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-xl">No liked plans yet</p>
                    <p className="text-sm mt-2">Start exploring and like plans to save them here</p>
                  </div>
                </div>
              )}

              {/* Liked Plans Grid */}
              {likedPlansData.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedPlansData.map((result, index) => (
                    <Card
                      key={index}
                      className="result-card bg-card border-border hover:border-primary/50 transition-all duration-300 group shadow-xl hover:shadow-2xl hover-lift"
                    >
                      <div className="relative">
                        <div className="relative h-56 overflow-hidden rounded-t-lg">
                          <img
                            src={result.image_url}
                            alt={result.name}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                            }}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-xl backdrop-blur-sm">
                            <Bot className="mr-1 animate-pulse" size={14} />
                            {result.ai_score}
                          </Badge>
                          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-sm hover:shadow-md transition-all rounded-full w-8 h-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikePlan(result._id, e);
                              }}
                            >
                              <Heart size={16} className="fill-current" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white text-primary hover:text-primary/80 shadow-sm hover:shadow-md transition-all rounded-full w-8 h-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSharePlan(result, e);
                              }}
                            >
                              <Share size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-card-foreground mb-2 font-outfit group-hover:text-primary transition-colors">
                                {result.name}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {result.days} {result.days === 1 ? 'Day' : 'Days'}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className="text-yellow-500"
                                      fill={i < Math.floor(result.star) ? "currentColor" : "none"}
                                    />
                                  ))}
                                  <span className="ml-1 font-semibold text-card-foreground">{result.star}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                ₹{result.cost?.toLocaleString() || 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">per person</div>
                            </div>
                          </div>

                          {result.destination_overview && (
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {result.destination_overview}
                            </p>
                          )}

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
                                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 cursor-pointer text-primary-foreground shadow-lg hover:shadow-xl transition-all"
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
            </TabsContent>
          </Tabs>
        </div>
      </section>


      {/* Detailed Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] bg-card border-border text-foreground p-0 overflow-hidden shadow-2xl">
          {selectedDestination && (
            <>
              {/* Modal Header with Image */}
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={selectedDestination.image_url}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>


                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground mb-4 shadow-xl backdrop-blur-sm px-3 py-1">
                        <Bot className="mr-1.5 animate-pulse" size={14} />
                        AI Score: {selectedDestination.ai_score}
                      </Badge>
                      <h2 className="text-4xl font-bold text-foreground mb-3 font-outfit">
                        {selectedDestination.name}
                      </h2>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock size={16} />
                          {selectedDestination.days} Days
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Star className="text-yellow-500" size={16} fill="currentColor" />
                          <span className="font-semibold text-foreground">{selectedDestination.star}</span>
                          <span className="text-muted-foreground">({selectedDestination.total_reviews} reviews)</span>
                        </span>
                        <span className="text-3xl font-bold text-green-600 dark:text-green-400">
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
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground font-outfit">
                      <Info className="mr-2 text-primary" size={22} />
                      Overview
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {selectedDestination.destination_overview}
                    </p>
                  </div>


                  {/* Perfect For Tags */}
                  {selectedDestination.perfect_for && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-foreground font-outfit flex items-center">
                        <Sparkles className="mr-2 text-secondary" size={22} />
                        Perfect For
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDestination.perfect_for.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-primary/50 text-primary bg-primary/10 px-4 py-2 hover:bg-primary/20 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}


                  {/* Tabs for Detailed Info */}
                  <Tabs defaultValue="highlights" className="w-full" onValueChange={(value) => {
                    if (value === "gallery" && galleryImages.length === 0) {
                      fetchGalleryImages(selectedDestination.name);
                    }
                  }}>
                    <TabsList className="grid w-full grid-cols-5 bg-muted/50 backdrop-blur-sm mb-8 p-1 rounded-xl shadow-lg">
                      <TabsTrigger value="highlights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer rounded-lg transition-all duration-300 data-[state=active]:shadow-lg font-medium text-xs sm:text-sm">
                        <Lightbulb className="mr-1 sm:mr-2" size={14} />
                        Highlights
                      </TabsTrigger>
                      <TabsTrigger value="itinerary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer rounded-lg transition-all duration-300 data-[state=active]:shadow-lg font-medium text-xs sm:text-sm">
                        <CalendarDays className="mr-1 sm:mr-2" size={14} />
                        Itinerary
                      </TabsTrigger>
                      <TabsTrigger value="budget" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer rounded-lg transition-all duration-300 data-[state=active]:shadow-lg font-medium text-xs sm:text-sm">
                        <IndianRupee className="mr-1 sm:mr-2" size={14} />
                        Budget
                      </TabsTrigger>
                      <TabsTrigger value="tips" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer rounded-lg transition-all duration-300 data-[state=active]:shadow-lg font-medium text-xs sm:text-sm">
                        <Lightbulb className="mr-1 sm:mr-2" size={14} />
                        Tips
                      </TabsTrigger>
                      <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer rounded-lg transition-all duration-300 data-[state=active]:shadow-lg font-medium text-xs sm:text-sm">
                        <ImageIcon className="mr-1 sm:mr-2" size={14} />
                        Gallery
                      </TabsTrigger>
                    </TabsList>


                    {/* Highlights Tab */}
                    <TabsContent value="highlights" className="space-y-4">
                      {selectedDestination.trip_highlights && selectedDestination.trip_highlights.length > 0 ? (
                        selectedDestination.trip_highlights.map((highlight, idx) => (
                          <Card
                            key={idx}
                            className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover-lift cursor-pointer group"
                            onClick={() => setSelectedHighlight(highlight)}
                          >
                            <CardContent className="p-5">
                              <div className="flex items-start space-x-4">
                                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-3 rounded-xl shadow-md group-hover:bg-primary/30 transition-colors">
                                  <MapPinned className="text-primary" size={24} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-card-foreground mb-2 text-lg font-outfit flex items-center justify-between">
                                    {highlight.name}
                                    <MapPin size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </h4>
                                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                                    {highlight.description}
                                  </p>
                                  <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground text-xs px-3 py-1">
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
                          <Card key={idx} className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                            <CardContent className="p-5">
                              <div className="flex items-start space-x-4">
                                <div className="bg-gradient-to-br from-secondary/20 to-primary/20 p-3 rounded-xl flex items-center justify-center min-w-[70px] shadow-md">
                                  <div className="text-center">
                                    <CalendarDays className="text-secondary mx-auto mb-1" size={22} />
                                    <span className="text-secondary font-bold text-sm">Day {day.day}</span>
                                  </div>
                                </div>
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <span className="text-xs text-primary uppercase font-semibold flex items-center gap-1">
                                      <Clock size={12} />
                                      Morning
                                    </span>
                                    <p className="text-muted-foreground text-sm mt-1">{day.morning}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-primary uppercase font-semibold flex items-center gap-1">
                                      <Clock size={12} />
                                      Afternoon
                                    </span>
                                    <p className="text-muted-foreground text-sm mt-1">{day.afternoon}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-primary uppercase font-semibold flex items-center gap-1">
                                      <Clock size={12} />
                                      Evening
                                    </span>
                                    <p className="text-muted-foreground text-sm mt-1">{day.evening}</p>
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
                            <Card key={idx} className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                              <CardContent className="p-5">
                                <div className="flex items-center space-x-4">
                                  <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-3 rounded-xl shadow-md">
                                    {category === 'flights' && <Plane className="text-green-600 dark:text-green-400" size={22} />}
                                    {category === 'accommodation' && <Hotel className="text-green-600 dark:text-green-400" size={22} />}
                                    {category === 'food' && <Utensils className="text-green-600 dark:text-green-400" size={22} />}
                                    {category === 'activities' && <MapPinned className="text-green-600 dark:text-green-400" size={22} />}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-card-foreground capitalize text-lg font-outfit mb-1">
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
                          <Card key={idx} className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                            <CardContent className="p-5">
                              <div className="flex items-start space-x-4">
                                <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-2 rounded-xl shadow-md flex-shrink-0">
                                  <Lightbulb className="text-yellow-500" size={22} />
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{tip}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No tips available</p>
                      )}
                    </TabsContent>

                    {/* Gallery Tab (Pinterest Style) */}
                    <TabsContent value="gallery" className="space-y-4">
                      {isGalleryLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                          <Spinner className="size-10 text-primary animate-spin mb-4" />
                          <p className="text-muted-foreground text-sm">Curating gallery...</p>
                        </div>
                      ) : galleryImages && galleryImages.length > 0 ? (
                        <>
                          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 pr-2">
                            {galleryImages.map((imgUrl, idx) => (
                              <div
                                key={idx}
                                className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-zoom-in"
                                onClick={() => openLightbox(idx)}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Gallery ${idx}`}
                                  className="w-full h-auto object-cover transform md:group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                                  <Maximize2 className="text-white opacity-80" size={24} />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Lightbox Overlay */}
                          {lightboxIndex !== null && (
                            <div
                              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
                              onClick={closeLightbox}
                            >
                              {/* Close Button */}
                              <button
                                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
                                onClick={closeLightbox}
                              >
                                <X size={32} />
                              </button>

                              {/* Navigation Buttons */}
                              <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:flex"
                                onClick={prevImage}
                              >
                                <ChevronLeft size={40} />
                              </button>

                              <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:flex"
                                onClick={nextImage}
                              >
                                <ChevronRight size={40} />
                              </button>

                              {/* Image Container */}
                              <div
                                className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                              >
                                <img
                                  src={galleryImages[lightboxIndex]}
                                  alt="Lightbox"
                                  className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
                                />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md">
                                  {lightboxIndex + 1} / {galleryImages.length}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
                          <p>No images found in gallery</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>


                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-border mb-12">
                    <Button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 cursor-pointer text-primary-foreground">
                      <Heart className="mr-2" size={18} />
                      Save to Favorites
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-input text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      onClick={(e) => handleSharePlan(selectedDestination, e)}
                    >
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


      {/* Map Modal */}
      <Dialog open={!!selectedHighlight} onOpenChange={() => setSelectedHighlight(null)}>
        <DialogContent className="max-w-4xl h-[70vh] bg-card border-border p-0 overflow-hidden shadow-2xl">
          <div className="relative w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-background/80 hover:bg-background rounded-full shadow-sm"
              onClick={() => setSelectedHighlight(null)}
            >
              <X size={20} />
            </Button>
            {selectedHighlight && (
              <HighlightMap
                highlight={selectedHighlight}
                destinationName={selectedDestination?.name}
              />
            )}
          </div>
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

      {/* Share Modal */}
      {selectedSharePlan && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          planId={selectedSharePlan._id}
          planName={selectedSharePlan.name}
        />
      )}
    </div>
  );
};


export default SearchPage;