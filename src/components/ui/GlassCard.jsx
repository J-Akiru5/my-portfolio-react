import React from 'react';

/**
 * GlassCard Component
 * 
 * Glassmorphism card with backdrop blur.
 */
const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default', // 'default' | 'strong'
  hoverEffect = true,
  ...props 
}) => {
  const baseClass = variant === 'strong' ? 'glass-card-strong' : 'glass-card';
  
  return (
    <div 
      className={`${baseClass} ${className}`}
      style={{
        padding: '1.5rem',
        transition: hoverEffect ? 'transform 0.3s ease, box-shadow 0.3s ease' : 'none',
      }}
      onMouseEnter={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 212, 255, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
