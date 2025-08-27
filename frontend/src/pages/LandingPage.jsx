import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    BookOpen,
    Users,
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
    Award
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import NumberCounter from '@/components/NumberCounter';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const SchoolSyncLanding = () => {
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
            {/* Navigation */}
            <nav ref={navRef} className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="bg-blue-600 text-white p-2 rounded-lg">
                                <BookOpen size={24} />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">SchoolSync</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
                            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Button variant="ghost">Sign In</Button>
                            <Button
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                            >
                                Get Started
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
            <section ref={heroRef} className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div ref={heroContentRef} className="space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    🎓 Transform Education Management
                                </Badge>
                                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                                    Complete School Management
                                    <span className="text-blue-600"> Made Simple</span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Streamline student enrollment, teacher management, attendance tracking, and academic reporting in one powerful platform.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="text-lg px-8 py-6"
                                    onMouseEnter={handleButtonHover}
                                    onMouseLeave={handleButtonLeave}
                                >
                                    Start Free Trial
                                    <ArrowRight className="ml-2" size={20} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-lg px-8 py-6"
                                    onMouseEnter={handleButtonHover}
                                    onMouseLeave={handleButtonLeave}
                                >
                                    <Play className="mr-2" size={20} />
                                    Watch Demo
                                </Button>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-500 mr-2" size={16} />
                                    No setup fees
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-500 mr-2" size={16} />
                                    14-day free trial
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-500 mr-2" size={16} />
                                    Cancel anytime
                                </div>
                            </div>
                        </div>

                        <div ref={heroImageRef} className="relative">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                                    <Badge variant="secondary">Live</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <Users className="text-blue-600 mx-auto mb-2" size={24} />
                                            <div className="text-2xl font-bold">
                                                <NumberCounter
                                                    targetNumber={1247}
                                                    duration={3}
                                                    className="text-2xl font-bold"
                                                />
                                            </div>
                                            <div className="text-sm text-gray-500">Students</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <BookOpen className="text-green-600 mx-auto mb-2" size={24} />
                                            <div className="text-2xl font-bold">
                                                <NumberCounter
                                                    targetNumber={89}
                                                    duration={2.5}
                                                    className="text-2xl font-bold"
                                                />
                                            </div>
                                            <div className="text-sm text-gray-500">Teachers</div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="text-blue-600" size={32} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Everything You Need to Manage Your School
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From student enrollment to grade reporting, SchoolSync provides comprehensive tools for modern educational institutions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Student Management",
                                description: "Complete student profiles, enrollment tracking, and parent communication tools."
                            },
                            {
                                icon: Calendar,
                                title: "Attendance Tracking",
                                description: "Digital attendance with real-time notifications and automated reporting."
                            },
                            {
                                icon: BarChart3,
                                title: "Grade Management",
                                description: "Comprehensive gradebook with customizable grading scales and progress tracking."
                            },
                            {
                                icon: Shield,
                                title: "Secure & Compliant",
                                description: "FERPA compliant with enterprise-grade security and data protection."
                            },
                            {
                                icon: Smartphone,
                                title: "Mobile Access",
                                description: "Full mobile app for teachers, students, and parents on iOS and Android."
                            },
                            {
                                icon: Globe,
                                title: "Multi-Language",
                                description: "Support for multiple languages to serve diverse school communities."
                            }
                        ].map((feature, index) => (
                            <Card
                                key={index}
                                className="feature-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                                onMouseEnter={(e) => {
                                    gsap.to(e.currentTarget, {
                                        y: -8,
                                        scale: 1.02,
                                        duration: 0.3,
                                        ease: "power2.out"
                                    });
                                }}
                                onMouseLeave={(e) => {
                                    gsap.to(e.currentTarget, {
                                        y: 0,
                                        scale: 1,
                                        duration: 0.3,
                                        ease: "power2.out"
                                    });
                                }}
                            >
                                <CardHeader>
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg w-fit">
                                        <feature.icon size={24} />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" ref={howItWorksRef} className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Get Started in Minutes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Simple setup process to get your school management system running quickly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Create Account",
                                description: "Sign up and set up your school profile with basic information and preferences."
                            },
                            {
                                step: "02",
                                title: "Import Data",
                                description: "Easily import existing student and teacher data or start fresh with our guided setup."
                            },
                            {
                                step: "03",
                                title: "Start Managing",
                                description: "Begin using all features immediately with our intuitive interface and helpful onboarding."
                            }
                        ].map((step, index) => (
                            <div key={index} className="step-item text-center space-y-4">
                                <div className="bg-blue-600 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                    {step.step}
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
                            Trusted by Schools Worldwide
                        </h2>
                        <p className="text-xl text-gray-600">
                            See what educators are saying about SchoolSync
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Johnson",
                                role: "Principal, Riverside Elementary",
                                content: "SchoolSync has transformed how we manage our school. The attendance tracking alone has saved us hours each week.",
                                rating: 5
                            },
                            {
                                name: "Michael Chen",
                                role: "Teacher, Lincoln High School",
                                content: "The gradebook feature is intuitive and the parent communication tools have improved our engagement significantly.",
                                rating: 5
                            },
                            {
                                name: "Dr. Emma Rodriguez",
                                role: "Superintendent, Valley School District",
                                content: "We've seen a 40% improvement in administrative efficiency since implementing SchoolSync across our district.",
                                rating: 5
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
                                    <div className="border-t pt-4">
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-gray-500">{testimonial.role}</div>
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
                            Choose the plan that fits your school's needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Starter",
                                price: "$49",
                                period: "/month",
                                description: "Perfect for small schools",
                                features: ["Up to 100 students", "Basic reporting", "Email support", "Mobile app access"],
                                popular: false
                            },
                            {
                                name: "Professional",
                                price: "$99",
                                period: "/month",
                                description: "Most popular choice",
                                features: ["Up to 500 students", "Advanced analytics", "Priority support", "Custom integrations", "Parent portal"],
                                popular: true
                            },
                            {
                                name: "Enterprise",
                                price: "Custom",
                                period: "",
                                description: "For large institutions",
                                features: ["Unlimited students", "Custom features", "Dedicated support", "On-site training", "SLA guarantee"],
                                popular: false
                            }
                        ].map((plan, index) => (
                            <Card
                                key={index}
                                className={`pricing-card relative hover:scale-105 transition-transform duration-300 ${plan.popular ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-200'
                                    }`}
                            >
                                {plan.popular && (
                                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
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
                                        className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                        onMouseEnter={handleButtonHover}
                                        onMouseLeave={handleButtonLeave}
                                    >
                                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section ref={ctaRef} className="py-20 bg-blue-600 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready to Transform Your School Management?
                        </h2>
                        <p className="text-xl opacity-90">
                            Join thousands of schools already using SchoolSync to streamline their operations and improve educational outcomes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 py-6"
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                            >
                                Start Your Free Trial
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-blue-600"
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                            >
                                Schedule Demo
                            </Button>
                        </div>
                        <div className="flex items-center justify-center space-x-8 text-sm opacity-75">
                            <div className="flex items-center">
                                <Award className="mr-2" size={16} />
                                Award-winning support
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2" size={16} />
                                Setup in under 30 minutes
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
                                <div className="bg-blue-600 text-white p-2 rounded-lg">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-2xl font-bold">SchoolSync</span>
                            </div>
                            <p className="text-gray-400">
                                Empowering educational institutions with comprehensive management solutions.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 SchoolSync. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SchoolSyncLanding;
