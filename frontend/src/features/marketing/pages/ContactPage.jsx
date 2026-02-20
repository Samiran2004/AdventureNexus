import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Send,
    Check,
    Loader2,
    Sparkles,
    Clock,
    Globe,
    HeadphonesIcon,
    Zap,
    ArrowRight,
    Twitter,
    Linkedin,
    Github,
    Instagram,
} from 'lucide-react';

const ContactPage = () => {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    const formRef = useRef(null);
    const isInView = useInView(formRef, { once: true, amount: 0.2 });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            console.log('Contact form submitted:', formData);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setFormData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 6000);
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { y: 24, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            value: 'support@adventurenexus.com',
            sub: 'We reply within 24 hours',
            color: 'text-cyan-400',
            bg: 'bg-cyan-400/10',
            border: 'border-cyan-400/20',
        },
        {
            icon: Phone,
            title: 'Call Us',
            value: '+91 98765 43210',
            sub: 'Mon–Fri, 9 AM – 6 PM IST',
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            border: 'border-purple-400/20',
        },
        {
            icon: MapPin,
            title: 'Our Office',
            value: 'Kolkata, West Bengal',
            sub: 'India — 700001',
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            border: 'border-emerald-400/20',
        },
        {
            icon: Clock,
            title: 'Business Hours',
            value: '9:00 AM – 6:00 PM',
            sub: 'Mon – Fri (IST)',
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            border: 'border-amber-400/20',
        },
    ];

    const inquiryCategories = [
        { icon: HeadphonesIcon, label: 'General Support', color: 'text-cyan-400' },
        { icon: Globe, label: 'Travel Planning', color: 'text-purple-400' },
        { icon: Zap, label: 'Technical Issue', color: 'text-amber-400' },
        { icon: MessageSquare, label: 'Partnership', color: 'text-emerald-400' },
    ];

    const faqs = [
        {
            q: 'How does the AI trip planner work?',
            a: 'Our AI analyses your preferences, budget, and travel dates to generate personalized itineraries in seconds.',
        },
        {
            q: 'Is my data safe with AdventureNexus?',
            a: 'Absolutely. We use industry-standard encryption and never share your personal data with third parties.',
        },
        {
            q: 'Can I modify my itinerary after generation?',
            a: 'Yes! Every generated plan is fully editable through our trip builder interface.',
        },
        {
            q: 'What is the typical response time for support?',
            a: 'Our team responds to all email inquiries within 24 hours. Live chat is available during business hours.',
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <NavBar />

            {/* ─── Hero ─── */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[130px] animate-pulse" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20">
                            <Sparkles size={14} /> Get In Touch
                        </span>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                            Let's Start a{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-purple-500">
                                Conversation
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                            Have a question, a partnership idea, or need help with your next adventure?
                            We're just a message away.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="mailto:support@adventurenexus.com">
                                <Button size="lg" className="gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-semibold shadow-lg shadow-primary/20">
                                    <Mail size={18} /> Email Support
                                </Button>
                            </a>
                            <a href="#contact-form">
                                <Button size="lg" variant="outline" className="gap-2 rounded-full border-primary/30 hover:bg-primary/10">
                                    <MessageSquare size={18} /> Send a Message
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── Contact Info Cards ─── */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {contactInfo.map((info, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className={`group bg-card/50 backdrop-blur-sm border ${info.border} p-6 rounded-2xl hover:bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300`}
                            >
                                <div className={`w-12 h-12 ${info.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <info.icon className={`w-6 h-6 ${info.color}`} />
                                </div>
                                <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                                <p className={`font-medium text-sm ${info.color} mb-1`}>{info.value}</p>
                                <p className="text-xs text-muted-foreground">{info.sub}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── Main Contact Form + Inquiry Types ─── */}
            <section id="contact-form" className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-start">

                    {/* Left – Inquiry Categories + Social */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-bold mb-3">What can we help with?</h2>
                            <p className="text-muted-foreground mb-8">
                                Select a category below to help us route your message to the right team.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {inquiryCategories.map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveCategory(idx === activeCategory ? null : idx)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-center hover:-translate-y-0.5 ${
                                            activeCategory === idx
                                                ? 'bg-primary/15 border-primary/40 shadow-lg shadow-primary/10'
                                                : 'bg-card/50 border-border/50 hover:bg-card hover:border-primary/20'
                                        }`}
                                    >
                                        <cat.icon className={`w-7 h-7 ${cat.color}`} />
                                        <span className="text-sm font-semibold">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
                        >
                            <h3 className="font-bold text-lg mb-4">Find Us Online</h3>
                            <div className="flex gap-3">
                                {[
                                    { Icon: Twitter, href: '#', label: 'Twitter' },
                                    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                                    { Icon: Github, href: 'https://github.com/Shounak2004/AdventureNexus', label: 'GitHub' },
                                    { Icon: Instagram, href: '#', label: 'Instagram' },
                                ].map(({ Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-10 h-10 bg-muted hover:bg-primary/15 hover:text-primary border border-border/50 hover:border-primary/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Response time badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                        >
                            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 shadow-lg shadow-emerald-400/50" />
                            <p className="text-sm font-medium">
                                Average response time: <span className="text-primary font-bold">under 24 hours</span>
                            </p>
                        </motion.div>
                    </div>

                    {/* Right – Contact Form */}
                    <motion.div
                        ref={formRef}
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-3 bg-card/50 backdrop-blur-sm border border-border/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative glow inside form */}
                        <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-2">
                                    Send Us a Message{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">✦</span>
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    Fill in the details below and our team will get back to you shortly.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                            className="bg-background/60 border-border/50 focus-visible:ring-primary/50 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            required
                                            className="bg-background/60 border-border/50 focus-visible:ring-primary/50 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder={activeCategory !== null ? inquiryCategories[activeCategory].label : 'How can we help you?'}
                                        required
                                        className="bg-background/60 border-border/50 focus-visible:ring-primary/50 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us about your query, idea, or adventure..."
                                        required
                                        className="h-40 resize-none bg-background/60 border-border/50 focus-visible:ring-primary/50 rounded-xl"
                                    />
                                </div>

                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-semibold text-base shadow-lg shadow-primary/20 transition-all"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Sending…
                                            </span>
                                        ) : isSubmitted ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Check className="h-5 w-5" />
                                                Message Sent! We'll be in touch.
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <Send className="h-5 w-5" />
                                                Send Message
                                            </span>
                                        )}
                                    </Button>
                                </motion.div>

                                <p className="text-center text-xs text-muted-foreground">
                                    By submitting this form you agree to our{' '}
                                    <a href="/privacy" className="underline underline-offset-2 hover:text-primary transition-colors">
                                        Privacy Policy
                                    </a>
                                    .
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── FAQ Section ─── */}
            <section className="py-20 px-6 bg-muted/20 border-y border-border/40">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                            <MessageSquare size={14} /> FAQs
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Common Questions</h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Quick answers to the questions we hear most often.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                                        <span className="text-primary text-sm font-bold">{idx + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">{faq.q}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── CTA Strip ─── */}
            <section className="py-24 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto bg-gradient-to-br from-primary via-purple-600 to-cyan-500 p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <h2 className="text-3xl md:text-5xl font-bold mb-4 relative z-10">
                        Ready to Explore the World?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto relative z-10">
                        Let our AI plan your perfect adventure — fast, smart, and personalised just for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <a href="/">
                            <Button size="lg" variant="secondary" className="text-primary font-bold shadow-lg hover:shadow-xl gap-2">
                                Plan My Trip <ArrowRight size={18} />
                            </Button>
                        </a>
                        <a href="/help">
                            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 gap-2">
                                Visit Help Center <HeadphonesIcon size={18} />
                            </Button>
                        </a>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactPage;
