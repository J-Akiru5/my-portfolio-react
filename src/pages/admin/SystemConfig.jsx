import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionTitle, GlassCard, PixelButton } from '../../components/ui'
import { db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

/**
 * System Configuration Page
 * 
 * Global settings, feature flags, and maintenance mode controls.
 */
export default function SystemConfig() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    siteName: 'JEFF.DEV',
    siteTagline: 'AI-Powered Developer',
    heroTitle: 'Jeff Edrick Martinez',
    heroSubtitle: 'Vibecoder • Creative Director',
    contactEmail: 'jeffmartinez474@gmail.com',
    maintenanceMode: false,
    showAnimations: true,
    enableAnalytics: true,
    socialLinksEnabled: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const docRef = doc(db, 'settings', 'general')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setSettings(prev => ({ ...prev, ...docSnap.data() }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  async function handleSave() {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const docRef = doc(db, 'settings', 'general')
      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date().toISOString(),
      })
      setSaveMessage('✅ Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveMessage('❌ Error saving settings: ' + error.message)
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  function handleChange(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <section className="system-config-page">
      <style>{`
        .system-config-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .settings-section {
          margin-bottom: 2rem;
        }
        
        .section-card {
          padding: 2rem !important;
        }
        
        .section-header {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          color: #00d4ff;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          transition: border-color 0.3s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #00d4ff;
        }
        
        .toggle-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .toggle-group:last-child {
          border-bottom: none;
        }
        
        .toggle-info h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          color: white;
          margin-bottom: 0.25rem;
        }
        
        .toggle-info p {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .toggle-switch {
          position: relative;
          width: 60px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .toggle-switch.active {
          background: #39ff14;
        }
        
        .toggle-switch.active.maintenance {
          background: #ff6b35;
        }
        
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s;
        }
        
        .toggle-switch.active::after {
          transform: translateX(30px);
        }
        
        .save-bar {
          position: sticky;
          bottom: 2rem;
          background: rgba(26, 26, 46, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .save-message {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
        }
        
        .save-message.success {
          color: #39ff14;
        }
        
        .save-message.error {
          color: #ff6b35;
        }
        
        .maintenance-warning {
          background: rgba(255, 107, 53, 0.15);
          border: 1px solid #ff6b35;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .maintenance-warning span {
          color: #ff6b35;
          font-size: 0.85rem;
        }
      `}</style>
      
      <div className="page-header">
        <SectionTitle title="SYSTEM_CONFIG" extension=".cfg" />
        <PixelButton variant="outline" onClick={() => navigate('/admin')}>
          ← BACK
        </PixelButton>
      </div>
      
      {settings.maintenanceMode && (
        <div className="maintenance-warning">
          ⚠️ <span><strong>Maintenance Mode is ON.</strong> Visitors will see a maintenance page.</span>
        </div>
      )}
      
      {/* Site Identity */}
      <div className="settings-section">
        <GlassCard className="section-card">
          <h3 className="section-header">🏷️ SITE_IDENTITY</h3>
          
          <div className="form-group">
            <label className="form-label">SITE NAME</label>
            <input 
              type="text" 
              className="form-input"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">TAGLINE</label>
            <input 
              type="text" 
              className="form-input"
              value={settings.siteTagline}
              onChange={(e) => handleChange('siteTagline', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">HERO TITLE</label>
            <input 
              type="text" 
              className="form-input"
              value={settings.heroTitle}
              onChange={(e) => handleChange('heroTitle', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">HERO SUBTITLE</label>
            <input 
              type="text" 
              className="form-input"
              value={settings.heroSubtitle}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">CONTACT EMAIL</label>
            <input 
              type="email" 
              className="form-input"
              value={settings.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
            />
          </div>
        </GlassCard>
      </div>
      
      {/* Feature Flags */}
      <div className="settings-section">
        <GlassCard className="section-card">
          <h3 className="section-header">🎚️ FEATURE_FLAGS</h3>
          
          <div className="toggle-group">
            <div className="toggle-info">
              <h4>Maintenance Mode</h4>
              <p>Show maintenance page to visitors</p>
            </div>
            <div 
              className={`toggle-switch ${settings.maintenanceMode ? 'active maintenance' : ''}`}
              onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
            />
          </div>
          
          <div className="toggle-group">
            <div className="toggle-info">
              <h4>Animations</h4>
              <p>Enable GSAP scroll animations</p>
            </div>
            <div 
              className={`toggle-switch ${settings.showAnimations ? 'active' : ''}`}
              onClick={() => handleChange('showAnimations', !settings.showAnimations)}
            />
          </div>
          
          <div className="toggle-group">
            <div className="toggle-info">
              <h4>Analytics</h4>
              <p>Track visitor statistics with Firebase</p>
            </div>
            <div 
              className={`toggle-switch ${settings.enableAnalytics ? 'active' : ''}`}
              onClick={() => handleChange('enableAnalytics', !settings.enableAnalytics)}
            />
          </div>
          
          <div className="toggle-group">
            <div className="toggle-info">
              <h4>Social Links</h4>
              <p>Show social media icons in footer</p>
            </div>
            <div 
              className={`toggle-switch ${settings.socialLinksEnabled ? 'active' : ''}`}
              onClick={() => handleChange('socialLinksEnabled', !settings.socialLinksEnabled)}
            />
          </div>
        </GlassCard>
      </div>
      
      {/* Save Bar */}
      <div className="save-bar">
        <span className={`save-message ${saveMessage.includes('✅') ? 'success' : 'error'}`}>
          {saveMessage}
        </span>
        <PixelButton 
          variant="filled" 
          color="matrix" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'SAVING...' : 'SAVE CONFIG'}
        </PixelButton>
      </div>
    </section>
  )
}
