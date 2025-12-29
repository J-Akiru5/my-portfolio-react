import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { SectionTitle, GlassCard, PixelButton } from '../../components/ui'
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      setError('')
      setIsLoading(true)
      
      // Set persistence based on Remember Me
      const auth = getAuth()
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
      
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
        
        .password-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .password-wrapper input {
          flex: 1;
          padding-right: 3rem;
        }
        
        .password-toggle {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
          transition: color 0.2s;
        }
        
        .password-toggle:hover {
          color: #00d4ff;
        }
        
        .remember-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .remember-checkbox {
          width: 20px;
          height: 20px;
          accent-color: #00d4ff;
          cursor: pointer;
        }
        
        .remember-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          user-select: none;
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
            <div className="password-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="terminal-input" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <div className="remember-group">
            <input
              type="checkbox"
              id="remember-me"
              className="remember-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="remember-label">
              REMEMBER_ME (stay logged in)
            </label>
          </div>
          
          <div>
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
