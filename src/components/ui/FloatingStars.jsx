import React, { useEffect, useRef } from 'react';

/**
 * FloatingStars Component
 * 
 * Creates an animated starfield background with CSS-based twinkling stars.
 */
const FloatingStars = ({ count = 100 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing stars
    container.innerHTML = '';

    // Generate stars
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'floating-star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random size (1-3px)
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random animation delay
      star.style.animationDelay = `${Math.random() * 3}s`;
      
      // Random opacity
      star.style.opacity = Math.random() * 0.5 + 0.3;
      
      container.appendChild(star);
    }
  }, [count]);

  return (
    <>
      <style>{`
        .floating-stars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        
        .floating-star {
          position: absolute;
          background: #00d4ff;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        /* Add some special stars */
        .floating-star:nth-child(5n) {
          background: #39ff14;
        }
        
        .floating-star:nth-child(7n) {
          background: #9d4edd;
        }
        
        .floating-star:nth-child(11n) {
          background: #ff6b35;
          animation-duration: 4s;
        }
      `}</style>
      <div ref={containerRef} className="floating-stars-container" aria-hidden="true" />
    </>
  );
};

export default FloatingStars;
