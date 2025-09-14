import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/clerk-react';
import { Compass, Menu, X } from 'lucide-react';

// Button component
const Button = ({ children, variant = 'default', className = '', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500';
    const variantClasses = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        ghost: 'bg-transparent text-white hover:bg-gray-800',
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

    // Navigation items
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Search', path: '/search' },
        { name: 'How It Works', path: '/works' },
        { name: 'Destinations', path: '/destinations' },
        { name: 'About', path: '/about' },
        {name: 'Review', path: '/review-page'}
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

    return (
        <div>
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/90 z-40 md:hidden"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu fixed top-0 right-0 h-full w-80 bg-gray-900 z-50 md:hidden border-l border-gray-800 transform transition-transform duration-300">
                    {/* Mobile Menu Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-800">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                <Compass size={20} />
                            </div>
                            <span className="text-lg font-bold text-white">
                                AdventureNexus
                            </span>
                        </div>
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white hover:text-gray-300 transition-colors"
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
                                className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-300"
                                onClick={toggleMobileMenu}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="border-t border-gray-800 pt-4 mt-4 space-y-3">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button variant="ghost" className="w-full justify-center text-white hover:bg-gray-800">
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
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    Plan My Trip
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Navigation */}
            <nav className={`border-b border-gray-800 backdrop-blur-md fixed top-0 w-full z-40 transition-all duration-300 ${
                scrolled
                    ? 'bg-black/95 shadow-lg'
                    : 'bg-black/60'
            }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
                        >
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                <Compass size={24} />
                            </div>
                            <span className="text-2xl font-bold text-white">
                                AdventureNexus
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Desktop CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button
                                        variant="ghost"
                                        className="text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
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
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 text-white font-semibold px-6 py-2 transition-all duration-300">
                                    Plan My Trip
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden text-white hover:text-gray-300 transition-colors duration-300 hover:scale-110"
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
