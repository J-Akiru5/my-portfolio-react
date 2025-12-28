import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSwipeable } from 'react-swipeable'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase'
import { SectionTitle, ProjectModal } from '..'

gsap.registerPlugin(ScrollTrigger)

// Fallback projects (used if Firestore is empty or fails)
const FALLBACK_PROJECTS = [
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

/**
 * ProjectsSection - Console Style Carousel (Stable Version)
 * 
 * Clean 3-card layout with CSS transitions.
 * - Simple prev/active/next layout
 * - Smooth CSS transitions on card change
 * - Dynamic data from Firestore with fallback
 */
export default function ProjectsSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const carouselRef = useRef(null)
  const controlsRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const [projects, setProjects] = useState(FALLBACK_PROJECTS)

  // Fetch projects from Firestore
  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectsRef = collection(db, 'projects')
        const q = query(projectsRef, orderBy('order', 'asc'))
        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
          const projectsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setProjects(projectsData)
        }
      } catch (error) {
        console.warn('Firestore fetch failed, using fallback projects:', error.message)
      }
    }
    fetchProjects()
  }, [])

  // Navigation handlers
  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

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
      if (selectedProject) return
      if (e.key === 'ArrowRight') nextProject()
      if (e.key === 'ArrowLeft') prevProject()
      if (e.key === 'Enter') setSelectedProject(projects[activeIndex])
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, selectedProject, projects])

  // GSAP Pinned Reveal Sequence (Simple)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial hidden states
      gsap.set([titleRef.current, carouselRef.current, controlsRef.current], { 
        opacity: 0,
        y: 30
      })

      // Reveal timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2000',
          pin: true,
          scrub: 1,
          refreshPriority: -1,
          anticipatePin: 1
        }
      })

      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(carouselRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
        .to(controlsRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
        .to({}, { duration: 1 }) // Hold

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Get visible project indices
  const getVisibleProjects = () => {
    const len = projects.length
    const prev = (activeIndex - 1 + len) % len
    const next = (activeIndex + 1) % len
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
          overflow: hidden;
          background: radial-gradient(circle at center, rgba(10, 20, 40, 0.8) 0%, rgba(5, 5, 10, 1) 100%);
        }
        
        .projects-header-container {
          position: relative;
          z-index: 10;
          margin-bottom: 1rem;
          text-align: center;
        }

        .console-frame {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          height: 55vh;
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.08) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02));
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

        /* Card Wrapper - CSS transitions only */
        .project-card-wrapper {
          position: absolute;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Active Card (Center) */
        .project-card-wrapper.active {
          z-index: 10;
          width: 55%;
          max-width: 700px;
          height: 400px;
          left: 50%;
          transform: translateX(-50%) scale(1);
          opacity: 1;
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

        /* Side Cards */
        .project-card-wrapper.prev,
        .project-card-wrapper.next {
          z-index: 5;
          width: 28%;
          max-width: 320px;
          height: 200px;
          top: 50%;
          margin-top: -100px;
          opacity: 0.5;
          filter: brightness(0.5) saturate(0.6);
          pointer-events: none;
        }

        .project-card-wrapper.prev {
          left: 3%;
          transform: perspective(800px) rotateY(20deg) scale(0.85);
        }

        .project-card-wrapper.next {
          right: 3%;
          transform: perspective(800px) rotateY(-20deg) scale(0.85);
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
          transform: translateY(10px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .project-card-wrapper.active .project-info-overlay {
          transform: translateY(0);
          opacity: 1;
        }

        .project-title {
          font-family: 'Press Start 2P', cursive;
          color: white;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 0px black;
        }

        .click-hint {
          color: rgba(255,255,255,0.6);
          font-size: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
        }

        /* CONTROLLER BUTTONS */
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
          box-shadow: inset -2px -2px 0 #0a0a12, inset 2px 2px 0 #2a2a3e, 0 4px 0 #0a0a12;
          font-family: 'Press Start 2P', cursive;
        }

        .control-btn:active {
          transform: translateY(4px);
          box-shadow: inset -2px -2px 0 #0a0a12, inset 2px 2px 0 #2a2a3e, 0 0 0 #0a0a12;
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

        .select-btn {
          padding: 0.8rem 1.5rem;
          background: #ff0055;
          border: 3px solid #990033;
          border-radius: 4px;
          color: white;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.65rem;
          cursor: pointer;
          box-shadow: inset -2px -2px 0 #aa0044, inset 2px 2px 0 #ff3377, 0 4px 0 #660022;
          transition: all 0.15s;
          text-transform: uppercase;
        }

        .select-btn:active {
          transform: translateY(4px);
          box-shadow: inset -2px -2px 0 #aa0044, inset 2px 2px 0 #ff3377, 0 0 0 #660022;
        }

        .select-btn:hover {
          background: #ff2266;
        }

        /* Counter */
        .project-counter {
          text-align: center;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 1rem;
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
             font-size: 0.75rem;
           }
        }
      `}</style>
      
      <div className="projects-header-container" ref={titleRef}>
        <SectionTitle title="PROJECTS" extension=".work" />
      </div>

      <div className="console-frame" ref={carouselRef} {...handlers}>
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

      <div className="project-counter">
        {String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
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
