import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PixelButton } from '../components/ui'

gsap.registerPlugin(ScrollTrigger)

/**
 * Home Page
 * 
 * 8-bit styled hero section with pixel avatar and animated text.
 */
export default function Home() {
  const heroRef = useRef(null)
  const nameRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonsRef = useRef(null)
  const avatarRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Avatar float animation
      gsap.to(avatarRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Name reveal
      gsap.fromTo(
        nameRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
      )

      // Subtitle reveal
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
      )

      // Buttons reveal
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="home-page">
      <style>{`
        .home-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .hero-section {
          min-height: calc(100vh - 60px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .hero-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          max-width: 1200px;
          width: 100%;
        }
        
        .hero-avatar {
          flex-shrink: 0;
        }
        
        .pixel-avatar {
          width: 200px;
          height: 200px;
          image-rendering: pixelated;
          filter: drop-shadow(0 0 30px rgba(0, 212, 255, 0.3));
        }
        
        /* Simple 8-bit avatar using CSS */
        .pixel-avatar-placeholder {
          width: 200px;
          height: 200px;
          background: linear-gradient(180deg, #00d4ff 0%, #0099cc 100%);
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 40px rgba(0, 212, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pixel-avatar-face {
          width: 160px;
          height: 160px;
          background: #00bfff;
          border-radius: 50%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .pixel-eyes {
          display: flex;
          gap: 40px;
          margin-bottom: 10px;
        }
        
        .pixel-eye {
          width: 24px;
          height: 24px;
          background: #ff6b35;
          border-radius: 4px;
        }
        
        .pixel-mouth {
          width: 60px;
          height: 20px;
          background: #ff6b35;
          border-radius: 0 0 30px 30px;
        }
        
        .hero-content {
          flex: 1;
          max-width: 600px;
        }
        
        .hero-name {
          margin-bottom: 0.5rem;
        }
        
        .hero-name .first-name {
          display: block;
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          color: white;
          font-family: 'Press Start 2P', cursive;
          letter-spacing: 2px;
        }
        
        .hero-name .last-name {
          display: block;
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          font-family: 'Press Start 2P', cursive;
          background: linear-gradient(135deg, #39ff14, #00d4ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 2px;
        }
        
        .hero-underline {
          width: 200px;
          height: 4px;
          background: #39ff14;
          margin: 1rem 0;
          box-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
        }
        
        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.5rem;
        }
        
        .hero-subtitle {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          color: #39ff14;
          margin-bottom: 2rem;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.5);
          font-size: 2rem;
          animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
        
        /* Responsive */
        @media (max-width: 900px) {
          .hero-container {
            flex-direction: column;
            text-align: center;
          }
          
          .hero-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .hero-buttons {
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .pixel-avatar-placeholder {
            width: 150px;
            height: 150px;
          }
          
          .pixel-avatar-face {
            width: 120px;
            height: 120px;
          }
          
          .pixel-eyes {
            gap: 30px;
          }
          
          .pixel-eye {
            width: 18px;
            height: 18px;
          }
          
          .pixel-mouth {
            width: 45px;
            height: 15px;
          }
        }
      `}</style>
      
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-container">
          {/* Pixel Avatar */}
          <div className="hero-avatar" ref={avatarRef}>
            <div className="pixel-avatar-placeholder">
              <div className="pixel-avatar-face">
                <div className="pixel-eyes">
                  <div className="pixel-eye"></div>
                  <div className="pixel-eye"></div>
                </div>
                <div className="pixel-mouth"></div>
              </div>
            </div>
          </div>
          
          {/* Hero Content */}
          <div className="hero-content">
            <h1 className="hero-name" ref={nameRef}>
              <span className="first-name">JEFF EDRICK</span>
              <span className="last-name">MARTINEZ</span>
            </h1>
            <div className="hero-underline"></div>
            <div ref={subtitleRef}>
              <p className="hero-title">AI-Powered Developer</p>
              <p className="hero-subtitle">Vibecoder • Creative Director</p>
            </div>
            <div className="hero-buttons" ref={buttonsRef}>
              <PixelButton variant="outline" color="electric" href="#work">
                VIEW WORK
              </PixelButton>
              <Link to="/contact">
                <PixelButton variant="filled" color="matrix">
                  CONTACT
                </PixelButton>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span>▼</span>
        </div>
      </section>
    </section>
  )
}