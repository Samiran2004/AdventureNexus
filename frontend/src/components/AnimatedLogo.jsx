import React from 'react';
import { motion } from 'framer-motion';

const AnimatedLogo = ({ size = 48, className = '' }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
            >
                <defs>
                    {/* Mountain Gradient: "Adventure" Core */}
                    <linearGradient id="mountain-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#c084fc" /> {/* Top - Lavender */}
                        <stop offset="50%" stopColor="#7c3aed" /> {/* Mid - Violet */}
                        <stop offset="100%" stopColor="#4c1d95" /> {/* Base - Deep Purple */}
                    </linearGradient>

                    {/* Mountain Snow Cap Gradient */}
                    <linearGradient id="snow-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#a5b4fc" />
                    </linearGradient>

                    {/* Globe/Network Gradient: "Nexus" Shell */}
                    <radialGradient id="network-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="70%" stopColor="#22d3ee" stopOpacity="0" /> {/* Transparent center */}
                        <stop offset="90%" stopColor="#22d3ee" stopOpacity="0.2" /> {/* Subtle shimmer */}
                        <stop offset="100%" stopColor="#0891b2" stopOpacity="0.4" /> {/* Rim */}
                    </radialGradient>

                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* --- BACK GRID (The "Nexus" behind the mountain) --- */}
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "50px", originY: "50px", opacity: 0.3 }}
                >
                    {/* Dashed Longitude Lines */}
                    <ellipse cx="50" cy="50" rx="40" ry="10" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 3" />
                    <ellipse cx="50" cy="50" rx="10" ry="40" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="6 4" />
                </motion.g>

                {/* --- CENTRAL MOUNTAIN (THE "ADVENTURE") --- */}
                <motion.g
                    animate={{ y: [-1, 1, -1] }} // Subtle float / breathing
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Main Peak - Left Face (Shadow) */}
                    <path d="M50 25 L 30 75 L 50 75 Z" fill="#4c1d95" />

                    {/* Main Peak - Right Face (Light) */}
                    <path d="M50 25 L 70 75 L 50 75 Z" fill="url(#mountain-gradient)" />

                    {/* Snow Cap - Left */}
                    <path d="M50 25 L 42 45 L 46 42 L 50 48 Z" fill="#e0e7ff" />
                    {/* Snow Cap - Right */}
                    <path d="M50 25 L 58 45 L 54 42 L 50 48 Z" fill="url(#snow-gradient)" />

                    {/* Small secondary peak (Left) */}
                    <path d="M35 55 L 25 75 L 45 75 Z" fill="#5b21b6" />
                    <path d="M35 55 L 30 65 L 35 62 L 40 65 Z" fill="#a5b4fc" opacity="0.8" />
                </motion.g>

                {/* --- FRONT GRID GLOW (The "Nexus" Shield) --- */}
                <circle cx="50" cy="50" r="42" fill="url(#network-glow)" />

                {/* --- ORBIT RING & PLANE (THE JOURNEY) --- */}
                {/* Tilted Orbit Ring */}
                <motion.ellipse
                    cx="50"
                    cy="50"
                    rx="48"
                    ry="14"
                    stroke="#ec4899"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                    fill="none"
                    initial={{ rotate: -15 }} // Tilt
                    style={{ filter: "url(#glow)" }}
                />

                {/* Orbiting Plane Container */}
                <motion.g
                    style={{ originX: "50px", originY: "50px" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                >
                    {/* Counter-rotate container to matching tilt */}
                    <g transform="rotate(-15 50 50)">
                        <g transform="scale(1, 0.29)"> {/* Flatten to match ellipse ratio */}
                            {/* The Plane Object */}
                            <motion.g
                                style={{ x: 48, y: 0 }} // Position on the outer radius
                                transform="scale(1, 3.4)" // Counter-scale to preserve shape
                            >
                                <g transform="rotate(90)"> {/* Point forward along path */}
                                    {/* Trail */}
                                    <motion.path
                                        d="M0 2 L 0 15"
                                        stroke="#f472b6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        style={{ filter: "url(#glow)" }}
                                    />
                                    {/* Plane Icon */}
                                    <path
                                        d="M0 -3 L 3 2 L 0 0 L -3 2 Z"
                                        fill="white"
                                    />
                                </g>
                            </motion.g>
                        </g>
                    </g>
                </motion.g>
            </svg>
        </div>
    );
};

export default AnimatedLogo;
