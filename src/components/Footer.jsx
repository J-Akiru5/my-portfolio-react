import React, { useEffect } from 'react'
import '../styles/footer.css'

export default function Footer() {
  useEffect(() => {
    const el = document.getElementById('footer-year')
    if (el) el.textContent = new Date().getFullYear()
  }, [])
  return (
    <footer className="site-footer">
      {/* ...copy the inner HTML from fragments/footer.html and adapt links if needed... */}
      <div className="footer-main">
        <div className="footer-col credentials">
          <h3>Jeff Edrick Martinez</h3>
          <p>Iloilo State University of Fisheries Science and Technology</p>
          <p>Bachelor of Science in Information Technology</p>
        </div>
        <div className="footer-col navigation">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="mailto:jeffmartinez@isufst.edu.ph">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col connect">
          <h4>Connect</h4>
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/jeff-edrick-martinez-888575300/" target="_blank" aria-label="LinkedIn">
              <svg width="28" height="28" fill="#fff" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z" /></svg>
            </a>
            <a href="https://github.com/J-Akiru5" target="_blank" aria-label="GitHub">
              <svg width="28" height="28" fill="#fff" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            </a>
            <a href="https://www.facebook.com/martinezjeff26/" target="_blank" aria-label="Facebook">
              <svg width="28" height="28" fill="#fff" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.294h6.116c.733 0 1.325-.593 1.325-1.326v-21.349c0-.733-.592-1.325-1.325-1.325z" /></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © <span id="footer-year"></span> Jeff Edrick Martinez. Designed and Built by Me.
      </div>
    </footer>
  )
}