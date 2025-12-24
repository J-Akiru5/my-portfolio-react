import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, PixelButton, SocialIcon } from '../components/ui'

gsap.registerPlugin(ScrollTrigger)

/**
 * Contact Page
 * 
 * Terminal-style contact form with social media grid.
 */

const STORAGE_KEY = 'profile_contact_messages_v1'

const socialLinks = [
  { platform: 'github', href: 'https://github.com/J-Akiru5', label: 'GITHUB' },
  { platform: 'linkedin', href: 'https://www.linkedin.com/in/jeff-edrick-martinez-888575300/', label: 'LINKEDIN' },
  { platform: 'x', href: '#', label: 'X' },
  { platform: 'instagram', href: '#', label: 'INSTAGRAM' },
  { platform: 'youtube', href: '#', label: 'YOUTUBE' },
  { platform: 'tiktok', href: '#', label: 'TIKTOK' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const socialRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top 80%',
          },
        }
      )

      gsap.fromTo(
        socialRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top 80%',
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Message required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e) {
    setForm(s => ({ ...s, [e.target.name]: e.target.value }))
    // Clear error when typing
    if (errors[e.target.name]) {
      setErrors(s => ({ ...s, [e.target.name]: undefined }))
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    
    const payload = { ...form, id: Date.now(), sentAt: new Date().toISOString() }
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const updated = [payload, ...existing].slice(0, 20)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(null), 4000)
  }

  return (
    <section className="contact-page" ref={pageRef}>
      <style>{`
        .contact-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .form-card {
          padding: 2rem;
        }
        
        .form-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .form-header-icon {
          color: #39ff14;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .form-header-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #39ff14;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: #00d4ff;
          margin-bottom: 0.5rem;
        }
        
        .form-label::before {
          content: '> ';
          color: #39ff14;
        }
        
        .terminal-input,
        .terminal-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .terminal-input:focus,
        .terminal-textarea:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
        }
        
        .terminal-textarea {
          min-height: 150px;
          resize: vertical;
        }
        
        .error-text {
          color: #ff6b35;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .success-message {
          padding: 1rem;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid #39ff14;
          border-radius: 4px;
          color: #39ff14;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
        
        .social-card {
          padding: 2rem;
        }
        
        .social-header {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .social-header::before,
        .social-header::after {
          content: ' — ';
        }
        
        .social-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          
          .social-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .social-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      
      {/* Page Title */}
      <SectionTitle title="CONNECT" extension=".exe" />
      
      {/* Contact Grid */}
      <div className="contact-grid">
        {/* Form Section */}
        <GlassCard className="form-card" ref={formRef}>
          <div className="form-header">
            <span className="form-header-icon">&gt;</span>
            <span className="form-header-title">SEND_TRANSMISSION</span>
          </div>
          
          {sent && (
            <div className="success-message">
              ✓ Message transmitted successfully!
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">NAME:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="terminal-input"
                placeholder="Enter your name..."
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">EMAIL:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="terminal-input"
                placeholder="Enter your email..."
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">MESSAGE:</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="terminal-textarea"
                placeholder="Enter your message..."
              />
              {errors.message && <div className="error-text">{errors.message}</div>}
            </div>
            
            <PixelButton 
              type="submit" 
              variant="filled" 
              color="electric"
              style={{ width: '100%' }}
            >
              TRANSMIT
            </PixelButton>
          </form>
        </GlassCard>
        
        {/* Social Links Section */}
        <GlassCard className="social-card" ref={socialRef}>
          <div className="social-header">OR FIND ME AT</div>
          <div className="social-grid">
            {socialLinks.map((link) => (
              <SocialIcon
                key={link.platform}
                platform={link.platform}
                href={link.href}
                label={link.label}
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
