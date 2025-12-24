import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { SectionTitle, GlassCard, PixelButton } from '../../components/ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      setError('')
      setIsLoading(true)
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      console.error(err)
      setError('Failed to log in: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .login-card {
          width: 100%;
          max-width: 450px;
          padding: 2.5rem !important;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #00d4ff;
          margin-bottom: 0.75rem;
        }
        
        .error-message {
          background: rgba(255, 107, 53, 0.15);
          border: 1px solid #ff6b35;
          color: #ff6b35;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>

      <GlassCard className="login-card" variant="strong">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <SectionTitle title="ADMIN_ACCESS" extension=".lock" />
        </div>
        
        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">IDENTIFIER (EMAIL)</label>
            <input 
              type="email" 
              className="terminal-input" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@system.local"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">ACCESS_KEY (PASSWORD)</label>
            <input 
              type="password" 
              className="terminal-input" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <PixelButton 
              variant="filled" 
              color="matrix" 
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'AUTHENTICATING...' : 'INITIATE_SESSION'}
            </PixelButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
