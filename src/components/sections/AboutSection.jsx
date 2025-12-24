import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, SkillBar } from '../ui'

gsap.registerPlugin(ScrollTrigger)

/**
 * AboutSection - Parallax multi-layer section
 * 
 * Features parallax scrolling with multiple speed layers
 * and the Bento grid layout for skills.
 */
export default function AboutSection() {
  const sectionRef = useRef(null)
  const layer1Ref = useRef(null)
  const layer2Ref = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax layers at different speeds
      gsap.to(layer1Ref.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      })

      gsap.to(layer2Ref.current, {
        y: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      })

      // Content reveal
      gsap.from('.about-card', {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const skills = [
    { name: 'React / Next.js', level: 90, color: '#00d4ff' },
    { name: 'Laravel / PHP', level: 85, color: '#ff6b35' },
    { name: 'Python / AI', level: 80, color: '#39ff14' },
    { name: 'Firebase / Node', level: 75, color: '#9d4edd' },
  ]

  const aiTools = [
    { name: 'ChatGPT', icon: '🤖' },
    { name: 'Claude', icon: '🧠' },
    { name: 'Gemini', icon: '✨' },
    { name: 'Cursor', icon: '⚡' },
    { name: 'GitHub Copilot', icon: '🐙' },
    { name: 'Midjourney', icon: '🎨' },
  ]

  const hobbies = ['Gaming 🎮', 'Music Production 🎵', 'UI Design 🖌️', 'Tech Blogging ✍️']

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <style>{`
        .about-section {
          min-height: 100vh;
          padding: 6rem 2rem;
          position: relative;
          overflow: hidden;
        }
        
        .parallax-layer {
          position: absolute;
          pointer-events: none;
        }
        
        .layer-1 {
          top: 10%;
          left: 5%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
        }
        
        .layer-2 {
          bottom: 20%;
          right: 10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.08) 0%, transparent 70%);
          border-radius: 50%;
        }
        
        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.25rem;
          margin-top: 3rem;
        }
        
        .about-card {
          padding: 1.5rem !important;
        }
        
        .card-span-8 { grid-column: span 8; }
        .card-span-4 { grid-column: span 4; }
        .card-span-6 { grid-column: span 6; }
        .card-span-12 { grid-column: span 12; }
        
        @media (max-width: 900px) {
          .card-span-8, .card-span-4, .card-span-6 {
            grid-column: span 12;
          }
        }
        
        .card-header {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #00d4ff;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .about-text {
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.85);
        }
        
        .about-text a {
          color: #39ff14;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        
        .about-text a:hover {
          color: #00d4ff;
        }
        
        .skills-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .ai-tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        
        .ai-tool {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          font-size: 0.75rem;
          text-align: center;
          transition: all 0.3s;
        }
        
        .ai-tool:hover {
          background: rgba(0, 212, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .ai-tool-icon {
          font-size: 1.5rem;
        }
        
        .hobbies-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        
        .hobby-tag {
          padding: 0.5rem 1rem;
          background: rgba(157, 78, 221, 0.15);
          border: 1px solid rgba(157, 78, 221, 0.3);
          border-radius: 20px;
          font-size: 0.85rem;
          color: #9d4edd;
        }
      `}</style>
      
      {/* Parallax layers */}
      <div ref={layer1Ref} className="parallax-layer layer-1" />
      <div ref={layer2Ref} className="parallax-layer layer-2" />
      
      <div className="about-container">
        <SectionTitle title="ABOUT" extension=".me" />
        
        <div ref={contentRef} className="bento-grid">
          {/* WHO AM I - Large Card */}
          <GlassCard className="about-card card-span-8">
            <h3 className="card-header">📁 WHO_AM_I</h3>
            <p className="about-text">
              Third-year IT student at ISUFST and President of the{' '}
              <a href="https://sineai.tech" target="_blank" rel="noopener noreferrer">
                Sine AI Guild of Western Visayas
              </a>. 
              Passionate about blending AI technology with creative development to build 
              innovative solutions. I specialize in full-stack web development with a 
              focus on modern frameworks and AI-powered applications.
            </p>
          </GlassCard>
          
          {/* AI TOOLKIT - Small Card */}
          <GlassCard className="about-card card-span-4">
            <h3 className="card-header">🤖 AI_TOOLKIT</h3>
            <div className="ai-tools-grid">
              {aiTools.map((tool) => (
                <div key={tool.name} className="ai-tool">
                  <span className="ai-tool-icon">{tool.icon}</span>
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          
          {/* SKILLS - Half Card */}
          <GlassCard className="about-card card-span-6">
            <h3 className="card-header">💻 SKILLS</h3>
            <div className="skills-list">
              {skills.map((skill) => (
                <SkillBar 
                  key={skill.name} 
                  name={skill.name} 
                  level={skill.level} 
                  color={skill.color}
                />
              ))}
            </div>
          </GlassCard>
          
          {/* HOBBIES - Half Card */}
          <GlassCard className="about-card card-span-6">
            <h3 className="card-header">🎮 HOBBIES</h3>
            <div className="hobbies-list">
              {hobbies.map((hobby) => (
                <span key={hobby} className="hobby-tag">{hobby}</span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
