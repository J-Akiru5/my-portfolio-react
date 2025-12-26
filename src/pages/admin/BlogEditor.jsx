import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { common, createLowlight } from 'lowlight'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { SectionTitle, GlassCard, PixelButton, ImageUpload } from '../../components/ui'
import { uploadImage } from '../../services/uploadService'
import TurndownService from 'turndown'

const lowlight = createLowlight(common)
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
})

/**
 * BlogEditor - Tiptap-based post editor
 * 
 * Create and edit blog posts with rich text, code blocks, and images.
 */
export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const isEditing = !!id

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tags, setTags] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [inlineImageUploading, setInlineImageUploading] = useState(false)
  const inlineImageInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your masterpiece...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
    content: '',
  })

  // Load post for editing
  useEffect(() => {
    if (isEditing && id) {
      loadPost()
    }
  }, [id, isEditing]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadPost() {
    setLoading(true)
    try {
      const postDoc = await getDoc(doc(db, 'posts', id))
      if (postDoc.exists()) {
        const data = postDoc.data()
        setTitle(data.title || '')
        setSlug(data.slug || '')
        setExcerpt(data.excerpt || '')
        setCoverImage(data.coverImage || '')
        setTags(data.tags?.join(', ') || '')
        setIsPublished(data.isPublished || false)
        setIsPremium(data.isPremium || false)
        setAffiliateUrl(data.affiliateUrl || '')
        editor?.commands.setContent(data.content || '')
      }
    } catch (error) {
      console.error('Error loading post:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate slug from title
  function handleTitleChange(e) {
    const val = e.target.value
    setTitle(val)
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
    }
  }

  async function handleSave(publishState = isPublished) {
    if (!title || !editor) return
    setSaving(true)

    const postData = {
      title,
      slug,
      excerpt,
      content: turndownService.turndown(editor.getHTML()),
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

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div className="blog-editor">
      <style>{`
        .blog-editor {
          padding: 2rem;
          max-width: 900px;
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
          gap: 1rem;
          align-items: center;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.65rem;
          color: #00d4ff;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: white;
          font-size: 1rem;
          font-family: inherit;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #00d4ff;
        }
        
        .form-input.title-input {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .checkbox-group {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .checkbox-label input {
          accent-color: #00d4ff;
          width: 18px;
          height: 18px;
        }
        
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px 8px 0 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: none;
        }
        
        .toolbar-btn {
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .toolbar-btn:hover {
          background: rgba(0, 212, 255, 0.1);
          border-color: #00d4ff;
          color: #00d4ff;
        }
        
        .toolbar-btn.active {
          background: rgba(0, 212, 255, 0.2);
          border-color: #00d4ff;
          color: #00d4ff;
        }
        
        .editor-wrapper {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0 0 8px 8px;
          min-height: 400px;
        }
        
        .editor-content {
          padding: 1.5rem;
          min-height: 400px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          line-height: 1.8;
        }
        
        .editor-content:focus {
          outline: none;
        }
        
        .editor-content p {
          margin-bottom: 1rem;
        }
        
        .editor-content h1,
        .editor-content h2,
        .editor-content h3 {
          color: #00d4ff;
          margin: 1.5rem 0 1rem;
        }
        
        .editor-content pre {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .editor-content code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
        }
        
        .editor-content a {
          color: #39ff14;
        }
        
        .editor-content ul,
        .editor-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .editor-content .is-empty::before {
          content: attr(data-placeholder);
          color: rgba(255, 255, 255, 0.3);
          pointer-events: none;
          float: left;
          height: 0;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
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
          placeholder="Short description for preview cards..."
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
            placeholder="react, gsap, tutorial"
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

      {/* Publish Options */}
      <div className="form-group">
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
      </div>

      {/* Editor Toolbar */}
      <div className="toolbar">
        <button
          className={`toolbar-btn ${editor?.isActive('bold') ? 'active' : ''}`}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          className={`toolbar-btn ${editor?.isActive('italic') ? 'active' : ''}`}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          className={`toolbar-btn ${editor?.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          className={`toolbar-btn ${editor?.isActive('heading', { level: 3 }) ? 'active' : ''}`}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          className={`toolbar-btn ${editor?.isActive('bulletList') ? 'active' : ''}`}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          className={`toolbar-btn ${editor?.isActive('orderedList') ? 'active' : ''}`}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          className={`toolbar-btn ${editor?.isActive('codeBlock') ? 'active' : ''}`}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          {'</>'}  Code
        </button>
        <button
          className="toolbar-btn"
          onClick={() => {
            const url = window.prompt('Enter URL:')
            if (url) editor?.chain().focus().setLink({ href: url }).run()
          }}
        >
          🔗 Link
        </button>
        
        {/* Inline Image Upload */}
        <input
          ref={inlineImageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file || !editor) return
            
            setInlineImageUploading(true)
            try {
              const result = await uploadImage(file)
              if (result.success && result.url) {
                editor.chain().focus().setImage({ src: result.url }).run()
              }
            } catch (err) {
              alert('Image upload failed: ' + err.message)
            } finally {
              setInlineImageUploading(false)
              e.target.value = '' // Reset for same file
            }
          }}
        />
        <button
          className="toolbar-btn"
          onClick={() => inlineImageInputRef.current?.click()}
          disabled={inlineImageUploading}
        >
          {inlineImageUploading ? '⏳...' : '🖼️ Image'}
        </button>
      </div>

      {/* Editor Area */}
      <GlassCard className="editor-wrapper">
        <EditorContent editor={editor} />
      </GlassCard>
    </div>
  )
}
