import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { SectionTitle, GlassCard, PixelButton, useToast } from '../../components/ui'

/**
 * ServiceEditor - Create/Edit a service
 */
export default function ServiceEditor() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const isEditing = serviceId && serviceId !== 'new'

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: '💼',
    description: '',
    features: [''],
    tech: [''],
    color: '#00d4ff',
    starterPrice: 500,
    packages: [
      { name: 'Starter', price: 500, description: '' },
      { name: 'Standard', price: 1500, description: '' },
      { name: 'Premium', price: 3000, description: '' }
    ],
    ctaText: 'GET STARTED',
    order: 1,
    active: true
  })

  // Fetch existing service if editing
  useEffect(() => {
    async function fetchService() {
      if (!isEditing) return
      
      try {
        const docRef = doc(db, 'services', serviceId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setFormData({ ...formData, ...docSnap.data() })
        } else {
          showToast('Service not found', 'error')
          navigate('/admin/services')
        }
      } catch (error) {
        console.error('Error fetching service:', error)
        showToast('Failed to load service', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId])

  // Generate slug from title
  function generateSlug(title) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  // Handle input changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Auto-generate slug from title
    if (name === 'title' && !isEditing) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  // Handle array field changes (features, tech)
  function handleArrayChange(field, index, value) {
    setFormData(prev => {
      const arr = [...prev[field]]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  // Add item to array field
  function addArrayItem(field) {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  // Remove item from array field
  function removeArrayItem(field, index) {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  // Handle package changes
  function handlePackageChange(index, key, value) {
    setFormData(prev => {
      const packages = [...prev.packages]
      packages[index] = { ...packages[index], [key]: key === 'price' ? Number(value) : value }
      return { ...prev, packages }
    })
  }

  // Save service
  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      const serviceData = {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        tech: formData.tech.filter(t => t.trim()),
        starterPrice: Number(formData.starterPrice),
        order: Number(formData.order),
        updatedAt: new Date().toISOString()
      }

      if (isEditing) {
        await updateDoc(doc(db, 'services', serviceId), serviceData)
        showToast('Service updated!', 'success')
      } else {
        const id = formData.slug || generateSlug(formData.title)
        await setDoc(doc(db, 'services', id), {
          ...serviceData,
          createdAt: new Date().toISOString()
        })
        showToast('Service created!', 'success')
      }

      navigate('/admin/services')
    } catch (error) {
      console.error('Error saving service:', error)
      showToast('Failed to save service', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Press Start 2P', color: '#00d4ff', fontSize: '0.8rem' }}>LOADING...</span>
      </div>
    )
  }

  return (
    <section className="service-editor">
      <style>{`
        .service-editor {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .back-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          display: inline-block;
        }
        .back-link:hover { color: #00d4ff; }

        .editor-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          padding: 1.5rem;
        }

        .section-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.75rem;
          color: #00d4ff;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 212, 255, 0.3);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
        }

        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #00d4ff;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .array-field {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .array-field input {
          flex: 1;
        }

        .array-btn {
          padding: 0.5rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }

        .array-btn:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .array-btn.remove:hover {
          border-color: #ff6b35;
          color: #ff6b35;
        }

        .add-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px dashed rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-size: 0.8rem;
          width: 100%;
        }

        .add-btn:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .package-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .package-card h4 {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.75rem;
        }

        .color-preview {
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          margin-left: 1rem;
          vertical-align: middle;
          border: 2px solid white;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .checkbox-group input {
          width: 20px;
          height: 20px;
          accent-color: #39ff14;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }
      `}</style>

      <Link to="/admin/services" className="back-link">← Back to Services</Link>
      <SectionTitle title={isEditing ? 'EDIT_SERVICE' : 'NEW_SERVICE'} extension=".admin" />

      <form className="editor-form" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <GlassCard className="form-section">
          <h3 className="section-title">BASIC INFO</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">TITLE *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Web Development"
              />
            </div>
            <div className="form-group">
              <label className="form-label">SLUG</label>
              <input
                type="text"
                name="slug"
                className="form-input"
                value={formData.slug}
                onChange={handleChange}
                placeholder="web-development"
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ICON (Emoji)</label>
              <input
                type="text"
                name="icon"
                className="form-input"
                value={formData.icon}
                onChange={handleChange}
                placeholder="💻"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                COLOR
                <span className="color-preview" style={{ backgroundColor: formData.color }} />
              </label>
              <input
                type="text"
                name="color"
                className="form-input"
                value={formData.color}
                onChange={handleChange}
                placeholder="#00d4ff"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">DESCRIPTION *</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe what this service offers..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">CTA BUTTON TEXT</label>
              <input
                type="text"
                name="ctaText"
                className="form-input"
                value={formData.ctaText}
                onChange={handleChange}
                placeholder="GET STARTED"
              />
            </div>
            <div className="form-group">
              <label className="form-label">ORDER</label>
              <input
                type="number"
                name="order"
                className="form-input"
                value={formData.order}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              id="active"
            />
            <label htmlFor="active" className="form-label" style={{ margin: 0 }}>
              ACTIVE (visible on site)
            </label>
          </div>
        </GlassCard>

        {/* Features */}
        <GlassCard className="form-section">
          <h3 className="section-title">FEATURES</h3>
          {formData.features.map((feature, idx) => (
            <div key={idx} className="array-field">
              <input
                type="text"
                className="form-input"
                value={feature}
                onChange={(e) => handleArrayChange('features', idx, e.target.value)}
                placeholder="Feature description..."
              />
              <button
                type="button"
                className="array-btn remove"
                onClick={() => removeArrayItem('features', idx)}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addArrayItem('features')}>
            + Add Feature
          </button>
        </GlassCard>

        {/* Tech Stack */}
        <GlassCard className="form-section">
          <h3 className="section-title">TECH STACK</h3>
          {formData.tech.map((t, idx) => (
            <div key={idx} className="array-field">
              <input
                type="text"
                className="form-input"
                value={t}
                onChange={(e) => handleArrayChange('tech', idx, e.target.value)}
                placeholder="Technology name..."
              />
              <button
                type="button"
                className="array-btn remove"
                onClick={() => removeArrayItem('tech', idx)}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addArrayItem('tech')}>
            + Add Technology
          </button>
        </GlassCard>

        {/* Pricing */}
        <GlassCard className="form-section">
          <h3 className="section-title">PRICING</h3>
          
          <div className="form-group">
            <label className="form-label">STARTING PRICE ($)</label>
            <input
              type="number"
              name="starterPrice"
              className="form-input"
              value={formData.starterPrice}
              onChange={handleChange}
              min="0"
            />
          </div>

          <h4 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', fontSize: '0.8rem' }}>
            PACKAGES
          </h4>
          {formData.packages.map((pkg, idx) => (
            <div key={idx} className="package-card">
              <h4>{['Starter', 'Standard', 'Premium'][idx] || `Package ${idx + 1}`}</h4>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">NAME</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pkg.name}
                    onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">PRICE ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={pkg.price}
                    onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                <label className="form-label">DESCRIPTION</label>
                <input
                  type="text"
                  className="form-input"
                  value={pkg.description}
                  onChange={(e) => handlePackageChange(idx, 'description', e.target.value)}
                  placeholder="What's included..."
                />
              </div>
            </div>
          ))}
        </GlassCard>

        {/* Actions */}
        <div className="form-actions">
          <PixelButton
            type="button"
            variant="outline"
            color="sunset"
            onClick={() => navigate('/admin/services')}
          >
            CANCEL
          </PixelButton>
          <PixelButton
            type="submit"
            variant="filled"
            color="matrix"
            disabled={saving}
          >
            {saving ? 'SAVING...' : (isEditing ? 'UPDATE' : 'CREATE')}
          </PixelButton>
        </div>
      </form>
    </section>
  )
}
