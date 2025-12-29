import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase'
import { SectionTitle, GlassCard } from '..'

gsap.registerPlugin(ScrollTrigger)

/**
 * TestimonialsSection - Client testimonials for social proof
 * 
 * Fetches from Firestore `testimonials` collection with fallback data.
 */

const FALLBACK_TESTIMONIALS = [
  {
    id: 'placeholder-1',
    quote: 'We\'re gathering testimonials from our amazing clients. Check back soon!',
    clientName: 'Your Name Here',
    clientRole: 'Future Client',
    clientCompany: 'Your Company',
    avatar: null,
    rating: 5
  }
]

export default function TestimonialsSection() {
  const sectionRef = useRef(null)
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS)

  // Fetch testimonials from Firestore
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const testimonialsRef = collection(db, 'testimonials')
        const q = query(
          testimonialsRef,
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setTestimonials(data)
        }
      } catch (error) {
        console.warn('Using fallback testimonials:', error.message)
      }
    }
    fetchTestimonials()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.batch('.testimonial-card', {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.5
            })
          },
          start: 'top 85%'
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="testimonials-section">
      <style>{`
        .testimonials-section {
          padding: 6rem 2rem;
          position: relative;
        }

        .testimonials-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .testimonial-card {
          opacity: 0;
          transform: translateY(20px);
          padding: 2rem !important;
          text-align: center;
        }

        .testimonial-quote {
          font-size: 1rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 1.5rem;
          font-style: italic;
          position: relative;
        }

        .testimonial-quote::before {
          content: '"';
          font-size: 3rem;
          color: #00d4ff;
          position: absolute;
          top: -1rem;
          left: -0.5rem;
          opacity: 0.3;
          font-family: Georgia, serif;
        }

        .testimonial-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 0 auto 1rem;
          border: 2px solid #00d4ff;
          object-fit: cover;
        }

        .testimonial-avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, #00d4ff, #9d4edd);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .testimonial-name {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #39ff14;
          margin-bottom: 0.25rem;
        }

        .testimonial-role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .testimonial-company {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #00d4ff;
        }

        .testimonial-rating {
          margin-bottom: 1rem;
          color: #ffc107;
          font-size: 1.2rem;
          letter-spacing: 2px;
        }

        @media (max-width: 768px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="testimonials-container">
        <SectionTitle title="TESTIMONIALS" extension=".trust" />

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <GlassCard key={testimonial.id} className="testimonial-card">
              {testimonial.rating && (
                <div className="testimonial-rating">
                  {'★'.repeat(testimonial.rating)}
                  {'☆'.repeat(5 - testimonial.rating)}
                </div>
              )}

              <p className="testimonial-quote">{testimonial.quote}</p>

              {testimonial.avatar ? (
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.clientName}
                  className="testimonial-avatar"
                />
              ) : (
                <div className="testimonial-avatar-placeholder">
                  {testimonial.clientName?.charAt(0) || '?'}
                </div>
              )}

              <p className="testimonial-name">{testimonial.clientName}</p>
              {testimonial.clientRole && (
                <p className="testimonial-role">{testimonial.clientRole}</p>
              )}
              {testimonial.clientCompany && (
                <p className="testimonial-company">{testimonial.clientCompany}</p>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
