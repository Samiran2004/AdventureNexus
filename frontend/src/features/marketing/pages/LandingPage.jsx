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
    const navRef = useRef(null);
    const heroContentRef = useRef(null);
    const heroImageRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Initial page load animation
            gsap.set(navRef.current, { y: -100, opacity: 0 });
            gsap.set(heroContentRef.current, { x: -100, opacity: 0 });
            gsap.set(heroImageRef.current, { x: 100, opacity: 0, scale: 0.8 });

            // Navbar animation
            gsap.to(navRef.current, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            });

            // Hero content animation with stagger
            gsap.timeline({ delay: 0.3 })
                .to(heroContentRef.current, {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.out"
                })
                .to(heroImageRef.current, {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "back.out(1.7)"
                }, "-=0.8");

            // Features section animation
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
                ease: "power2.out"
            });

            // How it works animation
            gsap.from(".step-item", {
                scrollTrigger: {
                    trigger: howItWorksRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.3,
                ease: "power2.out"
            });

            // Testimonials animation
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
                ease: "back.out(1.7)"
            });

            // Persona cards animation
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
                ease: "power2.out"
            });

            // CTA section animation
            gsap.from(ctaRef.current, {
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 90%",
                },
                scale: 0.8,
                opacity: 0,
                duration: 1.2,
                ease: "back.out(1.7)"
            });

            // Floating animation for hero image
            gsap.to(heroImageRef.current, {
                y: -10,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });

        });

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
        <div className="min-h-screen bg-background overflow-hidden">

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
                    <div className="max-w-4xl mx-auto text-center space-y-10">
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
                            
                            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] font-inter">
                                YOUR DREAM <br /> ADVENTURE <br />
                                <span className="text-white/40">STARTS HERE</span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                                Experience intelligent travel planning powered by AI. Get personalized itineraries and discover hidden destinations instantly.
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
                                className="h-14 px-10 border-white/10 bg-transparent text-white hover:bg-white/5 rounded-full font-bold text-sm uppercase tracking-widest transition-all"
                                onClick={() => navigate('/works')}
                            >
                                See how it works
                            </Button>
                        </motion.div>
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
                            className="md:col-span-2 md:row-span-2 glass-card rounded-3xl overflow-hidden relative flex flex-col items-center justify-center p-8 group border border-white/5"
                        >
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <Globe2 />
                            </div>
                            <div className="relative z-10 mt-auto text-center space-y-2">
                                <h3 className="text-2xl font-bold text-white font-inter">Global Reach</h3>
                                <p className="text-muted-foreground max-w-sm text-sm">Every destination at your fingertips with AI-driven insights.</p>
                            </div>
                        </TiltWrapper>

                        {/* Itinerary Box */}
                        <TiltWrapper 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative border border-white/5"
                        >
                            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors"></div>
                            <Sparkles className="text-white w-8 h-8 mb-4" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white font-inter">Smart Itineraries</h3>
                                <p className="text-sm text-muted-foreground">Personalized routes based on your preferences and local trends.</p>
                            </div>
                        </TiltWrapper>

                        {/* Search Box */}
                        <TiltWrapper 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-card rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative border border-white/5"
                        >
                            <Search className="text-white w-8 h-8 mb-4" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white font-inter">Infinite Discovery</h3>
                                <p className="text-sm text-muted-foreground">Find hidden gems that other planners simply overlook.</p>
                            </div>
                        </TiltWrapper>

                        {/* Activity Slider - wide bottom */}
                        <TiltWrapper 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-3 glass-card rounded-3xl p-8 overflow-hidden relative border border-white/5"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                                <div className="space-y-4 max-w-md">
                                    <h3 className="text-2xl font-bold text-white leading-tight font-inter">Curated Experiences</h3>
                                    <p className="text-muted-foreground text-sm">From luxury stays to local street food, we map out the perfect journey for every vibe.</p>
                                    <Button variant="outline" className="rounded-full border-white/10 text-[10px] px-6 uppercase tracking-widest font-bold text-white hover:bg-white/5">Explore Features</Button>
                                </div>
                                <div className="w-full md:w-1/2 min-h-[150px]">
                                    <CardSlider />
                                </div>
                            </div>
                        </TiltWrapper>
                    </div>
                </div>
            </section>


            {/* Testimonials Section */}
            <section id="testimonials" ref={testimonialsRef} className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 developer-grid opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold font-inter">Voices of Adventure</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-inter">
                            COMMUNITY <span className="text-white/30">TRUST</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
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
                                <Card className="testimonial-card bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 shadow-2xl hover:bg-[#111] transition-colors duration-300 h-full flex flex-col group">
                                    <CardContent className="p-8 space-y-6 flex-1 flex flex-col">
                                        <div className="flex text-white/80 gap-1">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                                            ))}
                                            <span className="ml-2 text-xs font-bold font-inter text-muted-foreground">{testimonial.rating}.0</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed flex-1 font-inter">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center space-x-4 pt-4 border-t border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-sm tracking-widest font-inter">
                                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm font-inter tracking-tight">{testimonial.name}</div>
                                                <div className="text-xs text-muted-foreground font-inter tracking-wide">{testimonial.role} &bull; {testimonial.location}</div>
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
            <section id="personas" ref={personaRef} className="py-24 bg-[#050505]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Compass className="w-8 h-8 text-white" />
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent font-inter tracking-tight">
                                Discover Your Travel Persona
                            </h2>
                        </div>
                        <p className="text-xl text-muted-foreground font-inter">
                            Our AI curates highly specialized journeys for every type of traveler.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                name: "The Thrill Seeker",
                                icon: <Sparkles className="w-8 h-8 text-white mb-4" />,
                                description: "Adrenaline, extreme sports, and uncharted paths.",
                                bg: "bg-gradient-to-br from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20",
                                img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=400&auto=format&fit=crop"
                            },
                            {
                                name: "Cultural Connoisseur",
                                icon: <Globe className="w-8 h-8 text-white mb-4" />,
                                description: "Wine tasting, ancient history, and deep local immersion.",
                                bg: "bg-gradient-to-br from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20",
                                img: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=400&auto=format&fit=crop"
                            },
                            {
                                name: "The Escapist",
                                icon: <MapPin className="w-8 h-8 text-white mb-4" />,
                                description: "Maximum relaxation, hidden beaches, zero stress.",
                                bg: "bg-gradient-to-br from-teal-500/10 to-emerald-500/10 hover:from-teal-500/20 hover:to-emerald-500/20",
                                img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=400&auto=format&fit=crop"
                            },
                            {
                                name: "Budget Backpacker",
                                icon: <Compass className="w-8 h-8 text-white mb-4" />,
                                description: "Hostels, raw experiences, and spontaneous living.",
                                bg: "bg-gradient-to-br from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20",
                                img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=400&auto=format&fit=crop"
                            }
                        ].map((persona, index) => (
                            <TiltWrapper key={index} className="persona-card h-full">
                                <Card className={`h-full flex flex-col border border-white/5 backdrop-blur-xl transition-all duration-500 overflow-hidden cursor-pointer group ${persona.bg}`}>
                                    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-cover bg-center" style={{ backgroundImage: `url(${persona.img})`, filter: 'grayscale(100%)' }}></div>
                                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500 z-0"></div>
                                    <CardContent className="p-8 flex flex-col items-center text-center justify-center h-full relative z-10">
                                        <div className="transform group-hover:scale-110 transition-transform duration-500">
                                            {persona.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white font-inter tracking-tight mb-4">{persona.name}</h3>
                                        <p className="text-sm text-muted-foreground font-inter">{persona.description}</p>
                                        <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full text-xs uppercase tracking-widest font-bold">
                                                Select Persona
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TiltWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section ref={ctaRef} className="py-32 bg-black relative overflow-hidden border-t border-white/5">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute inset-0 developer-grid opacity-20 pointer-events-none"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="max-w-3xl mx-auto space-y-10">
                        <div className="flex flex-col items-center justify-center gap-6 mb-4">
                            <Sparkles className="w-12 h-12 text-white/80 animate-pulse" />
                            <h2 className="text-5xl md:text-7xl font-bold font-inter tracking-tighter text-white leading-tight">
                                Ready to Plan Your Next Adventure?
                            </h2>
                        </div>
                        <p className="text-xl md:text-2xl text-muted-foreground font-inter max-w-2xl mx-auto">
                            Join thousands of adventurers who trust AdventureNexus to create unforgettable journeys.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <Button
                                size="lg"
                                className="h-14 px-10 bg-white text-black btn-glow hover-scale rounded-full font-bold text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                            >
                                Start planning
                                <ArrowRight className="ml-2" size={16} />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-10 border-white/10 bg-transparent text-white hover-scale rounded-full font-bold text-sm uppercase tracking-widest"
                            >
                                <MessageCircle className="mr-2" size={16} />
                                Talk to Our AI
                            </Button>
                        </div>
                        <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground font-inter pt-8 border-t border-white/5 mt-12 w-full max-w-lg mx-auto">
                            <div className="flex items-center">
                                <Award className="mr-2 w-4 h-4" />
                                Smart recommendations
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 w-4 h-4" />
                                Instant planning
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
