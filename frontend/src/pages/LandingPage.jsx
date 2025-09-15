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
import Globe2 from '@/components/mvpblocks/globe2';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const AdventureNexusLanding = () => {


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
        <div className="min-h-screen bg-black overflow-hidden">

            <NavBar />

            {/* Hero Section */}
            <section ref={heroRef} className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-900/20 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-900/20 rounded-full opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div ref={heroContentRef} className="space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-400 border border-blue-700/30">
                                    🤖 AI-Powered Travel Planning
                                </Badge>
                                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                    Your Perfect Trip
                                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Planned by AI</span>
                                </h1>
                                <p className="text-xl text-gray-300 leading-relaxed">
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
                                    className="text-lg px-8 py-6 border-2 border-gray-600 text-black hover:bg-gray-800 hover:text-white"
                                    onMouseEnter={handleButtonHover}
                                    onMouseLeave={handleButtonLeave}
                                >
                                    <Play className="mr-2" size={20} />
                                    See How It Works
                                </Button>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-400 mr-2" size={16} />
                                    Free to use
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-400 mr-2" size={16} />
                                    Instant results
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-400 mr-2" size={16} />
                                    No credit card required
                                </div>
                            </div>
                        </div>

                        <div ref={heroImageRef} className="relative">
                            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl p-8 space-y-6 backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Trip Planner Dashboard</h3>
                                    <Badge variant="secondary" className="bg-green-900/50 text-green-400 border border-green-700">AI Active</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardContent className="p-4 text-center">
                                            <MapPin className="text-blue-400 mx-auto mb-2" size={24} />
                                            <div className="text-2xl font-bold text-white">
                                                <NumberCounter
                                                    targetNumber={195}
                                                    duration={3}
                                                    className="text-2xl font-bold text-white"
                                                />
                                            </div>
                                            <div className="text-sm text-gray-400">Countries</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardContent className="p-4 text-center">
                                            <Users className="text-green-400 mx-auto mb-2" size={24} />
                                            <div className="text-2xl font-bold text-white">
                                                <NumberCounter
                                                    targetNumber={50000}
                                                    duration={2.5}
                                                    className="text-2xl font-bold text-white"
                                                />
                                                +
                                            </div>
                                            <div className="text-sm text-gray-400">Happy Travelers</div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Bot className="text-purple-400" size={20} />
                                        <div className="flex-1 bg-gray-800 rounded-lg p-2">
                                            <div className="text-sm text-gray-300">Planning your 7-day Japan adventure...</div>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="py-10 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className='m-0'>
                        <Globe2 />
                    </div>

                    <div className=''>
                        <CardSlider />
                    </div>
                    <div>
                        <ScrollBasedVelocityDemo />
                        <BentoGrid1 />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" ref={testimonialsRef} className="py-20 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Travelers Love AdventureNexus
                        </h2>
                        <p className="text-xl text-gray-400">
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
                            <Card key={index} className="testimonial-card bg-gray-900 border-gray-700 shadow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} size={20} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 italic">"{testimonial.content}"</p>
                                    <div className="border-t border-gray-700 pt-4 flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">{testimonial.name}</div>
                                            <div className="text-sm text-gray-400">{testimonial.role} • {testimonial.location}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" ref={pricingRef} className="py-20 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-400">
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
                                className={`pricing-card relative hover:scale-105 transition-transform duration-300 bg-gray-800 ${plan.popular ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-700'
                                    }`}
                            >
                                {plan.popular && (
                                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                                        Most Popular
                                    </Badge>
                                )}
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                                    <div className="space-y-2">
                                        <div className="text-4xl font-bold text-white">
                                            {plan.price}
                                            <span className="text-lg font-normal text-gray-400">{plan.period}</span>
                                        </div>
                                        <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center">
                                                <CheckCircle className="text-green-400 mr-3" size={16} />
                                                <span className="text-sm text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        className={`w-full ${plan.popular
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                                : 'bg-gray-700 hover:bg-gray-600 text-white'
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
                                <MessageCircle className="mr-2" size={20} />
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
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
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
                                <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:text-white hover:border-white hover:bg-gray-800">
                                    <Mail size={16} className="mr-2" />
                                    Newsletter
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">Product</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white transition-colors">AI Trip Planner</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Flight Search</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Hotel Booking</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">Company</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Travel Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Partnerships</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">Support</h3>
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
