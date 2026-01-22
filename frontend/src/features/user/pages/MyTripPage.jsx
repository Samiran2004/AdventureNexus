import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
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
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';

gsap.registerPlugin(ScrollTrigger);

// MyTripsPage component manages and displays the user's trips
const MyTripsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
  const [trips] = useState([
    {
      id: '1',
      title: 'Japan Adventure',
      destination: 'Tokyo, Kyoto, Osaka',
      startDate: '2025-10-15',
      endDate: '2025-10-22',
      status: 'upcoming',
      progress: 85,
      totalDays: 7,
      budget: 3500,
      spent: 2100,
      travelers: 2,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
      aiGenerated: true
    },
    {
      id: '2',
      title: 'European Summer',
      destination: 'Paris, Rome, Barcelona',
      startDate: '2025-07-10',
      endDate: '2025-07-20',
      status: 'completed',
      progress: 100,
      totalDays: 10,
      budget: 4200,
      spent: 4150,
      travelers: 1,
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400',
      aiGenerated: true
    },
    {
      id: '3',
      title: 'Thailand Retreat',
      destination: 'Bangkok, Phuket, Chiang Mai',
      startDate: '2025-09-20',
      endDate: '2025-09-23',
      status: 'active',
      progress: 40,
      totalDays: 14,
      currentDay: 6,
      budget: 2800,
      spent: 1200,
      travelers: 4,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      aiGenerated: true
    }
  ]);

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

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedTrip ? (
          // Trip Overview
          <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-10 bg-input border-input"
                    placeholder="Search trips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="bg-background border border-input rounded-md px-3 py-2 text-foreground"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                <Plus size={16} className="mr-2" />
                New Trip
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Trips</p>
                      <p className="text-2xl font-bold text-foreground">{trips.length}</p>
                    </div>
                    <MapPin className="text-primary" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Active Trips</p>
                      <p className="text-2xl font-bold text-foreground">
                        {trips.filter(t => t.status === 'active').length}
                      </p>
                    </div>
                    <Navigation className="text-green-500" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Countries Visited</p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                    </div>
                    <Camera className="text-purple-500" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Spent</p>
                      <p className="text-2xl font-bold text-foreground">$12.5K</p>
                    </div>
                    <Star className="text-yellow-500" size={32} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trip Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <Card
                  key={trip.id}
                  className="trip-card bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedTrip(trip)}
                >
                  <div className="relative">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(trip.status)}>
                        {trip.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                    {trip.aiGenerated && (
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                          AI Generated
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {trip.title}
                        </h3>
                        <p className="text-muted-foreground">{trip.destination}</p>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(trip.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {trip.totalDays} days
                        </div>
                      </div>

                      {trip.status === 'active' && trip.currentDay && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground">Day {trip.currentDay} of {trip.totalDays}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                              style={{ width: `${trip.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="text-foreground font-semibold">${trip.budget}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Travelers</p>
                          <p className="text-foreground font-semibold">{trip.travelers}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Trip Detail View
          <div className="space-y-6">
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
                        <p className="text-foreground font-semibold">${selectedTrip.budget}</p>
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
                            <span className="text-foreground">${selectedTrip.spent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Remaining</span>
                            <span className="text-green-500">
                              ${selectedTrip.budget - selectedTrip.spent}
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
