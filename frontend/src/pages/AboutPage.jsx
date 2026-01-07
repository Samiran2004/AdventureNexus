import React, { useRef, useEffect, useState } from 'react';
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
    Github,
    ArrowLeft
} from 'lucide-react';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/components/NavBar';
import NumberCounter from '@/components/NumberCounter';
import Footer from '@/components/mvpblocks/footer-newsletter';
import ContactUs1 from '@/components/mvpblocks/contact-us-1';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// AboutPage component displays information about the company
const AboutPage = () => {
    // Refs for GSAP animations that are used to animate the sections of the page
    const heroRef = useRef(null);
    const missionRef = useRef(null);
    const storyRef = useRef(null);
    const valuesRef = useRef(null);
    const teamRef = useRef(null);
    const techRef = useRef(null);
    const statsRef = useRef(null);

    const [showContact, setShowContact] = useState(false);

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

    const handleBackClick = () => {
        setShowContact(false);
        window.scrollTo(0, 0);
    };

    if (showContact) {
        return (
            <div className="min-h-screen bg-background">
                <NavBar />
                <div className="pt-20 px-4">
                    {/* Added a Back Button so user isn't stuck */}
                    <Button
                        onClick={handleBackClick}
                        variant="ghost"
                        className="text-foreground hover:text-primary mb-4 flex items-center gap-2"
                    >
                        <ArrowLeft size={30} />
                    </Button>
                    <ContactUs1 />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            <NavBar />

            {/* Hero Section */}
            <section ref={heroRef} className="py-20 bg-background relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-primary/20 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/20 rounded-full opacity-30 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                            🚀 About AdventureNexus
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                            Revolutionizing Travel with
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Artificial Intelligence</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                            We're on a mission to make travel planning effortless, personalized, and accessible to everyone.
                            Through cutting-edge AI technology, we transform the way people discover, plan, and experience the world.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section ref={missionRef} className="py-20 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Mission</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                At AdventureNexus, we believe that every journey should be extraordinary. Our mission is to
                                democratize travel planning by harnessing the power of artificial intelligence to create
                                personalized, seamless, and unforgettable travel experiences for adventurers worldwide.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We're eliminating the overwhelming complexity of trip planning, making it possible for anyone
                                to discover hidden gems, optimize their itineraries, and travel smarter with confidence.
                            </p>
                        </div>
                        <div className="relative">
                            <Card className="bg-card border-border p-8 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-lg">
                                            <Target className="text-primary-foreground" size={24} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground">Our Vision</h3>
                                    </div>
                                    <p className="text-muted-foreground">
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
            <section ref={statsRef} className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                <NumberCounter targetNumber={195} duration={2} />+
                            </div>
                            <div className="text-muted-foreground">Countries Covered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                <NumberCounter targetNumber={5} duration={2.5} />+
                            </div>
                            <div className="text-muted-foreground">Happy Travelers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                <NumberCounter targetNumber={10} duration={3} />+
                            </div>
                            <div className="text-muted-foreground">Trips Planned</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                <NumberCounter targetNumber={98} duration={2} />%
                            </div>
                            <div className="text-muted-foreground">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section ref={storyRef} className="py-20 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Story</h2>
                            <p className="text-xl text-muted-foreground">How we started and where we're going</p>
                        </div>

                        <div className="space-y-12">
                            <div className="grid md:grid-cols-3 gap-8">
                                <Card className="bg-card border-border">
                                    <CardContent className="p-6 text-center">
                                        <div className="bg-primary/10 p-3 rounded-lg inline-block mb-4">
                                            <Lightbulb className="text-primary" size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-card-foreground mb-2">2023: The Idea</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Founded by travel enthusiasts frustrated with complex trip planning,
                                            we envisioned an AI-powered solution to simplify travel.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card border-border">
                                    <CardContent className="p-6 text-center">
                                        <div className="bg-secondary/10 p-3 rounded-lg inline-block mb-4">
                                            <Bot className="text-secondary" size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-card-foreground mb-2">2024: AI Development</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Launched our first AI travel planner, processing thousands of data points
                                            to create personalized itineraries in seconds.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card border-border">
                                    <CardContent className="p-6 text-center">
                                        <div className="bg-green-600/10 p-3 rounded-lg inline-block mb-4">
                                            <Globe className="text-green-600 dark:text-green-400" size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-card-foreground mb-2">2025: Global Expansion</h3>
                                        <p className="text-muted-foreground text-sm">
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
            <section ref={valuesRef} className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Values</h2>
                        <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Heart className="text-red-500" size={32} />,
                                title: "User-Centric",
                                description: "Every feature is designed with our travelers' needs and experiences at the forefront."
                            },
                            {
                                icon: <Lightbulb className="text-yellow-500" size={32} />,
                                title: "Innovation",
                                description: "We continuously push the boundaries of AI technology to enhance travel planning."
                            },
                            {
                                icon: <Shield className="text-green-500" size={32} />,
                                title: "Trust & Security",
                                description: "We protect user data and privacy while providing reliable, accurate recommendations."
                            },
                            {
                                icon: <Globe className="text-blue-500" size={32} />,
                                title: "Accessibility",
                                description: "Making travel planning accessible to everyone, regardless of experience or budget."
                            }
                        ].map((value, index) => (
                            <Card key={index} className="value-card bg-card border-border text-center hover:scale-105 transition-transform duration-300">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-center">{value.icon}</div>
                                    <h3 className="text-lg font-semibold text-card-foreground">{value.title}</h3>
                                    <p className="text-muted-foreground text-sm">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section ref={teamRef} className="py-20 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Team</h2>
                        <p className="text-xl text-muted-foreground">The passionate people behind AdventureNexus</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "SAMIRAN SAMANTA",
                                role: "Technology Lead",
                                bio: "Responsible for managing the technical structure of the system. Handles system architecture, backend logic, and ensures smooth performance of the application.",
                                avatar: "SS",
                                social: { linkedin: "#", twitter: "#" }
                            },
                            {
                                name: "ATARTHI PARIA",
                                role: "Design & Market Research Lead",
                                bio: "Oversees visual design direction while researching market trends, user behavior, and emerging statistics to drive creative, data-informed design decisions.",
                                avatar: "AP",
                                social: { linkedin: "#", github: "#" }
                            },
                            {
                                name: "SHOUNAK SANTRA",
                                role: "UI/UX DESIGNER",
                                bio: "Owns the frontend architecture and user interface implementation, ensuring seamless user experience, visual consistency, and performance across the platform.",
                                avatar: "SS",
                                social: { linkedin: "#", twitter: "#" }
                            },
                            {
                                name: "RITAM MAITY",
                                role: "UI/UX DESIGNER",
                                bio: "Codes interactive intefaces and design systems, focusing on usability, accessibility, and smooth user interactions.",
                                avatar: "RM",
                                social: { linkedin: "#", github: "#" }
                            },
                            {
                                name: "",
                                role: "Strategic Alliances Director",
                                bio: "Builds and manages high-impact partnerships with travel providers, platforms, and global stakeholders.",
                                avatar: "SS",
                                social: { linkedin: "#", twitter: "#" }
                            },
                            {
                                name: "Arijit Chattaraj",
                                role: "Project Mentor",
                                bio: "Advises the team on methodology, technical direction, and best practices while ensuring the project meets academic and professional standards",
                                avatar: "AC",
                                social: { linkedin: "#", mail: "#" }
                            }

                        ].map((member, index) => (
                            <Card key={index} className="team-card bg-card border-border hover:scale-105 transition-transform duration-300">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto">
                                        {member.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-card-foreground">{member.name}</h3>
                                        <p className="text-primary text-sm font-medium">{member.role}</p>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                                    <div className="flex justify-center space-x-3">
                                        {member.social.linkedin && (
                                            <Button variant="outline" size="sm" className="border-input hover:bg-primary/10 hover:text-primary cursor-pointer">
                                                <Linkedin size={16} />
                                            </Button>
                                        )}
                                        {member.social.twitter && (
                                            <Button variant="outline" size="sm" className="border-input hover:bg-primary/10 hover:text-primary cursor-pointer">
                                                <Twitter size={16} />
                                            </Button>
                                        )}
                                        {member.social.github && (
                                            <Button variant="outline" size="sm" className="border-input hover:bg-primary/10 hover:text-primary cursor-pointer">
                                                <Github size={16} />
                                            </Button>
                                        )}
                                        {member.social.mail && (
                                            <Button variant="outline" size="sm" className="border-input hover:bg-destructive/10 hover:text-destructive cursor-pointer">
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
            <section ref={techRef} className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Powered by Advanced AI</h2>
                        <p className="text-xl text-muted-foreground">The technology stack that makes magic happen</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-foreground">Cutting-Edge Technology</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 p-2 rounded-lg mt-1">
                                        <Bot className="text-primary" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Machine Learning Algorithms</h4>
                                        <p className="text-muted-foreground text-sm">Advanced ML models analyze millions of data points to understand your preferences and create perfect itineraries.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-secondary/10 p-2 rounded-lg mt-1">
                                        <Zap className="text-secondary" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Real-Time Processing</h4>
                                        <p className="text-muted-foreground text-sm">Lightning-fast APIs process travel data in real-time to provide up-to-date recommendations and pricing.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-600/10 p-2 rounded-lg mt-1">
                                        <Globe className="text-green-600 dark:text-green-400" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Global Data Network</h4>
                                        <p className="text-muted-foreground text-sm">Integrated with major airlines, hotels, and local service providers across 195+ countries.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card className="bg-card border-border">
                            <CardContent className="p-6">
                                <h4 className="text-lg font-semibold text-card-foreground mb-4">AI Performance Metrics</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">Recommendation Accuracy</span>
                                            <span className="text-foreground">98.5%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full">
                                            <div className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full" style={{ width: '98.5%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">Response Time</span>
                                            <span className="text-foreground"> 3 seconds</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full">
                                            <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full" style={{ width: '95%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">User Satisfaction</span>
                                            <span className="text-foreground">97.8%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full">
                                            <div className="h-full bg-gradient-to-r from-green-600 to-yellow-500 rounded-full" style={{ width: '97.8%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary via-secondary to-primary text-primary-foreground">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">Join Our Journey</h2>
                        <p className="text-xl opacity-90">
                            Be part of the travel revolution. Whether you're a traveler, partner, or team member,
                            there's a place for you in the AdventureNexus family.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90">
                                Start Your Adventure
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => setShowContact(true)}>
                                Contact Us
                                <Mail className="ml-2" size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AboutPage;
