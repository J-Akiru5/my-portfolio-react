import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, PixelButton } from '..'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProductsSection - Showcase internal SaaS products and IP
 * 
 * Positions JeffDev Studio as a product company, not just an agency.
 * Critical for AWS startup narrative.
 */

const PRODUCTS = [
  {
    id: 'sineai-hub',
    name: 'SineAI Hub',
    tagline: 'Redefining Pre-Production with Generative Intelligence',
    description: 'An all-in-one creative suite featuring Spark, our proprietary AI filmmaker\'s assistant. SineAI Hub accelerates the journey from concept to screenplay, using advanced LLMs to brainstorm scenes, auto-format scripts, and overcome writer\'s block instantly.',
    image: '/assets/Screenshot 2025-12-29 124910.png',
    badge: 'Live Demo',
    color: '#00d4ff',
    tech: ['Laravel', 'React', 'Gemini AI', 'Supabase'],
    liveUrl: 'https://sineai.tech',
    codeUrl: 'https://github.com/J-Akiru5/sineai-hub'
  },
  {
    id: 'vibecoder-engine',
    name: 'Vibecoder Engine',
    tagline: 'AI-Powered Development Acceleration',
    description: 'The internal engine powering all JeffDev Studio projects. Combines AI agents with modern development workflows to deliver production-ready code 10x faster.',
    image: '/assets/Screenshot 2025-12-29 124930.png',
    badge: 'Internal Beta',
    color: '#9d4edd',
    tech: ['Claude AI', 'React', 'Node.js', 'Firebase'],
    liveUrl: null,
    codeUrl: null
  }
]

export default function ProductsSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.batch('.product-card', {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 0.6
            })
          },
          start: 'top 85%'
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="products" ref={sectionRef} className="products-section">
      <style>{`
        .products-section {
          min-height: 100vh;
          padding: 6rem 2rem;
          position: relative;
        }

        .products-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .products-intro {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .products-intro p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.6;
        }

        .products-intro .highlight {
          color: #9d4edd;
          font-weight: 600;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2rem;
        }

        .product-card {
          opacity: 0;
          transform: translateY(30px);
          overflow: hidden;
          padding: 0 !important;
        }

        .product-image-container {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.4rem 0.8rem;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid;
          border-radius: 4px;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.5rem;
          text-transform: uppercase;
        }

        .product-content {
          padding: 1.5rem;
        }

        .product-name {
          font-family: 'Press Start 2P', cursive;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .product-tagline {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1rem;
          font-style: italic;
        }

        .product-description {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .product-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .product-tech-tag {
          padding: 0.3rem 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .product-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          
          .product-image-container {
            height: 200px;
          }
        }
      `}</style>

      <div className="products-container">
        <SectionTitle title="OUR PRODUCTS" extension=".saas" />

        <div className="products-intro">
          <p>
            We don't just build for clients — we build our own{' '}
            <span className="highlight">intellectual property</span>. 
            These are the tools powering JeffDev Studio's innovation engine.
          </p>
        </div>

        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <GlassCard key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image"
                />
                <span 
                  className="product-badge"
                  style={{ 
                    borderColor: product.color,
                    color: product.color 
                  }}
                >
                  {product.badge}
                </span>
              </div>

              <div className="product-content">
                <h3 className="product-name" style={{ color: product.color }}>
                  {product.name}
                </h3>
                <p className="product-tagline">{product.tagline}</p>
                <p className="product-description">{product.description}</p>

                <div className="product-tech">
                  {product.tech.map((tech, idx) => (
                    <span key={idx} className="product-tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="product-actions">
                  {product.liveUrl && (
                    <PixelButton href={product.liveUrl} size="small" icon="🚀">
                      LIVE DEMO
                    </PixelButton>
                  )}
                  {product.codeUrl && (
                    <PixelButton href={product.codeUrl} size="small" variant="outline" icon="💻">
                      VIEW CODE
                    </PixelButton>
                  )}
                  {!product.liveUrl && !product.codeUrl && (
                    <span style={{ 
                      color: 'rgba(255,255,255,0.4)', 
                      fontFamily: 'JetBrains Mono', 
                      fontSize: '0.75rem' 
                    }}>
                      🔒 Internal Use Only
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
