import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    MapPin, Globe, Bot, Target, Heart, Lightbulb,
    Shield, Zap, Users, Linkedin, Twitter, Github, Mail,
    ArrowLeft, CheckCircle, Award, Sparkles, TrendingUp,
    Layers, Code, Database, Cpu, Palette, Lock
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import NumberCounter from '@/components/NumberCounter';
import Footer from '@/components/mvpblocks/footer-newsletter';
import ContactUs1 from '@/components/mvpblocks/contact-us-1';

const AboutPage = () => {
    const [showContact, setShowContact] = useState(false);

    const handleBackClick = () => {
        setShowContact(false);
        window.scrollTo(0, 0);
    };

    if (showContact) {
        return (
            <div className="min-h-screen bg-background">
                <NavBar />
                <div className="pt-24 px-6 max-w-7xl mx-auto">
                    <Button onClick={handleBackClick} variant="ghost" className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary">
                        <ArrowLeft size={20} /> Back to About
                    </Button>
                    <ContactUs1 />
                </div>
                <Footer />
            </div>
        );
    }

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // Full Tech Stack Data
    const techStack = [
        // Frontend
        { name: "React 19", icon: "react", color: "61DAFB", category: "Core Framework", desc: "Latest React features" },
        { name: "Vite", icon: "vite", color: "646CFF", category: "Build Engine", desc: "Instant HMR" },
        { name: "TailwindCSS", icon: "tailwindcss", color: "06B6D4", category: "Styling", desc: "Utility-first design" },
        { name: "Framer Motion", icon: "framer", color: "0055FF", category: "Animation", desc: "Fluid interactions" },
        { name: "TypeScript", icon: "typescript", color: "3178C6", category: "Language", desc: "Type safety" },

        // Backend & APIs
        { name: "Node.js", icon: "nodedotjs", color: "339933", category: "Backend Runtime", desc: "Scalable services" },
        { name: "FastAPI", icon: "fastapi", color: "009688", category: "AI API", desc: "High-performance Python" },
        { name: "Python", icon: "python", color: "3776AB", category: "AI Logic", desc: "Advanced processing" },
        { name: "Express", icon: "express", color: "ffffff", category: "API Server", desc: "Robust routing" }, // White for visibility

        // Database & Infra
        { name: "MongoDB", icon: "mongodb", color: "47A248", category: "Database", desc: "Flexible NoSQL" },
        { name: "Redis", icon: "redis", color: "DC382D", category: "Caching", desc: "Real-time performance" },
        { name: "Cloudinary", icon: "cloudinary", color: "3448C5", category: "CDN", desc: "Optimized media" },

        // AI & Intelligence
        { name: "OpenAI", icon: "openai", color: "412991", category: "LLM Engine", desc: "GPT-4o Integration" },
        { name: "Groq", icon: "groq", color: "F55036", category: "Inference", desc: "Ultra-fast AI" }, // Groq color
        { name: "Google Gemini", icon: "googlegemini", color: "8E75B2", category: "AI Model", desc: "Multimodal AI" },

        // Utilities
        { name: "Clerk", icon: "clerk", color: "6C47FF", category: "Auth", desc: "Secure identity" },
        { name: "Radix UI", icon: "radixui", color: "ffffff", category: "Primitives", desc: "Accessible components" }, // White for visibility
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
            <NavBar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20">
                            <Sparkles size={14} /> Revolutionizing Travel
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                            We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">AdventureNexus</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                            Empowering explorers with AI-driven journeys. We bridge the gap between dream and destination using cutting-edge technology.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="border-y border-border/50 bg-muted/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Countries", value: 195, icon: Globe },
                            { label: "Travelers", value: 50, suffix: "k+", icon: Users },
                            { label: "Planned Trips", value: 120, suffix: "k+", icon: MapPin },
                            { label: "Satisfaction", value: 99, suffix: "%", icon: Heart },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <stat.icon className="text-primary/60 w-6 h-6 mb-2" />
                                <div className="text-4xl font-bold tracking-tight">
                                    <NumberCounter targetNumber={stat.value} duration={2} />{stat.suffix || "+"}
                                </div>
                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Mission</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            We believe travel should be effortless. By harnessing the power of Artificial Intelligence,
                            we eliminate the stress of planning, giving you more time to experience the world.
                        </p>
                        <div className="space-y-4">
                            {[
                                "Personalized itineraries in seconds",
                                "Real-time budget optimization",
                                "Sustainable travel choices"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle className="text-primary w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-background to-purple-500/20 border border-border/50 p-8 flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
                            <Target className="w-16 h-16 text-primary mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                To become the world's most trusted travel companion, making global exploration accessible,
                                intelligent, and inclusive for every adventurer.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Values</h2>
                        <p className="text-muted-foreground text-lg">Principles that guide our innovation</p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {[
                            { icon: Heart, title: "User-Centric", desc: "We build for the traveler first.", color: "text-red-500" },
                            { icon: Lightbulb, title: "Innovation", desc: "Pushing boundaries with AI.", color: "text-yellow-500" },
                            { icon: Shield, title: "Trust", desc: "Your data is safe with us.", color: "text-green-500" },
                            { icon: Globe, title: "Accessibility", desc: "Travel is for everyone.", color: "text-blue-500" }
                        ].map((val, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="bg-card border border-border/60 p-8 rounded-2xl hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <val.icon className={`w-10 h-10 ${val.color} mb-6 group-hover:scale-110 transition-transform`} />
                                <h3 className="text-xl font-bold mb-2">{val.title}</h3>
                                <p className="text-muted-foreground text-sm">{val.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Detailed Technology Section */}
            <section className="py-24 px-6 bg-background relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">Powered By Innovation</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Our platform is built on a robust, scalable, and intelligent technology stack.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {techStack.map((tech, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-2xl flex items-center gap-4 hover:bg-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center p-3 group-hover:bg-background transition-colors border border-border/20">
                                    <img
                                        src={`https://cdn.simpleicons.org/${tech.icon}/${tech.color}`}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentNode.innerHTML = '<span class="text-xs font-bold text-muted-foreground">DEV</span>';
                                        }}
                                        alt={tech.name}
                                        className="w-full h-full object-contain filter hover:brightness-110 transition-all"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{tech.name}</h3>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{tech.category}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">The Minds Behind</h2>
                    <p className="text-muted-foreground text-lg">Passionate creators building the future of travel</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Samiran Samanta", role: "Technology Lead", initials: "SS",
                            bio: "Architecting scalable systems and driving technical excellence."
                        },
                        {
                            name: "Atarthi Paria", role: "Design Lead", initials: "AP",
                            bio: "Crafting intuitive experiences through data-driven design."
                        },
                        {
                            name: "Shounak Santra", role: "UI/UX Designer", initials: "SS",
                            bio: "Bridging the gap between aesthetics and functionality."
                        },
                        {
                            name: "Ritam Maity", role: "Frontend Dev", initials: "RM",
                            bio: "Building responsive, accessible, and smooth interfaces."
                        },
                        {
                            name: "Arijit Chattaraj", role: "Project Mentor", initials: "AC",
                            bio: "Guiding technical strategy and best practices."
                        }
                    ].map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-card border border-border rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center text-xl font-bold text-muted-foreground mb-4 border-2 border-transparent group-hover:border-primary transition-colors">
                                {member.initials}
                            </div>

                            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                            <p className="text-primary text-sm font-medium mb-3 uppercase tracking-wide">{member.role}</p>
                            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">{member.bio}</p>

                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                <button className="p-2 hover:text-primary transition-colors"><Linkedin size={18} /></button>
                                <button className="p-2 hover:text-primary transition-colors"><Twitter size={18} /></button>
                                <button className="p-2 hover:text-primary transition-colors"><Github size={18} /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary via-purple-600 to-secondary p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Start Your Journey</h2>
                    <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto relative z-10">
                        Join thousands of travelers planning their dream trips with AdventureNexus.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Button size="lg" variant="secondary" className="text-primary font-bold shadow-lg hover:shadow-xl">
                            Plan Now
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-transparent border-white text-white hover:bg-white/10"
                            onClick={() => setShowContact(true)}
                        >
                            Contact Us
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
