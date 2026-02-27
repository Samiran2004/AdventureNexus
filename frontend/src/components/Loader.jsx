import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import anime from 'animejs';

const Loader = () => {
  const compassNeedleRef = useRef(null);
  const ringRef = useRef(null);
  const nexusNodesRef = useRef(null);

  useEffect(() => {
    // 1. Compass Needle Animation: Searching for adventure
    anime({
      targets: '.compass-needle',
      rotate: [
        { value: -45, duration: 500, easing: 'easeInOutQuad' },
        { value: 135, duration: 1000, easing: 'easeInOutElastic(1, .5)' },
        { value: 45, duration: 800, easing: 'easeInOutQuad' },
        { value: 90, duration: 1200, easing: 'spring(1, 80, 10, 0)' }
      ],
      loop: true,
      direction: 'alternate'
    });

    // 2. Nexus Nodes: Pulsing connectivity
    anime({
      targets: '.nexus-node',
      opacity: [0.3, 1],
      scale: [0.8, 1.2],
      delay: anime.stagger(200),
      duration: 1000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine'
    });

    // 3. Globe Lines: Drawing effect
    anime({
      targets: '.globe-line',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: anime.stagger(300),
      loop: true,
      direction: 'alternate'
    });

    // 4. Outer Ring Rotation
    anime({
      targets: '.outer-ring',
      rotate: '1turn',
      duration: 10000,
      easing: 'linear',
      loop: true
    });
  }, []);

  return (
    <StyledWrapper>
      <div className="glass-loader">
        <div className="content">
          <svg width="120" height="120" viewBox="0 0 100 100" className="main-svg">
            <defs>
              <linearGradient id="needle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF7B31" />
                <stop offset="100%" stopColor="#FFC800" />
              </linearGradient>
              <filter id="svg-glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Globe Grid */}
            <g className="globe-grid" opacity="0.2">
              <ellipse cx="50" cy="50" rx="45" ry="15" stroke="var(--primary)" strokeWidth="0.5" fill="none" className="globe-line" />
              <ellipse cx="50" cy="50" rx="15" ry="45" stroke="var(--primary)" strokeWidth="0.5" fill="none" className="globe-line" />
              <circle cx="50" cy="50" r="45" stroke="var(--primary)" strokeWidth="0.5" fill="none" className="globe-line" />
            </g>

            {/* Nexus Nodes & Connections */}
            <g className="nexus-system">
              <line x1="20" y1="50" x2="80" y2="50" stroke="var(--primary)" strokeWidth="0.2" opacity="0.1" />
              <line x1="50" y1="20" x2="50" y2="80" stroke="var(--primary)" strokeWidth="0.2" opacity="0.1" />
              <circle cx="20" cy="50" r="1.5" fill="var(--primary)" className="nexus-node" />
              <circle cx="80" cy="50" r="1.5" fill="var(--primary)" className="nexus-node" />
              <circle cx="50" cy="20" r="1.5" fill="var(--primary)" className="nexus-node" />
              <circle cx="50" cy="80" r="1.5" fill="var(--primary)" className="nexus-node" />
            </g>

            {/* Compass Outer Ring */}
            <g className="outer-ring">
              <circle cx="50" cy="50" r="40" stroke="var(--secondary)" strokeWidth="0.5" fill="none" strokeDasharray="2 4" opacity="0.5" />
              <text x="50" y="8" fontSize="6" fill="var(--primary)" textAnchor="middle" fontWeight="bold">N</text>
              <text x="50" y="96" fontSize="6" fill="var(--muted-foreground)" textAnchor="middle">S</text>
              <text x="92" y="52" fontSize="6" fill="var(--muted-foreground)" textAnchor="middle">E</text>
              <text x="8" y="52" fontSize="6" fill="var(--muted-foreground)" textAnchor="middle">W</text>
            </g>

            {/* Centered Compass Needle */}
            <g className="compass-needle" style={{ transformOrigin: '50px 50px' }}>
              <path d="M50 15 L 45 50 L 50 55 L 55 50 Z" fill="url(#needle-grad)" filter="url(#svg-glow)" />
              <path d="M50 85 L 55 50 L 50 45 L 45 50 Z" fill="#2D3142" />
              <circle cx="50" cy="50" r="2" fill="white" />
            </g>
          </svg>

          <div className="text-container">
            <h2 className="brand-text">AdventureNexus</h2>
            <div className="status-bar">
              <div className="bar-fill"></div>
            </div>
            <p className="loading-msg">Searching for adventures...</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at center, #151921 0%, #0B0E14 100%);
  overflow: hidden;

  .glass-loader {
    position: relative;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2.5rem;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 320px;
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .main-svg {
    filter: drop-shadow(0 0 10px rgba(255, 123, 49, 0.2));
  }

  .text-container {
    text-align: center;
    width: 100%;
  }

  .brand-text {
    font-family: 'Outfit', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, #FF7B31, #FFBE0B, #FF7B31);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s linear infinite;
  }

  .status-bar {
    height: 3px;
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  .bar-fill {
    height: 100%;
    width: 40%;
    background: var(--primary);
    border-radius: 10px;
    animation: loading 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  .loading-msg {
    font-size: 0.8rem;
    color: var(--muted-foreground);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  @keyframes shine {
    to { background-position: 200% center; }
  }

  @keyframes loading {
    0% { transform: translateX(-100%); width: 20%; }
    50% { transform: translateX(100%); width: 60%; }
    100% { transform: translateX(300%); width: 20%; }
  }
`;

export default Loader;
