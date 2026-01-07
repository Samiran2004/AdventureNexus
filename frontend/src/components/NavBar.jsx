import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'; // Clerk components for auth UI
import { Menu, X, Sun, Moon } from 'lucide-react'; // Icons
import { useEffect, useState } from 'react'; // React hooks
import { Link } from 'react-router-dom'; // Navigation link
import { useTheme } from 'next-themes';
import AnimatedLogo from './AnimatedLogo';

// Reusable Button component with variant support
const Button = ({ children, variant = 'default', className = '', ...props }) => {
    // Base styles common to all buttons
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring';

    // Styles specific to different variants
    const variantClasses = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90', // Primary theme button
        ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground', // Transparent button with hover effect
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

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
        { name: 'Plan', path: '/search' },
        { name: 'How It Works', path: '/works' },
        { name: 'Destinations', path: '/destinations' },
        { name: 'About', path: '/about' },
        { name: 'Review', path: '/review-page' }
    ];

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

            {/* Main Navigation */}
            <nav className={`border-b border-transparent fixed top-0 w-full z-40 transition-all duration-300 ${scrolled
                ? 'bg-background/80 shadow-lg border-border backdrop-blur-md'
                : 'bg-transparent'
                }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
                        >
                            <AnimatedLogo size={48} />
                            <span className="text-2xl font-bold logo-shimmer font-outfit tracking-tight drop-shadow-2xl hover:scale-110 transition-all duration-300">
                                AdventureNexus
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative group font-medium"
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Desktop CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
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
                            </button>

                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button
                                        variant="ghost"
                                        className="text-foreground hover:bg-accent hover:scale-105 transition-all duration-300"
                                    >
                                        Sign In
                                    </Button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8 hover:scale-110 transition-transform duration-300"
                                        }
                                    }}
                                />
                            </SignedIn>
                            <Link to="/search">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 font-semibold px-6 py-2 transition-all duration-300 cursor-pointer shadow-md hover:shadow-primary/25">
                                    Plan My Trip
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden text-foreground hover:text-muted-foreground transition-colors duration-300 hover:scale-110"
                            onClick={toggleMobileMenu}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content overlap */}
            <div className="h-10" />
        </div>
    );
}

export default NavBar;
