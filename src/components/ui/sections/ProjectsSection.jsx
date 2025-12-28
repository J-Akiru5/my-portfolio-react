import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSwipeable } from 'react-swipeable'
import { SectionTitle, GlassCard, ProjectModal } from '..'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProjectsSection - Game Console Style Carousel
 * 
 * 3D carousel with active center project, dimmed side projects,
 * retro controller navigation, and mobile swipe support.
 */
export default function ProjectsSection() {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const [rotation, setRotation] = useState(0)

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
      if (selectedProject) return // Disable nav when modal open
      if (e.key === 'ArrowRight') nextProject()
      if (e.key === 'ArrowLeft') prevProject()
      if (e.key === 'Enter') setSelectedProject(projects[activeIndex])
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, selectedProject])

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
          padding: 6rem 2rem 2rem;
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle at center, rgba(10, 20, 40, 0.8) 0%, rgba(5, 5, 10, 1) 100%);
        }
        
        .projects-header-container {
          position: relative;
          z-index: 10;
          margin-bottom: 2rem;
          padding-left: 2rem;
        }

        /* Console Frame */
        .console-frame {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          perspective: 1000px;
          height: 60vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Scanlines */
        .scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
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
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          width: 60%;
          max-width: 600px;
          height: 350px;
          cursor: pointer;
        }

        /* Active Card (Center) */
        .project-card-wrapper.active {
          z-index: 10;
          transform: translateX(0) scale(1);
          opacity: 1;
          filter: brightness(1.2);
        }

        /* Active Glow */
        .project-card-wrapper.active::after {
          content: '';
          position: absolute;
          inset: -3px;
          background: var(--glow-color);
          z-index: -1;
          border-radius: 16px;
          filter: blur(15px);
          opacity: 0.6;
          animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }

        /* Prev Card (Left) */
        .project-card-wrapper.prev {
          z-index: 5;
          transform: translateX(-55%) scale(0.7) rotateY(15deg);
          opacity: 0.5;
          filter: brightness(0.5) blur(1px);
          pointer-events: none; /* Prevent clicking side cards */
        }

        /* Next Card (Right) */
        .project-card-wrapper.next {
          z-index: 5;
          transform: translateX(55%) scale(0.7) rotateY(-15deg);
          opacity: 0.5;
          filter: brightness(0.5) blur(1px);
          pointer-events: none;
        }
        
        /* Main Visual */
        .project-visual {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background: #000;
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
          padding: 2rem;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s;
        }

        .project-card-wrapper.active:hover .project-info-overlay {
          transform: translateY(0);
          opacity: 1;
        }
        
        /* Always show info on mobile active */
        @media (max-width: 768px) {
           .project-card-wrapper.active .project-info-overlay {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .project-title {
          font-family: 'Press Start 2P', cursive;
          color: white;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 0px black;
        }

        /* Controller Controls */
        .console-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 900px;
          margin: 2rem auto;
          padding: 0 2rem;
        }
        
        .d-pad {
          display: flex;
          gap: 1rem;
        }

        .control-btn {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 5px 0 rgba(0,0,0,0.5);
        }

        .control-btn:active {
          transform: translateY(5px);
          box-shadow: 0 0 0 rgba(0,0,0,0.5);
        }

        .control-btn:hover {
          background: rgba(0, 212, 255, 0.2);
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
          padding: 0.8rem 2rem;
          background: #ff0055;
          border: none;
          border-radius: 30px;
          color: white;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          cursor: pointer;
          box-shadow: 0 5px 0 #990033;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .select-btn:active {
          transform: translateY(5px);
          box-shadow: 0 0 0 #990033;
        }

        .select-btn:hover {
          filter: brightness(1.1);
        }

        .mobile-hint {
           text-align: center;
           color: rgba(255,255,255,0.4);
           font-family: 'Press Start 2P', cursive;
           font-size: 0.6rem;
           margin-top: 1rem;
           display: none;
        }

        @media (max-width: 768px) {
           .project-card-wrapper {
             width: 80%;
             height: 300px;
           }
           
           .project-card-wrapper.prev, 
           .project-card-wrapper.next {
             display: none; /* Hide side cards on mobile for cleaner look */
           }
           
           .console-controls {
             display: none; /* Hide buttons, use swipe */
           }
           
           .mobile-hint {
             display: block;
           }
        }
      `}</style>
      
      <div className="projects-header-container">
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
            style={{ '--glow-color': projects[current].color }}
            onClick={() => setSelectedProject(projects[current])}
          >
             <div className="project-visual">
               <img src={projects[current].image} alt={projects[current].title} />
               <div className="project-info-overlay">
                 <h3 className="project-title">{projects[current].title}</h3>
                 <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                   Click for details
                 </p>
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

      <div className="console-controls">
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
            SELECT (A)
          </button>
        </div>
      </div>

      <div className="mobile-hint">
        SWIPE TO NAVIGATE • TAP FOR DETAILS
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
