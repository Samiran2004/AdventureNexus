import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    MapPin,
    Star,
    Heart,
    Share,
    Calendar,
    Users,
    DollarSign,
    Clock,
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Bot,
    Plane,
    Camera,
    Utensils,
    Bed,
    Car,
    Navigation,
    AlertCircle,
    CheckCircle,
    TrendingUp,
    Globe,
    Download,
    Upload,
    UserPlus,
    MessageCircle,
    Bell,
    Settings,
    Calculator,
    PieChart,
    BarChart3,
    Target,
    Wallet,
    CreditCard,
    Receipt,
    Split,
    ArrowRight,
    ChevronDown,
    ChevronRight,
    GripVertical,
    Copy,
    Filter,
    Search,
    SortAsc
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/components/NavBar';

gsap.registerPlugin(ScrollTrigger);

// TripBuilderPage component allows users to interactively build and customize their trip itinerary
const TripBuilderPage = () => {
    // Generate unique IDs for drag and drop items
    const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

    // Sample activities database
    const [activityDatabase] = useState([
        {
            id: generateId(),
            name: 'Eiffel Tower Visit',
            category: 'Sightseeing',
            duration: '2-3 hours',
            cost: 25,
            description: 'Iconic landmark with panoramic city views',
            location: 'Paris, France',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=200',
            suggestedTime: 'Morning',
            tags: ['Landmark', 'Views', 'Photography']
        },
        {
            id: generateId(),
            name: 'Louvre Museum',
            category: 'Culture',
            duration: '3-4 hours',
            cost: 20,
            description: 'World\'s largest art museum with famous masterpieces',
            location: 'Paris, France',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1566552881087-4b3e5b2a4bb5?w=200',
            suggestedTime: 'Afternoon',
            tags: ['Art', 'History', 'Culture']
        },
        {
            id: generateId(),
            name: 'Seine River Cruise',
            category: 'Activities',
            duration: '1.5 hours',
            cost: 40,
            description: 'Romantic boat ride through the heart of Paris',
            location: 'Paris, France',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200',
            suggestedTime: 'Evening',
            tags: ['Romantic', 'Sightseeing', 'Relaxing']
        }
    ]);

    // Trip state
    const [tripData, setTripData] = useState({
        name: 'My Amazing Paris Trip',
        destination: 'Paris, France',
        startDate: '2025-03-15',
        endDate: '2025-03-20',
        travelers: 2,
        budget: 2000,
        currency: 'USD',
        description: 'A romantic getaway to the City of Light'
    });

    // Itinerary state
    const [itinerary, setItinerary] = useState(() => {
        const days = [];
        const start = new Date(tripData.startDate);
        const end = new Date(tripData.endDate);
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        for (let i = 0; i < totalDays; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            days.push({
                date: date.toISOString().split('T'),
                dayNumber: i + 1,
                activities: [],
                notes: ''
            });
        }
        return days;
    });

    // UI state
    const [selectedDay, setSelectedDay] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeTab, setActiveTab] = useState('planner');

    // Budget state
    const [budgetBreakdown, setBudgetBreakdown] = useState({
        accommodation: 800,
        food: 400,
        activities: 300,
        transport: 300,
        shopping: 200
    });

    // Refs for animations
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero animation
            gsap.from(heroRef.current, {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power2.out"
            });

            // Content sections animation
            gsap.from(".builder-section", {
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 80%",
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });
        });

        return () => ctx.revert();
    }, []);

    // Calculate total costs
    const calculateTotalCost = () => {
        return itinerary.reduce((total, day) => {
            return total + day.activities.reduce((dayTotal, activity) => {
                return dayTotal + (activity.cost || 0);
            }, 0);
        }, 0);
    };

    const totalSpent = calculateTotalCost();
    const budgetUsed = (totalSpent / tripData.budget) * 100;
    const remainingBudget = tripData.budget - totalSpent;

    // Filter activities
    const filteredActivities = activityDatabase.filter(activity => {
        const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || activity.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    // Drag and drop handlers
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const sourceDroppableId = result.source.droppableId;
        const destinationDroppableId = result.destination.droppableId;

        // Handle adding from activity database
        if (sourceDroppableId === 'activities' && destinationDroppableId.startsWith('day-')) {
            const dayIndex = parseInt(destinationDroppableId.split('-')[11]);
            const activityIndex = result.source.index;
            const activity = filteredActivities[activityIndex];

            const newActivity = {
                ...activity,
                id: generateId(),
                scheduledTime: '09:00'
            };

            setItinerary(prev => {
                const newItinerary = [...prev];
                newItinerary[dayIndex].activities.splice(result.destination.index, 0, newActivity);
                return newItinerary;
            });
            return;
        }

        // Handle reordering within same day
        if (sourceDroppableId === destinationDroppableId && sourceDroppableId.startsWith('day-')) {
            const dayIndex = parseInt(sourceDroppableId.split('-')[11]);

            setItinerary(prev => {
                const newItinerary = [...prev];
                const dayActivities = [...newItinerary[dayIndex].activities];
                const [reorderedItem] = dayActivities.splice(result.source.index, 1);
                dayActivities.splice(result.destination.index, 0, reorderedItem);
                newItinerary[dayIndex].activities = dayActivities;
                return newItinerary;
            });
            return;
        }

        // Handle moving between days
        if (sourceDroppableId.startsWith('day-') && destinationDroppableId.startsWith('day-')) {
            const sourceDayIndex = parseInt(sourceDroppableId.split('-')[11]);
            const destDayIndex = parseInt(destinationDroppableId.split('-')[11]);

            setItinerary(prev => {
                const newItinerary = [...prev];
                const sourceActivities = [...newItinerary[sourceDayIndex].activities];
                const destActivities = [...newItinerary[destDayIndex].activities];

                const [movedItem] = sourceActivities.splice(result.source.index, 1);
                destActivities.splice(result.destination.index, 0, movedItem);

                newItinerary[sourceDayIndex].activities = sourceActivities;
                newItinerary[destDayIndex].activities = destActivities;
                return newItinerary;
            });
        }
    };

    // Remove activity from day
    const removeActivity = (dayIndex, activityIndex) => {
        setItinerary(prev => {
            const newItinerary = [...prev];
            newItinerary[dayIndex].activities.splice(activityIndex, 1);
            return newItinerary;
        });
    };

    const ActivityCard = ({ activity, index, isDragging = false }) => (
        <Draggable draggableId={activity.id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-gray-800 border-gray-700 cursor-move transition-all duration-200 ${snapshot.isDragging ? 'scale-105 shadow-2xl' : 'hover:scale-102'
                        }`}
                >
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <img
                                src={activity.image}
                                alt={activity.name}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium truncate">{activity.name}</h4>
                                <p className="text-gray-400 text-sm">{activity.duration}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                        {activity.category}
                                    </Badge>
                                    <div className="flex items-center text-yellow-400">
                                        <Star size={12} className="fill-current mr-1" />
                                        <span className="text-xs">{activity.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-medium">${activity.cost}</div>
                                <div className="text-gray-400 text-xs">{activity.suggestedTime}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <NavBar />

            {/* Hero Section */}
            <section ref={heroRef} className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-900/20 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-900/20 rounded-full opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Build Your Perfect
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Itinerary</span>
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Plan every detail of your trip with our interactive itinerary builder,
                            budget tracker, and collaborative planning tools.
                        </p>

                        {/* Trip Quick Stats */}
                        <div className="flex justify-center space-x-8 text-sm text-gray-400 mt-8">
                            <div className="flex items-center">
                                <Calendar className="mr-2" size={16} />
                                {itinerary.length} Days
                            </div>
                            <div className="flex items-center">
                                <Users className="mr-2" size={16} />
                                {tripData.travelers} Travelers
                            </div>
                            <div className="flex items-center">
                                <DollarSign className="mr-2" size={16} />
                                ${totalSpent} / ${tripData.budget}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section ref={contentRef} className="py-16 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-8">
                        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('planner')}
                                className={`flex items-center px-6 py-3 rounded-md transition-all ${activeTab === 'planner'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Calendar size={16} className="mr-2" />
                                Itinerary Planner
                            </button>
                        </div>
                    </div>

                    {/* Itinerary Planner */}
                    <div className="builder-section">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <div className="grid lg:grid-cols-4 gap-8">
                                {/* Activities Library */}
                                <div className="lg:col-span-1 space-y-6">
                                    <Card className="bg-gray-900 border-gray-700">
                                        <CardHeader>
                                            <CardTitle className="text-white flex items-center">
                                                <Search className="mr-2 text-blue-400" size={20} />
                                                Activity Library
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Search */}
                                            <Input
                                                placeholder="Search activities..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="bg-gray-800 border-gray-700 text-white"
                                            />

                                            {/* Category Filter */}
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                                            >
                                                <option value="all">All Categories</option>
                                                <option value="sightseeing">Sightseeing</option>
                                                <option value="culture">Culture</option>
                                                <option value="activities">Activities</option>
                                            </select>

                                            {/* Activities List */}
                                            <Droppable droppableId="activities">
                                                {(provided) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className="space-y-3 max-h-96 overflow-y-auto"
                                                    >
                                                        {filteredActivities.map((activity, index) => (
                                                            <ActivityCard
                                                                key={activity.id}
                                                                activity={activity}
                                                                index={index}
                                                            />
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Daily Itinerary */}
                                <div className="lg:col-span-3">
                                    {/* Day Navigation */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {itinerary.map((day, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedDay(index)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDay === index
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                                    }`}
                                            >
                                                Day {day.dayNumber}
                                                <div className="text-xs opacity-75">
                                                    {new Date(day.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Selected Day Content */}
                                    {itinerary[selectedDay] && (
                                        <Card className="bg-gray-900 border-gray-700">
                                            <CardHeader>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <CardTitle className="text-white">
                                                            Day {itinerary[selectedDay].dayNumber} Schedule
                                                        </CardTitle>
                                                        <CardDescription className="text-gray-400">
                                                            {new Date(itinerary[selectedDay].date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-white font-medium">
                                                            {itinerary[selectedDay].activities.length} Activities
                                                        </div>
                                                        <div className="text-green-400 font-medium">
                                                            ${itinerary[selectedDay].activities.reduce((sum, act) => sum + act.cost, 0)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                {/* Drop Zone */}
                                                <Droppable droppableId={`day-${selectedDay}`}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            className={`min-h-[300px] rounded-lg border-2 border-dashed transition-colors ${snapshot.isDraggingOver
                                                                    ? 'border-blue-500 bg-blue-500/10'
                                                                    : 'border-gray-600'
                                                                }`}
                                                        >
                                                            {itinerary[selectedDay].activities.length === 0 ? (
                                                                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                                                    <Calendar size={48} className="mb-4 opacity-50" />
                                                                    <p className="text-lg font-medium">No activities scheduled</p>
                                                                    <p className="text-sm">Drag activities from the library to build your day</p>
                                                                </div>
                                                            ) : (
                                                                <div className="p-4">
                                                                    {itinerary[selectedDay].activities.map((activity, activityIndex) => (
                                                                        <Draggable
                                                                            key={activity.id}
                                                                            draggableId={activity.id}
                                                                            index={activityIndex}
                                                                        >
                                                                            {(provided) => (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                >
                                                                                    <Card className="bg-gray-800 border-gray-700 mb-3">
                                                                                        <CardContent className="p-4">
                                                                                            <div className="flex items-start justify-between">
                                                                                                <div className="flex items-start space-x-3 flex-1">
                                                                                                    <GripVertical className="text-gray-400 cursor-move" size={16} />
                                                                                                    <img
                                                                                                        src={activity.image}
                                                                                                        alt={activity.name}
                                                                                                        className="w-10 h-10 rounded-lg object-cover"
                                                                                                    />
                                                                                                    <div className="flex-1">
                                                                                                        <h4 className="text-white font-medium">{activity.name}</h4>
                                                                                                        <p className="text-gray-400 text-sm">{activity.description}</p>
                                                                                                        <div className="flex items-center space-x-4 mt-2">
                                                                                                            <span className="text-gray-400 text-sm">{activity.duration}</span>
                                                                                                            <span className="text-green-400 font-medium">${activity.cost}</span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    onClick={() => removeActivity(selectedDay, activityIndex)}
                                                                                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                                                                >
                                                                                                    <Trash2 size={16} />
                                                                                                </Button>
                                                                                            </div>
                                                                                        </CardContent>
                                                                                    </Card>
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </DragDropContext>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-12">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                            <Download className="mr-2" size={20} />
                            Export Itinerary
                        </Button>
                        <Button size="lg" variant="outline" className="border-gray-600 text-blue-400 hover:text-black hover:bg-green-500 hover:border-white">
                            <Bot className="mr-2" size={20} />
                            Optimize with AI
                        </Button>
                        <Button size="lg" variant="outline" className="border-gray-600 text-blue-400 hover:text-black hover:bg-green-500 hover:border-white">
                            <Save className="mr-2" size={20} />
                            Save Trip
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TripBuilderPage;
