import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { SectionTitle, GlassCard, PixelButton } from '../../components/ui'

/**
 * ProjectEditor - Create/Edit project form
 * 
 * Used for adding new projects or editing existing ones.
 */
export default function ProjectEditor() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const isEditing = projectId && projectId !== 'new'

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [codeUrl, setCodeUrl] = useState('')
  const [color, setColor] = useState('#00d4ff')
  const [order, setOrder] = useState(0)
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Load existing project if editing
  useEffect(() => {
    if (isEditing) {
      loadProject()
    }
  }, [projectId])

  async function loadProject() {
    setLoading(true)
    try {
      const docRef = doc(db, 'projects', projectId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setTitle(data.title || '')
        setDescription(data.description || '')
        setImage(data.image || '')
        setTags((data.tags || []).join(', '))
        setLiveUrl(data.liveUrl || '')
        setCodeUrl(data.codeUrl || '')
        setColor(data.color || '#00d4ff')
        setOrder(data.order || 0)
      } else {
        setError('Project not found')
      }
    } catch (err) {
      console.error('Error loading project:', err)
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    
    setSaving(true)
    setError('')
    
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      liveUrl: liveUrl.trim() || '#',
      codeUrl: codeUrl.trim() || '#',
      color: color,
      order: parseInt(order) || 0,
      updatedAt: serverTimestamp(),
    }
    
    try {
      if (isEditing) {
        // Update existing
        await updateDoc(doc(db, 'projects', projectId), projectData)
      } else {
        // Create new
        projectData.createdAt = serverTimestamp()
        await addDoc(collection(db, 'projects'), projectData)
      }
      
      navigate('/admin/projects')
    } catch (err) {
      console.error('Error saving project:', err)
      setError('Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="project-editor">
      <style>{`
        .project-editor {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
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
        
        .editor-header {
          margin-bottom: 2rem;
        }
        
        .editor-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-label {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.65rem;
          color: #00d4ff;
          text-transform: uppercase;
        }
        
        .form-input,
        .form-textarea {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          padding: 0.75rem;
          color: white;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #00d4ff;
        }
        
        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .color-preview {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .image-preview {
          margin-top: 0.5rem;
        }
        
        .image-preview img {
          max-width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 4px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .error-message {
          background: rgba(255, 107, 53, 0.2);
          border: 1px solid #ff6b35;
          padding: 1rem;
          border-radius: 4px;
          color: #ff6b35;
          margin-bottom: 1rem;
        }
        
        .helper-text {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Link to="/admin/projects" className="back-link">← Back to Projects</Link>

      <div className="editor-header">
        <SectionTitle 
          title={isEditing ? 'EDIT_PROJECT' : 'NEW_PROJECT'} 
          extension=".form" 
        />
      </div>

      {loading ? (
        <GlassCard>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading project...
          </div>
        </GlassCard>
      ) : (
        <GlassCard>
          {error && <div className="error-message">{error}</div>}
          
          <form className="editor-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Project"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of what this project does..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-input"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/assets/project-screenshot.png"
              />
              <span className="helper-text">Path to image in public/assets or external URL</span>
              {image && (
                <div className="image-preview">
                  <img src={image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                className="form-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, Firebase, Tailwind"
              />
              <span className="helper-text">Comma-separated list of technologies</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Live URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Code URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={codeUrl}
                  onChange={(e) => setCodeUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Accent Color</label>
                <div className="color-preview">
                  <input
                    type="color"
                    className="color-swatch"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#00d4ff"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  className="form-input"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  placeholder="0"
                  min="0"
                />
                <span className="helper-text">Lower numbers appear first</span>
              </div>
            </div>

            <div className="form-actions">
              <PixelButton 
                type="submit" 
                variant="filled" 
                color="matrix"
                disabled={saving}
              >
                {saving ? 'SAVING...' : (isEditing ? 'UPDATE PROJECT' : 'CREATE PROJECT')}
              </PixelButton>
              
              <PixelButton 
                type="button" 
                variant="outline" 
                color="electric"
                onClick={() => navigate('/admin/projects')}
              >
                CANCEL
              </PixelButton>
            </div>
          </form>
        </GlassCard>
      )}
    </div>
  )
}
