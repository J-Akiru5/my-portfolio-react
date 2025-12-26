import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PixelButton } from '../ui'

gsap.registerPlugin(ScrollTrigger)

// Taglines for typing animation
const TAGLINES = ['AI-Powered Developer', 'Vibecoder', 'Creative Director']

/**
 * HeroSection - Pinned hero with profile picture
 * 
 * Uses ScrollTrigger pinning to keep the hero fixed while
 * content fades out on scroll.
 */
export default function HeroSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const avatarRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section and fade out content
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=50%',
          pin: true,
          scrub: 1,
        }
      })
      .to(contentRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.95,
      })

      // Avatar floating animation
      gsap.to(avatarRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Text reveal animation on load
      gsap.from('.hero-title span', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
      })

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.8,
      })

      gsap.from('.hero-buttons', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 1.2,
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Typing animation for tagline
  const [taglineIndex, setTaglineIndex] = React.useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(prev => (prev + 1) % TAGLINES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="hero-section">
      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: visible;
        }
        
        .hero-content {
          display: flex;
          align-items: center;
          gap: 4rem;
          max-width: 1200px;
          width: 100%;
        }
        
        .hero-avatar-wrapper {
          flex-shrink: 0;
        }
        
        .hero-avatar {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #00d4ff;
          box-shadow: 
            0 0 0 4px #0a0a12,
            0 0 0 8px #39ff14,
            0 0 40px rgba(0, 212, 255, 0.3),
            0 0 80px rgba(57, 255, 20, 0.2);
          image-rendering: pixelated;
          position: relative;
        }
        
        .hero-avatar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1) 2px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
          z-index: 1;
        }
        
        .hero-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .hero-text {
          flex: 1;
        }
        
        .hero-title {
          font-family: 'Press Start 2P', cursive;
          font-size: clamp(1.8rem, 5vw, 3rem);
          line-height: 1.4;
          margin-bottom: 1rem;
        }
        
        .hero-title .name-white {
          color: white;
          display: block;
        }
        
        .hero-title .name-green {
          color: #39ff14;
          display: block;
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
          transition: all 0.3s ease;
          cursor: default;
        }
        
        .hero-title:hover .name-green {
          animation: glitch 0.3s ease;
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        .hero-line {
          width: 120px;
          height: 3px;
          background: linear-gradient(90deg, #00d4ff, #39ff14);
          margin: 1.5rem 0;
        }
        
        .hero-tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.5rem;
        }
        
        .hero-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem;
          color: #39ff14;
          margin-bottom: 2rem;
          min-height: 1.5em;
        }
        
        .typing-text {
          display: inline-block;
          animation: fadeInUp 0.5s ease;
        }
        
        .typing-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: #39ff14;
          margin-left: 4px;
          animation: blink 1s step-end infinite;
          vertical-align: text-bottom;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        @media (max-width: 900px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }
          
          .hero-avatar {
            width: 200px;
            height: 200px;
          }
          
          .hero-line {
            margin: 1.5rem auto;
          }
          
          .hero-buttons {
            justify-content: center;
          }
        }
        
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          animation: bounce 2s ease-in-out infinite;
          z-index: 10;
        }
        
        .scroll-indicator-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 2px;
        }
        
        .scroll-indicator-arrow {
          font-size: 1.5rem;
          color: #00d4ff;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
      `}</style>
      
      <div ref={contentRef} className="hero-content">
        <div className="hero-avatar-wrapper">
          <div ref={avatarRef} className="hero-avatar">
            <img src="/assets/profilepic.jpg" alt="Jeff Edrick Martinez" />
          </div>
        </div>
        
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="name-white">JEFF EDRICK</span>
            <span className="name-green">MARTINEZ</span>
          </h1>
          
          <div className="hero-line" />
          
          <p className="hero-tagline">AI-Powered Developer</p>
          <p className="hero-subtitle">
            <span className="typing-text" key={taglineIndex}>{TAGLINES[taglineIndex]}</span>
            <span className="typing-cursor" />
          </p>
          
          <div className="hero-buttons">
            <PixelButton variant="outline" color="electric" onClick={() => scrollToSection('projects')}>
              VIEW WORK
            </PixelButton>
            <PixelButton variant="filled" color="matrix" onClick={() => scrollToSection('contact')}>
              CONTACT
            </PixelButton>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator" onClick={() => scrollToSection('about')}>
        <span className="scroll-indicator-text">SCROLL</span>
        <span className="scroll-indicator-arrow">▼</span>
      </div>
    </section>
  )
}
