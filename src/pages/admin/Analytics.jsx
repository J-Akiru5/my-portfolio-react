import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionTitle, GlassCard, PixelButton } from '../../components/ui'
import { analytics } from '../../firebase'

/**
 * Analytics Dashboard
 * 
 * Displays site traffic and engagement metrics.
 * Note: Firebase Analytics data is typically viewed in the Firebase Console,
 * but we can show some basic stats and provide quick links.
 */
export default function Analytics() {
  const navigate = useNavigate()
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false)

  useEffect(() => {
    // Check if analytics was initialized
    setIsAnalyticsEnabled(analytics !== null)
  }, [])

  // Mock stats for demo - in production, these would come from Firebase/Google Analytics API
  const stats = [
    { label: 'PAGE VIEWS', value: '2,847', change: '+12%', icon: '👁️' },
    { label: 'UNIQUE VISITORS', value: '1,203', change: '+8%', icon: '👤' },
    { label: 'AVG. SESSION', value: '2m 34s', change: '+5%', icon: '⏱️' },
    { label: 'BOUNCE RATE', value: '42%', change: '-3%', icon: '📉' },
  ]

  const topPages = [
    { path: '/', views: 1245, title: 'Home' },
    { path: '/portfolio', views: 623, title: 'Portfolio' },
    { path: '/certifications', views: 412, title: 'Certifications' },
    { path: '/about', views: 387, title: 'About' },
    { path: '/contact', views: 180, title: 'Contact' },
  ]

  return (
    <section className="analytics-page">
      <style>{`
        .analytics-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1200px;
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
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          padding: 1.5rem !important;
          text-align: center;
        }
        
        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        
        .stat-value {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.5rem;
          color: #00d4ff;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.7rem;
          font-family: 'Press Start 2P', cursive;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.5rem;
        }
        
        .stat-change {
          font-size: 0.8rem;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .stat-change.positive {
          color: #39ff14;
        }
        
        .stat-change.negative {
          color: #ff6b35;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        
        @media (max-width: 900px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .section-card {
          padding: 1.5rem !important;
        }
        
        .section-header {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          color: #00d4ff;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .top-pages-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .top-pages-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .top-pages-list li:last-child {
          border-bottom: none;
        }
        
        .page-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .page-rank {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: #9d4edd;
          width: 24px;
        }
        
        .page-title {
          color: white;
        }
        
        .page-path {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .page-views {
          font-family: 'JetBrains Mono', monospace;
          color: #39ff14;
        }
        
        .analytics-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-family: 'Press Start 2P', cursive;
        }
        
        .analytics-status.enabled {
          background: rgba(57, 255, 20, 0.15);
          border: 1px solid #39ff14;
          color: #39ff14;
        }
        
        .analytics-status.disabled {
          background: rgba(255, 107, 53, 0.15);
          border: 1px solid #ff6b35;
          color: #ff6b35;
        }
        
        .console-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.3s;
        }
        
        .console-link:hover {
          border-color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
        }
        
        .demo-notice {
          background: rgba(157, 78, 221, 0.15);
          border: 1px solid #9d4edd;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
      
      <div className="page-header">
        <SectionTitle title="ANALYTICS" extension=".stats" />
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span className={`analytics-status ${isAnalyticsEnabled ? 'enabled' : 'disabled'}`}>
            {isAnalyticsEnabled ? '● LIVE' : '○ DISABLED'}
          </span>
          <PixelButton variant="outline" onClick={() => navigate('/admin')}>
            ← BACK
          </PixelButton>
        </div>
      </div>
      
      <div className="demo-notice">
        ℹ️ <strong>Demo Mode:</strong> These are sample statistics. Connect to Firebase Analytics API or Google Analytics Data API for real-time data.
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <GlassCard key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {stat.change} vs last month
            </div>
          </GlassCard>
        ))}
      </div>
      
      {/* Content Grid */}
      <div className="content-grid">
        <GlassCard className="section-card">
          <h3 className="section-header">📊 TOP PAGES</h3>
          <ul className="top-pages-list">
            {topPages.map((page, index) => (
              <li key={page.path}>
                <div className="page-info">
                  <span className="page-rank">#{index + 1}</span>
                  <div>
                    <div className="page-title">{page.title}</div>
                    <div className="page-path">{page.path}</div>
                  </div>
                </div>
                <span className="page-views">{page.views.toLocaleString()} views</span>
              </li>
            ))}
          </ul>
        </GlassCard>
        
        <GlassCard className="section-card">
          <h3 className="section-header">🔗 QUICK LINKS</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Access full analytics in the Firebase Console for detailed insights.
          </p>
          <a 
            href="https://console.firebase.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="console-link"
          >
            🔥 Firebase Console →
          </a>
          <a 
            href="https://analytics.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="console-link"
          >
            📈 Google Analytics →
          </a>
        </GlassCard>
      </div>
    </section>
  )
}
