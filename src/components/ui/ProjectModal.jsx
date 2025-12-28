import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { PixelButton } from './'

/**
 * ProjectModal - Detailed view of a project
 * 
 * Overlay modal with full project details, tech stack, and links.
 * animated with GSAP.
 */
const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Overlay fade in
      gsap.fromTo(modalRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )
      
      // Content scale/fade up
      gsap.fromTo(contentRef.current, 
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'back.out(1.2)' }
      )
    })
    
    // Lock body scroll
    document.body.style.overflow = 'hidden'

    return () => {
      ctx.revert()
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    // Animate out
    gsap.to(contentRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        gsap.to(modalRef.current, {
          opacity: 0,
          duration: 0.2,
          onComplete: onClose
        })
      }
    })
  }

  if (!project) return null

  return (
    <div className="project-modal-overlay" ref={modalRef}>
      <style>{`
        .project-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 10, 18, 0.95);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow: hidden;
        }

        .project-modal-content {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          max-width: 900px;
          width: 100%;
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          box-shadow: 0 0 50px rgba(0, 212, 255, 0.15);
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 212, 255, 0.3) transparent;
        }

        .project-modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .project-modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .project-modal-content::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.3);
          border-radius: 4px;
        }

        .project-modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.5);
        }

        .project-modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.5rem;
          z-index: 10;
          transition: all 0.3s;
        }

        .project-modal-close:hover {
          background: #ff6b35;
          border-color: #ff6b35;
          transform: rotate(90deg);
        }

        .modal-image-container {
          width: 100%;
          height: 400px;
          overflow: hidden;
          position: relative;
          background: #000;
        }

        .modal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
        }
        
        /* Scanline overlay for image */
        .modal-image-container::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .modal-body {
          padding: 2rem 3rem 3rem;
          margin-top: -60px;
          position: relative;
          z-index: 2;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.5rem;
          color: white;
          text-shadow: 2px 2px 0px ${project.color || '#00d4ff'};
        }

        .modal-links {
          display: flex;
          gap: 1rem;
        }
        
        .project-stat-pill {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: #00d4ff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .modal-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2.5rem;
        }

        .modal-section-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .modal-section-title::after {
          content: '';
          height: 1px;
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 2rem;
        }

        .modal-tag {
          padding: 0.5rem 1rem;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 6px;
          color: #39ff14;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .project-modal-overlay {
            padding: 0;
            align-items: flex-end;
          }
          
          .project-modal-content {
            height: 85vh;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          
          .modal-image-container {
            height: 250px;
          }
          
          .modal-body {
            padding: 1.5rem;
            margin-top: -40px;
          }
          
          .modal-title {
            font-size: 1.1rem;
          }
        }
      `}</style>

      <div className="project-modal-content" ref={contentRef} onClick={e => e.stopPropagation()}>
        <button className="project-modal-close" onClick={handleClose}>×</button>
        
        <div className="modal-image-container">
          <img src={project.image} alt={project.title} className="modal-image" />
        </div>

        <div className="modal-body">
          <div className="modal-header">
            <div>
              <h2 className="modal-title">{project.title}</h2>
            </div>
            <div className="modal-links">
              {project.liveUrl && (
                <PixelButton href={project.liveUrl} icon="🚀" size="small">
                  LIVE DEMO
                </PixelButton>
              )}
              {project.codeUrl && (
                <PixelButton href={project.codeUrl} icon="💻" size="small" variant="outline">
                  CODE
                </PixelButton>
              )}
            </div>
          </div>

          <div className="modal-description">
            <p>{project.description}</p>
            {project.details && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ 
                  fontFamily: "'Press Start 2P', cursive", 
                  fontSize: '0.7rem', 
                  color: 'rgba(255,255,255,0.5)', 
                  marginBottom: '0.75rem' 
                }}>
                  ARCHITECTURE.md
                </h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{project.details}</p>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <h3 className="modal-section-title">TECH_STACK.json</h3>
          <div className="modal-tags">
            {project.tags.map(tag => (
              <span key={tag} className="modal-tag">{tag}</span>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProjectModal
