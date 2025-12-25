import React, { useState } from 'react'
import { SectionTitle, PixelButton, GlassCard } from '../components/ui'
import { seedAllData, seedCertificates, seedProjects, seedSocialLinks, seedSettings } from '../utils/seedFirebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import firstBlogPost from '../data/firstBlogPost'

/**
 * Admin Seed Page
 * 
 * One-click database population for Firestore collections.
 * Navigate to /admin/seed to use this page.
 */
export default function AdminSeed() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleSeedAll() {
    setStatus('loading')
    setError(null)
    
    try {
      const res = await seedAllData()
      setResult(res)
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  async function handleSeedCollection(seedFn, name) {
    setStatus('loading')
    setError(null)
    
    try {
      const count = await seedFn()
      setResult({ success: true, message: `Seeded ${count} ${name}` })
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  async function handleSeedBlogPost() {
    setStatus('loading')
    setError(null)
    
    try {
      // Check if post already exists
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('slug', '==', firstBlogPost.slug))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        setResult({ success: true, message: 'Blog post already exists!' })
        setStatus('success')
        return
      }
      
      // Add the blog post
      await addDoc(postsRef, {
        ...firstBlogPost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      
      setResult({ success: true, message: 'First blog post seeded successfully!' })
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <section className="admin-seed-page">
      <style>{`
        .admin-seed-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .seed-grid {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .seed-card {
          padding: 1.5rem;
        }
        
        .seed-card h3 {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          color: #00d4ff;
          margin-bottom: 0.5rem;
        }
        
        .seed-card p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .status-message {
          margin-top: 2rem;
          padding: 1rem;
          border-radius: 8px;
        }
        
        .status-message.success {
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid #39ff14;
          color: #39ff14;
        }
        
        .status-message.error {
          background: rgba(255, 107, 53, 0.1);
          border: 1px solid #ff6b35;
          color: #ff6b35;
        }
        
        .status-message.loading {
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid #00d4ff;
          color: #00d4ff;
        }
        
        .result-counts {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        
        .count-badge {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
        }
        
        .warning-box {
          background: rgba(255, 107, 53, 0.1);
          border: 1px solid rgba(255, 107, 53, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
          color: #ff6b35;
          font-size: 0.9rem;
        }
      `}</style>
      
      <SectionTitle title="SEED_DB" extension=".admin" />
      
      <div className="warning-box">
        ⚠️ This will overwrite existing data in Firestore. Make sure you want to proceed.
      </div>
      
      <div className="seed-grid">
        <GlassCard className="seed-card">
          <h3>🌱 SEED ALL DATA</h3>
          <p>Populate all Firestore collections with initial data (certificates, projects, social links, settings).</p>
          <PixelButton 
            variant="filled" 
            color="matrix" 
            onClick={handleSeedAll}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'SEEDING...' : 'SEED ALL'}
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="seed-card">
          <h3>📜 CERTIFICATES</h3>
          <p>Seed only the certificates collection (30 certs).</p>
          <PixelButton 
            variant="outline" 
            color="electric"
            onClick={() => handleSeedCollection(seedCertificates, 'certificates')}
            disabled={status === 'loading'}
          >
            SEED CERTS
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="seed-card">
          <h3>🚀 PROJECTS</h3>
          <p>Seed only the projects collection.</p>
          <PixelButton 
            variant="outline" 
            color="electric"
            onClick={() => handleSeedCollection(seedProjects, 'projects')}
            disabled={status === 'loading'}
          >
            SEED PROJECTS
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="seed-card">
          <h3>🔗 SOCIAL LINKS</h3>
          <p>Seed only the social links collection.</p>
          <PixelButton 
            variant="outline" 
            color="electric"
            onClick={() => handleSeedCollection(seedSocialLinks, 'social links')}
            disabled={status === 'loading'}
          >
            SEED LINKS
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="seed-card">
          <h3>⚙️ SETTINGS</h3>
          <p>Seed only the settings document.</p>
          <PixelButton 
            variant="outline" 
            color="electric"
            onClick={() => handleSeedCollection(seedSettings, 'settings')}
            disabled={status === 'loading'}
          >
            SEED SETTINGS
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="seed-card">
          <h3>📝 FIRST BLOG POST</h3>
          <p>Seed the first blog post: "Building Portfolio with Claude Opus 4.5"</p>
          <PixelButton 
            variant="filled" 
            color="sunset"
            onClick={handleSeedBlogPost}
            disabled={status === 'loading'}
          >
            SEED BLOG POST
          </PixelButton>
        </GlassCard>
      </div>
      
      {status === 'loading' && (
        <div className="status-message loading">
          ⏳ Seeding database... Please wait.
        </div>
      )}
      
      {status === 'success' && result && (
        <div className="status-message success">
          ✅ {result.message || 'Database seeded successfully!'}
          {result.counts && (
            <div className="result-counts">
              <span className="count-badge">📜 {result.counts.certificates} certs</span>
              <span className="count-badge">🚀 {result.counts.projects} projects</span>
              <span className="count-badge">🔗 {result.counts.socialLinks} links</span>
              <span className="count-badge">⚙️ {result.counts.settings} settings</span>
            </div>
          )}
        </div>
      )}
      
      {status === 'error' && (
        <div className="status-message error">
          ❌ Error: {error}
        </div>
      )}
    </section>
  )
}
