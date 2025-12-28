import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSwipeable } from 'react-swipeable'
import { SectionTitle, ProjectModal } from '..'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProjectsSection - Game Console Style Carousel
 * 
 * 3D carousel with cinematic slide animation (Nintendo Switch style).
 * Features:
 * - Robust pinned reveal (no StorySection conflicts)
 * - Physical slide movement (no instant swapping)
 * - Animation locking to prevent spam
 */
export default function ProjectsSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const activeCardRef = useRef(null)
  const controlsRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const projects = [
    {
      id: 'sineai-hub',
      title: 'SineAI Hub',
      description: 'AI-powered learning management system with real-time chat, collaboration features, and intelligent tutoring.',
      image: '/assets/Screenshot 2025-12-16 094218.png',
      tags: ['Laravel', 'Supabase', 'Gemini', 'Tailwind'],
      liveUrl: 'https://sineai.tech',
      codeUrl: 'https://github.com/J-Akiru5/sineai-hub',
      color: '#00d4ff',
    },
    {
      id: 'portfolio',
      title: 'This Portfolio',
      description: '8-bit Universe themed portfolio with GSAP animations, glassmorphism, and Firebase integration.',
      image: '/assets/Screenshot 2025-12-25 113451.png',
      tags: ['React', 'GSAP', 'Firebase', 'Lenis'],
      liveUrl: '#',
      codeUrl: 'https://github.com/J-Akiru5/my-portfolio-react',
      color: '#39ff14',
    },
    {
      id: 'cict-portal',
      title: 'CICT Tech Portal',
      description: 'Technology portal for the College of ICT with student resources and department management.',
      image: '/assets/Screenshot 2025-12-25 122142.png',
      tags: ['Laravel', 'TypeScript', 'Tailwind'],
      liveUrl: '#',
      codeUrl: 'https://github.com/J-Akiru5/cict-tech-portal',
      color: '#9d4edd',
    },
    {
      id: 'gsus',
      title: 'GSUS',
      description: 'General Services Unified System - comprehensive service management platform.',
      image: '/assets/image copy 2.png',
      tags: ['React', 'Vite', 'Vercel'],
      liveUrl: '#',
      codeUrl: 'https://github.com/J-Akiru5/GSUS-Hackathon-Project',
      color: '#ff6b35',
    },
    {
      id: 'ebhm-connect',
      title: 'E-BHM Connect',
      description: 'Electronic Barangay Health Management System for community healthcare.',
      image: '/assets/Screenshot 2025-12-18 222001.png',
      tags: ['PHP', 'MySQL', 'Bootstrap'],
      liveUrl: '#',
      codeUrl: 'https://github.com/J-Akiru5/e-bhm_connect',
      color: '#00d4ff',
    },
    {
      id: 'lingsarloka',
      title: 'LingsarLoka',
      description: 'High-fidelity Figma prototype with modern UI/UX design principles.',
      image: '/assets/image.png',
      tags: ['Figma', 'UI/UX'],
      liveUrl: 'https://thick-break-42913670.figma.site/',
      codeUrl: 'https://github.com/J-Akiru5/LingsarLoka',
      color: '#39ff14',
    },
  ]

  // Cinematic Slide Animation: NEXT
  const animateToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex((prev) => (prev + 1) % projects.length)
        setIsAnimating(false)
      }
    })

    // 1. Prev exiting left
    tl.to('.project-card-wrapper.prev', {
      x: '-100vw',
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 0)
    // 2. Active becoming Prev
    .to('.project-card-wrapper.active', {
      x: '-35%', // Approx position of prev card
      scale: 0.9,
      filter: 'brightness(0.4) saturate(0.5)',
      opacity: 0.4,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 0)
    // 3. Next becoming Active (Center)
    .to('.project-card-wrapper.next', {
      x: '0%', // Center
      scale: 1,
      filter: 'brightness(1.1) saturate(1)',
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 0)
  }

  // Cinematic Slide Animation: PREV
  const animateToPrev = () => {
    if (isAnimating) return
    setIsAnimating(true)

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
        setIsAnimating(false)
      }
    })

    // 1. Next exiting right
    tl.to('.project-card-wrapper.next', {
      x: '100vw',
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 0)
    // 2. Active becoming Next
    .to('.project-card-wrapper.active', {
      x: '35%', // Approx position of next card
      scale: 0.9,
      filter: 'brightness(0.4) saturate(0.5)',
      opacity: 0.4,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 0)
    // 3. Prev becoming Active (Center)
    .to('.project-card-wrapper.prev', {
      x: '0%', // Center
      scale: 1,
      filter: 'brightness(1.1) saturate(1)',
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 0)
  }

  // Handlers
  const nextProject = () => animateToNext()
  const prevProject = () => animateToPrev()

  // Mobile Swipe Handlers
  const handlers = useSwipeable({
    onSwipedLeft: nextProject,
    onSwipedRight: prevProject,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedProject || isAnimating) return
      if (e.key === 'ArrowRight') nextProject()
      if (e.key === 'ArrowLeft') prevProject()
      if (e.key === 'Enter') setSelectedProject(projects[activeIndex])
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, selectedProject, isAnimating])

  // Reset transforms after state update
  useEffect(() => {
    // Immediate reset because React re-renders with new content
    gsap.set('.project-card-wrapper', { 
      clearProps: 'x,scale,filter,opacity' 
    })
  }, [activeIndex])

  // GSAP Pinned Reveal Sequence
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Hidden States (Set by GSAP)
      gsap.set([titleRef.current, activeCardRef.current, controlsRef.current], { 
        opacity: 0,
        y: 20
      })
      gsap.set('.project-card-wrapper.prev', { 
        opacity: 0, 
        x: -400 // Off-screen left (GSAP relative)
      })
      gsap.set('.project-card-wrapper.next', { 
        opacity: 0, 
        x: 400 // Off-screen right (GSAP relative)
      })

      // 2. Main Timeline with Pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2500', // Pinned duration with breathing room
          pin: true,
          scrub: 1, // Smooth scrub
          refreshPriority: -1, 
          anticipatePin: 1
        }
      })

      // 3. Animation Sequence
      tl.to(titleRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.5 
      })
      .to(activeCardRef.current, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8,
        ease: 'back.out(1.2)'
      }, '-=0.3')
      .to(['.project-card-wrapper.prev', '.project-card-wrapper.next'], { 
        opacity: 0.4, // Match CSS final opacity
        x: 0, // Animate to natural CSS position
        duration: 0.8, 
        stagger: 0.1,
        ease: 'power2.out'
      }, '<') // Start slightly overlap with active card
      .to(controlsRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.5 
      }, '-=0.4')
      // 4. Breathing Room (Hold Phase)
      .to({}, { duration: 1 }) 

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Get index for 3 visible cards
  const getVisibleProjects = () => {
    const prev = (activeIndex - 1 + projects.length) % projects.length
    const next = (activeIndex + 1) % projects.length
    return { prev, current: activeIndex, next }
  }

  const { prev, current, next } = getVisibleProjects()

  return (
    <section id="projects" ref={sectionRef} className="projects-section">
      <style>{`
        .projects-section {
          min-height: 100vh;
          padding: 5rem 2rem 2rem;
          position: relative;
          overflow: hidden; // Critical for pin
          background: radial-gradient(circle at center, rgba(10, 20, 40, 0.8) 0%, rgba(5, 5, 10, 1) 100%);
        }
        
        .projects-header-container {
          position: relative;
          z-index: 10;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        /* Console Frame */
        .console-frame {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          perspective: 1200px;
          height: 55vh;
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Scanlines */
        .scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.08) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
          z-index: 5;
        }

        .carousel-track {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-card-wrapper {
          position: absolute;
          /* transition: transform 0.6s ... - REMOVED: GSAP controls movement now */
          /* opacity is handled by GSAP */
          will-change: transform, opacity; /* Optimize performance */
        }

        /* Active Card (Center) - LARGER */
        .project-card-wrapper.active {
          z-index: 10;
          width: 55%;
          max-width: 700px;
          height: 400px;
          left: 50%;
          transform: translateX(-50%) scale(1);
          filter: brightness(1.1);
        }

        /* Active Glow */
        .project-card-wrapper.active::after {
          content: '';
          position: absolute;
          inset: -4px;
          background: var(--glow-color);
          z-index: -1;
          border-radius: 6px;
          filter: blur(20px);
          opacity: 0.7;
          animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.35; }
        }

        /* Side Cards - SMALLER */
        .project-card-wrapper.prev,
        .project-card-wrapper.next {
          z-index: 5;
          width: 30%;
          max-width: 350px;
          height: 220px;
          top: 50%;
          margin-top: -110px; /* Half height to center vertically */
          opacity: 0.4;
          filter: brightness(0.4) saturate(0.5);
          pointer-events: none;
        }

        .project-card-wrapper.prev {
          left: 5%;
          transform: perspective(1000px) rotateY(25deg) scale(0.9);
        }

        .project-card-wrapper.next {
          right: 5%;
          transform: perspective(1000px) rotateY(-25deg) scale(0.9);
        }
        
        /* Card Visual */
        .project-visual {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          background: #000;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .project-card-wrapper.active .project-visual {
          border-color: var(--glow-color);
        }

        .project-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.4s ease;
        }

        .project-card-wrapper.active:hover .project-info-overlay,
        .project-card-wrapper.active .project-info-overlay {
          transform: translateY(0);
          opacity: 1;
        }

        .project-title {
          font-family: 'Press Start 2P', cursive;
          color: white;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 0px black;
        }

        .click-hint {
          color: rgba(255,255,255,0.6);
          font-size: 0.8rem;
          font-family: 'JetBrains Mono', monospace;
        }

        /* PIXEL CONTROLLER BUTTONS */
        .console-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 800px;
          margin: 2rem auto 0;
          padding: 0 2rem;
        }
        
        .d-pad {
          display: flex;
          gap: 0.5rem;
        }

        /* Pixelated Button Style */
        .control-btn {
          width: 50px;
          height: 50px;
          background: #1a1a2e;
          border: 3px solid #333;
          border-radius: 4px;
          color: #888;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          box-shadow: 
            inset -2px -2px 0 #0a0a12,
            inset 2px 2px 0 #2a2a3e,
            0 4px 0 #0a0a12;
          image-rendering: pixelated;
          font-family: 'Press Start 2P', cursive;
        }

        .control-btn:active {
          transform: translateY(4px);
          box-shadow: 
            inset -2px -2px 0 #0a0a12,
            inset 2px 2px 0 #2a2a3e,
            0 0 0 #0a0a12;
        }

        .control-btn:hover {
          background: #2a2a4e;
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .action-btns {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        /* Pixelated SELECT Button */
        .select-btn {
          padding: 0.8rem 1.5rem;
          background: #ff0055;
          border: 3px solid #990033;
          border-radius: 4px;
          color: white;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.65rem;
          cursor: pointer;
          box-shadow: 
            inset -2px -2px 0 #aa0044,
            inset 2px 2px 0 #ff3377,
            0 4px 0 #660022;
          transition: all 0.15s;
          text-transform: uppercase;
        }

        .select-btn:active {
          transform: translateY(4px);
          box-shadow: 
            inset -2px -2px 0 #aa0044,
            inset 2px 2px 0 #ff3377,
            0 0 0 #660022;
        }

        .select-btn:hover {
          background: #ff2266;
        }

        .mobile-hint {
           text-align: center;
           color: rgba(255,255,255,0.4);
           font-family: 'Press Start 2P', cursive;
           font-size: 0.55rem;
           margin-top: 1.5rem;
           display: none;
        }

        @media (max-width: 768px) {
           .console-frame {
             height: 45vh;
             min-height: 350px;
           }
           
           .project-card-wrapper.active {
             width: 85%;
             height: 280px;
           }
           
           .project-card-wrapper.prev, 
           .project-card-wrapper.next {
             display: none;
           }
           
           .console-controls {
             display: none;
           }
           
           .mobile-hint {
             display: block;
           }
           
           .project-title {
             font-size: 0.8rem;
           }
        }
      `}</style>
      
      <div className="projects-header-container" ref={titleRef}>
        <SectionTitle title="PROJECTS" extension=".work" />
      </div>

      <div className="console-frame" {...handlers}>
        <div className="scanlines"></div>
        <div className="carousel-track">
          
          {/* Previous Project (Left) */}
          <div className="project-card-wrapper prev">
             <div className="project-visual">
               <img src={projects[prev].image} alt="" />
             </div>
          </div>

          {/* Active Project (Center) */}
          <div 
            className="project-card-wrapper active"
            ref={activeCardRef}
            style={{ '--glow-color': projects[current].color }}
          >
             <div className="project-visual">
               <img src={projects[current].image} alt={projects[current].title} />
               <div className="project-info-overlay">
                 <h3 className="project-title">{projects[current].title}</h3>
                 <p className="click-hint">[ PRESS A TO SELECT ]</p>
               </div>
             </div>
          </div>

          {/* Next Project (Right) */}
          <div className="project-card-wrapper next">
             <div className="project-visual">
               <img src={projects[next].image} alt="" />
             </div>
          </div>

        </div>
      </div>

      <div className="console-controls" ref={controlsRef}>
        <div className="d-pad">
          <button className="control-btn" onClick={prevProject} aria-label="Previous">
            ◀
          </button>
          <button className="control-btn" onClick={nextProject} aria-label="Next">
             ▶
          </button>
        </div>
        
        <div className="action-btns">
          <button className="select-btn" onClick={() => setSelectedProject(projects[current])}>
            [A] SELECT
          </button>
        </div>
      </div>

      <div className="mobile-hint">
        ◀ SWIPE ▶ • TAP TO SELECT
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

    </section>
  )
}
