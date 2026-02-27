import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    MapPin,
    Clock,
    Search,
    ArrowRight,
    Star,
    Compass,
    Mountain,
    Waves,
    TreePine,
    Building2,
    Utensils,
    Camera,
    Filter,
    ChevronRight,
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ── Data ──────────────────────────────────────────────────────────────────
const categories = [
    { label: 'All Guides', icon: Compass, color: 'text-primary bg-primary/10' },
    { label: 'Mountains', icon: Mountain, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Beaches', icon: Waves, color: 'text-cyan-500 bg-cyan-500/10' },
    { label: 'Wildlife', icon: TreePine, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'City Life', icon: Building2, color: 'text-violet-500 bg-violet-500/10' },
    { label: 'Food & Culture', icon: Utensils, color: 'text-orange-500 bg-orange-500/10' },
    { label: 'Photography', icon: Camera, color: 'text-rose-500 bg-rose-500/10' },
];

const guides = [
    {
        id: 1,
        title: "The Ultimate Patagonia Trekking Guide",
        category: "Mountains",
        location: "Patagonia, Argentina",
        readTime: "12 min",
        rating: 4.9,
        reviews: 342,
        difficulty: "Hard",
        difficultyColor: "bg-red-500/10 text-red-500",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80",
        excerpt: "Navigate the windswept peaks of Patagonia with our comprehensive guide covering trails, gear, and seasonal tips.",
        tags: ["Trekking", "Camping", "Wildlife"],
        featured: true,
    },
    {
        id: 2,
        title: "Bali's Hidden Beach Coves: A Surfer's Handbook",
        category: "Beaches",
        location: "Bali, Indonesia",
        readTime: "8 min",
        rating: 4.8,
        reviews: 215,
        difficulty: "Easy",
        difficultyColor: "bg-green-500/10 text-green-500",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
        excerpt: "Discover secret surf breaks and secluded shores that most tourists never find with our insider local knowledge.",
        tags: ["Surfing", "Swimming", "Snorkeling"],
        featured: true,
    },
    {
        id: 3,
        title: "Safari Essentials: What Nobody Tells You About Kenya",
        category: "Wildlife",
        location: "Masai Mara, Kenya",
        readTime: "15 min",
        rating: 5.0,
        reviews: 189,
        difficulty: "Moderate",
        difficultyColor: "bg-yellow-500/10 text-yellow-500",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80",
        excerpt: "Pack right, stay safe, and witness the Great Migration. Your complete preparation guide for an African safari.",
        tags: ["Safari", "Photography", "Nature"],
        featured: false,
    },
    {
        id: 4,
        title: "Tokyo on a Budget: 10 Days Under $1000",
        category: "City Life",
        location: "Tokyo, Japan",
        readTime: "10 min",
        rating: 4.7,
        reviews: 407,
        difficulty: "Easy",
        difficultyColor: "bg-green-500/10 text-green-500",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80",
        excerpt: "Street food, free shrines, capsule hotels, and JR passes — Tokyo is surprisingly affordable if you know where to look.",
        tags: ["Budget", "Food", "Culture"],
        featured: false,
    },
    {
        id: 5,
        title: "Street Food Capital: Eating Your Way Through Bangkok",
        category: "Food & Culture",
        location: "Bangkok, Thailand",
        readTime: "9 min",
        rating: 4.9,
        reviews: 523,
        difficulty: "Easy",
        difficultyColor: "bg-green-500/10 text-green-500",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=80",
        excerpt: "From Pad Thai to Mango Sticky Rice, over 50 must-try dishes and exactly where to find them across every neighbourhood.",
        tags: ["Food", "Culture", "Night Markets"],
        featured: false,
    },
    {
        id: 6,
        title: "Golden Hour Photography in the Dolomites",
        category: "Photography",
        location: "Dolomites, Italy",
        readTime: "7 min",
        rating: 4.8,
        reviews: 156,
        difficulty: "Moderate",
        difficultyColor: "bg-yellow-500/10 text-yellow-500",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80",
        excerpt: "Viewpoints, camera settings, and hiking trails to capture the most dramatic alpine scenery in all of Europe.",
        tags: ["Photography", "Hiking", "Mountains"],
        featured: false,
    },
];

const stats = [
    { value: "200+", label: "Expert Guides" },
    { value: "80+", label: "Destinations" },
    { value: "50+", label: "Happy Travelers" },
    { value: "4.9★", label: "Avg. Rating" },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Component ─────────────────────────────────────────────────────────────
const TravelGuidesPage = () => {
    const [activeCategory, setActiveCategory] = useState('All Guides');
    const [search, setSearch] = useState('');

    const filtered = guides.filter((g) => {
        const matchCat = activeCategory === 'All Guides' || g.category === activeCategory;
        const matchSearch =
            !search ||
            g.title.toLowerCase().includes(search.toLowerCase()) ||
            g.location.toLowerCase().includes(search.toLowerCase()) ||
            g.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return matchCat && matchSearch;
    });

    const featured = filtered.filter((g) => g.featured);
    const regular = filtered.filter((g) => !g.featured);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <NavBar />

            {/* ── Hero ────────────────────────────────────────────────────── */}
            <div className="relative py-28 lg:py-40 overflow-hidden bg-black text-white">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&auto=format&fit=crop&q=80")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-1.5 text-xs uppercase tracking-widest backdrop-blur-md">
                            Travel Guides
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none mb-6">
                            Your World. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                                Your Handbook.
                            </span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                            Expert-written, community-tested travel guides for every kind of adventurer. Discover your next journey.
                        </p>

                        {/* Search bar */}
                        <div className="relative max-w-xl mx-auto">
                            <Search
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                                size={20}
                            />
                            <Input
                                placeholder="Search destinations, categories, or tags…"
                                className="pl-14 h-16 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-2 ring-white/30 text-base backdrop-blur-sm shadow-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Stats strip ─────────────────────────────────────────────── */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i, duration: 0.5 }}
                        >
                            <Card className="bg-card/90 backdrop-blur-md border-border shadow-xl">
                                <CardContent className="p-5 text-center">
                                    <div className="text-3xl font-black mb-0.5">{s.value}</div>
                                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── Category Filters ─────────────────────────────────────────── */}
            <div className="container mx-auto px-4 pt-20 pb-4">
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.label;
                        return (
                            <button
                                key={cat.label}
                                onClick={() => setActiveCategory(cat.label)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${isActive
                                    ? 'bg-foreground text-background border-foreground shadow-md scale-105'
                                    : 'border-border hover:border-foreground/30 bg-card hover:bg-muted/50'
                                    }`}
                            >
                                <cat.icon size={15} className={isActive ? '' : cat.color.split(' ')[0]} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {(search || activeCategory !== 'All Guides') && (
                    <p className="text-sm text-muted-foreground mt-4">
                        Showing <span className="font-bold text-foreground">{filtered.length}</span> guide{filtered.length !== 1 ? 's' : ''}
                        {activeCategory !== 'All Guides' && <> in <span className="font-bold text-foreground">{activeCategory}</span></>}
                        {search && <> matching <span className="font-bold text-foreground">"{search}"</span></>}
                    </p>
                )}
            </div>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <main className="container mx-auto px-4 pb-28 flex-1">

                {/* Featured Guides */}
                {featured.length > 0 && (
                    <section className="mb-16 mt-4">
                        <div className="flex items-center gap-3 mb-8">
                            <Star size={18} className="text-yellow-500 fill-yellow-500" />
                            <h2 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Featured Picks</h2>
                        </div>
                        <motion.div
                            className="grid md:grid-cols-2 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {featured.map((guide) => (
                                <FeaturedGuideCard key={guide.id} guide={guide} />
                            ))}
                        </motion.div>
                    </section>
                )}

                {/* All / Remaining Guides */}
                {regular.length > 0 && (
                    <section>
                        {featured.length > 0 && (
                            <div className="flex items-center gap-3 mb-8">
                                <BookOpen size={18} className="text-muted-foreground" />
                                <h2 className="text-xl font-black uppercase tracking-widest text-muted-foreground">All Guides</h2>
                            </div>
                        )}
                        <motion.div
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {regular.map((guide) => (
                                <RegularGuideCard key={guide.id} guide={guide} />
                            ))}
                        </motion.div>
                    </section>
                )}

                {filtered.length === 0 && (
                    <div className="text-center py-40 bg-muted/10 rounded-[4rem] border-2 border-dashed border-border mt-4">
                        <Compass size={48} className="mx-auto mb-6 text-muted-foreground opacity-30" />
                        <p className="text-2xl font-black italic tracking-tight text-muted-foreground opacity-50">
                            No guides found. Try a different search!
                        </p>
                        <button
                            onClick={() => { setSearch(''); setActiveCategory('All Guides'); }}
                            className="mt-6 text-sm font-semibold text-primary underline underline-offset-4"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </main>

            {/* ── Newsletter CTA ───────────────────────────────────────────── */}
            <div className="bg-muted/30 border-y border-border py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-primary/10 text-primary border-none px-4 py-1 font-black text-[10px] uppercase tracking-[0.2em]">
                            New Guides Weekly
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">
                            Never Miss an <span className="text-primary">Adventure.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Subscribe and get freshly crafted destination guides delivered straight to your inbox every week.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <Input
                                placeholder="Enter your email"
                                className="h-14 rounded-2xl bg-card border-border text-base"
                            />
                            <Button
                                size="lg"
                                className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] shrink-0 shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                            >
                                Subscribe <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

// ── Sub-components ────────────────────────────────────────────────────────
const FeaturedGuideCard = ({ guide }) => (
    <motion.div variants={cardVariants} className="group relative">
        <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_80px_rgba(79,70,229,0.15)] transition-all duration-700">
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-5 left-5 flex gap-2">
                    <Badge className="bg-primary/80 text-white border-none backdrop-blur-md text-[9px] font-black uppercase tracking-widest px-3 py-1">
                        ⭐ Featured
                    </Badge>
                    <Badge className={`border-none backdrop-blur-md text-[9px] font-black uppercase tracking-widest px-3 py-1 ${guide.difficultyColor}`}>
                        {guide.difficulty}
                    </Badge>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin size={13} className="text-white/70" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{guide.location}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-tight text-white group-hover:text-emerald-400 transition-colors">
                        {guide.title}
                    </h3>
                </div>
            </div>

            {/* Body */}
            <CardContent className="p-7">
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 opacity-80 italic">
                    "{guide.excerpt}"
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Clock size={13} /> {guide.readTime} read
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Star size={13} className="text-yellow-500 fill-yellow-500" />
                            {guide.rating} ({guide.reviews})
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl border border-primary/20 hover:bg-primary/5 font-black uppercase tracking-widest text-[9px] group/btn"
                    >
                        Read Guide <ChevronRight size={13} className="ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-5">
                    {guide.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-muted/60 text-muted-foreground text-[10px] font-black uppercase tracking-wider"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const RegularGuideCard = ({ guide }) => (
    <motion.div variants={cardVariants} className="group relative">
        <Card className="h-full overflow-hidden rounded-[2rem] border-border hover:border-primary/30 transition-colors duration-300 shadow-sm hover:shadow-[0_20px_40px_rgba(79,70,229,0.1)]">
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge
                        className={`border-none text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 ${guide.difficultyColor}`}
                    >
                        {guide.difficulty}
                    </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={11} className="text-white/70" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/70">{guide.location}</span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                        <h3 className="font-black italic tracking-tight text-lg leading-tight group-hover:text-primary transition-colors">
                            {guide.title}
                        </h3>
                    </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 opacity-80">
                    {guide.excerpt}
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Clock size={11} /> {guide.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                            <Star size={11} className="text-yellow-500 fill-yellow-500" />
                            {guide.rating}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-xl border border-primary/10 hover:bg-primary/5 font-black uppercase tracking-widest text-[8px] group/btn px-3"
                    >
                        Read <ArrowRight size={11} className="ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4">
                    {guide.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground text-[9px] font-bold uppercase tracking-wider"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export default TravelGuidesPage;
