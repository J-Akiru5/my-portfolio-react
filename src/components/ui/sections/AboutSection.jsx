import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, CatIcon, PixelButton } from '..'

gsap.registerPlugin(ScrollTrigger)

/**
 * AboutSection - Refactored for B2B Startup Vibe
 * 
 * Structure:
 * 1. ABOUT.studio (Company Mission)
 * 2. FOUNDER.log (RPG Character Sheet)
 * 3. TECH_STACK (Architecture Layers - No percentages)
 */
export default function AboutSection() {
  const sectionRef = useRef(null)
  const layer1Ref = useRef(null)
  const layer2Ref = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax layers
      gsap.to(layer1Ref.current, {
        y: -100, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      })

      gsap.to(layer2Ref.current, {
        y: -200, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      })

      // Content reveal
      gsap.from('.about-card', {
        opacity: 0, y: 60, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: contentRef.current, start: 'top 80%' }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Tech Stack - Architecture Layers
  const techStack = [
    {
      layer: 'LAYER 1: CORE ENGINE',
      color: '#00d4ff',
      tools: [
        { name: 'React', icon: '⚛️' },
        { name: 'Vite', icon: '⚡' },
        { name: 'Node.js', icon: '🟢' },
        { name: 'TypeScript', icon: '📘' }
      ]
    },
    {
      layer: 'LAYER 2: CLOUD INFRASTRUCTURE',
      color: '#FFCA28',
      tools: [
        { name: 'AWS', icon: '☁️' },
        { name: 'Firebase', icon: '🔥' },
        { name: 'Supabase', icon: '🟩' },
        { name: 'Vercel', icon: '▲' }
      ]
    },
    {
      layer: 'LAYER 3: BACKEND LOGIC',
      color: '#FF2D20',
      tools: [
        { name: 'Laravel', icon: '🐘' },
        { name: 'Python', icon: '🐍' },
        { name: 'C# / .NET', icon: '🖥️' },
        { name: 'SQL', icon: '🗄️' }
      ]
    },
    {
      layer: 'LAYER 4: AI & GENERATIVE',
      color: '#9d4edd',
      tools: [
        { name: 'Claude AI', icon: '🧠' },
        { name: 'Gemini', icon: '✨' },
        { name: 'OpenAI', icon: '🤖' },
        { name: 'GitHub Copilot', icon: <CatIcon /> }
      ]
    }
  ]

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <style>{`
        .about-section {
          min-height: 100vh;
          padding: 6rem 2rem;
          position: relative;
          overflow: hidden;
        }
        
        .parallax-layer { position: absolute; pointer-events: none; }
        .layer-1 {
          top: 10%; left: 5%; width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
        }
        .layer-2 {
          bottom: 20%; right: 10%; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.08) 0%, transparent 70%);
          border-radius: 50%;
        }
        
        .about-container { max-width: 1000px; margin: 0 auto; position: relative; z-index: 1; }
        .about-grid { display: flex; flex-direction: column; gap: 4rem; margin-top: 3rem; }
        
        /* ABOUT.studio */
        .studio-mission {
          text-align: center;
          font-size: 1.2rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
          max-width: 800px;
          margin: 0 auto;
        }
        .studio-mission .highlight { color: #39ff14; font-weight: bold; }
        
        /* FOUNDER.log - RPG Card */
        .founder-card {
           border: 2px solid #39ff14;
           background: rgba(0, 0, 0, 0.8);
           box-shadow: 4px 4px 0px 0px rgba(57, 255, 20, 1);
           display: flex;
           flex-direction: column;
           gap: 2rem;
           padding: 2rem;
        }
        
        @media (min-width: 768px) {
          .founder-card { flex-direction: row; align-items: center; }
        }

        .founder-avatar-wrapper { position: relative; flex-shrink: 0; }
        .founder-avatar {
          width: 140px; height: 140px;
          border: 2px solid #39ff14;
          filter: grayscale(100%);
          transition: filter 0.3s;
          object-fit: cover;
        }
        .founder-avatar:hover { filter: grayscale(0%); }
        
        .level-badge {
          position: absolute; bottom: -10px; right: -10px;
          background: #39ff14; color: black;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem; padding: 4px 8px;
          font-weight: bold;
        }

        .founder-info h3 {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.2rem; color: #fff; margin-bottom: 0.5rem;
        }
        
        .founder-role {
          font-family: 'JetBrains Mono', monospace;
          color: #39ff14; font-size: 0.8rem; margin-bottom: 1.5rem;
          text-transform: uppercase; letter-spacing: 1px;
        }

        .founder-bio {
          font-size: 0.95rem; line-height: 1.6; color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
        }
        
        .founder-stats {
          display: flex; gap: 1.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
        }
        .stat-label { color: rgba(255, 255, 255, 0.5); margin-right: 0.5rem; }
        .stat-value { color: #00d4ff; }

        /* TECH_STACK */
        .tech-stack-container { display: grid; gap: 1.5rem; }
        
        .tech-layer {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 8px;
        }
        
        .layer-header {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem; margin-bottom: 1rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        
        .layer-tools {
          display: flex; flex-wrap: wrap; gap: 1rem;
        }
        
        .tech-tool {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.5rem 0.8rem;
          border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
      
      {/* Parallax layers */}
      <div ref={layer1Ref} className="parallax-layer layer-1" />
      <div ref={layer2Ref} className="parallax-layer layer-2" />
      
      <div className="about-container">
        
        <div ref={contentRef} className="about-grid">
          
          {/* 1. ABOUT.studio */}
          <div className="about-card studio-mission">
            <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem', color: '#00d4ff', marginBottom: '1.5rem' }}>ABOUT.studio</h2>
            <p>
              JeffDev Studio is a <span className="highlight">cloud-native development shop</span> based in Iloilo. 
              We specialize in building high-performance B2B platforms using the same tech stack as Silicon Valley unicorns.
            </p>
          </div>

          {/* 2. FOUNDER.log */}
          <div className="about-card">
             <div className="founder-card">
               <div className="founder-avatar-wrapper">
                 <img src="/assets/profilepic.jpg" alt="Founder" className="founder-avatar" />
                 <div className="level-badge">LVL. 99</div>
               </div>
               
               <div className="founder-info">
                 <h3>JEFF EDRICK MARTINEZ</h3>
                 <p className="founder-role">// Lead Architect & Founder</p>
                 
                 <p className="founder-bio">
                   Bridging the gap between 8-bit nostalgia and <span style={{color: 'white'}}>enterprise cloud architecture</span>. 
                   Jeff architects the <strong>Vibecoder Engine</strong>, a proprietary SaaS for rapid UI deployment, 
                   helping businesses automate workflows and dominate their niche.
                 </p>
                 
                 <div className="founder-stats">
                    <div><span className="stat-label">CLASS:</span><span className="stat-value">Principal Architect</span></div>
                    <div><span className="stat-label">GUILD:</span><span className="stat-value">JeffDev Studio</span></div>
                    <div><span className="stat-label">STATUS:</span><span style={{color:'#39ff14'}}>ONLINE / BUILDING</span></div>
                 </div>
               </div>
             </div>
          </div>

          {/* 3. TECH_STACK */}
          <div className="about-card tech-stack-container">
            <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem', color: '#9d4edd', marginBottom: '0.5rem' }}>TECH_STACK</h2>
            
            {techStack.map((layer) => (
              <div key={layer.layer} className="tech-layer">
                <h4 className="layer-header" style={{ color: layer.color }}>{layer.layer}</h4>
                <div className="layer-tools">
                  {layer.tools.map((tool) => (
                    <div key={tool.name} className="tech-tool">
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
