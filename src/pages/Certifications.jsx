import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard } from '../components/ui'
import { certificates, getCertificatesByCategory, getTotalCount } from '../data/certificateData'

gsap.registerPlugin(ScrollTrigger)

/**
 * Certifications Page
 * 
 * ACHIEVEMENTS.dat styled page with category tabs and certificate cards.
 */

// Get unique categories from certificates array
const getUniqueCategories = () => {
  const cats = new Set(certificates.map(c => c.category))
  return ['all', ...Array.from(cats)]
}

export default function Certifications() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [displayedCerts, setDisplayedCerts] = useState(certificates)
  const [selectedCert, setSelectedCert] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const cardsRef = useRef(null)
  const pageRef = useRef(null)
  
  // Get categories from the data
  const uniqueCategories = getUniqueCategories()

  useEffect(() => {
    let filtered = getCertificatesByCategory(activeCategory)
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        c => c.title.toLowerCase().includes(term) || 
             c.provider.toLowerCase().includes(term)
      )
    }
    
    setDisplayedCerts(filtered)
  }, [activeCategory, searchTerm])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.cert-card')
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
          }
        )
      }
    })

    return () => ctx.revert()
  }, [displayedCerts])

  return (
    <section className="certifications-page" ref={pageRef}>
      <style>{`
        .certifications-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .cert-counter {
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .cert-counter .star {
          color: #39ff14;
        }
        
        .search-bar {
          width: 100%;
          max-width: 400px;
          margin-bottom: 1rem;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50px;
          color: white;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
        }
        
        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .category-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        
        .category-tab {
          padding: 0.5rem 1rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.55rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
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
        
        .certs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        
        .cert-card {
          cursor: pointer;
          overflow: hidden;
          padding: 0;
          transition: all 0.3s ease;
        }
        
        .cert-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 212, 255, 0.15);
        }
        
        .cert-image {
          width: 100%;
          height: 180px;
          overflow: hidden;
          background: #1a1a2e;
          position: relative;
        }
        
        .cert-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 0.5rem;
          transition: transform 0.3s ease;
        }
        
        .cert-card:hover .cert-image img {
          transform: scale(1.03);
        }
        
        .cert-category-badge {
          position: absolute;
          bottom: 0.5rem;
          left: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 4px;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.45rem;
          color: #00d4ff;
          text-transform: uppercase;
        }
        
        .cert-content {
          padding: 1rem;
        }
        
        .cert-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .cert-provider {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          color: #00d4ff;
        }
        
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        /* Lightbox */
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .lightbox-content {
          position: relative;
          max-width: 850px;
          max-height: 90vh;
          width: 100%;
          background: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .lightbox-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }
        
        .lightbox-close:hover {
          background: #ff6b35;
          transform: rotate(90deg);
        }
        
        .lightbox-image {
          width: 100%;
          max-height: 55vh;
          object-fit: contain;
          background: white;
        }
        
        .lightbox-info {
          padding: 1.5rem;
        }
        
        .lightbox-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.5rem;
        }
        
        .lightbox-provider {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
        }
        
        .lightbox-category {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: rgba(0, 212, 255, 0.15);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          font-size: 0.75rem;
          color: #00d4ff;
          margin-bottom: 1rem;
        }
        
        .lightbox-download {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #00d4ff, #9d4edd);
          border-radius: 8px;
          color: white;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          text-decoration: none;
          transition: all 0.3s;
        }
        
        .lightbox-download:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
          }
          
          .certs-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
          
          .lightbox {
            padding: 1rem;
          }
          
          .lightbox-image {
            max-height: 45vh;
          }
        }
        
        @media (max-width: 480px) {
          .certs-grid {
            grid-template-columns: 1fr;
          }
          
          .category-tab {
            flex: 1 1 calc(50% - 0.25rem);
            text-align: center;
          }
        }
      `}</style>
      
      {/* Header */}
      <div className="page-header">
        <SectionTitle title="ACHIEVEMENTS" extension=".dat" />
        <div className="cert-counter">
          <span className="star">★</span>
          <span>{getTotalCount()} CERTS UNLOCKED</span>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search certificates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Category Tabs */}
      <div className="category-tabs">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all' ? 'ALL' : cat}
          </button>
        ))}
      </div>
      
      {/* Certificates Grid */}
      <div className="certs-grid" ref={cardsRef}>
        {displayedCerts.length > 0 ? (
          displayedCerts.map((cert) => (
            <GlassCard 
              key={cert.id} 
              className="cert-card"
              hoverEffect={false}
              onClick={() => setSelectedCert(cert)}
            >
              <div className="cert-image">
                <img src={cert.image} alt={cert.title} />
                <span className="cert-category-badge">{cert.category}</span>
              </div>
              <div className="cert-content">
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-provider">{cert.provider}</p>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="no-results">
            No certificates found matching your search.
          </div>
        )}
      </div>
      
      {/* Lightbox Modal */}
      {selectedCert && (
        <div 
          className="lightbox" 
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="lightbox-close"
              onClick={() => setSelectedCert(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <img 
              src={selectedCert.image} 
              alt={selectedCert.title}
              className="lightbox-image"
            />
            <div className="lightbox-info">
              <h3 className="lightbox-title">{selectedCert.title}</h3>
              <p className="lightbox-provider">{selectedCert.provider}</p>
              <span className="lightbox-category">{selectedCert.category}</span>
              <br />
              <a 
                href={selectedCert.image} 
                download={`${selectedCert.title}.svg`}
                className="lightbox-download"
              >
                ⬇ DOWNLOAD
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}