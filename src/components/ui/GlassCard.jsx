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
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
