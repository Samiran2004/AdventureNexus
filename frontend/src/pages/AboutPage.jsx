import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Plane,
    Users,
    Globe,
    Bot,
    Award,
    Compass,
    Target,
    Heart,
    Lightbulb,
    Shield,
    Zap,
    Clock,
    Star,
    ArrowRight,
    Mail,
    Linkedin,
    Twitter,
    Github
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/components/NavBar';
import NumberCounter from '@/components/NumberCounter';
import Footer from '@/components/mvpblocks/footer-newsletter';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
    // Refs for GSAP animations
    const heroRef = useRef(null);
    const missionRef = useRef(null);
    const storyRef = useRef(null);
    const valuesRef = useRef(null);
    const teamRef = useRef(null);
    const techRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero animation
            gsap.from(heroRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out"
            });

            // Section animations with scroll triggers
            const sections = [missionRef, storyRef, valuesRef, teamRef, techRef, statsRef];

            sections.forEach((ref) => {
                gsap.from(ref.current, {
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 0,
                    y: 60,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });

            // Animate cards with stagger
            gsap.from(".value-card", {
                scrollTrigger: {
                    trigger: valuesRef.current,
                    start: "top 80%",
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });

            gsap.from(".team-card", {
                scrollTrigger: {
                    trigger: teamRef.current,
                    start: "top 80%",
                },
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)"
            });

        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-black overflow-hidden">
            <NavBar />

            {/* Hero Section */}
            <section ref={heroRef} className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-900/20 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-900/20 rounded-full opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        <Badge className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-400 border border-blue-700/30">
                            🚀 About AdventureNexus
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                            Revolutionizing Travel with
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Artificial Intelligence</span>
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                            We're on a mission to make travel planning effortless, personalized, and accessible to everyone.
                            Through cutting-edge AI technology, we transform the way people discover, plan, and experience the world.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section ref={missionRef} className="py-20 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Mission</h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                At AdventureNexus, we believe that every journey should be extraordinary. Our mission is to
                                democratize travel planning by harnessing the power of artificial intelligence to create
                                personalized, seamless, and unforgettable travel experiences for adventurers worldwide.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                We're eliminating the overwhelming complexity of trip planning, making it possible for anyone
                                to discover hidden gems, optimize their itineraries, and travel smarter with confidence.
                            </p>
                        </div>
                        <div className="relative">
                            <Card className="bg-gray-900/80 border border-gray-700 p-8 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg">
                                            <Target className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">Our Vision</h3>
                                    </div>
                                    <p className="text-gray-300">
                                        To become the world's most trusted AI travel companion, empowering every traveler
                                        to explore the world with confidence and create memories that last a lifetime.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section ref={statsRef} className="py-16 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                <NumberCounter targetNumber={195} duration={2} />+
                            </div>
                            <div className="text-gray-400">Countries Covered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                <NumberCounter targetNumber={50000} duration={2.5} />+
                            </div>
                            <div className="text-gray-400">Happy Travelers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                <NumberCounter targetNumber={1000000} duration={3} />+
                            </div>
                            <div className="text-gray-400">Trips Planned</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                <NumberCounter targetNumber={98} duration={2} />%
                            </div>
                            <div className="text-gray-400">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section ref={storyRef} className="py-20 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Story</h2>
                            <p className="text-xl text-gray-400">How we started and where we're going</p>
                        </div>

                        <div className="space-y-12">
                            <div className="grid md:grid-cols-3 gap-8">
                                <Card className="bg-gray-900 border-gray-700">
                                    <CardContent className="p-6 text-center">
                                        <div className="bg-blue-600/20 p-3 rounded-lg inline-block mb-4">
                                            <Lightbulb className="text-blue-400" size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">2023: The Idea</h3>
                                        <p className="text-gray-400 text-sm">
                                            Founded by travel enthusiasts frustrated with complex trip planning,
                                            we envisioned an AI-powered solution to simplify travel.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-900 border-gray-700">
                                    <CardContent className="p-6 text-center">
                                        <div className="bg-purple-600/20 p-3 rounded-lg inline-block mb-4">
                                            <Bot className="text-purple-400" size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">2024: AI Development</h3>
                                        <p className="text-gray-400 text-sm">
                                            Launched our first AI travel planner, processing thousands of data points
                                            to create personalized itineraries in seconds.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-900 border-gray-700">
                                    <CardContent className="p-6 text-center">
                                        <div className="bg-green-600/20 p-3 rounded-lg inline-block mb-4">
                                            <Globe className="text-green-400" size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">2025: Global Expansion</h3>
                                        <p className="text-gray-400 text-sm">
                                            Expanded to 195+ countries with advanced AI features, serving travelers
                                            worldwide with localized recommendations.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section ref={valuesRef} className="py-20 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Our Values</h2>
                        <p className="text-xl text-gray-400">The principles that guide everything we do</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Heart className="text-red-400" size={32} />,
                                title: "User-Centric",
                                description: "Every feature is designed with our travelers' needs and experiences at the forefront."
                            },
                            {
                                icon: <Lightbulb className="text-yellow-400" size={32} />,
                                title: "Innovation",
                                description: "We continuously push the boundaries of AI technology to enhance travel planning."
                            },
                            {
                                icon: <Shield className="text-green-400" size={32} />,
                                title: "Trust & Security",
                                description: "We protect user data and privacy while providing reliable, accurate recommendations."
                            },
                            {
                                icon: <Globe className="text-blue-400" size={32} />,
                                title: "Accessibility",
                                description: "Making travel planning accessible to everyone, regardless of experience or budget."
                            }
                        ].map((value, index) => (
                            <Card key={index} className="value-card bg-gray-800 border-gray-700 text-center hover:scale-105 transition-transform duration-300">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-center">{value.icon}</div>
                                    <h3 className="text-lg font-semibold text-white">{value.title}</h3>
                                    <p className="text-gray-400 text-sm">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section ref={teamRef} className="py-20 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Meet Our Team</h2>
                        <p className="text-xl text-gray-400">The passionate people behind AdventureNexus</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Alex Chen",
                                role: "CEO & Co-Founder",
                                bio: "Former travel blogger turned tech entrepreneur. Passionate about using AI to democratize travel.",
                                avatar: "AC",
                                social: { linkedin: "#", twitter: "#" }
                            },
                            {
                                name: "Sarah Martinez",
                                role: "CTO & Co-Founder",
                                bio: "AI researcher with 10+ years in machine learning. Loves building intelligent systems.",
                                avatar: "SM",
                                social: { linkedin: "#", github: "#" }
                            },
                            {
                                name: "David Kumar",
                                role: "Head of Product",
                                bio: "UX design expert focused on creating intuitive travel experiences for millions of users.",
                                avatar: "DK",
                                social: { linkedin: "#", twitter: "#" }
                            },
                            {
                                name: "Emma Thompson",
                                role: "Lead AI Engineer",
                                bio: "PhD in Computer Science specializing in recommendation systems and natural language processing.",
                                avatar: "ET",
                                social: { linkedin: "#", github: "#" }
                            },
                            {
                                name: "Marco Rodriguez",
                                role: "Head of Partnerships",
                                bio: "Travel industry veteran with extensive network of global travel suppliers and destinations.",
                                avatar: "MR",
                                social: { linkedin: "#", twitter: "#" }
                            },
                            {
                                name: "Lisa Wong",
                                role: "Customer Success Lead",
                                bio: "Dedicated to ensuring every traveler has an amazing experience with our platform.",
                                avatar: "LW",
                                social: { linkedin: "#", mail: "#" }
                            }
                        ].map((member, index) => (
                            <Card key={index} className="team-card bg-gray-900 border-gray-700 hover:scale-105 transition-transform duration-300">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
                                        {member.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                                        <p className="text-blue-400 text-sm font-medium">{member.role}</p>
                                    </div>
                                    <p className="text-gray-400 text-sm">{member.bio}</p>
                                    <div className="flex justify-center space-x-3">
                                        {member.social.linkedin && (
                                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-blue-200 hover:text-blue-700 hover:border-white">
                                                <Linkedin size={16} />
                                            </Button>
                                        )}
                                        {member.social.twitter && (
                                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-blue-200 hover:text-blue-500 hover:border-white">
                                                <Twitter size={16} />
                                            </Button>
                                        )}
                                        {member.social.github && (
                                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-black hover:border-white">
                                                <Github size={16} />
                                            </Button>
                                        )}
                                        {member.social.mail && (
                                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-red-600 hover:border-white">
                                                <Mail size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section ref={techRef} className="py-20 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Powered by Advanced AI</h2>
                        <p className="text-xl text-gray-400">The technology stack that makes magic happen</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">Cutting-Edge Technology</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-600/20 p-2 rounded-lg mt-1">
                                        <Bot className="text-blue-400" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Machine Learning Algorithms</h4>
                                        <p className="text-gray-400 text-sm">Advanced ML models analyze millions of data points to understand your preferences and create perfect itineraries.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-purple-600/20 p-2 rounded-lg mt-1">
                                        <Zap className="text-purple-400" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Real-Time Processing</h4>
                                        <p className="text-gray-400 text-sm">Lightning-fast APIs process travel data in real-time to provide up-to-date recommendations and pricing.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-600/20 p-2 rounded-lg mt-1">
                                        <Globe className="text-green-400" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Global Data Network</h4>
                                        <p className="text-gray-400 text-sm">Integrated with major airlines, hotels, and local service providers across 195+ countries.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-6">
                                <h4 className="text-lg font-semibold text-white mb-4">AI Performance Metrics</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">Recommendation Accuracy</span>
                                            <span className="text-white">98.5%</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full">
                                            <div className="h-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full" style={{width: '98.5%'}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">Response Time</span>
                                            <span className="text-white"> 3 seconds</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full">
                                            <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full" style={{width: '95%'}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">User Satisfaction</span>
                                            <span className="text-white">97.8%</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full">
                                            <div className="h-full bg-gradient-to-r from-green-600 to-yellow-500 rounded-full" style={{width: '97.8%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">Join Our Journey</h2>
                        <p className="text-xl opacity-90">
                            Be part of the travel revolution. Whether you're a traveler, partner, or team member,
                            there's a place for you in the AdventureNexus family.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-50">
                                Start Your Adventure
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-green-800 border-white hover:bg-white hover:text-blue-600">
                                Contact Us
                                <Mail className="ml-2" size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/* <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                <Compass size={24} />
                            </div>
                            <span className="text-2xl font-bold">AdventureNexus</span>
                        </div>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Empowering travelers with AI-powered trip planning and personalized recommendations for unforgettable adventures.
                        </p>
                        <div className="border-t border-gray-800 pt-8">
                            <p className="text-gray-400 text-sm">
                                © 2025 AdventureNexus. All rights reserved. Powered by AI for better travel experiences.
                            </p>
                        </div>
                    </div>
                </div>
            </footer> */}
            <Footer/>
        </div>
    );
};

export default AboutPage;
