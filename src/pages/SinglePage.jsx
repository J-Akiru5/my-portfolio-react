import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  HeroSection,
  ProductsSection,
  ServicesSection,
  ProjectsSection,
  TestimonialsSection,
  AboutSection,
  StorySection,
  CertificatesSection,
  ContactSection,
} from '../components/ui/sections'
import Footer from '../components/Footer'
import Seo from '../components/Seo'

gsap.registerPlugin(ScrollTrigger)

/**
 * SinglePage - Main one-page portfolio layout
 * 
 * Startup-optimized section order:
 * Hero → Products → Services → Portfolio → Testimonials → About → Contact
 */
export default function SinglePage() {
  useEffect(() => {
    // Refresh ScrollTrigger after component mounts
    ScrollTrigger.refresh()

    // Smooth scroll for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]')
      if (target) {
        e.preventDefault()
        const id = target.getAttribute('href').slice(1)
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div className="single-page">
      <Seo 
        title="JeffDev Studio | Enterprise Web Development"
        description="We build digital products that scale. Enterprise web development, SaaS platforms, and digital innovation. DTI Registered: VLLP979818395984"
      />
      <style>{`
        .single-page {
          overflow-x: hidden;
        }
        
        /* Smooth scroll progress indicator */
        .scroll-progress {
          position: fixed;
          top: 60px;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 100;
        }
        
        .scroll-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #00d4ff, #39ff14);
          width: 0%;
          transition: width 0.1s;
        }
        
        /* Section dividers */
        .section-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg, 
            transparent 0%, 
            rgba(0, 212, 255, 0.3) 20%, 
            rgba(57, 255, 20, 0.3) 80%, 
            transparent 100%
          );
          margin: 2rem 0;
        }
      `}</style>
      
      {/* Scroll Progress */}
      <div className="scroll-progress">
        <div 
          className="scroll-progress-bar" 
          id="scroll-progress-bar"
        />
      </div>
      
      {/* Sections - Startup Optimized Order */}
      <HeroSection />
      <ProductsSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <AboutSection />
      <StorySection />
      <CertificatesSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
