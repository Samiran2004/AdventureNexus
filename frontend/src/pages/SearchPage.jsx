import Footer from "@/components/mvpblocks/footer-newsletter";
import NavBar from "@/components/NavBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import {
  Bot,
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  Heart,
  IndianRupee,
  MapPin,
  Search,
  Share,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  Users
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";


const SearchPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [budgetRange, setBudgetRange] = useState([1000, 5000]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");

  const handleActivityToggle = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  // Sample search results data
  const sampleSearchResults = [
    {
      id: 1,
      destination: "Bali, Indonesia",
      duration: "7 Days",
      price: "$1,200",
      rating: 4.8,
      reviews: 124,
      aiScore: 98,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      highlights: ["Beach", "Culture", "Wellness"],
      activities: ["Surfing", "Yoga", "Temples"]
    },
    {
      id: 2,
      destination: "Kyoto, Japan",
      duration: "10 Days",
      price: "$2,400",
      rating: 4.9,
      reviews: 89,
      aiScore: 96,
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      highlights: ["History", "Nature", "Food"],
      activities: ["Temples", "Tea Ceremony", "Hiking"]
    },
    {
      id: 3,
      destination: "Reykjavik, Iceland",
      duration: "5 Days",
      price: "$1,800",
      rating: 4.7,
      reviews: 56,
      aiScore: 94,
      image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80",
      highlights: ["Nature", "Adventure", "Photography"],
      activities: ["Northern Lights", "Glaciers", "Geysers"]
    },
    {
      id: 4,
      destination: "Santorini, Greece",
      duration: "6 Days",
      price: "$3,200",
      rating: 4.9,
      reviews: 210,
      aiScore: 92,
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
      highlights: ["Romance", "Views", "Food"],
      activities: ["Sunsets", "Wine Tasting", "Boating"]
    },
    {
      id: 5,
      destination: "Machu Picchu, Peru",
      duration: "8 Days",
      price: "$2,100",
      rating: 4.8,
      reviews: 145,
      aiScore: 91,
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80",
      highlights: ["History", "Adventure", "Hiking"],
      activities: ["Trekking", "Ruins", "Culture"]
    },
    {
      id: 6,
      destination: "Amalfi Coast, Italy",
      duration: "7 Days",
      price: "$2,800",
      rating: 4.7,
      reviews: 178,
      aiScore: 90,
      image: "https://images.unsplash.com/photo-1633321088355-d0f8c1eaad48?auto=format&fit=crop&w=800&q=80",
      highlights: ["Coast", "Food", "Luxury"],
      activities: ["Driving", "Dining", "Boating"]
    }
  ];

  // Initialize state with sample data to prevent undefined mapping error
  const [searchResults, setSearchResults] = useState(sampleSearchResults);
  const [isLoading, setIsLoading] = useState(false);
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [budget, setBudget] = useState("mid");

  const handleSearchResult = async () => {
    try {
      // construct payload...
      setIsLoading(true);
      const payload = {
        to: to || "Japan",
        from: from || "Kolkata",
        date: fromDate,
        travelers: travelers || 2,
        budget: 250000,
        budget_range: budget,
      }

      // axios POST request...
      const response = await axios.post("http://localhost:8000/api/v1/plans/search/destination", payload);

      console.log(response.data.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error on initial search");
      setIsLoading(false);
    }
  }

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
    <div className="min-h-screen bg-black">
      {/* Navbar with padding for fixed positioning */}
      <NavBar />
      <div className="h-6"></div>

      {/* Search Header */}
      <section className="py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Find Your Perfect
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}
                  Adventure
                </span>
              </h1>
              <p className="text-lg text-gray-400">
                Let AI curate personalized travel experiences just for you
              </p>
            </div>

            {/* Search Form */}
            <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  {/* where to */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="destination"
                      className="text-white text-sm font-medium"
                    >
                      Where to?
                    </Label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-3 text-gray-400"
                        size={19}
                      />
                      <Input
                        id="destination"
                        placeholder="Enter destination"
                        onChange={(e) => setTo(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      />
                    </div>


                  </div>

                  {/* Where from */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="destination"
                      className="text-white text-sm font-medium"
                    >
                      Where from?
                    </Label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="destination"
                        placeholder="Enter destination"
                        onChange={(e) => setFrom(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      />
                    </div>


                  </div>

                  {/* From Date */}
                  <div className="space-y-2">
                    <Label htmlFor="dates" className="text-white text-sm font-medium">
                      From
                    </Label>
                    <div className="relative">
                      {/* Visual Icon (Optional, browser adds its own on the right usually) */}
                      <Calendar className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />

                      <Input
                        id="dates"
                        type="date" // This enables the native date picker
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 [color-scheme:dark]"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]} // Disable past dates
                      />
                    </div>
                  </div>

                  {/* To Date */}
                  <div className="space-y-2">
                    <Label htmlFor="dates-to" className="text-white text-sm font-medium">
                      To
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />

                      <Input
                        id="dates-to"
                        type="date"
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 [color-scheme:dark]"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        min={fromDate} // Ensure 'To' date is after 'From' date
                      />
                    </div>
                  </div>
                </div>

                {/* Select total travelers */}
                <div className="space-y-2">
                  <Label
                    htmlFor="travelers"
                    className="text-white text-sm font-medium"
                  >
                    Travelers
                  </Label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <Select onValueChange={(value) => setTravelers(value)}>
                      <SelectTrigger className="pl-10 bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="2 travelers"/>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="1">1 traveler</SelectItem>
                        <SelectItem value="2">2 travelers</SelectItem>
                        <SelectItem value="3">3 travelers</SelectItem>
                        <SelectItem value="4">4+ travelers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Select Budget */}
                <div className="space-y-2 mb-4 mt-2">
                  <Label className="text-white text-sm font-medium">
                    Budget Range
                  </Label>
                  <div className="relative">
                    <IndianRupee
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <Select onValueChange={(value) => setBudget(value)}>
                      <SelectTrigger className="pl-10 bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Any budget range" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="budget">
                          Budget ($500-$1500)
                        </SelectItem>
                        <SelectItem value="mid">
                          Mid-range ($1500-$3000)
                        </SelectItem>
                        <SelectItem value="luxury">
                          Luxury ($3000+)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                    size="lg"
                    onClick={() => handleSearchResult()}
                    disabled={isLoading} // Prevents multiple clicks
                  >
                    {isLoading ? (
                      <>
                        {/* Ensure your Spinner has animate-spin if it's an icon, or uses your custom component */}
                        <Spinner className="mr-2 size-5 text-white animate-spin" />
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
                    className="border-gray-600 text-black hover:bg-gray-800 hover:text-amber-400"
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
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">
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
                          <div className="flex justify-between text-sm text-gray-400 mt-2">
                            <span>${budgetRange[0]}</span>
                            <span>${budgetRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">Activities</h3>
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
                                className="border-gray-600"
                              />
                              <Label
                                htmlFor={activity}
                                className="text-sm text-gray-300"
                              >
                                {activity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">
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
                                className="border-gray-600"
                              />
                              <Label
                                htmlFor={style}
                                className="text-sm text-gray-300"
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
      </section >

      {/* Results Section */}
      < section className="py-8 bg-black" >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                AI-Curated Travel Plans
              </h2>
              <p className="text-gray-400">
                Found 247 personalized adventures • Powered by AI
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="recommended">AI Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults && searchResults.map((result) => (
              <Card
                key={result.id}
                className="result-card bg-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={result.image}
                      alt={result.destination}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDE4NVYxMTBIMTc1VjEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+dGggZD0iTTE4NSAxMDBIMTk1VjExMEgxODVWMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjA1IDEwMEgyMTVWMTEwSDIwNVYxMDBaIiBmaWxsPSIjOUNBM0FGIi8+CjwvZz4KPC9zdmc+";
                      }}
                      loading="lazy"
                    />

                    {/* AI Score Badge - positioned over image */}
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600">
                      <Bot className="mr-1" size={12} />
                      AI Score: {result.aiScore}%
                    </Badge>

                    {/* Action Buttons - positioned over image */}
                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                      >
                        <Heart size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
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
                        <h3 className="text-xl font-bold text-white mb-1">
                          {result.destination}
                        </h3>
                        <p className="text-gray-400 text-sm flex items-center">
                          <Clock className="mr-1" size={14} />
                          {result.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {result.price}
                        </div>
                        <div className="text-sm text-gray-400">per person</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={
                              i < Math.floor(result.rating)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold">
                        {result.rating}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({result.reviews} reviews)
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-medium text-sm">
                        Trip Highlights:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {result.highlights.map((highlight, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-800 text-gray-300 text-xs"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-medium text-sm">
                        Perfect for:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {result.activities.map((activity, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-blue-600/30 text-blue-400 text-xs"
                          >
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-black hover:bg-gray-800 hover:text-white"
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

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-gray-600 text-black hover:bg-gray-800 px-8 hover:text-white"
              size="lg"
            >
              Load More Adventures
              <TrendingUp className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </section >

      {/* AI Assistant CTA */}
      < section className="py-12 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-y border-gray-800" >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Bot size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need Help Finding the Perfect Trip?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Chat with our AI travel assistant for personalized recommendations
              based on your preferences, budget, and travel style.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            >
              <Bot className="mr-2" size={20} />
              Chat with AI Assistant
              <Sparkles className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </section >
      <Footer />
    </div >
  );
};

export default SearchPage;