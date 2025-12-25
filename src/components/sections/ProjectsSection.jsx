import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, PixelButton } from '../ui'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProjectsSection - Horizontal scroll showcase
 * 
 * Pins the container and scrolls project cards horizontally
 * as the user scrolls down.
 */
export default function ProjectsSection() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const cardsRef = useRef(null)

  const projects = [
    {
      id: 'sineai-hub',
      title: 'SineAI Hub',
      description: 'AI-powered learning management system with real-time chat, collaboration features, and intelligent tutoring.',
      image: '/assets/Screenshot 2025-12-16 094218.png',
      tags: ['Laravel', 'React', 'Firebase', 'OpenAI'],
      liveUrl: 'https://sineai.tech',
      codeUrl: 'https://github.com/J-Akiru5/sineai-hub',
      color: '#00d4ff',
    },
    {
      id: 'portfolio',
      title: 'This Portfolio',
      description: '8-bit Universe themed portfolio with GSAP animations, glassmorphism, and Firebase integration.',
      image: '/assets/Screenshot 2025-12-25 113451.png',
      tags: ['React', 'GSAP', 'Firebase'],
      liveUrl: '#',
      codeUrl: 'https://github.com/J-Akiru5/my-portfolio-react',
      color: '#39ff14',
    },
    {
      id: 'cict-portal',
      title: 'CICT Tech Portal',
      description: 'Technology portal for the College of ICT with student resources and department management.',
      image: '/assets/Screenshot 2025-12-25 122142.png',
      tags: ['React', 'Node.js'],
      liveUrl: '#',
      codeUrl: 'https://github.com/J-Akiru5/cict-tech-portal',
      color: '#9d4edd',
    },
    {
      id: 'gsus',
      title: 'GSUS',
      description: 'General Services Unified System - comprehensive service management platform.',
      image: '/assets/image copy 2.png',
      tags: ['React', 'Firebase'],
      liveUrl: '#',
      codeUrl: 'https://github.com/J-Akiru5/GSUS-Hackathon-Project',
      color: '#ff6b35',
    },
    {
      id: 'ebhm-connect',
      title: 'E-BHM Connect',
      description: 'Electronic Barangay Health Management System for community healthcare.',
      image: '/assets/Screenshot 2025-12-18 222001.png',
      tags: ['PHP', 'MySQL'],
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current
      const track = trackRef.current
      
      if (!cards || !track) return

      // Use functional getter to ensure it recalculates
      const getScrollWidth = () => cards.scrollWidth - window.innerWidth + 200

      gsap.to(cards, {
        x: () => -getScrollWidth(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getScrollWidth()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      })

      // Card reveal animations
      gsap.from('.project-card', {
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="projects-section">
      <style>{`
        .projects-section {
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }
        
        .projects-header {
          position: absolute;
          top: 2rem;
          left: 2rem;
          z-index: 10;
        }
        
        .horizontal-track {
          display: flex;
          align-items: center;
          height: 100vh;
          padding: 0 4rem;
        }
        
        .projects-cards {
          display: flex;
          gap: 2rem;
          padding: 6rem 4rem 4rem 4rem;
        }
        
        .project-card {
          flex-shrink: 0;
          width: 400px;
          overflow: hidden;
          padding: 0 !important;
          transition: transform 0.3s;
        }
        
        .project-card:hover {
          transform: translateY(-10px);
        }
        
        .project-image {
          width: 100%;
          height: 220px;
          background: #1a1a2e;
          position: relative;
          overflow: hidden;
        }
        
        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        
        .project-card:hover .project-image img {
          transform: scale(1.05);
        }
        
        .project-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(157, 78, 221, 0.1));
        }
        
        .project-color-bar {
          height: 4px;
          width: 100%;
        }
        
        .project-content {
          padding: 1.5rem;
        }
        
        .project-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: white;
          margin-bottom: 0.75rem;
        }
        
        .project-description {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        
        .project-tag {
          padding: 0.25rem 0.5rem;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 4px;
          font-size: 0.65rem;
          font-family: 'JetBrains Mono', monospace;
          color: #00d4ff;
        }
        
        .project-links {
          display: flex;
          gap: 0.75rem;
        }
        
        .project-link {
          flex: 1;
          padding: 0.6rem;
          text-align: center;
          font-size: 0.65rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-family: 'Press Start 2P', cursive;
          transition: all 0.3s;
        }
        
        .project-link:hover {
          border-color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
        }
        
        .scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .project-card {
            width: 320px;
          }
          
          .projects-cards {
            padding: 5rem 2rem 4rem 2rem;
          }
        }
      `}</style>
      
      <div className="projects-header">
        <SectionTitle title="PROJECTS" extension=".work" />
      </div>
      
      <div ref={trackRef} className="horizontal-track">
        <div ref={cardsRef} className="projects-cards">
          {projects.map((project) => (
            <GlassCard key={project.id} className="project-card" hoverEffect={false}>
              <div className="project-image">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className="project-image-placeholder" style={{ display: project.image ? 'none' : 'flex' }}>
                  🚀
                </div>
              </div>
              <div className="project-color-bar" style={{ background: project.color }} />
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                      LIVE →
                    </a>
                  )}
                  {project.codeUrl && (
                    <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                      CODE
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
      
      <div className="scroll-hint">
        ← SCROLL TO EXPLORE →
      </div>
    </section>
  )
}
