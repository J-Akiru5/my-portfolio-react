import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, PixelButton } from '../components/ui'

gsap.registerPlugin(ScrollTrigger)

/**
 * Portfolio Page
 * 
 * Project cards with category filter, tech tags, and live/code links.
 */

const projects = [
  {
    id: 1,
    title: 'SineAI Hub',
    description: 'AI-powered learning management system with real-time chat and collaboration features.',
    image: '/projects/sineai-hub.jpg',
    category: 'web',
    tags: ['Laravel', 'React', 'Supabase', 'Gemini'],
    liveUrl: 'https://sineai.tech',
    codeUrl: 'https://github.com/J-Akiru5/sineai-hub',
  },
  {
    id: 2,
    title: 'Profile Site',
    description: 'Personal portfolio with 8-bit aesthetic and modern animations.',
    image: '/projects/profile-site.jpg',
    category: 'web',
    tags: ['React', 'Tailwind', 'Motion'],
    liveUrl: '#',
    codeUrl: 'https://github.com/J-Akiru5/my-portfolio-react',
  },
  {
    id: 3,
    title: 'Design System',
    description: 'Comprehensive component library and design tokens.',
    image: '/projects/design-system.jpg',
    category: 'design',
    tags: ['Figma', 'React', 'Storybook'],
    liveUrl: '#',
  },
]

const categories = [
  { key: 'all', label: 'ALL' },
  { key: 'web', label: 'WEB' },
  { key: 'ai', label: 'AI' },
  { key: 'design', label: 'DESIGN' },
]

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const cardsRef = useRef(null)

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.category === activeCategory))
    }
  }, [activeCategory])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.project-card')
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
          }
        )
      }
    })

    return () => ctx.revert()
  }, [filteredProjects])

  return (
    <section className="portfolio-page">
      <style>{`
        .portfolio-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .category-tabs {
          display: flex;
          gap: 0.75rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }
        
        .category-tab {
          padding: 0.5rem 1rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .category-tab:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }
        
        .category-tab.active {
          background: #00d4ff;
          border-color: #00d4ff;
          color: #0a0a12;
        }
        
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        
        .project-card {
          overflow: hidden;
          padding: 0;
        }
        
        .project-image {
          width: 100%;
          height: 180px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a2e 0%, #0a0a12 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .project-card:hover .project-image img {
          transform: scale(1.05);
        }
        
        .project-placeholder {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
        }
        
        .project-content {
          padding: 1.25rem;
        }
        
        .project-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.5rem;
        }
        
        .project-description {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .project-tag {
          padding: 0.25rem 0.5rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.5rem;
          border: 1px solid #00d4ff;
          color: #00d4ff;
          border-radius: 3px;
        }
        
        .project-links {
          display: flex;
          gap: 0.75rem;
        }
        
        .project-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #39ff14;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .project-link:hover {
          color: #00d4ff;
        }
        
        .project-link svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
        }
        
        .no-projects {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'Space Grotesk', sans-serif;
        }
        
        /* Responsive */
        @media (max-width: 480px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      {/* Page Title */}
      <SectionTitle title="PROJECTS" extension=".zip" />
      
      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
      {/* Projects Grid */}
      <div className="projects-grid" ref={cardsRef}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <GlassCard key={project.id} className="project-card" hoverEffect={true}>
              <div className="project-image">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `<span class="project-placeholder">&lt;/&gt;</span>`
                    }}
                  />
                ) : (
                  <span className="project-placeholder">&lt;/&gt;</span>
                )}
              </div>
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
                      <svg viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                      LIVE
                    </a>
                  )}
                  {project.codeUrl && (
                    <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                      <svg viewBox="0 0 24 24">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-1-2.6c3.2-.4 6.5-1.5 6.5-7A5.4 5.4 0 0020 4.8 5 5 0 0020 1s-1.3-.4-4 1.5a13.4 13.4 0 00-7 0C6.3.6 5 1 5 1a5 5 0 000 3.8 5.4 5.4 0 00-1.5 3.7c0 5.5 3.3 6.6 6.5 7a3.4 3.4 0 00-1 2.6V22"/>
                      </svg>
                      CODE
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="no-projects">No projects found in this category.</div>
        )}
      </div>
    </section>
  )
}