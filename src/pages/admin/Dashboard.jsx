import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { SectionTitle, GlassCard, PixelButton } from '../../components/ui'

export default function Dashboard() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/admin/login')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  return (
    <section className="admin-dashboard">
      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 1.5rem;
        }
        
        .admin-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .admin-avatar {
          width: 48px;
          height: 48px;
          background: #1a1a2e;
          border: 2px solid #39ff14;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .admin-details h3 {
          font-size: 1rem;
          color: white;
          margin-bottom: 0.25rem;
        }
        
        .admin-details p {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #39ff14;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .dashboard-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .card-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: #00d4ff;
          margin-bottom: 0.75rem;
        }
        
        .card-desc {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          flex-grow: 1;
        }
      `}</style>
      
      <div className="dashboard-header">
        <div>
          <SectionTitle title="SYSTEM_CORE" extension=".adm" />
        </div>
        
        <div className="admin-info">
          <div className="admin-avatar">👨‍💻</div>
          <div className="admin-details">
            <h3>ADMINISTRATOR</h3>
            <p>{currentUser?.email}</p>
          </div>
          <PixelButton variant="outline" color="sunset" onClick={handleLogout}>
            LOGOUT
          </PixelButton>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <GlassCard className="dashboard-card" hoverEffect={true}>
          <div className="card-icon">📚</div>
          <h3 className="card-title">CONTENT_MANAGER</h3>
          <p className="card-desc">Manage projects, certificates, and update site content directly from the database.</p>
          <PixelButton variant="filled" color="electric" onClick={() => navigate('/admin/seed')}>
            MANAGE DATA
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="dashboard-card" hoverEffect={true}>
          <div className="card-icon">✍️</div>
          <h3 className="card-title">BLOG_MANAGER</h3>
          <p className="card-desc">Create, edit, and publish blog posts. Manage your content and drafts.</p>
          <PixelButton variant="filled" color="matrix" onClick={() => navigate('/admin/blog')}>
            MANAGE POSTS
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="dashboard-card" hoverEffect={true}>
          <div className="card-icon">🎮</div>
          <h3 className="card-title">PROJECTS_MANAGER</h3>
          <p className="card-desc">Add, edit, and organize portfolio projects displayed in the carousel.</p>
          <PixelButton variant="filled" color="purple" onClick={() => navigate('/admin/projects')}>
            MANAGE PROJECTS
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="dashboard-card" hoverEffect={true}>
          <div className="card-icon">🛠️</div>
          <h3 className="card-title" style={{ color: '#39ff14' }}>SERVICES_MANAGER</h3>
          <p className="card-desc">Manage freelance services, pricing packages, and service features.</p>
          <PixelButton variant="filled" color="matrix" onClick={() => navigate('/admin/services')}>
            MANAGE SERVICES
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="dashboard-card" hoverEffect={true}>
          <div className="card-icon">⚡</div>
          <h3 className="card-title">ANALYTICS</h3>
          <p className="card-desc">View site traffic, visitor stats, and engagement metrics via Firebase Analytics.</p>
          <PixelButton variant="outline" color="matrix" onClick={() => navigate('/admin/analytics')}>
            VIEW STATS
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="dashboard-card" hoverEffect={true}>
          <div className="card-icon">⚙️</div>
          <h3 className="card-title">SYSTEM_CONFIG</h3>
          <p className="card-desc">Global settings, feature flags, and maintenance mode controls.</p>
          <PixelButton variant="outline" color="purple" onClick={() => navigate('/admin/settings')}>
            SETTINGS
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="dashboard-card" hoverEffect={true}>
          <div className="card-icon">📨</div>
          <h3 className="card-title">INBOX</h3>
          <p className="card-desc">Read and manage messages from the contact form.</p>
          <PixelButton variant="outline" color="sunset" onClick={() => navigate('/admin/messages')}>
            VIEW MESSAGES
          </PixelButton>
        </GlassCard>
      </div>
    </section>
  )
}
