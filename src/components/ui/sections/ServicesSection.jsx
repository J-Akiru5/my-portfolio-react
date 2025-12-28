import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase'
import { SectionTitle, GlassCard, PixelButton } from '..'

gsap.registerPlugin(ScrollTrigger)

// Fallback services if Firestore fails
const FALLBACK_SERVICES = [
  {
    id: 'web-development',
    icon: '💻',
    title: 'Web Development',
    description: 'Full-stack web applications with Laravel + React + Inertia.js architecture.',
    features: ['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'Firebase'],
    color: '#00d4ff',
    ctaText: 'START PROJECT',
    slug: 'web-development'
  },
  {
    id: 'ui-ux-design',
    icon: '🎨', 
    title: 'UI/UX Design',
    description: 'User-centered interfaces with Figma prototypes, design systems, and modern aesthetics.',
    features: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
    color: '#9d4edd',
    ctaText: 'VIEW PROCESS',
    slug: 'ui-ux-design'
  },
  {
    id: 'mobile-apps',
    icon: '📱',
    title: 'Mobile Development',
    description: 'Native Android apps with Java and cross-platform solutions using React Native.',
    features: ['Java', 'React Native', 'Firebase', 'Play Store Ready'],
    color: '#39ff14',
    ctaText: 'DISCUSS APP',
    slug: 'mobile-apps'
  }
]

/**
 * ServicesSection - Freelance services showcase
 * 
 * Fetches services from Firestore with fallback to hardcoded data.
 */
export default function ServicesSection() {
  const sectionRef = useRef(null)
  const cardsRef = useRef(null)
  const [services, setServices] = useState(FALLBACK_SERVICES)

  // Fetch services from Firestore
  useEffect(() => {
    async function fetchServices() {
      try {
        const servicesRef = collection(db, 'services')
        const q = query(
          servicesRef, 
          where('active', '==', true),
          orderBy('order', 'asc')
        )
        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
          const servicesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setServices(servicesData)
        }
      } catch (error) {
        console.warn('Firestore fetch failed, using fallback services:', error.message)
      }
    }
    fetchServices()
  }, [])

  // Simplified animation for better INP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Use requestAnimationFrame to not block main thread
      requestAnimationFrame(() => {
        ScrollTrigger.batch('.service-card', {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              overwrite: true,
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
    <section id="services" ref={sectionRef} className="services-section">
      <style>{`
        .services-section {
          min-height: 100vh;
          padding: 6rem 2rem;
          position: relative;
        }
        
        .services-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .services-intro {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 3rem;
        }
        
        .services-intro p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .services-intro .highlight {
          color: #00d4ff;
          font-weight: 600;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        
        .service-card {
          position: relative;
          padding: 2rem !important;
          text-align: center;
          overflow: hidden;
        }
        
        .service-card.coming-soon {
          opacity: 0.6;
        }
        
        .service-card.coming-soon::after {
          content: 'COMING SOON';
          position: absolute;
          top: 1rem;
          right: -2rem;
          background: #ff6b35;
          color: #0a0a12;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.5rem;
          padding: 0.3rem 2rem;
          transform: rotate(45deg);
        }
        
        .service-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }
        
        .service-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          color: white;
        }
        
        .service-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .service-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .service-feature {
          padding: 0.3rem 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .service-cta {
          margin-top: auto;
        }
        
        .services-footer {
          text-align: center;
          margin-top: 3rem;
          padding: 2rem;
          background: rgba(0, 212, 255, 0.05);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 12px;
        }
        
        .services-footer p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .services-footer .pixel-font {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #00d4ff;
        }
        
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
          
          .service-title {
            font-size: 0.75rem;
          }
        }
      `}</style>
      
      <div className="services-container">
        <SectionTitle title="SERVICES" extension=".hire" />
        
        <div className="services-intro">
          <p>
            Currently a <span className="highlight">student freelancer</span> passionate about 
            crafting digital experiences. Let's build something awesome together!
          </p>
        </div>
        
        <div ref={cardsRef} className="services-grid">
          {services.map((service) => (
            <GlassCard 
              key={service.id} 
              className="service-card"
            >
              <span className="service-icon">{service.icon}</span>
              <h3 className="service-title" style={{ color: service.color }}>
                {service.title}
              </h3>
              <p className="service-description">{service.description}</p>
              <div className="service-features">
                {(service.features || service.tech || []).map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="service-feature"
                    style={{ borderColor: `${service.color}40` }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <div className="service-cta">
                <Link to={`/services/${service.slug || service.id}`} style={{ textDecoration: 'none' }}>
                  <PixelButton size="small">
                    {service.ctaText || 'LEARN MORE'}
                  </PixelButton>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
        
        <div className="services-footer">
          <p>Interested in working together?</p>
          <p className="pixel-font">📩 Contact me for project discussion & pricing</p>
        </div>
      </div>
    </section>
  )
}
