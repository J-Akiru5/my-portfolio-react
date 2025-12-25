import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * StorySection - Cinematic Terminal Experience
 * 
 * Pinned scroll with clip-path circle reveal transitions.
 * 4 chapters telling Jeff's developer journey.
 */
export default function StorySection() {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const [activeChapter, setActiveChapter] = useState(0)

  const chapters = [
    {
      id: 'origin',
      title: 'THE ORIGIN',
      subtitle: '// WHERE IT ALL BEGAN',
      text: "It all started with curiosity. That thought came to my mind—'What if I can understand programming language, coding. That would be cool.' And yes, the first programming language I learned was C#, and we developed a Snake game on the console.",
      icon: '🎮',
      bgClass: 'chapter-origin',
    },
    {
      id: 'awakening',
      title: 'THE AI AWAKENING',
      subtitle: '// THE GAME CHANGER',
      text: "Then came the shift. I discovered GitHub Copilot and VS Code. It wasn't about replacing code; it was about amplifying creativity. AI Agents handle the heavy lifting while I focus on architecture.",
      icon: '⚡',
      bgClass: 'chapter-awakening',
    },
    {
      id: 'creative',
      title: 'THE CREATIVE HYBRID',
      subtitle: '// MORE THAN CODE',
      text: "I'm not just a coder. I'm a filmmaker and UI designer. My hobbies—Music, Animation, Cinematography—bleed into my code. I don't just build apps; I direct user experiences.",
      icon: '🎬',
      bgClass: 'chapter-creative',
    },
    {
      id: 'leader',
      title: 'THE LEADER',
      subtitle: '// PRESENT DAY',
      text: "Today, I lead as the President of the SineAI Guild of Western Visayas. We successfully deployed the SineAI Hub. I blend leadership with full-stack capability to drive innovation.",
      icon: '👑',
      bgClass: 'chapter-leader',
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.chapter-panel')
      
      // Main timeline for the pinned scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress
            const newChapter = Math.min(Math.floor(progress * 4), 3)
            setActiveChapter(newChapter)
          }
        }
      })

      // Animate each panel with clip-path
      panels.forEach((panel, i) => {
        if (i === 0) {
          // First panel starts visible, then fades out
          tl.to(panel, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 1,
            ease: 'power2.inOut',
          }, i * 1)
        } else {
          // Other panels reveal with clip-path
          tl.fromTo(panel, 
            { clipPath: 'circle(0% at 50% 50%)' },
            { 
              clipPath: 'circle(150% at 50% 50%)',
              duration: 1,
              ease: 'power2.inOut',
            }, 
            (i - 1) * 1 + 0.5
          )
          
          // Then hide it for next panel (except last)
          if (i < panels.length - 1) {
            tl.to(panel, {
              clipPath: 'circle(0% at 50% 50%)',
              duration: 1,
              ease: 'power2.inOut',
            }, i * 1)
          }
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="story" ref={sectionRef} className="story-section">
      <style>{`
        .story-section {
          position: relative;
          overflow: hidden;
        }
        
        .story-container {
          position: relative;
          width: 100%;
          height: 100vh;
        }
        
        .chapter-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: circle(150% at 50% 50%);
        }
        
        .chapter-panel:not(:first-child) {
          clip-path: circle(0% at 50% 50%);
        }
        
        /* Chapter Backgrounds */
        .chapter-origin {
          background: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57, 255, 20, 0.03) 2px, rgba(57, 255, 20, 0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(57, 255, 20, 0.03) 2px, rgba(57, 255, 20, 0.03) 4px),
            linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%);
        }
        
        .chapter-origin::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
          );
          pointer-events: none;
          animation: scanline 8s linear infinite;
        }
        
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        
        .chapter-awakening {
          background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%);
          overflow: hidden;
        }
        
        .chapter-awakening::before {
          content: '01001010 01100101 01100110 01100110 00100000 01000100 01100101 01110110';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(0, 212, 255, 0.1);
          word-wrap: break-word;
          line-height: 1.5;
          padding: 2rem;
          animation: matrixFade 3s infinite;
          pointer-events: none;
        }
        
        @keyframes matrixFade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .chapter-creative {
          background: 
            linear-gradient(135deg, #1a0a1a 0%, #2a1a3a 100%);
        }
        
        .chapter-creative::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.05;
          pointer-events: none;
        }
        
        .chapter-leader {
          background: 
            radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0a1a1a 0%, #0a2a3a 100%);
        }
        
        .chapter-leader::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          background: url('/assets/logo.png') center/contain no-repeat;
          opacity: 0.1;
          filter: blur(2px);
          pointer-events: none;
        }
        
        .chapter-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 2rem;
          text-align: center;
        }
        
        .chapter-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }
        
        .chapter-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(0, 212, 255, 0.7);
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
        }
        
        .chapter-title {
          font-family: 'Press Start 2P', cursive;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #00d4ff, #39ff14);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .chapter-text {
          font-size: 1.15rem;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.85);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .chapter-text em {
          color: #39ff14;
          font-style: normal;
        }
        
        /* Progress Dots */
        .progress-dots {
          position: fixed;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 100;
        }
        
        .progress-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: transparent;
          transition: all 0.3s;
          cursor: pointer;
        }
        
        .progress-dot.active {
          background: #00d4ff;
          border-color: #00d4ff;
          box-shadow: 0 0 15px #00d4ff;
        }
        
        .progress-dot-label {
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          padding-right: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .progress-dot:hover .progress-dot-label,
        .progress-dot.active .progress-dot-label {
          opacity: 1;
        }
        
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        
        @media (max-width: 768px) {
          .progress-dots { right: 1rem; }
          .progress-dot { width: 8px; height: 8px; }
          .progress-dot-label { display: none; }
          .chapter-content { padding: 1.5rem; }
        }
      `}</style>
      
      {/* Progress Dots */}
      <div className="progress-dots">
        {chapters.map((chapter, index) => (
          <div 
            key={chapter.id}
            className={`progress-dot ${activeChapter === index ? 'active' : ''}`}
          >
            <span className="progress-dot-label">{chapter.title}</span>
          </div>
        ))}
      </div>
      
      {/* Chapters Container */}
      <div ref={containerRef} className="story-container">
        {chapters.map((chapter, index) => (
          <div 
            key={chapter.id}
            className={`chapter-panel ${chapter.bgClass}`}
            style={{ zIndex: index }}
          >
            <div className="chapter-content">
              <span className="chapter-icon">{chapter.icon}</span>
              <p className="chapter-subtitle">{chapter.subtitle}</p>
              <h2 className="chapter-title">{chapter.title}</h2>
              <p className="chapter-text">{chapter.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="scroll-indicator">↓ SCROLL TO EXPLORE ↓</div>
    </section>
  )
}
