import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'; // Clerk components for auth UI
import { Menu, X, Sun, Moon, ChevronDown, Compass, Users, Map as MapIcon, BookOpen, Sparkles, Tent } from 'lucide-react'; // Icons
import { useEffect, useState } from 'react'; // React hooks
import { Link } from 'react-router-dom'; // Navigation link
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLogo from './AnimatedLogo';

import { Button } from '@/components/ui/button';

function NavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Navigation items
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'My Trips', path: '/my-trips' },
    ];

    const discoverItems = [
        { 
            name: 'Community', 
            path: '/community', 
            icon: Users, 
            desc: 'Join fellow travelers and share stories.',
            color: 'text-blue-500'
        },
        { 
            name: 'Destinations', 
            path: '/destinations', 
            icon: MapIcon, 
            desc: 'Explore popular spots around the world.',
            color: 'text-emerald-500'
        },
        { 
            name: 'Trip Planner', 
            path: '/search', 
            icon: Compass, 
            desc: 'AI-powered smart itinerary builder.',
            color: 'text-purple-500'
        },
        { 
            name: 'Travel Guides', 
            path: '/guides', 
            icon: BookOpen, 
            desc: 'Expert advice for your next journey.',
            color: 'text-orange-500'
        },
        { 
            name: 'Experiences', 
            path: '/experiences', 
            icon: Sparkles, 
            desc: 'Curated local activities and hidden gems.',
            color: 'text-pink-500'
        },
        { 
            name: 'Adventure Tours', 
            path: '/tours', 
            icon: Tent, 
            desc: 'Thrilling group expeditions & treks.',
            color: 'text-indigo-500'
        }
    ];

    const [discoverOpen, setDiscoverOpen] = useState(false);

    // Mobile menu toggle
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('.mobile-menu')) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    if (!mounted) return null;

    return (
        <div>
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu fixed top-0 right-0 h-full w-80 bg-background z-50 md:hidden border-l border-border transform transition-transform duration-300">
                    {/* Mobile Menu Header */}
                    <div className="flex justify-between items-center p-6 border-b border-border">
                        <div className="flex items-center space-x-2">
                            <AnimatedLogo size={40} />
                            <span className="text-lg font-bold logo-shimmer font-outfit tracking-tight drop-shadow-lg">
                                AdventureNexus
                            </span>
                        </div>
                        <button
                            onClick={toggleMobileMenu}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Mobile Menu Items */}
                    <div className="flex flex-col space-y-2 p-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-4 py-3 transition-all duration-300"
                                onClick={toggleMobileMenu}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="py-2 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Discover</div>
                        {discoverItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="flex items-center gap-4 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-4 py-3 transition-all duration-300"
                                onClick={toggleMobileMenu}
                            >
                                <item.icon size={18} className={item.color} />
                                {item.name}
                            </Link>
                        ))}

                        <div className="flex items-center justify-between px-4 py-3">
                            <span className="text-muted-foreground font-semibold">Theme</span>
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="relative w-16 h-8 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 shadow-inner transition-shadow duration-300 hover:shadow-lg group"
                            >
                                {/* Track gradient overlay */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Animated toggle ball */}
                                <div
                                    className="absolute top-0.5 w-7 h-7 rounded-full transition-all duration-300 ease-out will-change-transform"
                                    style={{
                                        transform: theme === 'dark' ? 'translateX(2px) scale(1)' : 'translateX(34px) scale(1)',
                                        background: theme === 'dark'
                                            ? 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
                                            : 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #fb923c 100%)',
                                        boxShadow: theme === 'dark'
                                            ? '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)'
                                            : '0 2px 8px rgba(251,191,36,0.4), inset 0 1px 2px rgba(255,255,255,0.5)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = theme === 'dark' ? 'translateX(2px) scale(1.1)' : 'translateX(34px) scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = theme === 'dark' ? 'translateX(2px) scale(1)' : 'translateX(34px) scale(1)'}
                                >
                                    {/* Inner glow */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>

                                    {/* Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {theme === 'dark' ? (
                                            <Moon className="h-4 w-4 text-slate-300 drop-shadow transition-transform duration-300 group-hover:rotate-[-20deg]" />
                                        ) : (
                                            <Sun className="h-4 w-4 text-white drop-shadow transition-transform duration-300 group-hover:rotate-180" />
                                        )}
                                    </div>
                                </div>

                                <span className="sr-only">Toggle theme</span>
                            </button>
                        </div>

                        <div className="border-t border-border pt-4 mt-4 space-y-3">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button variant="ghost" className="w-full justify-center text-foreground hover:bg-accent">
                                        Sign In
                                    </Button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <div className="flex items-center justify-center">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-10 h-10"
                                            }
                                        }}
                                    />
                                </div>
                            </SignedIn>
                            <Link to="/search">
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                                    Plan My Trip
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Navigation - Floating Island */}
            <div className="fixed top-0 w-full z-50 flex justify-center pt-4 sm:pt-6 px-3 sm:px-4">
                <nav
                    className={`transition-all duration-500 ease-in-out px-4 sm:px-6 py-2 rounded-full border border-white/10 glass-card flex items-center justify-between gap-4 sm:gap-8 w-full max-w-5xl ${
                        scrolled ? 'scale-95' : 'scale-100'
                    }`}
                >
                    <div className="flex items-center gap-4 sm:gap-12">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        >
                            <AnimatedLogo size={28} />
                            <span className="hidden sm:block font-bold font-inter text-lg tracking-tight text-white">
                                AdventureNexus
                            </span>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Discover Mega Menu Trigger */}
                            <div 
                                className="relative group"
                                onMouseEnter={() => setDiscoverOpen(true)}
                                onMouseLeave={() => setDiscoverOpen(false)}
                            >
                                <button 
                                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground group-hover:text-white transition-colors"
                                >
                                    Discover <ChevronDown size={14} className={`transition-transform duration-300 ${discoverOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {discoverOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute left-0 mt-2 w-[450px] bg-card/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-6 grid grid-cols-2 gap-4"
                                        >
                                            {discoverItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group/item"
                                                >
                                                    <div className={`p-2.5 rounded-xl bg-white/5 ${item.color} group-hover/item:scale-110 transition-transform`}>
                                                        <item.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white group-hover/item:text-primary transition-colors">{item.name}</div>
                                                        <div className="text-[10px] text-muted-foreground leading-tight mt-1">{item.desc}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link
                                to="/review-page"
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                            >
                                Reviews
                            </Link>
                        </div>
                    </div>

                    {/* Desktop CTA Buttons & Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8 rounded-full border border-white/10"
                                    }
                                }}
                            />
                        </SignedIn>

                        <Link to="/search">
                            <Button className="h-9 px-6 bg-white text-black hover:bg-white/90 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                                Plan Trip
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-white p-1"
                        onClick={toggleMobileMenu}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </nav>
            </div>

            {/* Spacer to prevent content overlap */}
            <div className="h-10" />
        </div>
    );
}

export default NavBar;
