import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Plane,
    Hotel,
    Calendar,
    BarChart3,
    Shield,
    Smartphone,
    Star,
    CheckCircle,
    Menu,
    X,
    ArrowRight,
    Play,
    Globe,
    Clock,
    Award,
    Compass,
    Camera,
    Users,
    Bot,
    Search,
    Navigation,
    Sparkles,
    Zap,
    TrendingUp,
    Mail,
    Phone,
    MessageCircle
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import NumberCounter from '@/components/NumberCounter';
import CardSlider from '@/components/CardSlider';

import ScrollBasedVelocityDemo from '@/components/mvpblocks/scrollbasedvelocity-demo';
import BentoGrid1 from '@/components/mvpblocks/bento-grid-1';
import Globe2 from '@/components/mvpblocks/globe2';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { TextReveal } from '@/components/ui/text-reveal';
import TextRevealLetters from '@/components/mvpblocks/text-reveal-1';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Reusable 3D Tilt Card Wrapper
const TiltWrapper = ({ children, className, ...props }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateY, rotateX, transformStyle: "preserve-3d", perspective: 1000 }}
            className={className}
            {...props}
        >
            <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
                {children}
            </div>
        </motion.div>
    );
};

// AdventureNexusLanding is the main landing page component of the application
const AdventureNexusLanding = () => {
    const { scrollYProgress } = useScroll();
    const backgroundParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const lightRayParallax = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    // Refs for GSAP animations for various sections of the page
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const howItWorksRef = useRef(null);
    const testimonialsRef = useRef(null);
    const personaRef = useRef(null);
    const ctaRef = useRef(null);
    const heroContentRef = useRef(null);
    const heroImageRef = useRef(null);
    const rootRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Initial page load animation
            if (heroContentRef.current) gsap.set(heroContentRef.current, { x: -100, opacity: 0 });
            if (heroImageRef.current) gsap.set(heroImageRef.current, { x: 100, opacity: 0, scale: 0.8 });

            // Hero content animation with stagger
            const tl = gsap.timeline({ delay: 0.3 });
            if (heroContentRef.current) {
                tl.to(heroContentRef.current, {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.out"
                });
            }
            if (heroImageRef.current) {
                tl.to(heroImageRef.current, {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "back.out(1.7)"
                }, "-=0.8");
            }

            // Features section animation
            if (featuresRef.current) {
                gsap.from(".feature-card", {
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    },
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                    immediateRender: false
                });
            }

            // How it works animation
            if (howItWorksRef.current) {
                gsap.from(".step-item", {
                    scrollTrigger: {
                        trigger: howItWorksRef.current,
                        start: "top 80%",
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.3,
                    ease: "power2.out",
                    immediateRender: false
                });
            }

            // Testimonials animation
            if (testimonialsRef.current) {
                gsap.from(".testimonial-card", {
                    scrollTrigger: {
                        trigger: testimonialsRef.current,
                        start: "top 80%",
                    },
                    y: 50,
                    opacity: 0,
                    rotation: 5,
                    duration: 1,
                    stagger: 0.2,
                    ease: "back.out(1.7)",
                    immediateRender: false
                });
            }

            // Persona cards animation
            if (personaRef.current) {
                gsap.from(".persona-card", {
                    scrollTrigger: {
                        trigger: personaRef.current,
                        start: "top 80%",
                    },
                    y: 80,
                    opacity: 0,
                    scale: 0.9,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power2.out",
                    immediateRender: false
                });
            }

            // CTA section animation
            if (ctaRef.current) {
                gsap.from(ctaRef.current, {
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: "top 90%",
                    },
                    scale: 0.8,
                    opacity: 0,
                    duration: 1.2,
                    ease: "back.out(1.7)",
                    immediateRender: false
                });
            }

            // Floating animation for hero image
            if (heroImageRef.current) {
                gsap.to(heroImageRef.current, {
                    y: -10,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "power2.inOut"
                });
            }

        }, rootRef); // Scope to rootRef

        return () => ctx.revert(); // Cleanup
    }, []);

    // Button hover animations
    const handleButtonHover = (e) => {
        gsap.to(e.target, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleButtonLeave = (e) => {
        gsap.to(e.target, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const navigate = useNavigate();

    return (
        <div ref={rootRef} className="min-h-screen bg-background overflow-hidden">

            <NavBar />

            {/* Hero Section */}
            <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32 pb-20 perspective-1000">
                {/* Background Atmosphere with Parallax */}
                <motion.div className="absolute inset-0 z-0" style={{ y: backgroundParallax }}>
                    <div className="absolute inset-0 developer-grid opacity-30"></div>
                    <div className="absolute inset-0 developer-grid-dot opacity-20"></div>
                </motion.div>
                {/* Light Ray effect with stronger Parallax */}
                <motion.div 
                    className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none z-0"
                    style={{
                        y: lightRayParallax,
                        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
                        filter: 'blur(100px)'
                    }}
                ></motion.div>
 
                <div className="container mx-auto px-4 relative z-10">
                    <div ref={heroContentRef} className="max-w-4xl mx-auto text-center space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            <div className="flex justify-center">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    <Sparkles size={12} className="text-white" />
                                    AdventureNexus AI
                                </span>
                            </div>
                            
                            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] font-inter">
                                YOUR DREAM <br /> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400">ADVENTURE</span> <br />
                                <span className="text-white/20">STARTS HERE</span>
                            </h1>

                            <p className="text-lg md:text-2xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
                                Experience intelligent travel planning powered by AI. <br className="hidden md:block" /> Get personalized itineraries and discover hidden destinations instantly.
                            </p>
                        </motion.div>
 
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Button
                                size="lg"
                                className="h-14 px-10 bg-white text-black hover:bg-white/90 rounded-full font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                                onClick={() => navigate('/search')}
                            >
                                Start planning
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-10 border-white/10 bg-transparent text-white hover-scale rounded-full font-bold text-sm uppercase tracking-widest"
                                onClick={() => {
                                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                See how it works
                            </Button>
                        </motion.div>
                    </div>

                    {/* Hero Image / Illustration */}
                    <div ref={heroImageRef} className="mt-20 relative max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                        <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-muted/20 backdrop-blur-sm aspect-video flex items-center justify-center group">
                             <img 
                                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop" 
                                alt="Adventure" 
                                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                             />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 cursor-pointer hover:scale-110 transition-transform">
                                    <Play fill="white" size={32} className="ml-1" />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Bento Grid Section */}
            <section id="features" ref={featuresRef} className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold font-inter">Capabilities</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-inter">
                            POWERED BY <span className="text-white/50">INTELLIGENCE</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[300px]">
                        {/* Globe Box - Large */}
                        <TiltWrapper 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="feature-card md:col-span-2 md:row-span-2 rounded-[3rem] overflow-hidden relative flex flex-col p-12 group border border-white/10 bg-[#050505]"
                        >
                            <div className="absolute inset-0 opacity-40 pointer-events-none group-hover:opacity-60 transition-opacity duration-700">
                                <Globe2 />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                            <div className="relative z-10 mt-auto space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                                    <Globe size={12} /> Global Discovery
                                </div>
                                <h3 className="text-4xl md:text-5xl font-bold text-white font-inter tracking-tight leading-tight">
                                    Explore the world <br /> with <span className="text-blue-500">AI precision.</span>
                                </h3>
                                <p className="text-white/50 max-w-md text-lg leading-relaxed">Every destination at your fingertips with real-time AI-driven insights and local hidden gems.</p>
                            </div>
                        </TiltWrapper>

                        {/* Itinerary Box */}
                        <TiltWrapper 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="feature-card glass-card rounded-[2.5rem] p-10 flex flex-col justify-between group overflow-hidden relative border border-white/10 bg-white/[0.02]"
                        >
                            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-700"></div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                                <Sparkles className="text-purple-400 w-6 h-6" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-white font-inter tracking-tight">Smart Itineraries</h3>
                                <p className="text-white/40 leading-relaxed">Personalized routes based on your preferences, budget, and local trends.</p>
                            </div>
                        </TiltWrapper>

                        {/* Search Box */}
                        <TiltWrapper 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="feature-card glass-card rounded-[2.5rem] p-10 flex flex-col justify-between group overflow-hidden relative border border-white/10 bg-white/[0.02]"
                        >
                            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                                <Search className="text-emerald-400 w-6 h-6" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-white font-inter tracking-tight">Infinite Discovery</h3>
                                <p className="text-white/40 leading-relaxed">Find hidden spots that other travelers simply overlook with our neural search.</p>
                            </div>
                        </TiltWrapper>

                        {/* Activity Slider - wide bottom */}
                        <TiltWrapper 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="feature-card md:col-span-3 rounded-[3rem] p-12 overflow-hidden relative border border-white/10 bg-[#080808]"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12 h-full relative z-10">
                                <div className="space-y-6 max-w-lg">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                        <TrendingUp className="text-blue-400 w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight font-inter tracking-tight">Curated Local <span className="text-blue-500">Experiences.</span></h3>
                                    <p className="text-white/50 text-lg leading-relaxed">From luxury stays to local street food, we map out the perfect journey for every vibe.</p>
                                    <Button className="h-12 px-8 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform">Explore All Features</Button>
                                </div>
                                <div className="w-full md:w-1/2 min-h-[250px]">
                                    <CardSlider />
                                </div>
                            </div>
                        </TiltWrapper>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" ref={howItWorksRef} className="py-32 bg-[#020202] relative overflow-hidden">
                <div className="absolute inset-0 developer-grid-dot opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-24 space-y-6">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.3em] text-white/60 font-black">The Workflow</span>
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter font-inter">
                            HOW THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">NEXUS WORKS</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {[
                            { 
                                step: "01", 
                                title: "Share Your Vibe", 
                                desc: "Tell our AI what kind of adventure you're looking for - from chill beaches to intense treks.",
                                icon: MessageCircle,
                                color: "blue"
                            },
                            { 
                                step: "02", 
                                title: "AI Generation", 
                                desc: "Our neural engine crafts a hyper-personalized itinerary in seconds, checking live data.",
                                icon: Bot,
                                color: "purple"
                            },
                            { 
                                step: "03", 
                                title: "Hit the Road", 
                                desc: "Follow your interactive smart guide and explore the world with zero friction.",
                                icon: Navigation,
                                color: "emerald"
                            }
                        ].map((item, i) => (
                            <div key={i} className="step-item group p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-6 relative overflow-hidden hover:bg-white/[0.04] transition-all duration-500">
                                <div className="absolute top-[-10%] right-[-10%] text-9xl font-black text-white/[0.03] group-hover:text-white/[0.06] transition-colors duration-500">{item.step}</div>
                                <div className={`w-16 h-16 rounded-[1.5rem] bg-${item.color}-500/10 flex items-center justify-center border border-${item.color}-500/20 group-hover:scale-110 transition-transform duration-500`}>
                                    <item.icon size={32} className={`text-${item.color}-400`} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold text-white font-inter tracking-tight">{item.title}</h3>
                                    <p className="text-white/40 text-lg leading-relaxed">{item.desc}</p>
                                </div>
                                <div className="pt-4 flex items-center gap-2 text-white/20 group-hover:text-white/60 transition-colors">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Learn More</span>
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Testimonials Section */}
            <section id="testimonials" ref={testimonialsRef} className="py-32 relative overflow-hidden bg-black">
                <div className="absolute inset-0 developer-grid opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-24 space-y-6">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.3em] text-white/60 font-black">Community Trust</span>
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter font-inter">
                            VOICES OF <span className="text-white/20">ADVENTURE</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                name: "Samiran Samanta",
                                role: "Journey Lover",
                                content: "Great tool! Very easy to use and gives smart, personalized travel plans. Adding more customization options would make it perfect.",
                                rating: 5,
                                location: "Bangkok, Thailand"
                            },
                            {
                                name: "Ritam Maity",
                                role: "Family Traveler",
                                content: "This AI planner planned my whole trip in seconds and gave ideas I wouldn't have thought of. Super easy to use, super fun.",
                                rating: 4,
                                location: "Tokyo, Japan"
                            },
                            {
                                name: "Shounak Santra",
                                role: "Adventure Seeker",
                                content: "A really helpful planner with clear itineraries and creative suggestions. The interface is simple, smooth, and very intuitive.",
                                rating: 4,
                                location: "Barcelona, Spain"
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="testimonial-card bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-2xl hover:bg-white/[0.04] transition-all duration-500 h-full flex flex-col group rounded-[2.5rem] overflow-hidden">
                                    <CardContent className="p-10 space-y-8 flex-1 flex flex-col relative">
                                        <div className="absolute top-8 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Sparkles size={40} className="text-white" />
                                        </div>
                                        <div className="flex text-amber-400 gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < testimonial.rating ? "currentColor" : "none"} strokeWidth={1} />
                                            ))}
                                        </div>
                                        <p className="text-white/70 text-lg leading-relaxed flex-1 font-inter italic font-medium">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center space-x-5 pt-8 border-t border-white/5">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg tracking-widest shadow-lg">
                                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg font-inter tracking-tight">{testimonial.name}</div>
                                                <div className="text-sm text-white/40 font-inter tracking-wide">{testimonial.role} &bull; {testimonial.location}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Velocity Banner */}
            <div className="py-12 bg-black border-y border-white/5 overflow-hidden">
                <ScrollBasedVelocityDemo />
            </div>

            {/* Travel Personas Section */}
            <section id="personas" ref={personaRef} className="py-32 bg-[#050505] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-6 mb-24">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.3em] text-white/60 font-black">Tailored Journeys</span>
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter font-inter">
                            CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">VIBE</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {[
                            {
                                name: "The Thrill Seeker",
                                icon: <Zap className="w-6 h-6 text-orange-400" />,
                                description: "Adrenaline, extreme sports, and uncharted paths.",
                                accent: "orange",
                                img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=600&auto=format&fit=crop"
                            },
                            {
                                name: "Cultural Connoisseur",
                                icon: <Globe className="w-6 h-6 text-purple-400" />,
                                description: "Wine tasting, ancient history, and deep local immersion.",
                                accent: "purple",
                                img: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=600&auto=format&fit=crop"
                            },
                            {
                                name: "Nature Nomad",
                                icon: <MapPin className="w-6 h-6 text-emerald-400" />,
                                description: "Hidden forests, serene lakes, and sustainable living.",
                                accent: "emerald",
                                img: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600&auto=format&fit=crop"
                            },
                            {
                                name: "Luxury Explorer",
                                icon: <Sparkles className="w-6 h-6 text-amber-400" />,
                                description: "Private villas, boutique hotels, and five-star comfort.",
                                accent: "amber",
                                img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop"
                            }
                        ].map((persona, index) => (
                            <TiltWrapper key={index} className="persona-card group h-[500px] rounded-[3rem] overflow-hidden relative border border-white/10">
                                <img src={persona.img} alt={persona.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute inset-0 p-10 flex flex-col justify-end space-y-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center mb-2`}>
                                        {persona.icon}
                                    </div>
                                    <h3 className="text-3xl font-bold text-white font-inter tracking-tight leading-tight">{persona.name}</h3>
                                    <p className="text-white/60 text-sm leading-relaxed">{persona.description}</p>
                                    <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        <Button className="w-full h-12 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest">Select Vibe</Button>
                                    </div>
                                </div>
                            </TiltWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section ref={ctaRef} className="py-40 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto text-center space-y-12">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl animate-pulse">
                            <Zap size={20} className="text-blue-400 fill-blue-400" />
                            <span className="text-xs font-bold text-white tracking-[0.3em] uppercase">Ready for Takeoff?</span>
                        </div>
                        <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] font-inter">
                            ADVENTURE IS <br /> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">CALLING YOU.</span>
                        </h2>
                        <p className="text-xl md:text-3xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed italic">
                            "Stop dreaming about the world. Start exploring it with intelligence and passion."
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                            <Button 
                                size="lg" 
                                className="h-20 px-16 bg-white text-black hover:bg-white/90 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                                onClick={() => navigate('/search')}
                            >
                                Start planning now
                            </Button>
                            <Button 
                                variant="outline" 
                                size="lg" 
                                className="h-20 px-16 border-white/10 bg-transparent text-white hover:bg-white/5 rounded-[2rem] font-black text-lg uppercase tracking-widest"
                                onClick={() => navigate('/community')}
                            >
                                Join Community
                            </Button>
                        </div>
                        <div className="flex items-center justify-center space-x-8 text-sm text-white/20 font-inter pt-12 border-t border-white/5 mt-16 w-full max-w-2xl mx-auto">
                            <div className="flex items-center">
                                <Award className="mr-2 w-4 h-4" />
                                Smart AI
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 w-4 h-4" />
                                Instant Plans
                            </div>
                            <div className="flex items-center">
                                <Shield className="mr-2 w-4 h-4" />
                                Trusted by 10k+
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AdventureNexusLanding;
