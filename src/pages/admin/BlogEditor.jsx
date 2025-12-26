import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { SectionTitle, GlassCard, PixelButton, ImageUpload } from '../../components/ui'
import { uploadImage } from '../../services/uploadService'
import MDEditor from '@uiw/react-md-editor'

/**
 * BlogEditor - Markdown-based post editor
 * 
 * Create and edit blog posts with direct Markdown editing.
 */
export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const isEditing = !!id

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tags, setTags] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const inlineImageInputRef = useRef(null)

  // Load existing post when editing
  useEffect(() => {
    async function fetchPost() {
      if (!id) return
      setLoading(true)
      try {
        const postRef = doc(db, 'posts', id)
        const snapshot = await getDoc(postRef)
        if (snapshot.exists()) {
          const data = snapshot.data()
          setTitle(data.title || '')
          setSlug(data.slug || '')
          setExcerpt(data.excerpt || '')
          setContent(data.content || '')
          setCoverImage(data.coverImage || '')
          setTags(data.tags?.join(', ') || '')
          setIsPublished(data.isPublished || false)
          setIsPremium(data.isPremium || false)
          setAffiliateUrl(data.affiliateUrl || '')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  function handleTitleChange(e) {
    const val = e.target.value
    setTitle(val)
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
    }
  }

  async function handleSave(publishState = isPublished) {
    if (!title) return
    setSaving(true)

    const postData = {
      title,
      slug,
      excerpt,
      content, // Already markdown!
      coverImage,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isPublished: publishState,
      isPremium,
      affiliateUrl,
      authorId: currentUser?.uid,
      updatedAt: serverTimestamp(),
    }

    try {
      if (isEditing) {
        await updateDoc(doc(db, 'posts', id), postData)
      } else {
        postData.createdAt = serverTimestamp()
        postData.viewsCount = 0
        await addDoc(collection(db, 'posts'), postData)
      }
      
      navigate('/admin/blog')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // Handle image upload for inline images
  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await uploadImage(file)
      if (result.success && result.url) {
        // Insert markdown image at cursor or end
        const imageMarkdown = `\n![${file.name}](${result.url})\n`
        setContent(prev => prev + imageMarkdown)
      }
    } catch (err) {
      alert('Image upload failed: ' + err.message)
    } finally {
      e.target.value = '' // Reset for same file
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div className="blog-editor" data-color-mode="dark">
      <style>{`
        .blog-editor {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .editor-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #00d4ff;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: white;
          font-size: 0.95rem;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #00d4ff;
        }
        
        .title-input {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        
        .checkbox-group {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .checkbox-label input {
          width: 18px;
          height: 18px;
          accent-color: #39ff14;
        }
        
        .insert-image-btn {
          margin-bottom: 1rem;
        }
        
        /* Markdown Editor Styling */
        .w-md-editor {
          background: rgba(0, 0, 0, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
        }
        
        .w-md-editor-toolbar {
          background: rgba(0, 0, 0, 0.6) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .w-md-editor-text-pre > code,
        .w-md-editor-text-input,
        .w-md-editor-text {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 14px !important;
        }
        
        .w-md-editor-preview {
          background: rgba(0, 0, 0, 0.3) !important;
        }
        
        .wmde-markdown {
          background: transparent !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .wmde-markdown h1, .wmde-markdown h2, .wmde-markdown h3 {
          color: #00d4ff !important;
          border-bottom-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .wmde-markdown code {
          background: rgba(0, 212, 255, 0.1) !important;
          color: #39ff14 !important;
        }
        
        .wmde-markdown pre {
          background: rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>

      <div className="editor-header">
        <SectionTitle 
          title={isEditing ? 'EDIT_POST' : 'NEW_POST'} 
          extension=".md" 
        />
        <div className="editor-actions">
          <PixelButton 
            variant="outline" 
            onClick={() => navigate('/admin/blog')}
          >
            CANCEL
          </PixelButton>
          
          {/* Save as Draft button */}
          <PixelButton 
            variant="outline" 
            color="electric"
            onClick={async () => {
              setIsPublished(false)
              await handleSave(false)
            }}
            disabled={saving || !title}
          >
            {saving ? 'SAVING...' : '💾 SAVE DRAFT'}
          </PixelButton>
          
          {/* Publish/Unpublish button */}
          {isPublished ? (
            <PixelButton 
              variant="outline" 
              color="fire"
              onClick={async () => {
                setIsPublished(false)
                await handleSave(false)
              }}
              disabled={saving || !title}
            >
              📤 UNPUBLISH
            </PixelButton>
          ) : (
            <PixelButton 
              variant="filled" 
              color="matrix"
              onClick={async () => {
                setIsPublished(true)
                await handleSave(true)
              }}
              disabled={saving || !title}
            >
              {saving ? 'PUBLISHING...' : '🚀 PUBLISH'}
            </PixelButton>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="form-group">
        <input
          type="text"
          className="form-input title-input"
          placeholder="Post Title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      {/* Cover Image Upload */}
      <div className="form-group">
        <label className="form-label">COVER IMAGE</label>
        <ImageUpload
          value={coverImage}
          onChange={setCoverImage}
          placeholder="Drag & drop cover image or click to select"
        />
        {coverImage && (
          <input
            type="text"
            className="form-input"
            placeholder="Or paste image URL..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            style={{ marginTop: '0.5rem' }}
          />
        )}
      </div>

      {/* Slug */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">URL SLUG</label>
          <input
            type="text"
            className="form-input"
            placeholder="url-friendly-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="form-group">
        <label className="form-label">EXCERPT</label>
        <input
          type="text"
          className="form-input"
          placeholder="A brief summary of your post..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>

      {/* Tags & Affiliate */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">TAGS (comma separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="React, JavaScript, Tutorial"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">AFFILIATE URL (optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="https://..."
            value={affiliateUrl}
            onChange={(e) => setAffiliateUrl(e.target.value)}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Publish (make visible)
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
          />
          Premium Content 💎
        </label>
      </div>

      {/* Insert Image Button */}
      <div className="insert-image-btn">
        <input
          ref={inlineImageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <PixelButton 
          variant="outline" 
          color="electric"
          onClick={() => inlineImageInputRef.current?.click()}
        >
          🖼️ Insert Image
        </PixelButton>
      </div>

      {/* Markdown Editor */}
      <div className="form-group">
        <label className="form-label">CONTENT (Markdown)</label>
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || '')}
          height={500}
          preview="live"
          hideToolbar={false}
        />
      </div>
    </div>
  )
}
