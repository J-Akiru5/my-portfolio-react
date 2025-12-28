import React, { useState } from 'react'
import { SectionTitle, PixelButton, GlassCard, useToast } from '../components/ui'
import { seedAllData, seedCertificates, seedProjects, seedSocialLinks, seedSettings } from '../utils/seedFirebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import firstBlogPost from '../data/firstBlogPost'

/**
 * Admin Seed Page
 * 
 * One-click database population for Firestore collections.
 * Navigate to /admin/seed to use this page.
 * Uses toast notifications in lower-right corner.
 */
export default function AdminSeed() {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  async function handleSeedAll() {
    setLoading(true)
    
    try {
      const res = await seedAllData()
      showToast(`Seeded: ${res.counts.certificates} certs, ${res.counts.projects} projects, ${res.counts.socialLinks} links`, 'success')
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSeedCollection(seedFn, name) {
    setLoading(true)
    
    try {
      const count = await seedFn()
      showToast(`Seeded ${count} ${name}`, 'success')
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSeedBlogPost() {
    setLoading(true)
    
    try {
      // Check if post already exists
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('slug', '==', firstBlogPost.slug))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        showToast('Blog post already exists!', 'info')
        setLoading(false)
        return
      }
      
      // Add the blog post
      await addDoc(postsRef, {
        ...firstBlogPost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      
      showToast('First blog post seeded successfully!', 'success')
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error')
    } finally {
      setLoading(false)
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
            disabled={loading}
          >
            {loading ? 'SEEDING...' : 'SEED ALL'}
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="seed-card">
          <h3>📜 CERTIFICATES</h3>
          <p>Seed only the certificates collection (30 certs).</p>
          <PixelButton 
            variant="outline" 
            color="electric"
            onClick={() => handleSeedCollection(seedCertificates, 'certificates')}
            disabled={loading}
          >
            SEED CERTS
          </PixelButton>
        </GlassCard>
        
        <GlassCard className="seed-card">
          <h3>🚀 PROJECTS</h3>
          <p>Seed only the projects collection (6 projects for carousel).</p>
          <PixelButton 
            variant="outline" 
            color="electric"
            onClick={() => handleSeedCollection(seedProjects, 'projects')}
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          >
            SEED BLOG POST
          </PixelButton>
        </GlassCard>
      </div>
    </section>
  )
}
