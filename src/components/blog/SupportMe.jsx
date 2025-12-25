import React from 'react'

/**
 * SupportMe - Monetization CTA component
 * 
 * "Buy Me a Coffee" style support banner for blog posts.
 * Configure username in env: VITE_BUYMEACOFFEE_USERNAME
 */
export default function SupportMe() {
  const username = import.meta.env.VITE_BUYMEACOFFEE_USERNAME || 'j_akiru'
  const coffeUrl = `https://www.buymeacoffee.com/${username}`

  return (
    <div className="support-me">
      <style>{`
        .support-me {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          margin: 3rem 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .support-content {
          flex: 1;
          min-width: 200px;
        }
        
        .support-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          color: #ffc107;
          margin-bottom: 0.5rem;
        }
        
        .support-text {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          line-height: 1.6;
        }
        
        .support-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #ffc107, #ff9800);
          color: #000;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          font-size: 0.9rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .support-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(255, 193, 7, 0.4);
        }
        
        .support-emoji {
          font-size: 1.2rem;
        }
        
        @media (max-width: 600px) {
          .support-me {
            flex-direction: column;
            text-align: center;
          }
          
          .support-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="support-content">
        <h3 className="support-title">Found this helpful?</h3>
        <p className="support-text">
          I write these guides to help devs like you. Fuel my next tutorial with a coffee!
        </p>
      </div>
      
      <a 
        href={coffeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="support-btn"
      >
        <span className="support-emoji">☕</span>
        Buy me a coffee
      </a>
    </div>
  )
}
