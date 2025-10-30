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

const MyTripsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Enhanced document states
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
      case 'upcoming': return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'active': return 'bg-green-900/50 text-green-400 border-green-700';
      case 'completed': return 'bg-gray-900/50 text-gray-400 border-gray-700';
      default: return 'bg-gray-900/50 text-gray-400 border-gray-700';
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
      case 'passport': return 'bg-purple-900/50 text-purple-400';
      case 'visa': return 'bg-blue-900/50 text-blue-400';
      case 'boarding_pass': return 'bg-green-900/50 text-green-400';
      case 'hotel_booking': return 'bg-orange-900/50 text-orange-400';
      case 'travel_insurance': return 'bg-red-900/50 text-red-400';
      case 'pan_card': return 'bg-yellow-900/50 text-yellow-400';
      case 'aadhar': return 'bg-indigo-900/50 text-indigo-400';
      default: return 'bg-gray-900/50 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white" ref={containerRef}>
      {/* Header */}
      <NavBar/>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedTrip ? (
          // Trip Overview
          <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10 bg-gray-900 border-gray-700"
                    placeholder="Search trips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus size={16} className="mr-2" />
                New Trip
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Trips</p>
                      <p className="text-2xl font-bold text-white">{trips.length}</p>
                    </div>
                    <MapPin className="text-blue-400" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Trips</p>
                      <p className="text-2xl font-bold text-white">
                        {trips.filter(t => t.status === 'active').length}
                      </p>
                    </div>
                    <Navigation className="text-green-400" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Countries Visited</p>
                      <p className="text-2xl font-bold text-white">12</p>
                    </div>
                    <Camera className="text-purple-400" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Spent</p>
                      <p className="text-2xl font-bold text-white">$12.5K</p>
                    </div>
                    <Star className="text-yellow-400" size={32} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trip Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <Card
                  key={trip.id}
                  className="trip-card bg-gray-900 border-gray-700 hover:border-blue-500 transition-all cursor-pointer group"
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
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                          AI Generated
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {trip.title}
                        </h3>
                        <p className="text-gray-400">{trip.destination}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
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
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">Day {trip.currentDay} of {trip.totalDays}</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                              style={{ width: `${trip.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-400">Budget</p>
                          <p className="text-white font-semibold">${trip.budget}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Travelers</p>
                          <p className="text-white font-semibold">{trip.travelers}</p>
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
                className="text-gray-400 hover:text-white"
              >
                ← Back to Trips
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text- bg-green-500 hover:bg-green-800 hover:text-white border-gray-600">
                  <Heart size={16} className="mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="text- bg-green-500 hover:bg-green-800 hover:text-white border-gray-600">
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Trip Info Header */}
            <Card className="bg-gray-900 border-gray-700">
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
                        <h1 className="text-3xl font-bold text-white">{selectedTrip.title}</h1>
                        <p className="text-xl text-gray-400">{selectedTrip.destination}</p>
                      </div>
                      <Badge className={getStatusColor(selectedTrip.status)}>
                        {selectedTrip.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Start Date</p>
                        <p className="text-white font-semibold">
                          {new Date(selectedTrip.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Duration</p>
                        <p className="text-white font-semibold">{selectedTrip.totalDays} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Budget</p>
                        <p className="text-white font-semibold">${selectedTrip.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Travelers</p>
                        <p className="text-white font-semibold">{selectedTrip.travelers}</p>
                      </div>
                    </div>

                    {selectedTrip.status === 'active' && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Trip Progress</span>
                          <span className="text-white">
                            Day {selectedTrip.currentDay} of {selectedTrip.totalDays}
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
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
            <div className="border-b border-gray-800">
              <nav className="flex space-x-8">
                {[
                  { key: 'overview', label: 'Overview', icon: <Eye size={16} /> },
                  { key: 'itinerary', label: 'Itinerary', icon: <Calendar size={16} /> },
                  { key: 'documents', label: 'Documents', icon: <FileText size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-white'
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
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Trip Summary</CardTitle>
                        <CardDescription>
                          AI-generated insights and recommendations
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-gray-300">
                          Your {selectedTrip.totalDays}-day adventure through {selectedTrip.destination} has been 
                          carefully crafted by AI to maximize your experience. This itinerary balances cultural 
                          exploration, culinary delights, and memorable activities.
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="text-blue-400" size={16} />
                              <span className="text-sm text-gray-400">Destinations</span>
                            </div>
                            <span className="text-white font-semibold">5 cities</span>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Star className="text-yellow-400" size={16} />
                              <span className="text-sm text-gray-400">Activities</span>
                            </div>
                            <span className="text-white font-semibold">12 planned</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Budget Tracker</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Spent</span>
                            <span className="text-white">${selectedTrip.spent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Remaining</span>
                            <span className="text-green-400">
                              ${selectedTrip.budget - selectedTrip.spent}
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ 
                                width: `${(selectedTrip.spent / selectedTrip.budget) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start border-gray-600">
                          <Edit3 size={16} className="mr-2" />
                          Edit Trip Details
                        </Button>
                        <Button variant="outline" className="w-full justify-start border-gray-600">
                          <Share2 size={16} className="mr-2" />
                          Share with Friends
                        </Button>
                        <Button variant="outline" className="w-full justify-start border-gray-600">
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
                    <h3 className="text-xl font-semibold text-white">Trip Itinerary</h3>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <Plus size={16} className="mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="itinerary-container space-y-4">
                    {itineraryItems
                      .filter(item => item.tripId === selectedTrip.id)
                      .reduce((acc, item) => {
                        if (!acc[item.day]) acc[item.day] = [];
                        acc[item.day].push(item);
                        return acc;
                      }, {})
                      && Object.entries(
                        itineraryItems
                          .filter(item => item.tripId === selectedTrip.id)
                          .reduce((acc, item) => {
                            if (!acc[item.day]) acc[item.day] = [];
                            acc[item.day].push(item);
                            return acc;
                          }, {})
                      ).map(([day, items]) => (
                        <Card key={day} className="bg-gray-900 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center space-x-2">
                              <Calendar size={20} />
                              <span>Day {day}</span>
                              <Badge variant="outline" className="border-gray-600">
                                {items.length} activities
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="itinerary-item flex items-start space-x-4 p-4 bg-gray-800 rounded-lg"
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                                    {getTypeIcon(item.type)}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="text-white font-semibold">{item.title}</h4>
                                      <p className="text-gray-400 text-sm">{item.description}</p>
                                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <span>{item.time}</span>
                                        <span>{item.location}</span>
                                        {item.duration && <span>{item.duration}</span>}
                                        {item.cost && <span>${item.cost}</span>}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge className={
                                        item.status === 'confirmed' ? 'bg-green-900/50 text-green-400' :
                                        item.status === 'completed' ? 'bg-gray-900/50 text-gray-400' :
                                        'bg-yellow-900/50 text-yellow-400'
                                      }>
                                        {item.status}
                                      </Badge>
                                      <Button variant="ghost" size="sm">
                                        <Edit3 size={14} />
                                      </Button>
                                    </div>
                                  </div>
                                  {item.notes && (
                                    <div className="mt-2 p-2 bg-gray-700 rounded text-sm text-gray-300">
                                      {item.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Travel Documents</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" className=" text-black border-black-300 hover:bg-blue-500">
                        <Scan size={16} className="mr-2" />
                        Scan Document
                      </Button>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <Upload size={16} className="mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>

                  {/* Document Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(documentCategories).map(([categoryKey, category]) => (
                      <Card key={categoryKey} className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="text-white font-semibold mb-2">{category.label}</h4>
                          <div className="text-sm text-gray-400">
                            {documents.filter(doc => doc.category === categoryKey && doc.tripId === selectedTrip.id).length} documents
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Upload Area */}
                  <Card className="bg-gray-900 border-gray-700">
                    <CardContent className="p-6">
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {!selectedFile ? (
                          <>
                            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                            <h4 className="text-white font-semibold mb-2">Upload Your Documents</h4>
                            <p className="text-gray-400 text-sm mb-4">
                              Drag and drop files here, or click to browse
                            </p>
                            <p className="text-gray-500 text-xs mb-4">
                              Supports: JPG, PNG, PDF, DOC (Max 10MB)
                            </p>
                            <input
                              type="file"
                              id="file-upload"
                              className="hidden"
                              accept="image/*,.pdf,.doc,.docx"
                              onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                            />
                            <Button 
                              variant="outline" 
                              className="border-gray-600"
                              onClick={() => document.getElementById('file-upload').click()}
                            >
                              Choose Files
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-4">
                              <div className="flex items-center space-x-2">
                                {selectedFile.type.startsWith('image/') ? (
                                  <ImageIcon className="text-blue-400" size={24} />
                                ) : (
                                  <File className="text-gray-400" size={24} />
                                )}
                                <span className="text-white font-medium">{selectedFile.name}</span>
                                <span className="text-gray-400 text-sm">
                                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedFile(null);
                                  setDocumentPreview(null);
                                  setOcrText('');
                                }}
                              >
                                <XCircle size={16} />
                              </Button>
                            </div>
                            
                            {/* Document Preview */}
                            {documentPreview && (
                              <div className="max-w-md mx-auto">
                                <img
                                  src={documentPreview}
                                  alt="Document preview"
                                  className="w-full h-48 object-cover rounded-lg border border-gray-600"
                                />
                              </div>
                            )}
                            
                            {/* OCR Processing/Results */}
                            {processingOCR ? (
                              <div className="flex items-center justify-center space-x-2 text-blue-400">
                                <RefreshCw size={16} className="animate-spin" />
                                <span>Extracting text from document...</span>
                              </div>
                            ) : ocrText && (
                              <div className="text-left bg-gray-800 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-300">Extracted Information:</span>
                                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(ocrText)}>
                                    <Copy size={14} />
                                  </Button>
                                </div>
                                <pre className="text-xs text-gray-400 whitespace-pre-wrap">{ocrText}</pre>
                              </div>
                            )}
                            
                            {/* Document Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  Document Name
                                </label>
                                <Input
                                  value={documentForm.name}
                                  onChange={(e) => setDocumentForm(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="Enter document name"
                                  className="bg-gray-800 border-gray-600"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  Document Type
                                </label>
                                <select
                                  value={documentForm.type}
                                  onChange={(e) => setDocumentForm(prev => ({ ...prev, type: e.target.value }))}
                                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                                >
                                  {Object.entries(documentCategories).map(([categoryKey, category]) =>
                                    category.types.map(type => (
                                      <option key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                      </option>
                                    ))
                                  )}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  Category
                                </label>
                                <select
                                  value={documentForm.category}
                                  onChange={(e) => setDocumentForm(prev => ({ ...prev, category: e.target.value }))}
                                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                                >
                                  {Object.entries(documentCategories).map(([key, category]) => (
                                    <option key={key} value={key}>{category.label}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  Expiry Date (Optional)
                                </label>
                                <Input
                                  type="date"
                                  value={documentForm.expiryDate}
                                  onChange={(e) => setDocumentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                                  className="bg-gray-800 border-gray-600"
                                />
                              </div>
                              
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  Notes (Optional)
                                </label>
                                <textarea
                                  value={documentForm.notes}
                                  onChange={(e) => setDocumentForm(prev => ({ ...prev, notes: e.target.value }))}
                                  placeholder="Add any additional notes about this document"
                                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white min-h-20"
                                />
                              </div>
                              
                              <div className="md:col-span-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id="isPrivate"
                                      checked={documentForm.isPrivate}
                                      onChange={(e) => setDocumentForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                                      className="rounded border-gray-600"
                                    />
                                    <label htmlFor="isPrivate" className="text-sm text-gray-300 flex items-center">
                                      <Shield size={14} className="mr-1" />
                                      Mark as private (requires password to view)
                                    </label>
                                  </div>
                                  
                                  {documentForm.isPrivate && (
                                    <Input
                                      type="password"
                                      placeholder="Set password"
                                      value={documentForm.password}
                                      onChange={(e) => setDocumentForm(prev => ({ ...prev, password: e.target.value }))}
                                      className="w-32 bg-gray-800 border-gray-600"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-4">
                              <Button
                                onClick={handleUpload}
                                disabled={uploadingDocument}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 flex-1"
                              >
                                {uploadingDocument ? (
                                  <>
                                    <RefreshCw size={16} className="mr-2 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 size={16} className="mr-2" />
                                    Save Document
                                  </>
                                )}
                              </Button>
                              
                              <Button
                                variant="outline"
                                onClick={() => {
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
                                }}
                                className="border-gray-600"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Document Grid by Category */}
                  <div className="space-y-6">
                    {Object.entries(documentCategories).map(([categoryKey, category]) => {
                      const categoryDocs = documents.filter(doc => 
                        doc.category === categoryKey && doc.tripId === selectedTrip.id
                      );
                      
                      if (categoryDocs.length === 0) return null;
                      
                      return (
                        <div key={categoryKey}>
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                            {category.label}
                            <Badge className="ml-2 bg-gray-700">{categoryDocs.length}</Badge>
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryDocs.map((doc) => {
                              const docType = Object.values(documentCategories)
                                .flatMap(cat => cat.types)
                                .find(type => type.value === doc.type);
                              
                              return (
                                <Card key={doc.id} className="bg-gray-900 border-gray-700 group hover:border-blue-500 transition-colors">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-lg">
                                          {docType?.icon || '📄'}
                                        </div>
                                        <div>
                                          <h4 className="text-white font-semibold text-sm">{doc.name}</h4>
                                          <p className="text-gray-400 text-xs">{doc.size}</p>
                                          {doc.isPrivate && (
                                            <div className="flex items-center mt-1">
                                              <Lock size={12} className="text-yellow-400 mr-1" />
                                              <span className="text-yellow-400 text-xs">Private</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical size={14} />
                                      </Button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Badge className={getDocumentTypeColor(doc.type)}>
                                        {docType?.label || doc.type}
                                      </Badge>
                                      
                                      <div className="text-xs text-gray-400">
                                        <div>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</div>
                                        {doc.expiryDate && (
                                          <div className={
                                            new Date(doc.expiryDate) < new Date(Date.now() + 30*24*60*60*1000) 
                                              ? 'text-red-400 flex items-center' : 'text-gray-400'
                                          }>
                                            {new Date(doc.expiryDate) < new Date(Date.now() + 30*24*60*60*1000) && (
                                              <AlertTriangle size={12} className="mr-1" />
                                            )}
                                            Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                                          </div>
                                        )}
                                        {doc.notes && (
                                          <div className="mt-1 p-2 bg-gray-800 rounded text-xs">
                                            {doc.notes}
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex space-x-2 pt-2">
                                        <Button variant="outline" size="sm" className="flex-1 border-gray-600">
                                          <Eye size={12} className="mr-1" />
                                          {doc.isPrivate ? 'Unlock' : 'View'}
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 border-gray-600">
                                          <Download size={12} className="mr-1" />
                                          Download
                                        </Button>
                                        <Button variant="outline" size="sm" className="border-gray-600">
                                          <Share2 size={12} />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Security Notice */}
                  <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700/30">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <h4 className="text-blue-300 font-semibold mb-1">Secure Document Storage</h4>
                          <p className="text-blue-200/80 text-sm">
                            Your documents are encrypted and stored securely. Private documents require password verification before viewing. 
                            We recommend enabling two-factor authentication for additional security.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default MyTripsPage;
