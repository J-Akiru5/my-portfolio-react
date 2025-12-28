import React from 'react'

/**
 * VersionBadge - Persistent version indicator
 * 
 * Shows current portfolio version in the lower-left corner.
 * Displayed globally via App.jsx.
 */

// Update this with each release
const VERSION = 'v2.1.0'
const BUILD_DATE = 'Dec 2025'

export default function VersionBadge() {
  return (
    <>
      <style>{`
        .version-badge {
          position: fixed;
          bottom: 16px;
          left: 16px;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
          cursor: default;
        }

        .version-badge:hover {
          border-color: rgba(0, 212, 255, 0.3);
          color: rgba(255, 255, 255, 0.7);
          background: rgba(0, 10, 20, 0.9);
        }

        .version-badge:hover .version-number {
          color: #00d4ff;
        }

        .version-dot {
          width: 6px;
          height: 6px;
          background: #39ff14;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .version-number {
          color: rgba(255, 255, 255, 0.5);
          transition: color 0.3s;
        }

        .version-build {
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.6rem;
        }

        /* Hide on very small screens */
        @media (max-width: 480px) {
          .version-badge {
            display: none;
          }
        }
      `}</style>

      <div className="version-badge" title={`Portfolio ${VERSION} • Built ${BUILD_DATE}`}>
        <span className="version-dot"></span>
        <span className="version-number">{VERSION}</span>
        <span className="version-build">• {BUILD_DATE}</span>
      </div>
    </>
  )
}
