import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import ReactMarkdown from 'react-markdown'
import Seo from '../components/Seo'
import { PixelButton } from '../components/ui'

/**
 * ProjectDetail - Dedicated project detail page
 * 
 * Replaces the modal approach with a full-page experience.
 * Includes CTAs for user engagement.
 */

// Fallback data if Firestore fails
const FALLBACK_PROJECTS = {
  'sineai-hub': {
    id: 'sineai-hub',
    title: 'SineAI Hub',
    description: 'AI-powered learning management system with real-time chat, collaboration features, and intelligent tutoring.',
    image: '/projects/sineai-hub.jpg',
    tags: ['Laravel', 'Supabase', 'Gemini', 'Tailwind'],
    liveUrl: 'https://sineai.tech',
    codeUrl: 'https://github.com/J-Akiru5/sineai-hub',
    status: 100,
    color: '#00d4ff',
    details: ''
  }
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchProject() {
      try {
        const docRef = doc(db, 'projects', slug)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() })
        } else {
          // Try fallback
          setProject(FALLBACK_PROJECTS[slug] || null)
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setProject(FALLBACK_PROJECTS[slug] || null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProject()
    window.scrollTo(0, 0)
  }, [slug])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(project?.title || 'Project')
    
    const links = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check out ${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    }
    
    window.open(links[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="project-detail-loading">
        <style>{`
          .project-detail-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00d4ff;
            font-family: 'Press Start 2P', cursive;
            font-size: 0.8rem;
          }
          .loading-text::after {
            content: '';
            animation: dots 1.5s steps(4) infinite;
          }
          @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
          }
        `}</style>
        <span className="loading-text">LOADING PROJECT</span>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="project-not-found">
        <style>{`
          .project-not-found {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            padding: 2rem;
          }
          .not-found-title {
            font-family: 'Press Start 2P', cursive;
            color: #ff6b35;
            font-size: 1.2rem;
          }
        `}</style>
        <h1 className="not-found-title">PROJECT NOT FOUND</h1>
        <PixelButton onClick={() => navigate('/#projects')}>
          ← BACK TO PROJECTS
        </PixelButton>
      </div>
    )
  }

  return (
    <div className="project-detail-page">
      <Seo 
        title={`${project.title} | JeffDev Projects`}
        description={project.description}
        image={project.image}
      />
      
      <style>{`
        .project-detail-page {
          min-height: 100vh;
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          transition: color 0.3s;
        }

        .back-link:hover {
          color: #00d4ff;
        }

        .project-hero {
          position: relative;
          width: 100%;
          height: 400px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .project-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                      linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .project-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.8rem;
          color: white;
          text-shadow: 3px 3px 0px ${project.color || '#00d4ff'};
          margin: 0;
        }

        .status-badge {
          display: inline-block;
          margin-top: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
        }

        .status-badge.complete {
          background: rgba(57, 255, 20, 0.15);
          border: 1px solid rgba(57, 255, 20, 0.4);
          color: #39ff14;
        }

        .status-badge.progress {
          background: rgba(255, 170, 0, 0.15);
          border: 1px solid rgba(255, 170, 0, 0.4);
          color: #ffaa00;
        }

        .project-links {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .project-description {
          font-size: 1.15rem;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 3rem;
        }

        .section-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .section-title::after {
          content: '';
          height: 1px;
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
        }

        .details-section {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .markdown-content {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.95rem;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.85);
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3 {
          color: #00d4ff;
          margin: 1.5rem 0 1rem;
          font-family: 'Press Start 2P', cursive;
        }

        .markdown-content h1 { font-size: 1rem; }
        .markdown-content h2 { font-size: 0.85rem; }
        .markdown-content h3 { font-size: 0.75rem; color: #39ff14; }

        .markdown-content p { margin-bottom: 1rem; }

        .markdown-content ul,
        .markdown-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .markdown-content li { margin-bottom: 0.5rem; }
        .markdown-content li::marker { color: #39ff14; }

        .markdown-content code {
          background: rgba(0, 212, 255, 0.15);
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          color: #00d4ff;
        }

        .markdown-content pre {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 6px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .markdown-content a {
          color: #00d4ff;
          text-decoration: underline;
        }

        .markdown-content blockquote {
          border-left: 3px solid #9d4edd;
          padding-left: 1rem;
          margin: 1rem 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 3rem;
        }

        .tech-tag {
          padding: 0.6rem 1.2rem;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 6px;
          color: #39ff14;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(157, 78, 221, 0.1));
          border: 2px solid rgba(0, 212, 255, 0.3);
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          margin: 3rem 0;
        }

        .cta-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1rem;
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        /* Share Section */
        .share-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .share-label {
          color: rgba(255, 255, 255, 0.5);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
        }

        .share-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .share-btn:hover {
          background: rgba(0, 212, 255, 0.1);
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .share-btn.copied {
          background: rgba(57, 255, 20, 0.15);
          border-color: #39ff14;
          color: #39ff14;
        }

        @media (max-width: 768px) {
          .project-detail-page {
            padding: 1rem;
          }

          .project-hero {
            height: 250px;
          }

          .project-title {
            font-size: 1.2rem;
          }

          .project-header {
            flex-direction: column;
          }

          .cta-section {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      {/* Back Link */}
      <Link to="/#projects" className="back-link">
        ← Back to Projects
      </Link>

      {/* Hero Image */}
      <div className="project-hero">
        <img src={project.image} alt={project.title} />
      </div>

      {/* Header */}
      <div className="project-header">
        <div>
          <h1 className="project-title">{project.title}</h1>
          {project.status !== undefined && (
            <span className={`status-badge ${project.status >= 100 ? 'complete' : 'progress'}`}>
              {project.status >= 100 ? '✓ Complete' : `${project.status}% In Progress`}
            </span>
          )}
        </div>
        <div className="project-links">
          {project.liveUrl && project.liveUrl !== '#' && (
            <PixelButton href={project.liveUrl} icon="🚀">
              LIVE DEMO
            </PixelButton>
          )}
          {project.codeUrl && project.codeUrl !== '#' && (
            <PixelButton href={project.codeUrl} icon="💻" variant="outline">
              VIEW CODE
            </PixelButton>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="project-description">{project.description}</p>

      {/* Architecture / Details */}
      {project.details && (
        <>
          <h2 className="section-title">ARCHITECTURE.md</h2>
          <div className="details-section">
            <div className="markdown-content">
              <ReactMarkdown>{project.details}</ReactMarkdown>
            </div>
          </div>
        </>
      )}

      {/* Tech Stack */}
      <h2 className="section-title">TECH_STACK.json</h2>
      <div className="tech-tags">
        {project.tags && project.tags.map(tag => (
          <span key={tag} className="tech-tag">{tag}</span>
        ))}
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2 className="cta-title">💬 Interested in this project?</h2>
        <p className="cta-subtitle">
          Let's discuss how I can build something similar for you, or collaborate on your next big idea.
        </p>
        <div className="cta-buttons">
          <PixelButton 
            href={`mailto:jeffdev.studio@gmail.com?subject=Interested%20in%20${encodeURIComponent(project.title)}&body=Hi%20Jeff!%0A%0AI%20saw%20your%20${encodeURIComponent(project.title)}%20project%20and%20would%20love%20to%20chat%20about%20working%20together.`}
            icon="�"
            variant="filled"
            color="matrix"
          >
            LET'S TALK
          </PixelButton>
          <PixelButton 
            href="/#contact"
            icon="💼"
            variant="outline"
            color="electric"
          >
            HIRE ME
          </PixelButton>
        </div>

        {/* Share Buttons */}
        <div className="share-section">
          <span className="share-label">Share:</span>
          <button 
            className={`share-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
          <button className="share-btn" onClick={() => handleShare('twitter')}>
            𝕏 Twitter
          </button>
          <button className="share-btn" onClick={() => handleShare('linkedin')}>
            in LinkedIn
          </button>
        </div>
      </div>

      {/* Back to Projects */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <PixelButton href="/#projects" variant="outline">
          ← VIEW ALL PROJECTS
        </PixelButton>
      </div>
    </div>
  )
}
