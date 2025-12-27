import React from 'react';

/**
 * CatIcon - Pixelated Cat Icon
 * 
 * Used to replace GitHub icon with a cat design as requested.
 * Scales with font-size using em units.
 */
export const CatIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width="1em" 
    height="1em" 
    {...props}
  >
    <path d="M6 2H4v4H2v6h2v6h2v-2h2v4h4v-2h4v2h4v-4h2v2h2v-6h-2V6h-2V2h-2v2H6V2zm2 6h2v2H8V8zm8 0h2v2h-2V8zM8 14h8v2H8v-2z"/>
  </svg>
);
