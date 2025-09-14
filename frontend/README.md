# AdventureNexus — AI Travel Planner

A modern, animated, and responsive for an AI-powered travel planning app, featuring GSAP motion, Clerk authentication, Tailwind UI, and reusable UI blocks.

# Features
 
    AI-focused hero with animated counters, dual CTAs, and a floating dashboard mockup.

    Scroll-triggered animations for features, testimonials, pricing, and CTA sections.

    Auth-ready header with Clerk SignIn and User menus.

    Responsive design with a mobile menu and desktop navigation.

    Reusable UI blocks: Bento Grid, Card Slider, Globe visual, and a velocity-based scroll demo.

# Tech Stack
    React 18 with Hooks and functional components.

     CSS with shadcn/ui components.

    GSAP with ScrollTrigger and TextPlugin.

    Clerk React for authentication.

    lucide-react for icons.

# Screens

    Hero: AI pitch, dual CTA, animated stat cards, floating hero motion.

    Features: Globe visual, card slider, scroll velocity demo, and bento grid.

    Testimonials: Three-card grid with star ratings and user initials.

    Pricing: Three-tier cards with “Most Popular” emphasis and motion on scroll.

    CTA: Gradient background with dual CTA and supporting benefits.

    Footer: Product, Company, Support links with newsletter action and legal.

# Prerequisites
    Node.js 18+ and a package manager like pnpm, npm, or yarn.

    CSS configured in the project.

    Shadcn/ui installed with Button, Card, Badge, and Input primitives.

    Clerk project with a publishable key for client-side auth.

    GSAP installed with ScrollTrigger and TextPlugin plugins.


# Installation
# using pnpm
        pnpm install

# or npm
        npm install

# or yarn
        yarn

# Environment Variables
## Public client key for Clerk:
# Vite
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# CRA or similar
    REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_...
## Server-side secret key if a backend exists:
    CLERK_SECRET_KEY=sk_test_...

# App Provider Setup
## Wrap the application with ClerkProvider and ensure Tailwind styles are imported
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './styles/tailwind.css';

const pubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={pubKey}>
    <App />
  </ClerkProvider>
);

# Usage
## Import and render the landing page component.

import AdventureNexusLanding from './components/AdventureNexusLanding';

export default function Home() {
  return <AdventureNexusLanding />;
}