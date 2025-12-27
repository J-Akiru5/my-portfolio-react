import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, SkillCard, CatIcon } from '..'

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
    { name: 'Laravel / PHP', level: '89%', color: '#FF2D20', icon: '🔥', featured: true },
    { name: 'Supabase / PostgreSQL / MySQL', level: '88%', color: '#3ECF8E', icon: '🗄️' },
    { name: 'Bootstrap', level: '87%', color: '#7952B3', icon: '🎨' },
    { name: 'Firebase', level: '86%', color: '#FFCA28', icon: '☁️' },
    { name: 'Windows / C#', level: '85%', color: '#9B4F96', icon: '🖥️' },
    { name: 'Android / Java', level: '83%', color: '#3DDC84', icon: '📱' },
    { name: 'React / Native', level: '79%', color: '#61DAFB', icon: '⚛️' },
    { name: 'Tailwind', level: '73%', color: '#38B2AC', icon: '💨' },
    { name: 'Python / Data', level: '67%', color: '#3776AB', icon: '🐍' },
  ]

  const aiTools = [
    { name: 'GitHub Copilot', icon: <CatIcon /> },
    { name: 'Antigravity', icon: '🚀' },
    { name: 'Claude', icon: '🧠' },
    { name: 'Gemini', icon: '✨' },
    { name: 'ChatGPT', icon: '🤖' },
  ]

  const [activeHobby, setActiveHobby] = useState(null)
  // Holo-Projector Experimental Refinement
  const monitorRef = useRef(null)
  const monitorContentRef = useRef(null)
  const timeoutRef = useRef(null)

  const handleMouseEnter = (hobby) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveHobby(hobby)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveHobby(null)
    }, 500)
  }

  const hobbies = [
    { id: 'ui', label: 'UI Design', icon: '🎨', color: '#F472B6', desc: 'Designing intuitive interfaces with pixel-perfect precision.' },
    { id: 'music', label: 'Music Production', icon: '🎵', color: '#A78BFA', desc: 'Composing electronic beats and soundscapes.' },
    { id: 'film', label: 'Filmmaking', icon: '🎬', color: '#34D399', desc: 'Directing visual stories and cinematic experiences.' },
    { id: 'ai', label: 'AI Agents', icon: '🤖', color: '#60A5FA', desc: 'Building intelligent autonomous systems.' },
    { id: 'gaming', label: 'Gaming', icon: '🎮', color: '#F59E0B', desc: 'Interactive entertainment and game mechanics.' },
    { id: 'animation', label: 'Animation', icon: '🎞️', color: '#EF4444', desc: 'Motion graphics and 2D/3D storytelling.' },
    { id: 'photo', label: 'Cinematography', icon: '📷', color: '#06B6D4', desc: 'Visual composition and lighting design.' },
  ]

  // Holo-Monitor Animation
  useEffect(() => {
    if (activeHobby && monitorContentRef.current) {
      gsap.fromTo(monitorContentRef.current,
        { opacity: 0, scale: 0.95, filter: 'blur(5px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [activeHobby])

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
        
        /* Holo-Projector Styles */
        .holo-container {
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }

        .holo-layout {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 1rem;
        }

        @media (min-width: 768px) {
          .holo-layout {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        .control-panel {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-content: flex-start;
        }

        .data-cartridge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .data-cartridge:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .data-cartridge.active {
          background: rgba(0, 0, 0, 0.8);
          border-color: var(--glow-color);
          box-shadow: 0 0 15px var(--glow-color), inset 0 0 10px rgba(0,0,0,0.5);
          color: white;
          text-shadow: 0 0 5px var(--glow-color);
        }

        .holo-monitor {
          width: 100%;
          height: 250px;
          background: #050508;
          border: 2px solid rgba(0, 212, 255, 0.2);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .holo-monitor {
            flex: 1;
            height: auto;
            min-height: 350px;
            align-self: stretch;
          }
        }

        .crt-overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 10;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
        }

        .monitor-content {
          padding: 2rem;
          text-align: center;
          position: relative;
          z-index: 5;
          width: 100%;
        }

        .standby-mode {
          color: rgba(0, 212, 255, 0.4);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.6;
          animation: pulse-glow 2s infinite;
        }

        .display-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
        }

        .display-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .display-desc {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .skills-bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        
        @media (max-width: 768px) {
          .skills-bento {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 500px) {
          .skills-bento {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      {/* Parallax layers */}
      <div ref={layer1Ref} className="parallax-layer layer-1" />
      <div ref={layer2Ref} className="parallax-layer layer-2" />
      
      <div className="about-container">
        <SectionTitle title="ABOUT" extension=".me" />
        
        <div ref={contentRef} className="bento-grid">
          {/* AI TOOLKIT - Full Width */}
          <GlassCard className="about-card card-span-12">
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
          
          {/* SKILLS - Full Width Bento Grid */}
          <GlassCard className="about-card card-span-12">
            <h3 className="card-header">💻 SKILL_MATRIX</h3>
            <div className="skills-bento">
              {skills.map((skill) => (
                <SkillCard 
                  key={skill.name} 
                  name={skill.name} 
                  level={skill.level} 
                  color={skill.color}
                  icon={skill.icon}
                  featured={skill.featured}
                />
              ))}
            </div>
          </GlassCard>
          
          {/* HOBBIES - Holo-Projector */}
          <GlassCard className="about-card card-span-12 holo-container">
            <h3 className="card-header">🎮 HOBBIES & INTERESTS</h3>
            
            <div className="holo-layout">
              {/* Control Panel */}
              <div className="control-panel">
                {hobbies.map((hobby) => (
                  <button
                    key={hobby.id}
                    className={`data-cartridge ${activeHobby?.id === hobby.id ? 'active' : ''}`}
                    onMouseEnter={() => handleMouseEnter(hobby)}
                    onMouseLeave={handleMouseLeave}
                    style={{ '--glow-color': hobby.color }}
                  >
                    <span className="cartridge-icon">{hobby.icon}</span>
                    <span className="cartridge-label">{hobby.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Holo Monitor */}
              <div className="holo-monitor" ref={monitorRef}>
                <div className="crt-overlay" />
                <div className="monitor-content" ref={monitorContentRef}>
                  {!activeHobby ? (
                    <div className="standby-mode">
                      [ WAITING_FOR_INPUT ]<br/>
                      &gt; HOVER_MODULE_TO_PREVIEW<br/>
                      <span className="typing-cursor">_</span>
                    </div>
                  ) : (
                    <div className="active-display">
                      <span className="display-icon">{activeHobby.icon}</span>
                      <h4 className="display-title" style={{ color: activeHobby.color, textShadow: `0 0 10px ${activeHobby.color}` }}>
                        {activeHobby.label}
                      </h4>
                      <p className="display-desc">{activeHobby.desc}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
