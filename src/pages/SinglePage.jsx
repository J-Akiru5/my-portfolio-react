import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  HeroSection,
  AboutSection,
  StorySection,
  ProjectsSection,
  CertificatesSection,
  ServicesSection,
  ContactSection,
} from '../components/ui/sections'
import Seo from '../components/Seo'

gsap.registerPlugin(ScrollTrigger)

/**
 * SinglePage - Main one-page portfolio layout
 * 
 * Combines all sections with smooth scroll and GSAP animations.
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
        title="JeffDev Studio | Vibecoder Developer"
        description="Portfolio of Jeff Martinez - Specializing in High-Performance Web Applications, React Architecture, and 8-bit aesthetic designs."
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
      
      {/* Sections */}
      <HeroSection />
      <AboutSection />
      <StorySection />
      <ProjectsSection />
      <CertificatesSection />
      <ServicesSection />
      <ContactSection />
    </div>
  )
}
