import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react';
import {
  MapPin,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Plus,
  FileText,
  Upload,
  Download,
  Plane,
  Hotel,
  Camera,
  Navigation,
  Star,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Compass,
  Settings,
  Share2,
  Heart,
  Eye,
  MoreVertical,
  Filter,
  Search,
  Scan,
  Lock,
  Unlock,
  Copy,
  RefreshCw,
  AlertTriangle,
  Shield,
  Image as ImageIcon,
  File,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'react-hot-toast';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';

gsap.registerPlugin(ScrollTrigger);

// MyTripsPage component manages and displays the user's trips
const MyTripsPage = () => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('history'); // 'history' | 'liked'
  const [likedTrips, setLikedTrips] = useState([]);
  const [isLikedLoading, setIsLikedLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const inrFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Enhanced document states for file uploads and management
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentForm, setDocumentForm] = useState({
    name: '',
    type: 'passport',
    category: 'identity',
    expiryDate: '',
    notes: '',
    isPrivate: false,
    password: ''
  });
  const [documentPreview, setDocumentPreview] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [processingOCR, setProcessingOCR] = useState(false);

  const containerRef = useRef(null);
  const headerRef = useRef(null);

  // Enhanced document categories
  const documentCategories = {
    identity: {
      label: 'Identity Documents',
      types: [
        { value: 'passport', label: 'Passport', icon: '🛂' },
        { value: 'drivers_license', label: 'Driver\'s License', icon: '🚗' },
        { value: 'national_id', label: 'National ID', icon: '🆔' },
        { value: 'pan_card', label: 'PAN Card', icon: '🏛️' },
        { value: 'aadhar', label: 'Aadhar Card', icon: '🇮🇳' }
      ]
    },
    travel: {
      label: 'Travel Documents',
      types: [
        { value: 'visa', label: 'Visa', icon: '✈️' },
        { value: 'boarding_pass', label: 'Boarding Pass', icon: '🎫' },
        { value: 'hotel_booking', label: 'Hotel Booking', icon: '🏨' },
        { value: 'travel_insurance', label: 'Travel Insurance', icon: '🛡️' },
        { value: 'vaccination', label: 'Vaccination Certificate', icon: '💉' }
      ]
    },
    financial: {
      label: 'Financial Documents',
      types: [
        { value: 'credit_card', label: 'Credit Card', icon: '💳' },
        { value: 'bank_statement', label: 'Bank Statement', icon: '🏦' },
        { value: 'forex_receipt', label: 'Forex Receipt', icon: '💱' },
        { value: 'receipt', label: 'Receipt', icon: '🧾' }
      ]
    },
    emergency: {
      label: 'Emergency Contacts',
      types: [
        { value: 'emergency_contact', label: 'Emergency Contact', icon: '🚨' },
        { value: 'medical_info', label: 'Medical Information', icon: '⚕️' },
        { value: 'embassy_info', label: 'Embassy Information', icon: '🏛️' }
      ]
    }
  };

  // Mock data
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch trips from backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setIsLikedLoading(true);
        const token = await getToken();
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        };
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

        // Fetch My Plans (History)
        const myPlansRes = await fetch(`${backendUrl}/api/v1/plans/my-plans`, { headers });
        if (myPlansRes.ok) {
            const myPlansData = await myPlansRes.json();
            if (myPlansData.status === 'Success') {
              const transformedTrips = (myPlansData.data || []).map(plan => {
                if (!plan) return null;
                return {
                  id: plan._id, title: plan.name || 'Untitled Trip', destination: plan.to || 'Unknown Destination', startDate: plan.date || new Date().toISOString(),
                  totalDays: plan.days || 1, status: new Date(plan.date || new Date()) > new Date() ? 'upcoming' : 'completed',
                  budget: plan.budget || 20000, spent: plan.cost || Math.floor((plan.budget || 20000) * 0.4), travelers: plan.travelers || 1,
                  image: plan.image_url || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400',
                  aiGenerated: !!plan.ai_score, progress: 0, currentDay: 0
                };
              }).filter(Boolean);
              setTrips(transformedTrips);
            }
        }

        // Fetch Liked Plans
        const likedRes = await fetch(`${backendUrl}/api/v1/liked-plans`, { headers });
        if (likedRes.ok) {
            const likedData = await likedRes.json();
            if (likedData.success && likedData.likedPlans) {
              const transformedLiked = (likedData.likedPlans || []).map(plan => {
                if (!plan) return null;
                return {
                  id: plan._id, title: plan.name || 'Untitled Target', destination: plan.to || 'Unknown Destination', startDate: plan.date || new Date().toISOString(),
                  totalDays: plan.days || 1, status: new Date(plan.date || new Date()) > new Date() ? 'upcoming' : 'completed',
                  budget: plan.budget || 30000, spent: plan.cost || Math.floor((plan.budget || 30000) * 0.3), travelers: plan.travelers || 1,
                  image: plan.image_url || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400',
                  aiGenerated: !!plan.ai_score, progress: 0, currentDay: 0
                };
              }).filter(Boolean);
              setLikedTrips(transformedLiked);
            }
        }
      } catch (error) {
        console.error('Fetch Trips Error:', error);
      } finally {
        setLoading(false);
        setIsLikedLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const [itineraryItems] = useState([
    {
      id: '1',
      tripId: '1',
      day: 1,
      time: '08:00',
      type: 'flight',
      title: 'Flight to Tokyo',
      description: 'Departure from JFK Airport',
      location: 'JFK Airport → Haneda Airport',
      duration: '14h 30m',
      cost: 850,
      status: 'confirmed'
    },
    {
      id: '2',
      tripId: '1',
      day: 1,
      time: '14:30',
      type: 'hotel',
      title: 'Check-in at Hotel Shibuya',
      description: 'Modern hotel in central Tokyo',
      location: 'Shibuya District, Tokyo',
      cost: 120,
      status: 'confirmed'
    },
    {
      id: '3',
      tripId: '1',
      day: 2,
      time: '09:00',
      type: 'activity',
      title: 'Senso-ji Temple Visit',
      description: 'Explore ancient Buddhist temple',
      location: 'Asakusa, Tokyo',
      duration: '2h',
      cost: 0,
      status: 'pending'
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: '1',
      tripId: '1',
      name: 'US Passport',
      type: 'passport',
      category: 'identity',
      uploadDate: '2025-08-15',
      expiryDate: '2030-08-15',
      size: '2.1 MB',
      url: '#',
      isPrivate: false
    },
    {
      id: '2',
      tripId: '1',
      name: 'Japan Visa',
      type: 'visa',
      category: 'travel',
      uploadDate: '2025-08-20',
      expiryDate: '2025-12-20',
      size: '1.8 MB',
      url: '#',
      isPrivate: false
    },
    {
      id: '3',
      tripId: '1',
      name: 'Flight Tickets',
      type: 'boarding_pass',
      category: 'travel',
      uploadDate: '2025-09-01',
      size: '956 KB',
      url: '#',
      isPrivate: false
    },
    {
      id: '4',
      tripId: '1',
      name: 'PAN Card',
      type: 'pan_card',
      category: 'identity',
      uploadDate: '2025-08-10',
      expiryDate: '2035-12-31',
      size: '1.2 MB',
      url: '#',
      isPrivate: true,
      notes: 'Important tax document for India travel'
    }
  ]);

  // File upload handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setDocumentPreview(e.target.result);
      reader.readAsDataURL(file);

      // Simulate OCR processing
      setProcessingOCR(true);
      setTimeout(() => {
        setOcrText(`Extracted text from ${file.name}:\nDocument Number: ABC123456\nExpiry Date: 2030-12-31\nName: John Doe`);
        setProcessingOCR(false);
      }, 2000);
    } else {
      setDocumentPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadingDocument(true);

    // Simulate upload process
    setTimeout(() => {
      const newDocument = {
        id: Date.now().toString(),
        tripId: selectedTrip.id,
        name: documentForm.name || selectedFile.name,
        type: documentForm.type,
        category: documentForm.category,
        uploadDate: new Date().toISOString(),
        expiryDate: documentForm.expiryDate,
        size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
        url: documentPreview || '#',
        notes: documentForm.notes,
        isPrivate: documentForm.isPrivate,
        ocrText: ocrText,
        fileType: selectedFile.type,
        fileName: selectedFile.name
      };

      // Add to documents array
      setDocuments(prev => [...prev, newDocument]);

      // Reset form
      setSelectedFile(null);
      setDocumentPreview(null);
      setDocumentForm({
        name: '',
        type: 'passport',
        category: 'identity',
        expiryDate: '',
        notes: '',
        isPrivate: false,
        password: ''
      });
      setOcrText('');
      setUploadingDocument(false);

      alert('Document uploaded successfully!');
    }, 1500);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.trip-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      });

      gsap.from('.itinerary-item', {
        scrollTrigger: {
          trigger: '.itinerary-container',
          start: 'top 85%',
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selectedTrip, activeTab]);

  const currentArray = viewMode === 'history' ? trips : likedTrips;
  const filteredTrips = currentArray.filter(trip => {
    if (!trip) return false;
    const title = trip.title || '';
    const destination = trip.destination || '';
    
    const matchesSearch = title.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
                          destination.toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, viewMode]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage) || 1;
  const paginatedTrips = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalSpent = currentArray.reduce((acc, trip) => acc + (trip.spent || 0), 0);

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      if (!token) return;

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      if (viewMode === 'history') {
        const res = await fetch(`${backendUrl}/api/v1/plans/${tripId}`, { method: 'DELETE', headers });
        if (res.ok) {
          toast.success("Plan deleted permanently.");
          setTrips(trips.filter(t => t.id !== tripId));
        } else {
          toast.error("Failed to delete plan.");
        }
      } else {
        const res = await fetch(`${backendUrl}/api/v1/liked-plans/${tripId}`, { method: 'DELETE', headers });
        if (res.ok) {
          toast.success("Plan removed from Liked Plans.");
          setLikedTrips(likedTrips.filter(t => t.id !== tripId));
        } else {
          toast.error("Failed to remove plan.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during deletion.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/10 text-blue-500 border-blue-500/50';
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/50';
      case 'completed': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'flight': return <Plane size={16} />;
      case 'hotel': return <Hotel size={16} />;
      case 'activity': return <Camera size={16} />;
      case 'restaurant': return <Star size={16} />;
      case 'transport': return <Navigation size={16} />;
      default: return <MapPin size={16} />;
    }
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'passport': return 'bg-purple-500/10 text-purple-500';
      case 'visa': return 'bg-blue-500/10 text-blue-500';
      case 'boarding_pass': return 'bg-green-500/10 text-green-500';
      case 'hotel_booking': return 'bg-orange-500/10 text-orange-500';
      case 'travel_insurance': return 'bg-red-500/10 text-red-500';
      case 'pan_card': return 'bg-yellow-500/10 text-yellow-500';
      case 'aadhar': return 'bg-indigo-500/10 text-indigo-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" ref={containerRef}>
      {/* Header */}
      <NavBar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 relative z-10">
        {!selectedTrip ? (
          <div className="space-y-8">
            {/* View Mode Tabs */}
            <div className="flex justify-center mb-10 mt-4">
              <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 inline-flex shadow-sm relative">
                <button
                  onClick={() => { setViewMode('history'); setCurrentPage(1); }}
                  className={`flex items-center space-x-2.5 py-3 px-8 rounded-xl transition-all duration-300 font-semibold z-10 ${
                    viewMode === 'history' ? 'text-white' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  <Compass size={18} />
                  <span>Search History</span>
                </button>
                <button
                  onClick={() => { setViewMode('liked'); setCurrentPage(1); }}
                  className={`flex items-center space-x-2.5 py-3 px-8 rounded-xl transition-all duration-300 font-semibold z-10 ${
                    viewMode === 'liked' ? 'text-white' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  <Heart size={18} />
                  <span>Saved & Liked Plans</span>
                </button>
                <div 
                  className={`absolute top-1.5 bottom-1.5 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg transition-transform duration-300 ease-in-out ${viewMode === 'history' ? 'translate-x-0' : 'translate-x-[calc(100%-0px)]'}`}
                  style={{ width: 'calc(50% - 3px)' }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-card/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row flex-1 w-full gap-4 items-center">
                <div className="relative w-full sm:max-w-md group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    className="pl-11 h-12 w-full bg-background/50 border-white/10 hover:border-primary/30 text-white rounded-xl text-base"
                    placeholder="Search past trips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <select
                    className="appearance-none h-12 w-full sm:w-48 bg-background/50 border border-white/10 hover:border-primary/30 rounded-xl px-4 py-2 pr-10 text-white cursor-pointer transition-all"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Trips</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <Button className="w-full md:w-auto h-12 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 rounded-xl shadow-lg">
                <Plus size={18} className="mr-2" />
                Plan New Trip
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-white/5 shadow-xl group hover:border-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
                  <CardContent className="p-6 relative z-10 flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-inner">
                        <MapPin size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Trips</p>
                      <p className="text-3xl font-bold text-white">{currentArray.length}</p>
                    </div>
                  </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-white/5 shadow-xl group hover:border-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
                  <CardContent className="p-6 relative z-10 flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner">
                        <Navigation size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Trips</p>
                      <p className="text-3xl font-bold text-white">{currentArray.filter(t => t.status === 'active').length}</p>
                    </div>
                  </CardContent>
              </Card>
               <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-white/5 shadow-xl group hover:border-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
                  <CardContent className="p-6 relative z-10 flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
                        <Camera size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Destinations</p>
                      <p className="text-3xl font-bold text-white">12</p>
                    </div>
                  </CardContent>
              </Card>
               <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-white/5 shadow-xl group hover:border-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
                  <CardContent className="p-6 relative z-10 flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
                        <Star size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Spent</p>
                      <p className="text-2xl font-bold text-white">{inrFormat.format(totalSpent)}</p>
                    </div>
                  </CardContent>
              </Card>
            </div>

            {/* Trip Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(viewMode === 'history' ? loading : isLikedLoading) ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                  <p className="text-muted-foreground">Fetching your adventures...</p>
                </div>
              ) : currentArray.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                   <Compass size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                   <h2 className="text-2xl font-bold text-white mb-2">No Plans Yet</h2>
                   <p className="text-muted-foreground mb-6">Looks like you haven't {viewMode === 'history' ? 'generated' : 'saved'} any trips yet.</p>
                </div>
              ) : (
                paginatedTrips.map(trip => (
                  <div
                    key={trip.id}
                    className="group cursor-pointer relative rounded-3xl overflow-hidden min-h-[420px] shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/5 hover:border-primary/30"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <div className="absolute inset-0">
                      <img src={trip.image} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/60 to-transparent" />
                      <div className="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    <div className="relative h-full p-6 flex flex-col justify-between z-10">
                      <div className="flex justify-between items-start">
                        <Badge className="backdrop-blur-md bg-white/10 text-white shadow-sm font-medium border-white/20 capitalize">
                          {trip.status}
                        </Badge>
                        <div className="flex gap-2 items-center">
                          {trip.aiGenerated && (
                            <Badge className="bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 border-white/20 text-white shadow-lg backdrop-blur-md">
                              ✨ AI
                            </Badge>
                          )}
                          <button 
                            onClick={(e) => handleDeleteTrip(trip.id, e)}
                            className="p-1.5 rounded-full backdrop-blur-md bg-red-500/20 text-red-100 hover:bg-red-500 hover:text-white transition-all shadow-md border border-red-500/30 z-20 relative"
                            title={viewMode === 'history' ? "Delete permanently" : "Remove from Liked"}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                         <div>
                           <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors drop-shadow-md line-clamp-1">{trip.title}</h3>
                           <div className="flex items-center text-zinc-300 font-medium">
                             <MapPin size={16} className="mr-1.5 text-primary" />
                             {trip.destination}
                           </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Budget</p>
                                <p className="text-white text-sm font-medium">{inrFormat.format(trip.budget)}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Travelers</p>
                                <p className="text-white text-sm font-medium">{trip.travelers} Pax</p>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {!(viewMode === 'history' ? loading : isLikedLoading) && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 py-4 z-10 relative">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-card/40 backdrop-blur-md border border-white/10 text-white hover:text-black hover:bg-white"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1 hidden sm:flex">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                          : 'bg-card/40 backdrop-blur-md border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-card/40 backdrop-blur-md border border-white/10 text-white hover:text-black hover:bg-white"
                >
                  Next
                </Button>
              </div>
            )}
            
          </div>
        ) : (
          // Trip Detail View
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 relative z-10 space-y-6">
            {/* Back Button & Trip Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setSelectedTrip(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Trips
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-green-500 border-green-500/20 hover:bg-green-500/10">
                  <Heart size={16} className="mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="text-muted-foreground border-border hover:bg-muted">
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Trip Info Header */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <img
                    src={selectedTrip.image}
                    alt={selectedTrip.title}
                    className="w-full lg:w-64 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground">{selectedTrip.title}</h1>
                        <p className="text-xl text-muted-foreground">{selectedTrip.destination}</p>
                      </div>
                      <Badge className={getStatusColor(selectedTrip.status)}>
                        {selectedTrip.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="text-foreground font-semibold">
                          {new Date(selectedTrip.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="text-foreground font-semibold">{selectedTrip.totalDays} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="text-foreground font-semibold">{inrFormat.format(selectedTrip.budget)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Travelers</p>
                        <p className="text-foreground font-semibold">{selectedTrip.travelers}</p>
                      </div>
                    </div>

                    {selectedTrip.status === 'active' && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Trip Progress</span>
                          <span className="text-foreground">
                            Day {selectedTrip.currentDay} of {selectedTrip.totalDays}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                            style={{ width: `${selectedTrip.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {[
                  { key: 'overview', label: 'Overview', icon: <Eye size={16} /> },
                  { key: 'itinerary', label: 'Itinerary', icon: <Calendar size={16} /> },
                  { key: 'documents', label: 'Documents', icon: <FileText size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground">Trip Summary</CardTitle>
                        <CardDescription>
                          AI-generated insights and recommendations
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-muted-foreground">
                          Your {selectedTrip.totalDays}-day adventure through {selectedTrip.destination} has been
                          carefully crafted by AI to maximize your experience. This itinerary balances cultural
                          exploration, culinary delights, and memorable activities.
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="text-primary" size={16} />
                              <span className="text-sm text-muted-foreground">Destinations</span>
                            </div>
                            <span className="text-foreground font-semibold">5 cities</span>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Star className="text-yellow-500" size={16} />
                              <span className="text-sm text-muted-foreground">Activities</span>
                            </div>
                            <span className="text-foreground font-semibold">12 planned</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground">Budget Tracker</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Spent</span>
                            <span className="text-foreground">{inrFormat.format(selectedTrip.spent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Remaining</span>
                            <span className="text-green-500">
                              {inrFormat.format(selectedTrip.budget - selectedTrip.spent)}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(selectedTrip.spent / selectedTrip.budget) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start border-input text-muted-foreground hover:text-foreground">
                          <Edit3 size={16} className="mr-2" />
                          Edit Trip Details
                        </Button>
                        <Button variant="outline" className="w-full justify-start border-input text-muted-foreground hover:text-foreground">
                          <Share2 size={16} className="mr-2" />
                          Share with Friends
                        </Button>
                        <Button variant="outline" className="w-full justify-start border-input text-muted-foreground hover:text-foreground">
                          <Download size={16} className="mr-2" />
                          Export Itinerary
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-foreground">Trip Itinerary</h3>
                    <Button>
                      <Plus size={16} className="mr-2" />
                      Add Activity
                    </Button>
                  </div>
                  <div className="itinerary-container space-y-4">
                    {itineraryItems.map((item) => (
                      <Card key={item.id} className="itinerary-item bg-card border-border">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="p-3 bg-muted rounded-full text-foreground">
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-semibold text-foreground">{item.title}</h4>
                              <span className="text-sm text-muted-foreground">{item.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-foreground">Trip Documents</h3>
                    <Button onClick={() => setShowAddForm(true)}>
                      <Upload size={16} className="mr-2" />
                      Upload Document
                    </Button>
                  </div>

                  {/* Document Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map(doc => (
                      <Card key={doc.id} className="bg-card border-border">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getDocumentTypeColor(doc.type).split(' ')[0]}`}>
                              <FileText className={getDocumentTypeColor(doc.type).split(' ')[1]} size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download size={16} />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {showAddForm && (
                    <Card className="bg-card border-border mt-6">
                      <CardHeader>
                        <CardTitle className="text-foreground">Upload New Document</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload').click()}
                          >
                            <input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                            />
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-foreground font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                          </div>

                          {selectedFile && (
                            <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                              <span className="text-foreground">{selectedFile.name}</span>
                              <Button size="sm" onClick={handleUpload} disabled={uploadingDocument}>
                                {uploadingDocument ? 'Uploading...' : 'Upload'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyTripsPage;
