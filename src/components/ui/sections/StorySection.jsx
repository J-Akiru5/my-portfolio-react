import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * StorySection - "The Director's Cut"
 * 
 * Hybrid ScrollTrigger with two distinct phases:
 * - Phase 1 (Glitch): Circle clip reveal from Origin → Awakening
 * - Phase 2 (Filmstrip): Horizontal scroll from Creative → Leader
 */
export default function StorySection() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state for filmstrip (hidden below viewport)
      gsap.set('#filmstrip-container', { yPercent: 100 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=500%',
          anticipatePin: 1,
        }
      })

      // STEP 1: Circle clip reveal - Origin → Awakening
      tl.fromTo('#panel-awakening',
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', duration: 1.5, ease: 'power2.inOut' }
      )

      // STEP 2: Pause to read awakening content
      tl.to({}, { duration: 0.5 })

      // STEP 3: Filmstrip slides up and COVERS everything (no fade needed)
      tl.to('#filmstrip-container', {
        yPercent: 0,
        duration: 1,
        ease: 'power2.out'
      })

      // STEP 4: Pause to read creative content
      tl.to({}, { duration: 0.3 })

      // STEP 5: Horizontal scroll through filmstrip
      tl.to('#filmstrip-inner', {
        xPercent: -50,
        duration: 2.5,
        ease: 'none',
      })

      // Parallax backgrounds move slightly opposite
      tl.to('.film-bg-parallax', {
        xPercent: 15,
        duration: 2.5,
        ease: 'none',
      }, '<')

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="story" ref={containerRef} className="story-section">
      <style>{`
        .story-section {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        /* PANEL 1: ORIGIN */
        .panel-origin {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
          background: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57, 255, 20, 0.03) 2px, rgba(57, 255, 20, 0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(57, 255, 20, 0.03) 2px, rgba(57, 255, 20, 0.03) 4px),
            linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%);
        }

        .panel-origin::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px);
          pointer-events: none;
          animation: scanline 8s linear infinite;
        }

        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }

        /* PANEL 2: AWAKENING (Clip Reveal) */
        .panel-awakening {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%);
          clip-path: circle(0% at 50% 50%);
        }

        .panel-awakening::before {
          content: '01001010 01100101 01100110 01100110';
          position: absolute;
          inset: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem;
          color: rgba(0, 212, 255, 0.08);
          word-wrap: break-word;
          line-height: 2;
          padding: 2rem;
          animation: matrixFade 3s infinite;
          pointer-events: none;
        }

        @keyframes matrixFade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        /* FILMSTRIP CONTAINER */
        .filmstrip-container {
          position: absolute;
          inset: 0;
          z-index: 20;
          background: #000;
        }

        .filmstrip-inner {
          display: flex;
          height: 100%;
          width: 200%;
        }

        .film-panel {
          width: 50%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .film-panel-creative {
          background: linear-gradient(135deg, #1a0a1a 0%, #2a1a3a 100%);
          border-right: 8px solid #000;
        }

        .film-panel-leader {
          background: linear-gradient(135deg, #0a1a1a 0%, #0a2a3a 100%);
        }

        .film-bg-parallax {
          position: absolute;
          inset: -20%;
          background-size: cover;
          background-position: center;
          opacity: 0.25;
          filter: blur(3px);
          pointer-events: none;
        }

        /* Panel Content */
        .panel-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          padding: 2rem;
          text-align: center;
        }

        .panel-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }

        .panel-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(0, 212, 255, 0.7);
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
        }

        .panel-title {
          font-family: 'Press Start 2P', cursive;
          font-size: clamp(1.2rem, 3vw, 2rem);
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #00d4ff, #39ff14);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .panel-text {
          font-size: 1.1rem;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.85);
        }

        /* Film Content Cards */
        .film-content {
          position: relative;
          z-index: 10;
          max-width: 600px;
          padding: 2.5rem;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .film-scene {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #ff6b9d;
          letter-spacing: 0.15em;
          margin-bottom: 0.75rem;
        }

        .film-title {
          font-family: 'Press Start 2P', cursive;
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          color: white;
          margin-bottom: 1.25rem;
        }

        .film-text {
          font-size: 1rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.8);
        }

        .highlight-creative {
          color: #ff6b9d;
          font-weight: 600;
        }

        .highlight-leader {
          color: #00d4ff;
          font-weight: 600;
        }

        /* Filmstrip Sprocket Holes */
        .sprocket-holes {
          position: absolute;
          left: 0;
          right: 0;
          height: 24px;
          z-index: 30;
          pointer-events: none;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 30px,
            rgba(30, 30, 30, 0.9) 30px,
            rgba(30, 30, 30, 0.9) 50px
          );
        }

        .sprocket-top { top: 0; }
        .sprocket-bottom { bottom: 0; }

        .sprocket-holes::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 12px;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 35px,
            rgba(60, 60, 60, 0.8) 35px,
            rgba(60, 60, 60, 0.8) 45px
          );
        }

        @media (max-width: 768px) {
          .panel-content {
            padding: 1.5rem;
            max-width: 95%;
          }
          
          .panel-icon { 
            font-size: 2.5rem;
            margin-bottom: 0.75rem;
          }
          
          .panel-title {
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          
          .panel-subtitle {
            font-size: 0.65rem;
          }
          
          .panel-text {
            font-size: 0.9rem;
            line-height: 1.7;
          }
          
          .film-content {
            padding: 1.5rem;
            max-width: 90%;
            margin: 0 auto;
          }
          
          .film-title {
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }
          
          .film-scene {
            font-size: 0.6rem;
          }
          
          .film-text {
            font-size: 0.85rem;
            line-height: 1.7;
          }
          
          .sprocket-holes {
            height: 16px;
          }
          
          .sprocket-holes::before {
            height: 8px;
          }
        }
        
        @media (max-width: 480px) {
          .panel-content {
            padding: 1rem;
          }
          
          .panel-icon {
            font-size: 2rem;
          }
          
          .panel-title {
            font-size: 0.85rem;
          }
          
          .panel-text {
            font-size: 0.8rem;
          }
          
          .film-content {
            padding: 1rem;
          }
          
          .film-title {
            font-size: 0.8rem;
          }
          
          .film-text {
            font-size: 0.75rem;
          }
        }
      `}</style>

      {/* PANEL 1: JEFFDEV ORIGIN */}
      <div className="panel-origin">
        <div className="panel-content">
          <span className="panel-icon">🚀</span>
          <p className="panel-subtitle">// EST. ILOILO CITY</p>
          <h2 className="panel-title">DIGITAL CRAFTSMANSHIP</h2>
          <p className="panel-text">
            JeffDev Studio is a cloud-native development shop based in Iloilo. We specialize in building high-performance B2B platforms using the same tech stack as Silicon Valley unicorns. We don't just write code; we architect digital assets that compound in value.
          </p>
        </div>
      </div>

      {/* PANEL 2: VIBECODER ENGINE (Clip Reveal) */}
      <div id="panel-awakening" className="panel-awakening">
        <div className="panel-content">
          <span className="panel-icon">⚡</span>
          <p className="panel-subtitle">// PROPRIETARY IP</p>
          <h2 className="panel-title">THE VIBECODER ENGINE</h2>
          <p className="panel-text">
            Speed is our currency. Our proprietary <strong>Vibecoder Engine</strong> allows us to deploy production-ready UI 3x faster than traditional agencies. By leveraging AI-augmented workflows, we deliver enterprise-grade software at startup speed.
          </p>
        </div>
      </div>

      {/* FILMSTRIP CONTAINER */}
      <div id="filmstrip-container" className="filmstrip-container">
        
        {/* Sprocket Holes */}
        <div className="sprocket-holes sprocket-top" />
        <div className="sprocket-holes sprocket-bottom" />

        <div id="filmstrip-inner" className="filmstrip-inner">
          
          {/* SCENE 3: ENTERPRISE SERVICES */}
          <div className="film-panel film-panel-creative">
            <div 
              className="film-bg-parallax" 
              style={{ 
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(57, 255, 20, 0.1))',
              }}
            />
            <div className="film-content">
              <p className="film-scene">SCENE 03: SERVICES</p>
              <h2 className="film-title">Technical Partnership</h2>
              <p className="film-text">
                We partner with ambitious founders to build <span className="highlight-leader">custom SaaS platforms</span>, <span className="highlight-leader">internal tooling</span>, and <span className="highlight-leader">AI integrations</span>. Our code is clean, documented, and built to scale on AWS.
              </p>
            </div>
          </div>

          {/* SCENE 4: COMMUNITY LEADERSHIP */}
          <div className="film-panel film-panel-leader">
            <div 
              className="film-bg-parallax" 
              style={{ 
                backgroundImage: 'url(/assets/Screenshot 2025-12-16 094218.png)',
              }}
            />
            <div className="film-content">
              <p className="film-scene">SCENE 04: LEADERSHIP</p>
              <h2 className="film-title">SineAI Guild</h2>
              <p className="film-text">
                Beyond client work, we lead the <span className="highlight-creative">SineAI Guild of Western Visayas</span> using the <span className="highlight-creative">SineAI Hub</span> platform. We stay at the bleeding edge of AI to give our clients an unfair advantage.
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
