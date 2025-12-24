import React from 'react';

/**
 * SectionTitle Component
 * 
 * 8-bit styled section title with file extension format.
 */
const SectionTitle = ({ 
  title, 
  extension = '.exe',
  className = '' 
}) => {
  return (
    <div className={`section-title-wrapper ${className}`}>
      <h2 className="section-title">
        <span className="title-main">{title}</span>
        <span className="title-ext">{extension}</span>
      </h2>
      <span className="gradient-underline" style={{ width: '150px' }}></span>
    </div>
  );
};

export default SectionTitle;
