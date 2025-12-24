import React from 'react';

/**
 * SkillBar Component
 * 
 * Retro-styled skill progress bar with pixelated fill.
 */
const SkillBar = ({ 
  name, 
  level, 
  color = '#00d4ff' // electric blue default
}) => {
  return (
    <div className="skill-bar-wrapper" style={{ marginBottom: '1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <span style={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9rem',
          fontFamily: "'Space Grotesk', sans-serif"
        }}>
          {name}
        </span>
        <span style={{ 
          color: color,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem'
        }}>
          {level}%
        </span>
      </div>
      <div className="skill-bar">
        <div 
          className="skill-bar-fill"
          style={{ 
            width: `${level}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
