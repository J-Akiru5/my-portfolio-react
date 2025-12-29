import React from 'react'
import { Link } from 'react-router-dom'
import { CatIcon } from './ui'

/**
 * Footer - Professional B2B startup footer
 * 
 * Includes DTI registration, legal links, and JeffDev Studio branding.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <style>{`
        .site-footer {
          background: rgba(10, 10, 18, 0.95);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4rem 2rem 2rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-brand h3 {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .footer-brand p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .footer-dti {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 1rem;
        }

        .footer-dti strong {
          color: #39ff14;
        }

        .footer-col h4 {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-col li {
          margin-bottom: 0.75rem;
        }

        .footer-col a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s;
        }

        .footer-col a:hover {
          color: #00d4ff;
        }

        .footer-social {
          display: flex;
          gap: 1rem;
        }

        .footer-social a {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .footer-social a:hover {
          border-color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
        }

        .footer-social svg {
          fill: rgba(255, 255, 255, 0.7);
          transition: fill 0.2s;
        }

        .footer-social a:hover svg {
          fill: #00d4ff;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-copyright {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        .footer-legal {
          display: flex;
          gap: 2rem;
        }

        .footer-legal a {
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          font-size: 0.75rem;
          transition: color 0.2s;
        }

        .footer-legal a:hover {
          color: #00d4ff;
        }

        @media (max-width: 768px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <h3>JeffDev Studio</h3>
            <p>
              We build digital products and enterprise-grade web solutions.
              From SaaS platforms to custom development, we turn ideas into production-ready software.
            </p>
            <div className="footer-dti">
              DTI Registered: <strong>VLLP979818395984</strong>
            </div>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services/web-development">Web Development</Link></li>
              <li><Link to="/services/ui-ux-design">UI/UX Design</Link></li>
              <li><Link to="/services/mobile-apps">Mobile Apps</Link></li>
              <li><a href="mailto:hire@jeffdev.studio">hire@jeffdev.studio</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/#about">About Us</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/#contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <div className="footer-social">
              <a href="https://www.linkedin.com/in/jeff-edrick-martinez-888575300/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z" /></svg>
              </a>
              <a href="https://github.com/J-Akiru5" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <CatIcon width="20" height="20" />
              </a>
              <a href="https://www.facebook.com/martinezjeff26/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.294h6.116c.733 0 1.325-.593 1.325-1.326v-21.349c0-.733-.592-1.325-1.325-1.325z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} JeffDev Studio. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
