import React, { useEffect } from 'react';
import styled from 'styled-components';
import { animate, svg, stagger } from 'animejs';

const Loader = () => {
  useEffect(() => {
    // Anime.js v4 SVG Drawing Animation
    animate(svg.createDrawable('.brand-path'), {
      draw: ['0 0', '0 1', '1 1'],
      ease: 'inOutQuad',
      duration: 2500,
      delay: stagger(150),
      loop: true
    });

    // Subtle glow pulse
    animate('.brand-svg', {
      filter: ['drop-shadow(0 0 5px rgba(255, 123, 49, 0.3))', 'drop-shadow(0 0 20px rgba(255, 123, 49, 0.6))'],
      duration: 1250,
      direction: 'alternate',
      loop: true,
      ease: 'inOutSine'
    });
  }, []);

  return (
    <StyledWrapper>
      <div className="glass-container">
        <svg viewBox="0 0 600 120" className="brand-svg">
          <defs>
            <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7B31" />
              <stop offset="50%" stopColor="#FFC800" />
              <stop offset="100%" stopColor="#FF7B31" />
            </linearGradient>
          </defs>

          {/* Stylized "AdventureNexus" SVG Paths - Monoline Style */}
          <g fill="none" stroke="url(#brand-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* A */}
            <path className="brand-path" d="M30 90 L 50 30 L 70 90 M 40 70 L 60 70" />
            {/* d */}
            <path className="brand-path" d="M105 30 V 90 M 105 90 C 105 90, 80 90, 80 70 C 80 50, 105 50, 105 50" />
            {/* v */}
            <path className="brand-path" d="M120 50 L 135 90 L 150 50" />
            {/* e */}
            <path className="brand-path" d="M190 70 H 160 C 160 55, 185 55, 185 70 C 185 85, 160 85, 160 85" />
            {/* n */}
            <path className="brand-path" d="M200 90 V 50 M 200 60 C 200 45, 230 45, 230 60 V 90" />
            {/* t */}
            <path className="brand-path" d="M250 40 V 90 C 250 90, 250 95, 260 95 M 240 55 H 260" />
            {/* u */}
            <path className="brand-path" d="M275 50 V 80 C 275 95, 305 95, 305 80 V 50" />
            {/* r */}
            <path className="brand-path" d="M320 90 V 50 M 320 65 C 320 45, 345 45, 345 55" />
            {/* e */}
            <path className="brand-path" d="M380 70 H 355 C 355 55, 375 55, 375 70 C 375 85, 355 85, 355 85" />

            {/* N (Start of Nexus) */}
            <path className="brand-path" d="M410 90 V 30 L 440 90 V 30" strokeWidth="3.5" />
            {/* e */}
            <path className="brand-path" d="M475 70 H 455 C 455 55, 470 55, 470 70 C 470 85, 455 85, 455 85" />
            {/* x */}
            <path className="brand-path" d="M485 55 L 515 85 M 515 55 L 485 85" />
            {/* u */}
            <path className="brand-path" d="M525 55 V 80 C 525 90, 550 90, 550 80 V 55" />
            {/* s */}
            <path className="brand-path" d="M585 55 C 565 45, 565 65, 585 75 C 600 85, 575 95, 565 85" />
          </g>
        </svg>

        <div className="loader-info">
          <p className="loading-text">Exploring Destinations...</p>
          <div className="progress-track">
            <div className="progress-thumb"></div>
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
  background: #05070a;
  color: white;

  .glass-container {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 2rem;
    padding: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 90%;
    max-width: 800px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .brand-svg {
    width: 100%;
    height: auto;
    max-height: 150px;
    overflow: visible;
  }

  .loader-info {
    width: 100%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .loading-text {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(255, 123, 49, 0.8);
    font-weight: 500;
  }

  .progress-track {
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1px;
    overflow: hidden;
  }

  .progress-thumb {
    height: 100%;
    width: 30%;
    background: linear-gradient(90deg, transparent, #FF7B31, transparent);
    animation: slide 2s infinite ease-in-out;
  }

  @keyframes slide {
    from { transform: translateX(-150%); }
    to { transform: translateX(250%); }
  }
`;

export default Loader;
