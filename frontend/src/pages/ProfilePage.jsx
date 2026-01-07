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

// ProfilePage component displays and manages the user's profile information
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
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={20} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavBar />

            {/* Profile Header */}
            <section ref={headerRef} className="bg-background py-20 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-primary/20 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/20 rounded-full opacity-30 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        <ProfilePicture size="w-32 h-32" textSize="text-4xl" />

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                        {userData.firstName} {userData.lastName}
                                    </h1>
                                    <p className="text-muted-foreground text-lg">Digital Nomad & Travel Enthusiast</p>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center space-x-4 mt-2 text-sm text-muted-foreground">
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
                                        className="border-input text-primary hover:bg-primary/10 hover:text-primary hover:border-primary"
                                    >
                                        {isEditing ? <X size={16} className="mr-2" /> : <Edit size={16} className="mr-2" />}
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </Button>
                                    {isEditing && (
                                        <Button
                                            size="sm"
                                            onClick={handleSave}
                                            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                                        >
                                            <Save size={16} className="mr-2" />
                                            Save
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <p className="text-muted-foreground max-w-2xl">
                                {userData.bio}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section ref={statsRef} className="py-10 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Card className="bg-card border-border text-center">
                            <CardContent className="p-4">
                                <Plane className="text-blue-400 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-card-foreground">{userData.stats.tripsPlanned}</div>
                                <div className="text-sm text-muted-foreground">Trips Planned</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border text-center">
                            <CardContent className="p-4">
                                <Globe className="text-green-400 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-card-foreground">{userData.stats.countriesVisited}</div>
                                <div className="text-sm text-muted-foreground">Countries Visited</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border text-center">
                            <CardContent className="p-4">
                                <Heart className="text-pink-400 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-card-foreground">{userData.stats.favoriteDestinations}</div>
                                <div className="text-sm text-muted-foreground">Favorites</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border text-center">
                            <CardContent className="p-4">
                                <Star className="text-yellow-400 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-card-foreground">{userData.stats.reviewsWritten}</div>
                                <div className="text-sm text-muted-foreground">Reviews</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section ref={contentRef} className="py-10 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg max-w-fit">
                        {[
                            { id: 'profile', label: 'Profile', icon: User },
                            { id: 'preferences', label: 'Travel Preferences', icon: Compass },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-2 rounded-md transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
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
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-card-foreground">Personal Information</CardTitle>
                                        <CardDescription className="text-muted-foreground">
                                            Manage your personal details and contact information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                    First Name
                                                </label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editData.firstName}
                                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                        className="bg-input border-input text-foreground"
                                                    />
                                                ) : (
                                                    <p className="text-foreground">{userData.firstName}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                    Last Name
                                                </label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editData.lastName}
                                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        className="bg-input border-input text-foreground"
                                                    />
                                                ) : (
                                                    <p className="text-foreground">{userData.lastName}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                Email Address
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <Mail className="text-muted-foreground" size={16} />
                                                {isEditing ? (
                                                    <Input
                                                        type="email"
                                                        value={editData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className="bg-input border-input text-foreground flex-1"
                                                    />
                                                ) : (
                                                    <p className="text-foreground">{userData.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                Phone Number
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <Phone className="text-muted-foreground" size={16} />
                                                {isEditing ? (
                                                    <Input
                                                        value={editData.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        className="bg-input border-input text-foreground flex-1"
                                                    />
                                                ) : (
                                                    <p className="text-foreground">{userData.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                Location
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <MapPin className="text-muted-foreground" size={16} />
                                                {isEditing ? (
                                                    <Input
                                                        value={editData.location}
                                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                                        className="bg-input border-input text-foreground flex-1"
                                                    />
                                                ) : (
                                                    <p className="text-foreground">{userData.location}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                Bio
                                            </label>
                                            {isEditing ? (
                                                <Textarea
                                                    value={editData.bio}
                                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                                    className="bg-input border-input text-foreground"
                                                    rows={3}
                                                />
                                            ) : (
                                                <p className="text-foreground">{userData.bio}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    {/* Travel Style */}
                                    <Card className="bg-card border-border">
                                        <CardHeader>
                                            <CardTitle className="text-foreground flex items-center">
                                                <Compass className="mr-2" size={20} />
                                                Travel Preferences
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-3">
                                                    Travel Style
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    {['Adventure', 'Cultural', 'Relaxation', 'Nature', 'Urban', 'Beach'].map(style => (
                                                        <label key={style} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={userData.preferences.travelStyle.includes(style)}
                                                                onChange={(e) => handleArrayChange('preferences.travelStyle', style, e.target.checked)}
                                                                className="rounded bg-input border-input"
                                                                disabled={!isEditing}
                                                            />
                                                            <span className="text-muted-foreground text-sm">{style}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                    Budget Range
                                                </label>
                                                {isEditing ? (
                                                    <select
                                                        value={editData.preferences.budgetRange}
                                                        onChange={(e) => handleInputChange('preferences.budgetRange', e.target.value)}
                                                        className="w-full p-3 rounded-lg bg-input border border-input text-foreground"
                                                    >
                                                        <option value="$500-1000">$500 - $1,000</option>
                                                        <option value="$1000-3000">$1,000 - $3,000</option>
                                                        <option value="$3000-5000">$3,000 - $5,000</option>
                                                        <option value="$5000+">$5,000+</option>
                                                    </select>
                                                ) : (
                                                    <p className="text-foreground">{userData.preferences.budgetRange}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-3">
                                                    Accommodation Preferences
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Hotels', 'Airbnb', 'Hostels', 'Resorts', 'Camping'].map(acc => (
                                                        <label key={acc} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={userData.preferences.accommodation.includes(acc)}
                                                                onChange={(e) => handleArrayChange('preferences.accommodation', acc, e.target.checked)}
                                                                className="rounded bg-input border-input"
                                                                disabled={!isEditing}
                                                            />
                                                            <span className="text-muted-foreground text-sm">{acc}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-3">
                                                    Dietary Requirements
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'No Restrictions'].map(diet => (
                                                        <label key={diet} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={userData.preferences.dietaryRequirements.includes(diet)}
                                                                onChange={(e) => handleArrayChange('preferences.dietaryRequirements', diet, e.target.checked)}
                                                                className="rounded bg-input border-input"
                                                                disabled={!isEditing}
                                                            />
                                                            <span className="text-muted-foreground text-sm">{diet}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-foreground flex items-center">
                                            <Settings className="mr-2" size={20} />
                                            Account Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-foreground font-medium">Email Notifications</h4>
                                                    <p className="text-muted-foreground text-sm">Get notified about trip updates</p>
                                                </div>
                                                <input type="checkbox" defaultChecked className="rounded bg-input border-input" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-foreground font-medium">SMS Alerts</h4>
                                                    <p className="text-muted-foreground text-sm">Receive trip reminders via SMS</p>
                                                </div>
                                                <input type="checkbox" className="rounded bg-input border-input" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-foreground font-medium">Marketing Emails</h4>
                                                    <p className="text-muted-foreground text-sm">Get travel deals and recommendations</p>
                                                </div>
                                                <input type="checkbox" defaultChecked className="rounded bg-input border-input" />
                                            </div>
                                        </div>

                                        <hr className="border-border" />

                                        <div>
                                            <h4 className="text-foreground font-medium mb-4">Privacy Settings</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Profile Visibility</span>
                                                    <select className="bg-input border border-input text-foreground rounded px-3 py-1 text-sm">
                                                        <option>Public</option>
                                                        <option>Friends Only</option>
                                                        <option>Private</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Show Travel History</span>
                                                    <input type="checkbox" defaultChecked className="rounded bg-input border-input" />
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
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground text-lg">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full justify-start bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground">
                                        <Plane className="mr-2" size={16} />
                                        Plan New Trip
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start border-input text-muted-foreground hover:bg-muted hover:text-foreground">
                                        <History className="mr-2" size={16} />
                                        View Trip History
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start border-input text-muted-foreground hover:bg-muted hover:text-foreground">
                                        <Heart className="mr-2" size={16} />
                                        Saved Destinations
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Achievements */}
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground text-lg flex items-center">
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
                                            <p className="text-foreground text-sm font-medium">Explorer</p>
                                            <p className="text-muted-foreground text-xs">Visited 10+ countries</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Users size={16} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-foreground text-sm font-medium">Community Helper</p>
                                            <p className="text-muted-foreground text-xs">Wrote 5+ reviews</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                            <CheckCircle size={16} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-foreground text-sm font-medium">Planner Pro</p>
                                            <p className="text-muted-foreground text-xs">Completed 20+ trips</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground text-lg">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-sm">
                                        <p className="text-foreground">Planned trip to Tokyo</p>
                                        <p className="text-muted-foreground">2 days ago</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-foreground">Added Paris to favorites</p>
                                        <p className="text-muted-foreground">1 week ago</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-foreground">Wrote review for Barcelona trip</p>
                                        <p className="text-muted-foreground">2 weeks ago</p>
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