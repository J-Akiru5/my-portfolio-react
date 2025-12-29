import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionTitle, GlassCard, PixelButton, CatIcon } from '..'
import { db } from '../../../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

gsap.registerPlugin(ScrollTrigger)

/**
 * ContactSection - Footer reveal with terminal form
 * 
 * Saves messages to Firestore for admin viewing.
 */
export default function ContactSection() {
  const sectionRef = useRef(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [honeypot, setHoneypot] = useState('') // Bot trap
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const [errors, setErrors] = useState({})

  // Rate limiting constants
  const RATE_LIMIT_KEY = 'contact_form_submissions'
  const MAX_SUBMISSIONS = 3
  const TIME_WINDOW = 60 * 60 * 1000 // 1 hour

  // Check if user has exceeded rate limit
  function checkRateLimit() {
    try {
      const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]')
      const recentSubmissions = submissions.filter(ts => Date.now() - ts < TIME_WINDOW)
      return recentSubmissions.length < MAX_SUBMISSIONS
    } catch {
      return true // Allow on error
    }
  }

  // Record a submission timestamp
  function recordSubmission() {
    try {
      const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]')
      submissions.push(Date.now())
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions.slice(-10)))
    } catch {
      // Silently fail
    }
  }

  // Sanitize input - strip HTML tags and limit length
  function sanitizeInput(str, maxLength = 1000) {
    return str.replace(/<[^>]*>/g, '').trim().slice(0, maxLength)
  }

  // Validate form fields
  function validateForm() {
    const newErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name too short'
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email required'
    }
    
    // Message validation
    const msgLength = formData.message.trim().length
    if (msgLength < 10) {
      newErrors.message = 'Message too short (min 10 chars)'
    } else if (msgLength > 1000) {
      newErrors.message = 'Message too long (max 1000 chars)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
      gsap.fromTo('.social-item', 
        { autoAlpha: 0, scale: 0.8, y: 20 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.social-grid',
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitStatus('')
    setErrors({})
    
    // Honeypot check - silently reject bots
    if (honeypot) {
      setSubmitStatus('✅ Message sent successfully!') // Fake success for bots
      setFormData({ name: '', email: '', message: '' })
      return
    }
    
    // Rate limit check
    if (!checkRateLimit()) {
      setSubmitStatus('⏱️ Too many messages. Please try again later.')
      return
    }
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Sanitize inputs before saving
      const sanitizedData = {
        name: sanitizeInput(formData.name, 100),
        email: sanitizeInput(formData.email, 100),
        message: sanitizeInput(formData.message, 1000),
        createdAt: serverTimestamp(),
        read: false,
        clientTimestamp: Date.now(),
        userAgent: navigator.userAgent.slice(0, 200),
      }
      
      // Save message to Firestore
      await addDoc(collection(db, 'messages'), sanitizedData)
      
      // Record submission for rate limiting
      recordSubmission()
      
      setSubmitStatus('✅ Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Error sending message:', error)
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        setSubmitStatus('❌ Unable to send. Please try again later.')
      } else if (error.code === 'unavailable' || !navigator.onLine) {
        setSubmitStatus('❌ No internet connection. Please check your network.')
      } else {
        setSubmitStatus('❌ Failed to send. Please try again or email directly.')
      }
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(''), 5000)
    }
  }

  // Social links - user-provided URLs
  const socialLinks = [
    { platform: 'GitHub', url: 'https://github.com/J-Akiru5', icon: <CatIcon /> },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/jeff-edrick-martinez-888575300/', icon: '💼' },
    { platform: 'Facebook', url: 'https://www.facebook.com/martinezjeff26', icon: '📘' },
    { platform: 'Instagram', url: 'https://www.instagram.com/jef.ferson_m/', icon: '📷' },
    { platform: 'TikTok', url: 'https://www.tiktok.com/@nereus_9', icon: '🎵' },
    { platform: 'Discord', url: 'https://discord.com/channels/@me', icon: '🎮' }, // Consider creating a Discord server!
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
        }

        .field-error {
          color: #ff6b6b;
          font-size: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          margin-top: 0.25rem;
        }

        .honeypot-field {
          position: absolute;
          left: -9999px;
          opacity: 0;
          height: 0;
          width: 0;
          pointer-events: none;
        }
          font-size: 0.85rem;
        }
        
        .submit-status.success {
          color: #39ff14;
        }
        
        .submit-status.error {
          color: #ff6b35;
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
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          min-height: 200px;
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
        
        .social-item .social-icon {
          font-size: 1.75rem;
        }
        
        .social-item .social-label {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.45rem;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
        }
        
        /* Console.WriteLine Footer */
        .console-footer {
          margin-top: 4rem;
          padding: 2rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .console-line {
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
        }
        
        .console-line .keyword {
          color: #9d4edd;
        }
        
        .console-line .method {
          color: #00d4ff;
        }
        
        .console-line .string {
          color: #39ff14;
        }
        
        .console-line .operator {
          color: white;
        }
        
        .console-line .comment {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
        }
        
        .console-cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: #39ff14;
          animation: blink 1s step-end infinite;
          vertical-align: text-bottom;
          margin-left: 4px;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
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
                {errors.name && <div className="field-error">{errors.name}</div>}
              </div>
              
              {/* Honeypot - invisible to humans, bots fill this */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="honeypot-field"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
              />
              
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
                {errors.email && <div className="field-error">{errors.email}</div>}
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
                {errors.message && <div className="field-error">{errors.message}</div>}
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
                <div className={`submit-status ${submitStatus.includes('✅') ? 'success' : 'error'}`}>
                  {submitStatus}
                </div>
              )}
            </form>
          </GlassCard>
          
          {/* Social Links */}
          <div>
            <GlassCard className="social-card">
              <h3 className="social-header">📡 CONNECT</h3>
              <div className="social-grid">
                {socialLinks.map((link) => (
                  <a 
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-item"
                  >
                    <span className="social-icon">{link.icon}</span>
                    <span className="social-label">{link.platform}</span>
                  </a>
                ))}
              </div>
            </GlassCard>
            
            <GlassCard className="social-card" style={{ marginTop: '1.5rem' }}>
              <h3 className="social-header">📧 DIRECT</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                For business inquiries or collaborations:
              </p>
              <a 
                href="mailto:contact@jeffdev.studio"
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
                contact@jeffdev.studio
              </a>
            </GlassCard>
          </div>
        </div>
        
        {/* Console.WriteLine Footer */}
        <div className="console-footer">
          <div className="console-line">
            <span className="comment">// Built with ❤️ and lots of ☕</span>
          </div>
          <div className="console-line">
            <span className="keyword">Console</span>
            <span className="operator">.</span>
            <span className="method">WriteLine</span>
            <span className="operator">(</span>
            <span className="string">"© {new Date().getFullYear()} JEFF.DEV | React + GSAP + Firebase"</span>
            <span className="operator">);</span>
          </div>
          <div className="console-line">
            <span className="keyword">Console</span>
            <span className="operator">.</span>
            <span className="method">WriteLine</span>
            <span className="operator">(</span>
            <span className="string">"Crafted in the 8-Bit Universe 🚀"</span>
            <span className="operator">);</span>
            <span className="console-cursor" />
          </div>
        </div>
      </div>
    </section>
  )
}
