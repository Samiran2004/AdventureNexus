import React from 'react';
import styled from 'styled-components'; // Library for styling components with CSS-in-JS

// Component displaying a 3D infinite slider of cards with modern glassmorphism
const CardSlider = () => {
  return (
    <StyledWrapper>
      <div
        className="slider"
        style={{
          '--width': '320px',
          '--height': '380px',
          '--quantity': 9,
        }}
      >
        <div className="list">
          <div className="item" style={{ '--position': 1 }}>
            <div className="card" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1431274172761-fca41d930114?w=500&h=500&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="overlay"></div>
              <div className="content">
                <h3>Paris, France</h3>
                <p>City of Love & Lights</p>
                <div className="badge">Popular</div>
              </div>
            </div>
          </div>

          <div className="item" style={{ '--position': 2 }}>
            <div className="card" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=500&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="overlay"></div>
              <div className="content">
                <h3>Tokyo, Japan</h3>
                <p>Modern Meets Traditional</p>
                <div className="badge">Trending</div>
              </div>
            </div>
          </div>

          <div className="item" style={{ '--position': 3 }}>
            <div className="card" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=500&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="overlay"></div>
              <div className="content">
                <h3>Bali, Indonesia</h3>
                <p>Tropical Paradise</p>
                <div className="badge">Hot</div>
              </div>
            </div>
          </div>

          <div className="item" style={{ '--position': 4 }}>
            <div className="card" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=500&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="overlay"></div>
              <div className="content">
                <h3>London, UK</h3>
                <p>Historic Royal Capital</p>
                <div className="badge">Classic</div>
              </div>
            </div>
          </div>

          <div className="item" style={{ '--position': 5 }}>
            <div className="card" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&h=500&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="overlay"></div>
              <div className="content">
                <h3>Santorini, Greece</h3>
                <p>Blue Domes & Sunsets</p>
                <div className="badge">Romantic</div>
              </div>
            </div>
          </div>

          <div className="item" style={{ '--position': 6 }}>
            <div className="card" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=500&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="overlay"></div>
              <div className="content">
                <h3>Dubai, UAE</h3>
                <p>Luxury & Innovation</p>
                <div className="badge">Luxury</div>
              </div>
            </div>
          </div>

          <div className="item" style={{ '--position': 7 }}>
            <div className="card" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="overlay"></div>
              <div className="content">
                <h3>Swiss Alps</h3>
                <p>Mountain Adventures</p>
                <div className="badge">Adventure</div>
              </div>
            </div>
          </div>

          <div className="item" style={{ '--position': 8 }}>
            <div className="card" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&h=500&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="overlay"></div>
              <div className="content">
                <h3>Maldives</h3>
                <p>Crystal Clear Waters</p>
                <div className="badge">Beach</div>
              </div>
            </div>
          </div>

          <div className="item" style={{ '--position': 9 }}>
            <div className="card" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500&h=500&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="overlay"></div>
              <div className="content">
                <h3>Morocco</h3>
                <p>Desert & Culture</p>
                <div className="badge">Exotic</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
      0 10px 30px -5px rgba(0, 0, 0, 0.3),
      0 20px 40px -10px rgba(0, 0, 0, 0.2),
      0 0 60px -15px rgba(14, 165, 233, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(14, 165, 233, 0.1) 0%,
      rgba(139, 92, 246, 0.1) 100%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 1;
  }

  .card:hover::before {
    opacity: 1;
  }

  .card:hover {
    transform: translateY(-12px) scale(1.03);
    box-shadow: 
      0 20px 40px -5px rgba(0, 0, 0, 0.4),
      0 30px 60px -15px rgba(0, 0, 0, 0.3),
      0 0 80px -10px rgba(14, 165, 233, 0.3);
    border-color: rgba(14, 165, 233, 0.3);
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.8) 100%
    );
    z-index: 2;
  }

  .content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px;
    z-index: 3;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateY(0);
    transition: all 0.4s ease;
  }

  .card:hover .content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(30px);
  }

  .content h3 {
    font-size: 24px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 0 8px 0;
    font-family: 'Outfit', sans-serif;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
    letter-spacing: -0.5px;
  }

  .content p {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 12px 0;
    font-family: 'Outfit', sans-serif;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  }

  .badge {
    display: inline-block;
    padding: 6px 14px;
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.9), rgba(139, 92, 246, 0.9));
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
    font-family: 'Outfit', sans-serif;
  }

  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 5% 95%, transparent);
    position: relative;
    margin: 40px 0;
  }

  .slider .list {
    display: flex;
    width: 100%;
    min-width: calc(var(--width) * var(--quantity));
    position: relative;
  }

  .slider .list .item {
    width: var(--width);
    height: var(--height);
    position: absolute;
    left: 100%;
    animation: autoRun 40s linear infinite;
    transition: filter 0.5s;
    animation-delay: calc(
      (40s / var(--quantity)) * (var(--position) - 1) - 40s
    ) !important;
  }

  @keyframes autoRun {
    from {
      left: 100%;
    }
    to {
      left: calc(var(--width) * -1);
    }
  }

  .slider:hover .item {
    animation-play-state: paused !important;
  }

  .slider .item:hover {
    filter: brightness(1.1) !important;
    z-index: 10;
  }

  @media (max-width: 768px) {
    .slider {
      --width: 280px;
      --height: 340px;
    }

    .content h3 {
      font-size: 20px;
    }

    .content p {
      font-size: 13px;
    }
  }
`;

export default CardSlider;
