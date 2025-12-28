import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Seo from '../components/Seo'
import { PixelButton, GlassCard } from '../components/ui'

/**
 * ServiceInquiry - Dedicated service page with tailored form
 */

const SERVICES_DATA = {
  'web-development': {
    title: 'Web Development',
    icon: '💻',
    description: 'Transform your ideas into robust, high-performance web applications using Laravel, React, and Inertia.js.',
    features: [
      'Full-Stack Architecture',
      'Database Design & Optimization',
      'Real-time Features (WebSockets)',
      'API Development & Integration',
      'Payment Gateway Integration',
      'Admin Dashboards'
    ],
    tech: ['Laravel', 'React', 'Inertia.js', 'MySQL', 'Redis'],
    color: '#00d4ff',
    starterPrice: '$500+'
  },
  'ui-ux-design': {
    title: 'UI/UX Design',
    icon: '🎨',
    description: 'Create intuitive, engaging user experiences with pixel-perfect designs and modern aesthetics.',
    features: [
      'User Research & Personas',
      'Wireframing & Prototyping',
      'Design Systems',
      'Interactive Mockups',
      'Mobile-First Design',
      'Accessibility Compliance'
    ],
    tech: ['Figma', 'Adobe XD', 'Protopie'],
    color: '#9d4edd',
    starterPrice: '$300+'
  },
  'mobile-apps': {
    title: 'Mobile Development',
    icon: '📱',
    description: 'Build native-quality mobile applications for Android using Java or cross-platform solutions with React Native.',
    features: [
      'Native Android Development',
      'Cross-Platform (React Native)',
      'Offline Functionality',
      'Push Notifications',
      'Google Maps Integration',
      'Play Store Deployment'
    ],
    tech: ['Java', 'React Native', 'Android Studio', 'Firebase'],
    color: '#39ff14',
    starterPrice: '$600+'
  }
}

export default function ServiceInquiry() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '1k-3k',
    timeline: '1-2 months',
    description: ''
  })

  useEffect(() => {
    if (SERVICES_DATA[slug]) {
      setService(SERVICES_DATA[slug])
      window.scrollTo(0, 0)
    } else {
      navigate('/#services')
    }
  }, [slug, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Construct mailto link with pre-filled data
    const subject = `Inquiry: ${service.title}`
    const body = `Hi Jeff,

I'm interested in your ${service.title} service.

Project Details:
- Budget: ${formData.budget}
- Timeline: ${formData.timeline}

Description:
${formData.description}

Contact Info:
- Name: ${formData.name}
- Email: ${formData.email}
`
    window.location.href = `mailto:jeffdev.studio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  if (!service) return null

  return (
    <div className="service-inquiry-page">
      <Seo 
        title={`${service.title} - Services | JeffDev Studio`}
        description={service.description}
      />

      <style>{`
        .service-inquiry-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          background-image: 
            radial-gradient(circle at 15% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(157, 78, 221, 0.03) 0%, transparent 25%);
        }

        .service-container {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: start;
        }

        .service-info {
          position: sticky;
          top: 100px;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 2rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          transition: color 0.3s;
        }
        .back-link:hover { color: #fff; }

        .service-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 30px ${service.color}40;
        }

        .service-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.8rem;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.4;
          text-shadow: 4px 4px 0 ${service.color};
        }

        .service-desc {
          font-size: 1.1rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin-bottom: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
        }

        .feature-item::before {
          content: '✓';
          color: ${service.color};
          font-weight: bold;
        }

        /* Form Styles */
        .specs-form {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          backdrop-filter: blur(10px);
        }

        .form-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: ${service.color};
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: ${service.color};
          background: rgba(255, 255, 255, 0.1);
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .service-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .service-info {
            position: static;
          }
          .service-inquiry-page {
            padding: 2rem 1rem;
          }
        }
      `}</style>

      <div className="service-container">
        {/* Info Column */}
        <div className="service-info">
          <Link to="/#services" className="back-link">← Back to Services</Link>
          <span className="service-icon">{service.icon}</span>
          <h1 className="service-title">{service.title}</h1>
          <p className="service-desc">{service.description}</p>
          
          <h3 style={{ color: service.color, fontFamily: 'Press Start 2P', fontSize: '0.8rem', marginBottom: '1rem' }}>
            WHAT'S INCLUDED:
          </h3>
          <ul className="feature-list">
            {service.features.map((feature, i) => (
              <li key={i} className="feature-item">{feature}</li>
            ))}
          </ul>
        </div>

        {/* Form Column */}
        <div className="form-container">
          <form className="specs-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2 className="form-title">PROJECT SPECS</h2>
              <p className="form-subtitle">Tell me about what you want to build</p>
            </div>

            <div className="form-group">
              <label className="form-label">YOUR NAME</label>
              <input 
                type="text" 
                name="name"
                className="form-input"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">EMAIL ADDRESS</label>
              <input 
                type="email" 
                name="email"
                className="form-input"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">BUDGET RANGE</label>
                <select 
                  name="budget" 
                  className="form-select"
                  value={formData.budget}
                  onChange={handleInputChange}
                >
                  <option value="< $1k">&lt; $1k (Small/Fix)</option>
                  <option value="1k-3k">$1k - $3k (Standard)</option>
                  <option value="3k-5k">$3k - $5k (Premium)</option>
                  <option value="5k+">$5k+ (Enterprise)</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">TIMELINE</label>
                <select 
                  name="timeline" 
                  className="form-select"
                  value={formData.timeline}
                  onChange={handleInputChange}
                >
                  <option value="ASAP">ASAP</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">PROJECT DESCRIPTION</label>
              <textarea 
                name="description"
                className="form-textarea"
                placeholder="Describe your project, features, and goals..."
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <PixelButton 
              type="submit" 
              variant="filled" 
              icon="🚀" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              SEND INQUIRY
            </PixelButton>
            
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '1rem' }}>
              This will open your default email client.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
