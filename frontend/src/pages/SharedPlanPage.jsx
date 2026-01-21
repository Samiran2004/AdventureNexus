import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
    Calendar,
    MapPin,
    Users,
    IndianRupee,
    Clock,
    Star,
    Sparkles,
    Plane,
    Hotel,
    Utensils,
    Lightbulb,
    MapPinned,
    ChevronLeft,
    TrendingUp,
    CheckCircle2,
    Info,
    ArrowRight,
    Map as MapIcon,
    Image as ImageIcon,
    Maximize2,
    X,
    ChevronRight,
    CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import NavBar from "@/components/NavBar";
import Footer from "@/components/mvpblocks/footer-newsletter";
import toast from "react-hot-toast";
import HighlightMap from "@/components/HighlightMap";

const SharedPlanPage = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [isGalleryLoading, setIsGalleryLoading] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await axios.get(`${VITE_BACKEND_URL}/api/v1/plans/public/${id}`);
                if (response.data.status === "Success") {
                    setPlan(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching plan:", error);
                toast.error("Failed to load the plan. It might have been deleted.");
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, [id, VITE_BACKEND_URL]);

    const fetchGalleryImages = async (destinationName) => {
        if (!destinationName || galleryImages.length > 0) return;

        try {
            setIsGalleryLoading(true);
            const response = await axios.post(
                `${VITE_BACKEND_URL}/api/v1/plans/search/destination-images`,
                { query: destinationName, count: 12 }
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
            setLightboxIndex(0);
        }
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        if (lightboxIndex !== null && lightboxIndex > 0) {
            setLightboxIndex(lightboxIndex - 1);
        } else if (lightboxIndex !== null) {
            setLightboxIndex(galleryImages.length - 1);
        }
    };

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


    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                    <Spinner className="size-16 text-primary relative z-10" />
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/60 mt-8 font-outfit tracking-widest uppercase text-xs"
                >
                    Curating your adventure...
                </motion.p>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-destructive/10 p-8 rounded-[2rem] mb-6 backdrop-blur-xl border border-destructive/20"
                >
                    <MapPin className="size-16 text-destructive" />
                </motion.div>
                <h1 className="text-4xl font-bold mb-3 font-outfit tracking-tight">Plan Not Found</h1>
                <p className="text-muted-foreground mb-10 max-w-md leading-relaxed">The travel link you're followed might be broken or the itinerary was made private by the traveler.</p>
                <Button asChild size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                    <Link to="/">Explore AdventureNexus</Link>
                </Button>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-background font-inter selection:bg-primary/30 selection:text-foreground">
            <NavBar />

            <main className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-all group px-4 py-2 bg-muted/30 rounded-full border border-border/50 backdrop-blur-sm"
                    >
                        <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        Create Your Own Itinerary
                    </Link>
                </motion.div>

                {/* Hero Section */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl group border border-white/10 aspect-[21/9] min-h-[450px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/40 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/80 via-transparent to-transparent z-10" />
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={plan.image_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"}
                        alt={plan.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center gap-3 mb-6"
                        >
                            <Badge className="bg-primary/20 backdrop-blur-xl text-primary border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold font-outfit tracking-wider uppercase">
                                <Sparkles size={14} className="mr-2" />
                                Premium AI Curation
                            </Badge>
                            <Badge variant="secondary" className="bg-white/10 backdrop-blur-xl text-white border-white/20 px-4 py-1.5 rounded-full text-xs font-bold font-outfit tracking-wider uppercase">
                                <Clock size={14} className="mr-2" />
                                {plan.days} Luxurious Days
                            </Badge>
                            {plan.ai_score && (
                                <div className="flex items-center bg-yellow-400/20 backdrop-blur-xl border border-yellow-400/30 px-4 py-1.5 rounded-full">
                                    <Star className="size-3 text-yellow-400 fill-yellow-400 mr-2" />
                                    <span className="text-xs font-bold text-yellow-500 font-outfit uppercase tracking-wider">{plan.ai_score}% Match</span>
                                </div>
                            )}
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-7xl font-bold text-white font-outfit mb-6 tracking-tight leading-[1.1]"
                        >
                            {plan.name}
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-white/80 text-lg md:text-xl max-w-4xl leading-relaxed font-inter font-medium"
                        >
                            {plan.destination_overview}
                        </motion.p>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left Column: Details & Tabs */}
                    <div className="lg:col-span-8 space-y-12">
                        <Tabs defaultValue="highlights" className="w-full" onValueChange={(value) => {
                            if (value === "gallery" && galleryImages.length === 0) {
                                fetchGalleryImages(plan.name);
                            }
                        }}>
                            <TabsList className="flex items-center w-full gap-2 bg-muted/40 p-2 rounded-[2rem] mb-10 border border-border/50 backdrop-blur-md sticky top-20 z-40">
                                <TabsTrigger value="highlights" className="flex-1 rounded-full py-3 font-bold font-outfit transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Highlights</TabsTrigger>
                                <TabsTrigger value="itinerary" className="flex-1 rounded-full py-3 font-bold font-outfit transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Itinerary</TabsTrigger>
                                <TabsTrigger value="budget" className="flex-1 rounded-full py-3 font-bold font-outfit transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Budget</TabsTrigger>
                                <TabsTrigger value="tips" className="flex-1 rounded-full py-3 font-bold font-outfit transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Tips</TabsTrigger>
                                <TabsTrigger value="gallery" className="flex-1 rounded-full py-3 font-bold font-outfit transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Gallery</TabsTrigger>
                            </TabsList>

                            {/* Highlights Tab */}
                            <TabsContent value="highlights" className="space-y-6 outline-none focus-visible:ring-0">
                                <div className="grid md:grid-cols-1 gap-6">
                                    {plan.trip_highlights?.map((highlight, idx) => (
                                        <div key={idx} onClick={() => setSelectedHighlight(highlight)} className="cursor-pointer">
                                            <Card className="bg-card/40 border-border/50 hover:border-primary/50 transition-all duration-500 backdrop-blur-xl group overflow-hidden rounded-3xl hover:shadow-xl hover:shadow-primary/5">
                                                <CardContent className="p-0">
                                                    <div className="flex flex-col md:flex-row gap-6 p-8">
                                                        <div className="relative">
                                                            <div className="h-16 w-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                                                <MapPinned className="text-primary size-8" />
                                                            </div>
                                                            <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75">
                                                                <MapIcon size={12} />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                                <h4 className="font-bold text-2xl font-outfit tracking-tight group-hover:text-primary transition-colors">{highlight.name}</h4>
                                                                <Badge variant="outline" className="text-secondary border-secondary/20 bg-secondary/5 px-4 py-1 font-bold font-outfit text-[10px] tracking-widest uppercase rounded-full">
                                                                    {highlight.match_reason}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-muted-foreground leading-relaxed text-base font-medium">{highlight.description}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                    {(!plan.trip_highlights || plan.trip_highlights.length === 0) && (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <MapPinned className="size-12 mx-auto mb-4 opacity-30" />
                                            <p>No specific highlights available for this trip.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Itinerary Tab */}
                            <TabsContent value="itinerary" className="space-y-12 py-4 px-2 outline-none">
                                <div className="space-y-16">
                                    {plan.suggested_itinerary && plan.suggested_itinerary.length > 0 ? (
                                        plan.suggested_itinerary.map((day, idx) => (
                                            <div
                                                key={idx}
                                                className="relative flex gap-8 md:gap-12"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 rounded-[2rem] bg-primary text-white flex flex-col items-center justify-center shadow-xl shadow-primary/20 z-10 shrink-0 mb-4 font-outfit">
                                                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Day</span>
                                                        <span className="text-2xl font-black leading-none">{day.day}</span>
                                                    </div>
                                                    {idx !== plan.suggested_itinerary.length - 1 && (
                                                        <div className="w-[2px] flex-1 bg-gradient-to-b from-primary/50 to-transparent rounded-full opacity-20" />
                                                    )}
                                                </div>

                                                <div className="flex-1 space-y-8">
                                                    {(day.title || day.description) && (
                                                        <div className="space-y-2">
                                                            {day.title && <h4 className="font-bold text-3xl font-outfit tracking-tight text-foreground">{day.title}</h4>}
                                                            {day.description && <p className="text-muted-foreground text-lg leading-relaxed font-medium">{day.description}</p>}
                                                        </div>
                                                    )}

                                                    {/* Original Morning/Afternoon/Evening structure */}
                                                    <div className="grid gap-6">
                                                        {['morning', 'afternoon', 'evening'].map((time) => (
                                                            day[time] && (
                                                                <div key={time} className="p-6 bg-card/30 rounded-3xl border border-border/40 backdrop-blur-xl group hover:border-primary/30 transition-all flex flex-col gap-3 hover:shadow-lg hover:shadow-primary/5">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="size-2 bg-primary rounded-full" />
                                                                        <span className="font-black font-outfit text-xs uppercase tracking-[0.2em] text-primary">{time}</span>
                                                                    </div>
                                                                    <p className="text-base text-muted-foreground font-medium leading-relaxed">{day[time]}</p>
                                                                </div>
                                                            )
                                                        ))}

                                                        {/* Modern Activities structure */}
                                                        {day.activities?.map((activity, aIdx) => (
                                                            <div
                                                                key={aIdx}
                                                                className="p-6 bg-card/30 rounded-3xl border border-border/40 backdrop-blur-xl group hover:border-primary/30 transition-all flex flex-col md:flex-row gap-4 justify-between items-start hover:shadow-lg hover:shadow-primary/5"
                                                            >
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="size-2 bg-secondary rounded-full" />
                                                                        <span className="font-bold text-lg font-outfit tracking-tight">{activity.name}</span>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground font-medium pl-4">{activity.description}</p>
                                                                </div>
                                                                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-black font-outfit text-[10px] tracking-widest px-4 py-2 rounded-xl whitespace-nowrap">
                                                                    {activity.time}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/50">
                                            <CalendarDays size={64} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-muted-foreground font-medium">No particular itinerary suggested for this plan.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Budget Tab */}
                            <TabsContent value="budget" className="space-y-8 outline-none">
                                <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                                    <CardContent className="p-8 md:p-12">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                            <div className="space-y-2">
                                                <h4 className="text-4xl font-black font-outfit tracking-tight">Investment Overview</h4>
                                                <p className="text-muted-foreground font-medium">Estimated cost for a premium experience.</p>
                                            </div>
                                            <div className="bg-primary text-white p-6 rounded-[2rem] shadow-2xl shadow-primary/20 text-center min-w-[200px]">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-70">Total Estimate</p>
                                                <p className="text-3xl font-black font-outfit tracking-tight">₹{plan.budget_breakdown?.total?.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {[
                                                { label: "Transport & Flights", value: plan.budget_breakdown?.flights, icon: Plane, color: "text-sky-500", bg: "bg-sky-500/10" },
                                                { label: "Luxury Stay", value: plan.budget_breakdown?.accommodation, icon: Hotel, color: "text-orange-500", bg: "bg-orange-500/10" },
                                                { label: "Curated Activities", value: plan.budget_breakdown?.activities, icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
                                                { label: "Fine Dining", value: plan.budget_breakdown?.food, icon: Utensils, color: "text-green-500", bg: "bg-green-500/10" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 bg-muted/20 rounded-[1.75rem] border border-border/50 hover:bg-muted/30 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-12 w-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                            <item.icon size={24} />
                                                        </div>
                                                        <span className="font-bold font-outfit text-base uppercase tracking-wider">{item.label}</span>
                                                    </div>
                                                    <span className="font-black text-xl font-outfit">₹{item.value?.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Tips Tab */}
                            <TabsContent value="tips" className="grid sm:grid-cols-2 gap-6 outline-none">
                                {plan.local_tips?.map((tip, idx) => (
                                    <div key={idx}>
                                        <Card className="bg-card/40 border-border/50 hover:border-secondary transition-all duration-300 backdrop-blur-xl rounded-[1.5rem] group min-h-[140px]">
                                            <CardContent className="p-8 flex items-start gap-6">
                                                <div className="h-12 w-12 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                                                    <Lightbulb className="text-secondary size-6" />
                                                </div>
                                                <p className="text-base font-bold leading-relaxed text-foreground/80 font-outfit">{tip}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </TabsContent>

                            {/* Gallery Tab */}
                            <TabsContent value="gallery" className="space-y-4">
                                {isGalleryLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Spinner className="size-10 text-primary animate-spin mb-4" />
                                        <p className="text-muted-foreground text-sm font-outfit">Curating visual experience...</p>
                                    </div>
                                ) : galleryImages && galleryImages.length > 0 ? (
                                    <>
                                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 pr-2">
                                            {galleryImages.map((imgUrl, idx) => (
                                                <div
                                                    key={idx}
                                                    className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-zoom-in"
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
                                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
                                                onClick={closeLightbox}
                                            >
                                                <button
                                                    className="absolute top-8 right-8 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
                                                    onClick={closeLightbox}
                                                >
                                                    <X size={32} />
                                                </button>

                                                <button
                                                    className="absolute left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:flex"
                                                    onClick={prevImage}
                                                >
                                                    <ChevronLeft size={40} />
                                                </button>

                                                <button
                                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:flex"
                                                    onClick={nextImage}
                                                >
                                                    <ChevronRight size={40} />
                                                </button>

                                                <div
                                                    className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <img
                                                        src={galleryImages[lightboxIndex]}
                                                        alt="Lightbox"
                                                        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
                                                    />
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md font-outfit border border-white/10">
                                                        {lightboxIndex + 1} / {galleryImages.length}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/50">
                                        <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-muted-foreground font-medium">No images found in gallery</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column: Info & CTA */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="bg-card border-border/60 shadow-2xl sticky top-24 rounded-[2.5rem] overflow-hidden group">
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black font-outfit tracking-tighter uppercase tracking-widest text-primary/80">Trip Summary</h3>
                                        <div className="h-1 w-12 bg-primary rounded-full" />
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { label: "Personalized Route", value: `${plan.from} → ${plan.to}`, icon: MapIcon },
                                            { label: "Departure Date", value: new Date(plan.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }), icon: Calendar },
                                            { label: "Group Dynamic", value: `${plan.travelers} Adventurers`, icon: Users },
                                            { label: "Budget Tier", value: plan.budget_range, icon: IndianRupee, isBadge: true }
                                        ].map((detail, i) => (
                                            <div key={i} className="flex items-center gap-5 group/item">
                                                <div className="h-12 w-12 bg-muted/50 rounded-2xl flex items-center justify-center group-hover/item:bg-primary/10 transition-colors shrink-0">
                                                    <detail.icon className="text-primary size-5" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-muted-foreground/60">{detail.label}</p>
                                                    {detail.isBadge ? (
                                                        <Badge className="bg-primary/10 text-primary border-0 rounded-lg px-2 text-[10px] font-bold uppercase tracking-widest mt-1">
                                                            {detail.value}
                                                        </Badge>
                                                    ) : (
                                                        <p className="text-base font-bold font-outfit tracking-tight">{detail.value}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-border flex flex-col gap-4">
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl shadow-xl shadow-primary/20 group hover:shadow-primary/40 transition-all relative overflow-hidden" asChild>
                                            <Link to="/" className="flex items-center justify-center gap-3">
                                                <TrendingUp size={18} />
                                                CREATE YOUR ADVENTURE
                                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                            <CheckCircle2 size={12} className="text-green-500" />
                                            Verified by AdventureNexus AI
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-white/5 space-y-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Info size={120} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-3 font-outfit uppercase tracking-wider">Plan Architecture</h4>
                                <p className="text-sm text-muted-foreground mb-8 font-medium leading-relaxed">This itinerary was engineered using real-time travel data and personalized interests.</p>
                                <div className="flex flex-wrap gap-2">
                                    {plan.perfect_for?.map((tag, i) => (
                                        <Badge key={i} variant="outline" className="bg-background/50 backdrop-blur-md border-border/50 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all hover:border-primary/40">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />

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
                                destinationName={plan?.name}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SharedPlanPage;
