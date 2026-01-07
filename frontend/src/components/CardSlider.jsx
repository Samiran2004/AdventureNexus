import React from 'react';
import styled from 'styled-components'; // Library for styling components with CSS-in-JS

// Component displaying a 3D infinite slider of cards
const CardSlider = () => {
  return (
    <StyledWrapper>
      <div
        className="slider"
        style={{
          '--width': '300px',
          '--height': '300px',
          '--quantity': 9,
          // 'marginBottom': 20
        }}
      >
        <div className="list">
          <div className="item" style={{ '--position': 1 }}>
            <div className="card" style={{
              backgroundImage: 'linear-gradient(rgba(255, 126, 95, 0.7), rgba(254, 180, 123, 0.7)), url(https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <p>Paris, France</p>
              <p>City of Love & Lights</p>
            </div>
          </div>

          <div className="item" style={{ '--position': 2 }}>
            <div className="card" style={{
              backgroundImage: 'linear-gradient(rgba(106, 17, 203, 0.7), rgba(37, 117, 252, 0.7)), url(https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <p>Tokyo, Japan</p>
              <p>Modern Meets Traditional</p>
            </div>
          </div>

          <div className="item" style={{ '--position': 3 }}>
            <div className="card" style={{
              backgroundImage: 'linear-gradient(rgba(102, 126, 234, 0.7), rgba(118, 75, 162, 0.7)), url(https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <p>Bali, Indonesia</p>
              <p>Tropical Paradise</p>
            </div>
          </div>

          <div className="item" style={{ '--position': 4 }}>
            <div className="card" style={{
              backgroundImage: 'linear-gradient(rgba(255, 81, 47, 0.7), rgba(221, 36, 118, 0.7)), url(https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <p>London, UK</p>
              <p>Historic Royal Capital</p>
            </div>
          </div>

          <div className="item" style={{ '--position': 5 }}>
            <div className="card" style={{
              backgroundImage: 'linear-gradient(rgba(255, 182, 193, 0.7), rgba(255, 105, 180, 0.7)), url(https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <p>Santorini, Greece</p>
              <p>Blue Domes & Sunsets</p>
            </div>
          </div>

          <div className="item" style={{ '--position': 6 }}>
            <div className="card" style={{
              backgroundImage: 'linear-gradient(rgba(255, 154, 139, 0.7), rgba(255, 195, 160, 0.7)), url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <p>Dubai, UAE</p>
              <p>Luxury & Innovation</p>
            </div>
          </div>

          <div className="item" style={{ '--position': 7 }}>
            <div className="card" style={{
              backgroundImage: 'linear-gradient(rgba(161, 196, 253, 0.7), rgba(194, 233, 251, 0.7)), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <p>Swiss Alps</p>
              <p>Mountain Adventures</p>
            </div>
          </div>

          <div className="item" style={{ '--position': 8 }}>
            <div className="card" style={{
              backgroundImage: 'linear-gradient(rgba(251, 194, 235, 0.7), rgba(161, 140, 209, 0.7)), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <p>Maldives</p>
              <p>Crystal Clear Waters</p>
            </div>
          </div>

          <div className="item" style={{ '--position': 9 }}>
            <div className="card" style={{
              backgroundImage: 'linear-gradient(rgba(132, 250, 176, 0.7), rgba(143, 211, 244, 0.7)), url(https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <p>Morocco</p>
              <p>Desert & Culture</p>
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
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    color: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-bottom: 40px;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  }

  .card p {
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    margin: 8px 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
    z-index: 2;
    position: relative;
    font-family: "Story Script", sans-serif;
    font-weight: 200;
    font-style: normal;
  }

  .card p:first-child {
    font-size: 20px;
    font-weight: 700;
  }

  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
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
    animation: autoRun 32s linear infinite;
    transition: filter 0.5s;
    animation-delay: calc(
      (32s / var(--quantity)) * (var(--position) - 1) - 32s
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
    filter: grayscale(0.3);
  }

  .slider .item:hover {
    filter: grayscale(0) !important;
    transform: scale(1.05);
  }

  .slider[reverse="true"] .item {
    animation: reversePlay 12s linear infinite;
  }

  @keyframes reversePlay {
    from {
      left: calc(var(--width) * -1);
    }
    to {
      left: 100%;
    }
  }
`;

export default CardSlider;
