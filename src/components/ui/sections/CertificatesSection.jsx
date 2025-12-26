import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard } from '../ui'
import { certificates, getCertificatesByCategory } from '../../data/certificateData'

gsap.registerPlugin(ScrollTrigger)

/**
 * CertificatesSection - Stagger reveal grid
 * 
 * Certificates animate in with staggered reveal as user scrolls.
 */
export default function CertificatesSection() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [displayedCerts, setDisplayedCerts] = useState(certificates.slice(0, 8))

  // Get unique categories
  const categories = ['all', ...new Set(certificates.map(c => c.category))]

  useEffect(() => {
    const filtered = getCertificatesByCategory(activeCategory).slice(0, 8)
    setDisplayedCerts(filtered)
  }, [activeCategory])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger reveal for certificate cards
      gsap.from('.cert-card', {
        opacity: 0,
        y: 50,
        rotateX: -15,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [displayedCerts])

  return (
    <section id="certificates" ref={sectionRef} className="certificates-section">
      <style>{`
        .certificates-section {
          min-height: 100vh;
          padding: 6rem 2rem;
        }
        
        .certs-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .certs-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .cert-stats {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid #39ff14;
          border-radius: 20px;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: #39ff14;
        }
        
        .category-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        
        .category-pill {
          padding: 0.4rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          border-radius: 15px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .category-pill:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }
        
        .category-pill.active {
          background: #00d4ff;
          border-color: #00d4ff;
          color: #0a0a12;
        }
        
        .certs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        
        .cert-card {
          padding: 0 !important;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .cert-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .cert-image {
          width: 100%;
          height: 160px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .cert-image img {
          max-width: 95%;
          max-height: 95%;
          object-fit: contain;
        }
        
        .cert-info {
          padding: 1rem;
        }
        
        .cert-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .cert-provider {
          font-size: 0.75rem;
          color: #00d4ff;
        }
        
        .view-all-link {
          display: block;
          text-align: center;
          margin-top: 2rem;
          color: #00d4ff;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          text-decoration: none;
          padding: 1rem;
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 8px;
          transition: all 0.3s;
        }
        
        .view-all-link:hover {
          background: rgba(0, 212, 255, 0.1);
          border-color: #00d4ff;
        }
      `}</style>
      
      <div className="certs-container">
        <div className="certs-header">
          <SectionTitle title="ACHIEVEMENTS" extension=".dat" />
          <div className="cert-stats">
            ★ {certificates.length} UNLOCKED
          </div>
        </div>
        
        <div className="category-pills">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? 'ALL' : cat}
            </button>
          ))}
        </div>
        
        <div ref={gridRef} className="certs-grid">
          {displayedCerts.map((cert) => (
            <GlassCard key={cert.id} className="cert-card" hoverEffect={false}>
              <div className="cert-image">
                <img src={cert.image} alt={cert.title} />
              </div>
              <div className="cert-info">
                <h4 className="cert-title">{cert.title}</h4>
                <p className="cert-provider">{cert.provider}</p>
              </div>
            </GlassCard>
          ))}
        </div>
        
        <a href="/certifications" className="view-all-link">
          VIEW ALL {certificates.length} CERTIFICATES →
        </a>
      </div>
    </section>
  )
}
