import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { SectionTitle, GlassCard, PixelButton } from '../../components/ui'

/**
 * ProjectsDashboard - Admin projects management
 * 
 * List, edit, delete projects from admin panel.
 */
export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const projectsRef = collection(db, 'projects')
      const q = query(projectsRef, orderBy('order', 'asc'))
      const snapshot = await getDocs(q)
      
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setProjects(projectsData)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(projectId, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    
    try {
      await deleteDoc(doc(db, 'projects', projectId))
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  return (
    <div className="projects-dashboard">
      <style>{`
        .projects-dashboard {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .back-link {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          display: inline-block;
        }
        
        .back-link:hover {
          color: #00d4ff;
        }
        
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .project-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .project-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 1rem;
          background: #1a1a2e;
        }
        
        .project-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          color: #00d4ff;
          margin-bottom: 0.5rem;
        }
        
        .project-desc {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
          flex-grow: 1;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .tag {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          color: #39ff14;
        }
        
        .project-order {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 1rem;
        }
        
        .action-btns {
          display: flex;
          gap: 0.5rem;
        }
        
        .action-btn {
          padding: 0.4rem 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: white;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        
        .action-btn:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }
        
        .action-btn.delete:hover {
          border-color: #ff6b35;
          color: #ff6b35;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .stats-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          flex: 1;
          padding: 1rem 1.5rem !important;
          text-align: center;
        }
        
        .stat-number {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.5rem;
          color: #00d4ff;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.5rem;
        }
      `}</style>

      <Link to="/admin" className="back-link">← Back to Dashboard</Link>

      <div className="dashboard-header">
        <SectionTitle title="PROJECTS_MANAGER" extension=".cms" />
        <Link to="/admin/projects/new">
          <PixelButton variant="filled" color="matrix">
            + NEW PROJECT
          </PixelButton>
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <GlassCard className="stat-card">
          <div className="stat-number">{projects.length}</div>
          <div className="stat-label">Total Projects</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-number">
            {projects.filter(p => p.liveUrl && p.liveUrl !== '#').length}
          </div>
          <div className="stat-label">Live</div>
        </GlassCard>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <GlassCard>
          <div className="empty-state">Loading projects...</div>
        </GlassCard>
      ) : projects.length === 0 ? (
        <GlassCard>
          <div className="empty-state">
            <p>No projects yet. Add your first project!</p>
          </div>
        </GlassCard>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <GlassCard key={project.id} className="project-card" hoverEffect={true}>
              <img 
                src={project.image || '/placeholder.png'} 
                alt={project.title} 
                className="project-image"
              />
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {(project.tags || []).slice(0, 3).map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
              <div className="project-order">Order: {project.order}</div>
              <div className="action-btns">
                <Link to={`/admin/projects/${project.id}`} className="action-btn">
                  Edit
                </Link>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDelete(project.id, project.title)}
                >
                  Delete
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
