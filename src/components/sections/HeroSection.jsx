import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PixelButton } from '../ui'

gsap.registerPlugin(ScrollTrigger)

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
          overflow: hidden;
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
          background: linear-gradient(135deg, #39ff14, #00d4ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
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
          <p className="hero-subtitle">Vibecoder • Creative Director</p>
          
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
    </section>
  )
}
