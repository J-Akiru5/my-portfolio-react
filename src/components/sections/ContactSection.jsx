import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, PixelButton, SocialIcon } from '../ui'

gsap.registerPlugin(ScrollTrigger)

/**
 * ContactSection - Footer reveal with terminal form
 * 
 * Slides up to reveal the contact form and social links.
 */
export default function ContactSection() {
  const sectionRef = useRef(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Form reveal animation
      gsap.from('.contact-content', {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      })

      // Social icons stagger
      gsap.from('.social-item', {
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.social-grid',
          start: 'top 85%',
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('✅ Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitStatus(''), 3000)
    }, 1500)
  }

  const socialLinks = [
    { platform: 'github', url: 'https://github.com/J-Akiru5' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/jeff-edrick-martinez-888575300/' },
    { platform: 'x', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'youtube', url: '#' },
    { platform: 'tiktok', url: '#' },
  ]

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <style>{`
        .contact-section {
          min-height: 100vh;
          padding: 6rem 2rem;
          position: relative;
        }
        
        .contact-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-top: 3rem;
        }
        
        @media (max-width: 900px) {
          .contact-content {
            grid-template-columns: 1fr;
          }
        }
        
        .terminal-card {
          padding: 2rem !important;
        }
        
        .terminal-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .terminal-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .terminal-dot.red { background: #ff5f57; }
        .terminal-dot.yellow { background: #ffbd2e; }
        .terminal-dot.green { background: #28c840; }
        
        .terminal-title {
          flex: 1;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: #39ff14;
          margin-bottom: 0.5rem;
        }
        
        .form-label::before {
          content: '> ';
          color: #00d4ff;
        }
        
        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          transition: all 0.3s;
        }
        
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.15);
        }
        
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        
        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        .submit-status {
          margin-top: 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: #39ff14;
        }
        
        .social-card {
          padding: 2rem !important;
        }
        
        .social-header {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          color: #00d4ff;
          margin-bottom: 1.5rem;
        }
        
        .social-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        
        .social-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          transition: all 0.3s;
        }
        
        .social-item:hover {
          border-color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
          transform: translateY(-3px);
        }
        
        .social-item svg {
          width: 28px;
          height: 28px;
          fill: currentColor;
        }
        
        .social-item span {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.5rem;
          text-transform: uppercase;
        }
        
        .footer-bar {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }
        
        .footer-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }
        
        .footer-text a {
          color: #00d4ff;
        }
      `}</style>
      
      <div className="contact-container">
        <SectionTitle title="CONTACT" extension=".msg" />
        
        <div className="contact-content">
          {/* Terminal Form */}
          <GlassCard className="terminal-card" variant="strong">
            <div className="terminal-header">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">message_form.sh</span>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">NAME</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="Enter your name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input 
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">MESSAGE</label>
                <textarea 
                  className="form-textarea"
                  placeholder="Type your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              
              <PixelButton 
                variant="filled" 
                color="matrix" 
                style={{ width: '100%' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SENDING...' : 'EXECUTE_SEND()'}
              </PixelButton>
              
              {submitStatus && (
                <div className="submit-status">{submitStatus}</div>
              )}
            </form>
          </GlassCard>
          
          {/* Social Links */}
          <div>
            <GlassCard className="social-card">
              <h3 className="social-header">📡 CONNECT</h3>
              <div className="social-grid">
                {socialLinks.map((link) => (
                  <SocialIcon 
                    key={link.platform}
                    platform={link.platform}
                    url={link.url}
                    className="social-item"
                  />
                ))}
              </div>
            </GlassCard>
            
            <GlassCard className="social-card" style={{ marginTop: '1.5rem' }}>
              <h3 className="social-header">📧 DIRECT</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                For business inquiries or collaborations:
              </p>
              <a 
                href="mailto:jeffmartinez474@gmail.com"
                style={{ 
                  display: 'block',
                  padding: '1rem',
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '8px',
                  color: '#00d4ff',
                  fontFamily: "'JetBrains Mono', monospace",
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                jeffmartinez474@gmail.com
              </a>
            </GlassCard>
          </div>
        </div>
        
        <div className="footer-bar">
          <p className="footer-text">
            © {new Date().getFullYear()} JEFF.DEV • Built with <a href="https://react.dev">React</a> & <a href="https://gsap.com">GSAP</a>
          </p>
        </div>
      </div>
    </section>
  )
}
