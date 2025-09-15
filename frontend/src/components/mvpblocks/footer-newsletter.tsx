'use client';

import { Instagram, Linkedin, Twitter, Youtube, Compass, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const legalLinks = [
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Cookie Policy', href: '/cookies' },
  { name: 'Accessibility', href: '/accessibility' },
];

const socialIcons = [
  { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com/adventurenexus', label: 'Instagram' },
  { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com/adventurenexus', label: 'Twitter' },
  { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/company/adventurenexus', label: 'LinkedIn' },
  { icon: <Youtube className="h-5 w-5" />, href: 'https://youtube.com/adventurenexus', label: 'YouTube' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white relative w-full pt-20 pb-10 border-t border-gray-800">
      {/* Background Effects */}
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        <div className="bg-blue-600 absolute top-1/3 left-1/4 h-64 w-64 rounded-full opacity-5 blur-3xl" />
        <div className="bg-purple-600 absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl" />
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 mb-16 rounded-2xl p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold md:text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Start Your Next Adventure
              </h3>
              <p className="text-gray-300 mb-6">
                Join thousands of adventurers who trust AdventureNexus for unforgettable travel experiences.
                Get personalized trip recommendations and exclusive travel deals.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none flex-1"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-6 py-3 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                  Get Travel Tips
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-3">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
            <div className="hidden justify-end md:flex">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 absolute inset-0 rotate-6 rounded-xl" />
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=240&q=80"
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
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <Compass size={24} />
              </div>
              <span className="text-2xl font-bold text-white">AdventureNexus</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              AI-powered travel planning platform that creates personalized itineraries
              for unforgettable adventures. Discover, plan, and explore the world with confidence.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin size={16} className="text-blue-400" />
                <span className="text-sm">Global Travel Solutions</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={16} className="text-blue-400" />
                <span className="text-sm">+1 (555) 123-TRIP</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={16} className="text-blue-400" />
                <span className="text-sm">hello@adventurenexus.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              {socialIcons.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  aria-label={item.label}
                  className="bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 border border-gray-700 hover:border-transparent flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="col-span-1">
              <h4 className="mb-4 text-lg font-semibold text-white">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white hover:text-blue-400 transition-colors duration-300 text-sm"
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
        <div className="border-t border-gray-700 flex flex-col items-center justify-between pt-8 md:flex-row">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} AdventureNexus. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Made with ❤️ for adventurous souls worldwide
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-500 text-xs text-center">
              <div className="font-semibold">✈️ 50K+ Trips Planned</div>
            </div>
            <div className="text-gray-500 text-xs text-center">
              <div className="font-semibold">🌍 200+ Destinations</div>
            </div>
            <div className="text-gray-500 text-xs text-center">
              <div className="font-semibold">⭐ 4.9/5 User Rating</div>
            </div>
            <div className="text-gray-500 text-xs text-center">
              <div className="font-semibold">🔒 Secure & Trusted</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
