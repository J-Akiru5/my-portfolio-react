import React from 'react';

/**
 * PixelButton Component
 * 
 * Retro 8-bit styled button with hover effects.
 */
const PixelButton = ({ 
  children, 
  variant = 'outline', // 'outline' | 'filled'
  color = 'electric', // 'electric' | 'matrix' | 'sunset'
  href,
  onClick,
  className = '',
  ...props 
}) => {
  const colorMap = {
    electric: {
      border: '#00d4ff',
      bg: '#00d4ff',
      hover: 'rgba(0, 212, 255, 0.4)',
    },
    matrix: {
      border: '#39ff14',
      bg: '#39ff14',
      hover: 'rgba(57, 255, 20, 0.4)',
    },
    sunset: {
      border: '#ff6b35',
      bg: '#ff6b35',
      hover: 'rgba(255, 107, 53, 0.4)',
    },
  };

  const colors = colorMap[color] || colorMap.electric;

  const baseStyles = {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.65rem',
    padding: '0.75rem 1.5rem',
    border: `2px solid ${colors.border}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: variant === 'filled' ? colors.bg : 'transparent',
    color: variant === 'filled' ? '#0a0a12' : colors.border,
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`pixel-btn ${className}`}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (variant === 'outline') {
          e.currentTarget.style.background = colors.bg;
          e.currentTarget.style.color = '#0a0a12';
        }
        e.currentTarget.style.boxShadow = `0 0 20px ${colors.hover}`;
      }}
      onMouseLeave={(e) => {
        if (variant === 'outline') {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = colors.border;
        }
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default PixelButton;
