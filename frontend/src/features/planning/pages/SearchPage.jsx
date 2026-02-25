import Footer from "@/components/mvpblocks/footer-newsletter";
import NavBar from "@/components/NavBar";
import ShareModal from "@/components/ShareModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
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
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from "axios";
import {
  Bot,
  Calendar,
  CalendarDays,
  ChevronDown,
  Clock,
  DollarSign,
  Heart,
  Hotel,
  IndianRupee,
  Info,
  Lightbulb,
  LocateFixed,
  Map,
  MapPin,
  MapPinned,
  Plane,
  Search,
  Share,
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
import { format, addDays } from "date-fns";

// Fix for default Leaflet marker icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


// SearchPage component allows users to search for trips using AI-powered criteria
const SearchPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);
  const [mapRouteCoordinates, setMapRouteCoordinates] = useState([]);
  const [isFetchingMapRoute, setIsFetchingMapRoute] = useState(false);
  const [activeMapResult, setActiveMapResult] = useState(null);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [pickerLocation, setPickerLocation] = useState(null); // {lat, lng}

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


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

  // --- Location Selection Helpers ---

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      if (response.data && response.data.address) {
        const addr = response.data.address;
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "";
        const country = addr.country || "";
        return city && country ? `${city}, ${country}` : city || country || "Unknown Location";
      }
      return "Unknown Location";
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return "Unknown Location";
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await reverseGeocode(latitude, longitude);
        setFrom(locationName);
        setIsDetectingLocation(false);
        toast.success(`Location set to ${locationName}`);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsDetectingLocation(false);
        toast.error("Failed to detect location. Please enter manually.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleLocationPick = async (lat, lng) => {
    setPickerLocation({ lat, lng });
    const locationName = await reverseGeocode(lat, lng);
    setFrom(locationName);
    setIsLocationModalOpen(false);
    toast.success(`Origin set to ${locationName}`);
  };

  // --- Picker Map Component ---
  const MapClickEvents = ({ onClick }) => {
    useMapEvents({
      click(e) {
        onClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
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
  }, [lightboxIndex, galleryImages, isFullMapOpen]);

  const fetchRoadRoute = async (plan) => {
    if (!plan.trip_highlights || plan.trip_highlights.length < 2) {
      setMapRouteCoordinates([]);
      return;
    }

    try {
      setIsFetchingMapRoute(true);
      const coords = plan.trip_highlights
        .filter(h => h.geo_coordinates)
        .map(h => `${h.geo_coordinates.lng},${h.geo_coordinates.lat}`)
        .join(';');

      if (!coords) {
        setMapRouteCoordinates([]);
        return;
      }

      const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);

      if (response.data?.routes?.[0]?.geometry?.coordinates) {
        const points = response.data.routes[0].geometry.coordinates.map(coord => [
          coord[1], // latitude
          coord[0]  // longitude
        ]);
        setMapRouteCoordinates(points);
      }
    } catch (error) {
      console.error("Error fetching road route:", error);
      // Fallback: use straight lines if OSRM fails
      setMapRouteCoordinates(plan.trip_highlights
        .filter(h => h.geo_coordinates)
        .map(h => [h.geo_coordinates.lat, h.geo_coordinates.lng])
      );
    } finally {
      setIsFetchingMapRoute(false);
    }
  };

  const handleOpenMap = (result, e) => {
    if (e) e.stopPropagation();
    setActiveMapResult(result);
    setIsFullMapOpen(true);
    setMapRouteCoordinates([]); // Clear previous route
    fetchRoadRoute(result);
  };


  // State
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading to fetch recommendations
  const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [toDate, setToDate] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));
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
        travelers: isNaN(parseInt(travelers)) ? 2 : parseInt(travelers),
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
                        placeholder="Where to? (e.g. Kyoto, Japan)"
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
                    <div className="relative group">
                      <Plane
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                        size={18}
                      />
                      <Input
                        id="from-destination"
                        placeholder="Where from? (e.g. London, UK)"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="pl-12 pr-28 h-12 bg-input border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          onClick={handleGetCurrentLocation}
                          title="Use current location"
                          disabled={isDetectingLocation}
                        >
                          {isDetectingLocation ? (
                            <Spinner className="size-4 text-primary" />
                          ) : (
                            <LocateFixed size={16} />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                          onClick={() => setIsLocationModalOpen(true)}
                          title="Pick from map"
                        >
                          <Map size={16} />
                        </Button>
                      </div>
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
                      />
                    </div>
                  </div>
                </div>


                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Pill Selection for Travelers */}
                  <div className="space-y-3">
                    <Label className="text-foreground text-sm font-semibold flex items-center gap-2">
                      <Users size={16} className="text-primary" />
                      Travelers
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {["1", "2", "3", "4+"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTravelers(t)}
                          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${travelers === t
                            ? "bg-primary text-primary-foreground shadow-lg scale-105"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent"
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pill Selection for Budget */}
                  <div className="space-y-3">
                    <Label className="text-foreground text-sm font-semibold flex items-center gap-2">
                      <DollarSign size={16} className="text-secondary" />
                      Budget Range
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Budget", value: "budget" },
                        { label: "Mid-range", value: "mid" },
                        { label: "Luxury", value: "luxury" }
                      ].map((b) => (
                        <button
                          key={b.value}
                          type="button"
                          onClick={() => setBudget(b.value)}
                          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${budget === b.value
                            ? "bg-secondary text-white shadow-lg scale-105"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent"
                            }`}
                        >
                          {b.label}
                        </button>
                      ))}
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
                </div>
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
                                className="border-input text-foreground hover:bg-accent hover:text-accent-foreground group/map"
                                onClick={(e) => handleOpenMap(result, e)}
                              >
                                <MapPinned size={16} className="group-hover/map:text-primary transition-colors" />
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
                                className="border-input text-foreground hover:bg-accent hover:text-accent-foreground group/map"
                                onClick={(e) => handleOpenMap(result, e)}
                              >
                                <MapPinned size={16} className="group-hover/map:text-primary transition-colors" />
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
      {/* Map View Dialog */}
      <Dialog open={isFullMapOpen} onOpenChange={setIsFullMapOpen}>
        <DialogContent className="max-w-[95vw] h-[95vh] bg-card border-border p-0 overflow-hidden shadow-2xl">
          <div className="relative w-full h-full">
            <div className="absolute top-4 left-4 z-50 pointer-events-none">
              <div className="bg-background/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl pointer-events-auto">
                <h3 className="font-black font-outfit text-lg">{activeMapResult?.name} Route</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Itinerary Visualization</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-background/80 hover:bg-background rounded-full shadow-sm"
              onClick={() => setIsFullMapOpen(false)}
            >
              <X size={20} />
            </Button>

            {isFetchingMapRoute && (
              <div className="absolute inset-0 z-40 bg-background/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                <div className="bg-background p-4 rounded-full shadow-2xl border border-border flex items-center gap-3">
                  <Spinner className="size-5 text-primary" />
                  <span className="text-sm font-bold font-outfit">Mapping route...</span>
                </div>
              </div>
            )}

            <HighlightMap
              highlights={activeMapResult?.trip_highlights}
              routeCoordinates={mapRouteCoordinates}
              destinationName={activeMapResult?.name}
              isSatellite={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Origin Location Picker Modal */}
      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="max-w-[70vw] h-[70vh] bg-card border-border p-0 overflow-hidden shadow-2xl">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-4 left-4 z-50 pointer-events-none">
              <div className="bg-background/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl pointer-events-auto">
                <h3 className="font-black font-outfit text-lg">Pick Origin Location</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Click anywhere on the map to select</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-background/80 hover:bg-background rounded-full shadow-sm"
              onClick={() => setIsLocationModalOpen(false)}
            >
              <X size={20} />
            </Button>

            <div className="flex-1 w-full h-full relative z-0">
              <MapContainer
                center={[20, 0]}
                zoom={2}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickEvents onClick={handleLocationPick} />
                {pickerLocation && (
                  <Marker position={[pickerLocation.lat, pickerLocation.lng]} />
                )}
              </MapContainer>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default SearchPage;