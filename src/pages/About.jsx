import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, SkillBar } from '../components/ui'

gsap.registerPlugin(ScrollTrigger)

/**
 * About Page
 * 
 * Bento grid layout with WHO_AM_I, SKILLS, AI_TOOLKIT, and HOBBIES sections.
 */

const skills = [
  { name: 'React', level: 85, color: '#00d4ff' },
  { name: 'Node.js', level: 75, color: '#39ff14' },
  { name: 'Laravel', level: 70, color: '#ff6b35' },
  { name: 'Firebase', level: 80, color: '#9d4edd' },
]

const aiTools = [
  { name: 'Claude Opus', icon: '▶' },
  { name: 'Gemini Pro', icon: '▶' },
  { name: 'GPT-4', icon: '▶' },
  { name: 'GitHub Copilot', icon: '▶' },
]

const hobbies = [
  'Beatboxing',
  'Swimming',
  'Calisthenics',
  'Gaming',
  'Music Production',
]

export default function About() {
  const pageRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.bento-card')
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="about-page" ref={pageRef}>
      <style>{`
        .about-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto auto;
          gap: 1.5rem;
          margin-top: 3rem;
        }
        
        .bento-card {
          padding: 1.5rem;
        }
        
        .bento-card.who-am-i {
          grid-column: 1;
          grid-row: 1;
        }
        
        .bento-card.skills {
          grid-column: 2;
          grid-row: 1;
        }
        
        .bento-card.ai-toolkit {
          grid-column: 3;
          grid-row: 1;
        }
        
        .bento-card.hobbies {
          grid-column: 1 / -1;
          grid-row: 2;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .card-header-icon {
          color: #39ff14;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .card-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.75rem;
          color: #39ff14;
          text-transform: uppercase;
        }
        
        .card-content p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
        }
        
        .ai-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .ai-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
          font-family: 'Space Grotesk', sans-serif;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .ai-list li .icon {
          color: #00d4ff;
          font-size: 0.8rem;
        }
        
        .hobbies-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        
        .hobby-tag {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
        }
        
        .hobby-tag:hover {
          border-color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
        }
        
        /* Responsive */
        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .bento-card.who-am-i {
            grid-column: 1 / -1;
          }
          
          .bento-card.skills {
            grid-column: 1;
            grid-row: 2;
          }
          
          .bento-card.ai-toolkit {
            grid-column: 2;
            grid-row: 2;
          }
          
          .bento-card.hobbies {
            grid-column: 1 / -1;
            grid-row: 3;
          }
        }
        
        @media (max-width: 600px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
          
          .bento-card.skills,
          .bento-card.ai-toolkit {
            grid-column: 1;
          }
          
          .bento-card.skills {
            grid-row: 2;
          }
          
          .bento-card.ai-toolkit {
            grid-row: 3;
          }
          
          .bento-card.hobbies {
            grid-row: 4;
          }
        }
      `}</style>
      
      {/* Page Title */}
      <SectionTitle title="ABOUT" extension=".exe" />
      
      {/* Bento Grid */}
      <div className="bento-grid" ref={cardsRef}>
        {/* WHO_AM_I */}
        <GlassCard className="bento-card who-am-i">
          <div className="card-header">
            <span className="card-header-icon">&gt;</span>
            <h3 className="card-title">WHO_AM_I</h3>
          </div>
          <div className="card-content">
            <p>
              Third-year IT student at ISUFST and President of the SineAI Guild. 
              Passionate about blending AI technology with creative development 
              to build innovative solutions.
            </p>
          </div>
        </GlassCard>
        
        {/* SKILLS */}
        <GlassCard className="bento-card skills">
          <div className="card-header">
            <span className="card-header-icon">&gt;</span>
            <h3 className="card-title">SKILLS</h3>
          </div>
          <div className="card-content">
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
        
        {/* AI_TOOLKIT */}
        <GlassCard className="bento-card ai-toolkit">
          <div className="card-header">
            <span className="card-header-icon">&gt;</span>
            <h3 className="card-title">AI_TOOLKIT</h3>
          </div>
          <div className="card-content">
            <ul className="ai-list">
              {aiTools.map((tool) => (
                <li key={tool.name}>
                  <span className="icon">{tool.icon}</span>
                  {tool.name}
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
        
        {/* HOBBIES */}
        <GlassCard className="bento-card hobbies">
          <div className="card-header">
            <span className="card-header-icon">◆</span>
            <h3 className="card-title">HOBBIES</h3>
          </div>
          <div className="hobbies-grid">
            {hobbies.map((hobby) => (
              <span key={hobby} className="hobby-tag">{hobby}</span>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
