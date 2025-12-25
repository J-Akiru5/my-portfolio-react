import React, { useRef, useState } from 'react'

/**
 * SkillCard - Interactive 3D skill card
 * 
 * Features:
 * - 3D tilt on hover (desktop)
 * - Flip to reveal bar on tap (mobile)
 * - Proficiency badge (ARCHITECT/SPECIALIST/INTERMEDIATE)
 */
export default function SkillCard({ 
  name, 
  level, 
  color, 
  icon,
  featured = false,
  className = '' 
}) {
  const cardRef = useRef(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  // Get proficiency level
  const getProficiency = (percent) => {
    const num = parseInt(percent)
    if (num >= 85) return { label: 'ARCHITECT', color: '#ffd700' }
    if (num >= 70) return { label: 'SPECIALIST', color: '#00d4ff' }
    return { label: 'INTERMEDIATE', color: '#39ff14' }
  }

  const proficiency = getProficiency(level)

  // Handle mouse move for 3D tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10
    
    setTilt({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const handleClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div 
      ref={cardRef}
      className={`skill-card ${featured ? 'featured' : ''} ${isFlipped ? 'flipped' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        '--rotateX': `${tilt.x}deg`,
        '--rotateY': `${tilt.y}deg`,
        '--skill-color': color,
        '--proficiency-color': proficiency.color,
      }}
    >
      <style>{`
        .skill-card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out, box-shadow 0.3s, border-color 0.3s;
          perspective: 1000px;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .skill-card:hover {
          transform: perspective(1000px) rotateX(var(--rotateX)) rotateY(var(--rotateY));
          border-color: var(--skill-color);
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.3),
            0 0 20px color-mix(in srgb, var(--skill-color) 30%, transparent);
        }
        
        .skill-card.featured {
          grid-column: span 2;
          min-height: 140px;
        }
        
        @media (max-width: 768px) {
          .skill-card.featured {
            grid-column: span 1;
          }
        }
        
        .skill-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .skill-card.flipped .skill-card-inner {
          transform: rotateY(180deg);
        }
        
        .skill-front, .skill-back {
          backface-visibility: hidden;
        }
        
        .skill-back {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .skill-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        
        .skill-icon {
          font-size: 1.75rem;
          line-height: 1;
        }
        
        .skill-card.featured .skill-icon {
          font-size: 2.25rem;
        }
        
        .skill-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.55rem;
          font-family: 'Press Start 2P', cursive;
          background: color-mix(in srgb, var(--proficiency-color) 15%, transparent);
          color: var(--proficiency-color);
          border: 1px solid var(--proficiency-color);
          white-space: nowrap;
        }
        
        .skill-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.5rem;
        }
        
        .skill-card.featured .skill-name {
          font-size: 1.1rem;
        }
        
        .skill-bar-container {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-top: auto;
        }
        
        .skill-bar-fill {
          height: 100%;
          border-radius: 3px;
          background: var(--skill-color);
          transition: width 1s ease-out;
          position: relative;
        }
        
        .skill-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .skill-percent {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-align: right;
          margin-top: 0.35rem;
        }
        
        .skill-back-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.65rem;
          color: var(--skill-color);
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .skill-back-percent {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.5rem;
          color: white;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .tap-hint {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.3);
          font-family: 'JetBrains Mono', monospace;
        }
        
        @media (min-width: 769px) {
          .tap-hint { display: none; }
        }
      `}</style>
      
      <div className="skill-card-inner">
        {/* Front of card */}
        <div className="skill-front">
          <div className="skill-header">
            <span className="skill-icon">{icon}</span>
            <span className="skill-badge">{proficiency.label}</span>
          </div>
          <div className="skill-name">{name}</div>
          <div className="skill-bar-container">
            <div 
              className="skill-bar-fill" 
              style={{ width: level }}
            />
          </div>
          <div className="skill-percent">{level}</div>
        </div>
        
        {/* Back of card (shown on flip) */}
        <div className="skill-back">
          <div className="skill-back-title">{name}</div>
          <div className="skill-back-percent">{level}</div>
          <div className="skill-badge" style={{ alignSelf: 'center' }}>
            {proficiency.label}
          </div>
        </div>
      </div>
      
      <span className="tap-hint">TAP</span>
    </div>
  )
}
