import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
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

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const AdventureNexusLanding = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Refs for GSAP animations
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const howItWorksRef = useRef(null);
    const testimonialsRef = useRef(null);
    const pricingRef = useRef(null);
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

            // Pricing cards animation
            gsap.from(".pricing-card", {
                scrollTrigger: {
                    trigger: pricingRef.current,
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

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-white z-50 md:hidden">
                    <div className="flex justify-between items-center p-4 border-b">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                <Compass size={20} />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AdventureNexus
                            </span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex flex-col space-y-4 p-4">
                        <a href="#features" className="text-gray-600 hover:text-gray-900 py-2">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 py-2">How it Works</a>
                        <a href="#destinations" className="text-gray-600 hover:text-gray-900 py-2">Destinations</a>
                        <a href="#testimonials" className="text-gray-600 hover:text-gray-900 py-2">Reviews</a>
                        <Button variant="ghost" className="justify-start">Sign In</Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Plan My Trip</Button>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav ref={navRef} className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                <Compass size={24} />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AdventureNexus
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
                            <a href="#destinations" className="text-gray-600 hover:text-gray-900 transition-colors">Destinations</a>
                            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Button variant="ghost">
                                <header>
                                    <SignedOut>
                                        <SignInButton />
                                    </SignedOut>
                                    <SignedIn>
                                        <UserButton />
                                    </SignedIn>
                                </header>
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                            >
                                Plan My Trip
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-100 rounded-full opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div ref={heroContentRef} className="space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:bg-blue-100 border-0">
                                    🤖 AI-Powered Travel Planning
                                </Badge>
                                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                                    Your Perfect Trip
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Planned by AI</span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Let our advanced AI create personalized itineraries, find the best flights and hotels, and discover hidden gems tailored to your preferences and budget.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    onMouseEnter={handleButtonHover}
                                    onMouseLeave={handleButtonLeave}
                                >
                                    Start Planning Free
                                    <ArrowRight className="ml-2" size={20} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-lg px-8 py-6 border-2"
                                    onMouseEnter={handleButtonHover}
                                    onMouseLeave={handleButtonLeave}
                                >
                                    <Play className="mr-2" size={20} />
                                    See How It Works
                                </Button>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-500 mr-2" size={16} />
                                    Free to use
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-500 mr-2" size={16} />
                                    Instant results
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-500 mr-2" size={16} />
                                    No credit card required
                                </div>
                            </div>
                        </div>

                        <div ref={heroImageRef} className="relative">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Trip Planner Dashboard</h3>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">AI Active</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <MapPin className="text-blue-600 mx-auto mb-2" size={24} />
                                            <div className="text-2xl font-bold">
                                                <NumberCounter
                                                    targetNumber={195}
                                                    duration={3}
                                                    className="text-2xl font-bold"
                                                />
                                            </div>
                                            <div className="text-sm text-gray-500">Countries</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <Users className="text-green-600 mx-auto mb-2" size={24} />
                                            <div className="text-2xl font-bold">
                                                <NumberCounter
                                                    targetNumber={50000}
                                                    duration={2.5}
                                                    className="text-2xl font-bold"
                                                />
                                                +
                                            </div>
                                            <div className="text-sm text-gray-500">Happy Travelers</div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Bot className="text-purple-600" size={20} />
                                        <div className="flex-1 bg-gray-100 rounded-lg p-2">
                                            <div className="text-sm text-gray-600">Planning your 7-day Japan adventure...</div>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Everything You Need for the Perfect Trip
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From AI-powered itinerary creation to real-time flight and hotel booking, AdventureNexus handles every aspect of your travel planning.
                        </p>
                    </div> */}

                    <div className=''>
                        <CardSlider />
                    </div>
                    <div>
                        <ScrollBasedVelocityDemo />
                        <BentoGrid1/>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" ref={howItWorksRef} className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Plan Your Dream Trip in 3 Simple Steps
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Our AI makes travel planning effortless and fun. Get started in minutes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Tell Us Your Preferences",
                                description: "Share your destination, dates, budget, interests, and travel style. Our AI learns what makes you happy.",
                                icon: Search
                            },
                            {
                                step: "02",
                                title: "AI Creates Your Itinerary",
                                description: "Our advanced AI generates a personalized trip plan with activities, restaurants, and attractions you'll love.",
                                icon: Bot
                            },
                            {
                                step: "03",
                                title: "Book & Go Adventure",
                                description: "Review your plan, book flights and hotels directly through our platform, and start your amazing journey.",
                                icon: Navigation
                            }
                        ].map((step, index) => (
                            <div key={index} className="step-item text-center space-y-4">
                                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                    {step.step}
                                </div>
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg w-fit mx-auto">
                                    <step.icon size={24} />
                                </div>
                                <h3 className="text-xl font-semibold">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" ref={testimonialsRef} className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Travelers Love AdventureNexus
                        </h2>
                        <p className="text-xl text-gray-600">
                            See what our community of adventurers is saying
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Mitchell",
                                role: "Digital Nomad",
                                content: "AdventureNexus planned my entire Southeast Asia trip in minutes! The AI found hidden gems I would have never discovered on my own.",
                                rating: 5,
                                location: "Bangkok, Thailand"
                            },
                            {
                                name: "David Chen",
                                role: "Family Traveler",
                                content: "Planning a family vacation with kids is usually stressful, but the AI created the perfect kid-friendly itinerary for our Japan trip.",
                                rating: 5,
                                location: "Tokyo, Japan"
                            },
                            {
                                name: "Maria Rodriguez",
                                role: "Adventure Seeker",
                                content: "The personalized recommendations were spot on! Every restaurant and activity was exactly my style. Best trip planning tool ever!",
                                rating: 5,
                                location: "Patagonia, Chile"
                            }
                        ].map((testimonial, index) => (
                            <Card key={index} className="testimonial-card border-0 shadow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} size={20} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 italic">"{testimonial.content}"</p>
                                    <div className="border-t pt-4 flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{testimonial.name}</div>
                                            <div className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" ref={pricingRef} className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600">
                            Choose the plan that fits your travel style
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Explorer",
                                price: "Free",
                                period: "",
                                description: "Perfect for occasional travelers",
                                features: ["3 AI trip plans per month", "Basic itinerary creation", "Flight price alerts", "Community support"],
                                popular: false,
                                buttonText: "Start Free"
                            },
                            {
                                name: "Adventurer",
                                price: "$9",
                                period: "/month",
                                description: "Most popular for frequent travelers",
                                features: ["Unlimited AI trip plans", "Advanced personalization", "Priority booking support", "Offline access", "Group trip planning"],
                                popular: true,
                                buttonText: "Start Free Trial"
                            },
                            {
                                name: "Nomad Pro",
                                price: "$19",
                                period: "/month",
                                description: "For travel professionals",
                                features: ["Everything in Adventurer", "White-label solutions", "API access", "Custom integrations", "Dedicated support"],
                                popular: false,
                                buttonText: "Contact Sales"
                            }
                        ].map((plan, index) => (
                            <Card
                                key={index}
                                className={`pricing-card relative hover:scale-105 transition-transform duration-300 ${plan.popular ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-200'
                                    }`}
                            >
                                {plan.popular && (
                                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                                        Most Popular
                                    </Badge>
                                )}
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <div className="space-y-2">
                                        <div className="text-4xl font-bold">
                                            {plan.price}
                                            <span className="text-lg font-normal text-gray-500">{plan.period}</span>
                                        </div>
                                        <CardDescription>{plan.description}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center">
                                                <CheckCircle className="text-green-500 mr-3" size={16} />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        className={`w-full ${plan.popular
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                            : ''
                                            }`}
                                        onMouseEnter={handleButtonHover}
                                        onMouseLeave={handleButtonLeave}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section ref={ctaRef} className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready to Plan Your Next Adventure?
                        </h2>
                        <p className="text-xl opacity-90">
                            Join thousands of travelers who trust our AI to create unforgettable journeys. Start planning your perfect trip today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-50"
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                            >
                                Start Planning Now
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-6 text-black border-white hover:bg-white hover:text-blue-600"
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                            >
                                <MessageCircle className="mr-2 text-gray-500" size={20} />
                                Talk to Our AI
                            </Button>
                        </div>
                        <div className="flex items-center justify-center space-x-8 text-sm opacity-75">
                            <div className="flex items-center">
                                <Award className="mr-2" size={16} />
                                AI-powered recommendations
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2" size={16} />
                                Plans ready in seconds
                            </div>
                            <div className="flex items-center">
                                <Globe className="mr-2" size={16} />
                                195+ countries covered
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                    <Compass size={24} />
                                </div>
                                <span className="text-2xl font-bold">AdventureNexus</span>
                            </div>
                            <p className="text-gray-400">
                                Empowering travelers with AI-powered trip planning and personalized recommendations for unforgettable adventures.
                            </p>
                            <div className="flex space-x-4">
                                <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:text-white hover:border-white">
                                    <Mail size={16} className="mr-2" />
                                    Newsletter
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white transition-colors">AI Trip Planner</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Flight Search</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Hotel Booking</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Travel Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Partnerships</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Travel Guides</a></li>
                                <li><a href="https://adventurenexus.onrender.com/api-docs/" className="hover:text-white transition-colors">API Docs</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 AdventureNexus. All rights reserved. Powered by AI for better travel experiences.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Settings</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdventureNexusLanding;
