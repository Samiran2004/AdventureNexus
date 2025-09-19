import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Camera,
    Edit,
    Save,
    X,
    Settings,
    Plane,
    Hotel,
    Car,
    Utensils,
    Heart,
    Globe,
    Shield,
    Bell,
    CreditCard,
    History,
    Star,
    Compass,
    Users,
    DollarSign,
    Clock,
    Smartphone,
    Award,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/components/NavBar';

gsap.registerPlugin(ScrollTrigger);

const ProfilePage = () => {
    // Sample user data - replace with actual user data from your auth system
    const [userData, setUserData] = useState({
        firstName: 'Sarah',
        lastName: 'Mitchell',
        email: 'sarah.mitchell@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        joinDate: '2024-01-15',
        profilePicture: null, // Set to null to show initials
        bio: 'Digital nomad and adventure seeker. Love exploring hidden gems and experiencing local cultures.',
        preferences: {
            travelStyle: ['Adventure', 'Cultural', 'Nature'],
            budgetRange: '$1000-3000',
            accommodation: ['Hotels', 'Airbnb'],
            transportation: ['Flight', 'Train'],
            dietaryRequirements: ['Vegetarian'],
            accessibility: [],
            interests: ['Photography', 'Hiking', 'Local Cuisine', 'Museums'],
            groupSize: 'Solo',
            travelPace: 'Moderate',
            language: 'English',
            currency: 'USD'
        },
        stats: {
            tripsPlanned: 24,
            countriesVisited: 18,
            favoriteDestinations: 12,
            reviewsWritten: 8
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...userData });
    const [activeTab, setActiveTab] = useState('profile');
    
    // Refs for animations
    const headerRef = useRef(null);
    const contentRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Header animation
            gsap.from(headerRef.current, {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power2.out"
            });

            // Content animation
            gsap.from(contentRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.3,
                ease: "power2.out"
            });

            // Stats animation
            gsap.from(statsRef.current?.children, {
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                stagger: 0.1,
                delay: 0.5,
                ease: "back.out(1.7)"
            });
        });

        return () => ctx.revert();
    }, []);

    // Generate initials for profile picture
    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    };

    // Generate background color based on name
    const getProfileColor = (name) => {
        const colors = [
            'from-blue-600 to-purple-600',
            'from-green-600 to-teal-600', 
            'from-pink-600 to-rose-600',
            'from-orange-600 to-red-600',
            'from-indigo-600 to-blue-600',
            'from-purple-600 to-pink-600'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setEditData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setEditData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleArrayChange = (field, value, isChecked) => {
        const [parent, child] = field.split('.');
        setEditData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [child]: isChecked 
                    ? [...prev[parent][child], value]
                    : prev[parent][child].filter(item => item !== value)
            }
        }));
    };

    const handleSave = () => {
        setUserData({ ...editData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ ...userData });
        setIsEditing(false);
    };

    const ProfilePicture = ({ size = "w-24 h-24", textSize = "text-2xl" }) => (
        <div className={`${size} rounded-full bg-gradient-to-r ${getProfileColor(userData.firstName + userData.lastName)} flex items-center justify-center ${textSize} font-bold text-white relative group cursor-pointer`}>
            {userData.profilePicture ? (
                <img 
                    src={userData.profilePicture} 
                    alt="Profile" 
                    className={`${size} rounded-full object-cover`}
                />
            ) : (
                getInitials(userData.firstName, userData.lastName)
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={20} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <NavBar />
            
            {/* Profile Header */}
            <section ref={headerRef} className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-900/20 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-900/20 rounded-full opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        <ProfilePicture size="w-32 h-32" textSize="text-4xl" />
                        
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                                        {userData.firstName} {userData.lastName}
                                    </h1>
                                    <p className="text-gray-400 text-lg">Digital Nomad & Travel Enthusiast</p>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center space-x-4 mt-2 text-sm text-gray-400">
                                        <div className="flex items-center">
                                            <MapPin size={16} className="mr-1" />
                                            {userData.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar size={16} className="mr-1" />
                                            Joined {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-4 md:mt-0">
                                    <Button
                                        variant={isEditing ? "destructive" : "outline"}
                                        size="sm"
                                        onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                                        className="border-gray-600 text-blue-600 hover:bg-green-400 hover:text-white hover:border-white"
                                    >
                                        {isEditing ? <X size={16} className="mr-2" /> : <Edit size={16} className="mr-2" />}
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </Button>
                                    {isEditing && (
                                        <Button
                                            size="sm"
                                            onClick={handleSave}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                                        >
                                            <Save size={16} className="mr-2" />
                                            Save
                                        </Button>
                                    )}
                                </div>
                            </div>
                            
                            <p className="text-gray-300 max-w-2xl">
                                {userData.bio}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section ref={statsRef} className="py-10 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Card className="bg-gray-800 border-gray-700 text-center">
                            <CardContent className="p-4">
                                <Plane className="text-blue-400 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-white">{userData.stats.tripsPlanned}</div>
                                <div className="text-sm text-gray-400">Trips Planned</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700 text-center">
                            <CardContent className="p-4">
                                <Globe className="text-green-400 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-white">{userData.stats.countriesVisited}</div>
                                <div className="text-sm text-gray-400">Countries Visited</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700 text-center">
                            <CardContent className="p-4">
                                <Heart className="text-pink-400 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-white">{userData.stats.favoriteDestinations}</div>
                                <div className="text-sm text-gray-400">Favorites</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700 text-center">
                            <CardContent className="p-4">
                                <Star className="text-yellow-400 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-white">{userData.stats.reviewsWritten}</div>
                                <div className="text-sm text-gray-400">Reviews</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section ref={contentRef} className="py-10 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg max-w-fit">
                        {[
                            { id: 'profile', label: 'Profile', icon: User },
                            { id: 'preferences', label: 'Travel Preferences', icon: Compass },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-2 rounded-md transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <tab.icon size={16} className="mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2">
                            {activeTab === 'profile' && (
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Personal Information</CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Manage your personal details and contact information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    First Name
                                                </label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editData.firstName}
                                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                        className="bg-gray-800 border-gray-700 text-white"
                                                    />
                                                ) : (
                                                    <p className="text-white">{userData.firstName}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Last Name
                                                </label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editData.lastName}
                                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        className="bg-gray-800 border-gray-700 text-white"
                                                    />
                                                ) : (
                                                    <p className="text-white">{userData.lastName}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <Mail className="text-gray-400" size={16} />
                                                {isEditing ? (
                                                    <Input
                                                        type="email"
                                                        value={editData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className="bg-gray-800 border-gray-700 text-white flex-1"
                                                    />
                                                ) : (
                                                    <p className="text-white">{userData.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Phone Number
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <Phone className="text-gray-400" size={16} />
                                                {isEditing ? (
                                                    <Input
                                                        value={editData.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        className="bg-gray-800 border-gray-700 text-white flex-1"
                                                    />
                                                ) : (
                                                    <p className="text-white">{userData.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Location
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <MapPin className="text-gray-400" size={16} />
                                                {isEditing ? (
                                                    <Input
                                                        value={editData.location}
                                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                                        className="bg-gray-800 border-gray-700 text-white flex-1"
                                                    />
                                                ) : (
                                                    <p className="text-white">{userData.location}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Bio
                                            </label>
                                            {isEditing ? (
                                                <Textarea
                                                    value={editData.bio}
                                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                                    className="bg-gray-800 border-gray-700 text-white"
                                                    rows={3}
                                                />
                                            ) : (
                                                <p className="text-white">{userData.bio}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    {/* Travel Style */}
                                    <Card className="bg-gray-900 border-gray-700">
                                        <CardHeader>
                                            <CardTitle className="text-white flex items-center">
                                                <Compass className="mr-2" size={20} />
                                                Travel Preferences
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                                    Travel Style
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    {['Adventure', 'Cultural', 'Relaxation', 'Nature', 'Urban', 'Beach'].map(style => (
                                                        <label key={style} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={userData.preferences.travelStyle.includes(style)}
                                                                onChange={(e) => handleArrayChange('preferences.travelStyle', style, e.target.checked)}
                                                                className="rounded bg-gray-800 border-gray-600"
                                                                disabled={!isEditing}
                                                            />
                                                            <span className="text-gray-300 text-sm">{style}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Budget Range
                                                </label>
                                                {isEditing ? (
                                                    <select
                                                        value={editData.preferences.budgetRange}
                                                        onChange={(e) => handleInputChange('preferences.budgetRange', e.target.value)}
                                                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                                                    >
                                                        <option value="$500-1000">$500 - $1,000</option>
                                                        <option value="$1000-3000">$1,000 - $3,000</option>
                                                        <option value="$3000-5000">$3,000 - $5,000</option>
                                                        <option value="$5000+">$5,000+</option>
                                                    </select>
                                                ) : (
                                                    <p className="text-white">{userData.preferences.budgetRange}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                                    Accommodation Preferences
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Hotels', 'Airbnb', 'Hostels', 'Resorts', 'Camping'].map(acc => (
                                                        <label key={acc} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={userData.preferences.accommodation.includes(acc)}
                                                                onChange={(e) => handleArrayChange('preferences.accommodation', acc, e.target.checked)}
                                                                className="rounded bg-gray-800 border-gray-600"
                                                                disabled={!isEditing}
                                                            />
                                                            <span className="text-gray-300 text-sm">{acc}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                                    Dietary Requirements
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'No Restrictions'].map(diet => (
                                                        <label key={diet} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={userData.preferences.dietaryRequirements.includes(diet)}
                                                                onChange={(e) => handleArrayChange('preferences.dietaryRequirements', diet, e.target.checked)}
                                                                className="rounded bg-gray-800 border-gray-600"
                                                                disabled={!isEditing}
                                                            />
                                                            <span className="text-gray-300 text-sm">{diet}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center">
                                            <Settings className="mr-2" size={20} />
                                            Account Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-white font-medium">Email Notifications</h4>
                                                    <p className="text-gray-400 text-sm">Get notified about trip updates</p>
                                                </div>
                                                <input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-600" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-white font-medium">SMS Alerts</h4>
                                                    <p className="text-gray-400 text-sm">Receive trip reminders via SMS</p>
                                                </div>
                                                <input type="checkbox" className="rounded bg-gray-800 border-gray-600" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-white font-medium">Marketing Emails</h4>
                                                    <p className="text-gray-400 text-sm">Get travel deals and recommendations</p>
                                                </div>
                                                <input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-600" />
                                            </div>
                                        </div>

                                        <hr className="border-gray-700" />

                                        <div>
                                            <h4 className="text-white font-medium mb-4">Privacy Settings</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-300">Profile Visibility</span>
                                                    <select className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 text-sm">
                                                        <option>Public</option>
                                                        <option>Friends Only</option>
                                                        <option>Private</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-300">Show Travel History</span>
                                                    <input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card className="bg-gray-900 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        <Plane className="mr-2" size={16} />
                                        Plan New Trip
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start border-gray-600 text-blue-500 hover:bg-green-400 hover:text-white hover:border-white">
                                        <History className="mr-2" size={16} />
                                        View Trip History
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start border-gray-600 text-blue-500 hover:bg-green-500 hover:text-white hover:border-white">
                                        <Heart className="mr-2" size={16} />
                                        Saved Destinations
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Achievements */}
                            <Card className="bg-gray-900 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg flex items-center">
                                        <Award className="mr-2" size={20} />
                                        Achievements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                                            <Star size={16} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">Explorer</p>
                                            <p className="text-gray-400 text-xs">Visited 10+ countries</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Users size={16} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">Community Helper</p>
                                            <p className="text-gray-400 text-xs">Wrote 5+ reviews</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                            <CheckCircle size={16} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">Planner Pro</p>
                                            <p className="text-gray-400 text-xs">Completed 20+ trips</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="bg-gray-900 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-sm">
                                        <p className="text-white">Planned trip to Tokyo</p>
                                        <p className="text-gray-400">2 days ago</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-white">Added Paris to favorites</p>
                                        <p className="text-gray-400">1 week ago</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-white">Wrote review for Barcelona trip</p>
                                        <p className="text-gray-400">2 weeks ago</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;