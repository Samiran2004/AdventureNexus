'use client';

import axios from 'axios';
import { Instagram, Linkedin, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useMatch } from 'react-router-dom';
import AnimatedLogo from '../AnimatedLogo';
const vite_backend_url = import.meta.env.VITE_BACKEND_URL;
// const vite_backend_url = "http://localhost:8000"

// Footer navigation columns data
const footerColumns = [
  {
    title: 'Explore',
    links: [
      { name: 'Popular Destinations', href: '/destinations' },
      { name: 'Trip Planner', href: '/search' },
      { name: 'Travel Guides', href: '/guides' },
      { name: 'Local Experiences', href: '/experiences' },
      { name: 'Adventure Tours', href: '/tours' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '/works' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press & Media', href: '/press' },
      { name: 'Partners', href: '/partners' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Travel Insurance', href: '/insurance' },
      { name: 'Safety Guidelines', href: '/safety' },
      { name: 'Community', href: '/community' },
    ],
  },
];

// Content for legal links
const legalLinks = [
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Cookie Policy', href: '/cookies' },
  { name: 'Accessibility', href: '/accessibility' },
];

// Social media links
const socialIcons = [
  { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com/adventurenexus', label: 'Instagram' },
  { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com/adventurenexus', label: 'Twitter' },
  { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/company/adventurenexus', label: 'LinkedIn' },
  { icon: <Youtube className="h-5 w-5" />, href: 'https://youtube.com/adventurenexus', label: 'YouTube' },
];

// Footer component handles newsletter subscription and renders footer links
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [userMail, setUserMail] = useState("");

  // Handle newsletter subscription
  const onClickSubscribeButton = async () => {
    console.log(userMail);

    // Cleaned up validation slightly for better safety
    if (!userMail || userMail.trim() === "") {
      toast.error("Please enter a valid mail.");
      return;
    }

    try {
      const response = await fetch(`${vite_backend_url}/api/v1/mail/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 1. Necessary for backend to understand JSON
        },
        body: JSON.stringify({ userMail }), // 2. Convert object to string
      });

      // 3. Check if the request was successful (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 4. Parse the JSON response
      const data = await response.json();
      toast.success(data.message || data.data || "Subscribed successfully!");

      setUserMail("");

    } catch (error) {
      console.error("Error on Subscribe...", error);
      toast.error("Error in Subscription!");
    }
  }

  return (
    <footer className="bg-background text-foreground relative w-full pt-20 pb-10 border-t border-border">
      {/* Background Effects */}
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        <div className="bg-primary/20 absolute top-1/3 left-1/4 h-64 w-64 rounded-full opacity-5 blur-3xl" />
        <div className="bg-secondary/20 absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl" />
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="bg-card/80 backdrop-blur-lg border border-border mb-16 rounded-2xl p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold md:text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Start Your Next Adventure
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of adventurers who trust AdventureNexus for unforgettable travel experiences.
                Get personalized trip recommendations and exclusive travel deals.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={userMail}
                  onChange={(e) => setUserMail(e.target.value)}
                  className="bg-input border border-input text-foreground placeholder-muted-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-ring focus:border-transparent focus:outline-none flex-1"
                />
                <button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-lg px-6 py-3 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/25 cursor-pointer" onClick={onClickSubscribeButton}>
                  Get Travel Tips
                </button>
              </div>
              <p className="text-muted-foreground text-sm mt-3">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
            <div className="hidden justify-end md:flex">
              <div className="relative">
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 absolute inset-0 rotate-6 rounded-xl" />
                <img
                  src="https://images.unsplash.com/photo-1707343848552-893e05dba6ac?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Adventure travelers exploring mountains"
                  className="relative w-80 h-60 rounded-xl object-cover shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="mb-6 flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
              <AnimatedLogo size={48} />
              <span className="text-2xl font-bold logo-shimmer font-outfit tracking-tight drop-shadow-xl">AdventureNexus</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              AI-powered travel planning platform that creates personalized itineraries
              for unforgettable adventures. Discover, plan, and explore the world with confidence.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm">AdventureNexus</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone size={16} className="text-primary" />
                <span className="text-sm">00000 00000</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail size={16} className="text-primary" />
                <span className="text-sm">adventurenexus.org@gmail.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              {socialIcons.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  aria-label={item.label}
                  className="bg-accent/50 hover:bg-gradient-to-r hover:from-primary hover:to-secondary border border-border hover:border-transparent flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 text-foreground"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="col-span-1">
              <h4 className="mb-4 text-lg font-semibold text-foreground">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border flex flex-col items-center justify-between pt-8 md:flex-row">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm">
              © {currentYear} AdventureNexus. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Made with ❤️ for adventurous souls worldwide
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-muted-foreground text-xs text-center">
              <div className="font-semibold">✈️ 5+ Trips Planned</div>
            </div>
            <div className="text-muted-foreground text-xs text-center">
              <div className="font-semibold">🌍 200+ Destinations</div>
            </div>
            <div className="text-muted-foreground text-xs text-center">
              <div className="font-semibold">⭐ 4.9/5 User Rating</div>
            </div>
            <div className="text-muted-foreground text-xs text-center">
              <div className="font-semibold">🔒 Secure & Trusted</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
