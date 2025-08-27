import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      {/* SchoolSync Animated Loader */}
      <div className="loader">
        <svg height={0} width={0} viewBox="0 0 64 64" className="absolute">
          <defs className="s-xJBuHA073rTt" xmlns="http://www.w3.org/2000/svg">
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="b">
              <stop className="s-xJBuHA073rTt" stopColor="#973BED" />
              <stop className="s-xJBuHA073rTt" stopColor="#007CFF" offset={1} />
            </linearGradient>
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={0} x2={0} y1={64} x1={0} id="c">
              <stop className="s-xJBuHA073rTt" stopColor="#FFC800" />
              <stop className="s-xJBuHA073rTt" stopColor="#F0F" offset={1} />
              <animateTransform repeatCount="indefinite" keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1" keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1" dur="8s" values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32" type="rotate" attributeName="gradientTransform" />
            </linearGradient>
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="d">
              <stop className="s-xJBuHA073rTt" stopColor="#00E0ED" />
              <stop className="s-xJBuHA073rTt" stopColor="#00DA72" offset={1} />
            </linearGradient>
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="e">
              <stop className="s-xJBuHA073rTt" stopColor="#FF6B35" />
              <stop className="s-xJBuHA073rTt" stopColor="#F7931E" offset={1} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* S */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#b)" d="M 50,15 C 50,8 44,4 32,4 20,4 14,8 14,15 c 0,6 4,9 12,11 l 16,4 c 8,2 12,6 12,14 0,10 -8,16 -22,16 -14,0 -22,-6 -22,-16" className="dash" pathLength={360} />
        </svg>
        
        {/* c */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#c)" d="M 50,20 C 46,16 40,14 32,14 20,14 12,22 12,32 c 0,10 8,18 20,18 8,0 14,-2 18,-6" className="dash" pathLength={360} />
        </svg>
        
        {/* h */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#d)" d="M 12,4 V 60 M 12,28 C 16,20 24,18 32,18 44,18 52,24 52,32 V 60" className="dash" pathLength={360} />
        </svg>
        
        {/* o */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#e)" d="M 32 32 m 0 -18 a 18 18 0 1 1 0 36 a 18 18 0 1 1 0 -36" className="spin" pathLength={360} />
        </svg>
        
        {/* o */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#b)" d="M 32 32 m 0 -18 a 18 18 0 1 1 0 36 a 18 18 0 1 1 0 -36" className="spin" pathLength={360} />
        </svg>
        
        {/* l */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#c)" d="M 32,4 V 60" className="dash" pathLength={360} />
        </svg>
        
        <div className="w-2" />
        
        {/* S */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#d)" d="M 50,15 C 50,8 44,4 32,4 20,4 14,8 14,15 c 0,6 4,9 12,11 l 16,4 c 8,2 12,6 12,14 0,10 -8,16 -22,16 -14,0 -22,-6 -22,-16" className="dash" pathLength={360} />
        </svg>
        
        {/* y */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#e)" d="M 12,18 L 32,40 L 52,18 M 32,40 L 32,60" className="dash" pathLength={360} />
        </svg>
        
        {/* n */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#b)" d="M 12,18 V 60 M 12,28 C 16,20 24,18 32,18 44,18 52,24 52,32 V 60" className="dash" pathLength={360} />
        </svg>
        
        {/* c */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={8} stroke="url(#c)" d="M 50,24 C 46,20 40,18 32,18 20,18 12,26 12,36 c 0,10 8,18 20,18 8,0 14,-2 18,-6" className="dash" pathLength={360} />
        </svg>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .absolute {
    position: absolute;
  }

  .inline-block {
    display: inline-block;
  }

  .loader {
    display: flex;
    margin: 0.25em 0;
  }

  .w-2 {
    width: 0.5em;
  }

  .dash {
    animation: dashArray 2s ease-in-out infinite,
      dashOffset 2s linear infinite;
  }

  .spin {
    animation: spinDashArray 2s ease-in-out infinite,
      spin 8s ease-in-out infinite,
      dashOffset 2s linear infinite;
    transform-origin: center;
  }

  @keyframes dashArray {
    0% {
      stroke-dasharray: 0 1 359 0;
    }

    50% {
      stroke-dasharray: 0 359 1 0;
    }

    100% {
      stroke-dasharray: 359 1 0 0;
    }
  }

  @keyframes spinDashArray {
    0% {
      stroke-dasharray: 270 90;
    }

    50% {
      stroke-dasharray: 0 360;
    }

    100% {
      stroke-dasharray: 270 90;
    }
  }

  @keyframes dashOffset {
    0% {
      stroke-dashoffset: 365;
    }

    100% {
      stroke-dashoffset: 5;
    }
  }

  @keyframes spin {
    0% {
      rotate: 0deg;
    }

    12.5%,
    25% {
      rotate: 270deg;
    }

    37.5%,
    50% {
      rotate: 540deg;
    }

    62.5%,
    75% {
      rotate: 810deg;
    }

    87.5%,
    100% {
      rotate: 1080deg;
    }
  }
`;

export default Loader;
