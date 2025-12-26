import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { SectionTitle, GlassCard, PixelButton, ImageUpload, useToast } from '../../components/ui'
import { uploadImage } from '../../services/uploadService'
import MDEditor from '@uiw/react-md-editor'

/**
 * BlogEditor - 3-Panel Markdown Editor with AI Assistant
 * 
 * Layout: Left Sidebar (metadata) | Center (editor) | Right (AI panel)
 */
export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { showToast } = useToast()
  const isEditing = !!id

  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tags, setTags] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [affiliateUrl, setAffiliateUrl] = useState('')
  
  // Reading time
  const [readingTimeOverride, setReadingTimeOverride] = useState(null)
  const [useCustomReadingTime, setUseCustomReadingTime] = useState(false)
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  
  // AI state
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  
  const inlineImageInputRef = useRef(null)
  const initialLoadRef = useRef(true)

  // Calculate reading time from word count
  const calculatedReadingTime = useCallback(() => {
    if (!content) return 1
    const wordCount = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / 200))
  }, [content])

  const readingTime = useCustomReadingTime && readingTimeOverride 
    ? readingTimeOverride 
    : calculatedReadingTime()

  // Load existing post
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
          if (data.readingTime) {
            setReadingTimeOverride(data.readingTime)
            setUseCustomReadingTime(true)
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        showToast('Failed to load post', 'error')
      } finally {
        setLoading(false)
        initialLoadRef.current = false
      }
    }
    fetchPost()
  }, [id, showToast])

  // Track unsaved changes
  useEffect(() => {
    if (!initialLoadRef.current) {
      setHasUnsavedChanges(true)
    }
  }, [title, slug, excerpt, content, coverImage, tags, isPublished, isPremium, affiliateUrl])

  function handleTitleChange(e) {
    const val = e.target.value
    setTitle(val)
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
    }
  }

  async function handleSave(publishState = null) {
    if (!title) {
      showToast('Title is required', 'warning')
      return
    }
    setSaving(true)

    const finalPublishState = publishState !== null ? publishState : isPublished

    const postData = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isPublished: finalPublishState,
      isPremium,
      affiliateUrl,
      readingTime: useCustomReadingTime ? readingTimeOverride : calculatedReadingTime(),
      authorId: currentUser?.uid,
      updatedAt: serverTimestamp(),
    }

    try {
      if (isEditing) {
        await updateDoc(doc(db, 'posts', id), postData)
        showToast('Changes saved!', 'success')
      } else {
        postData.createdAt = serverTimestamp()
        postData.viewsCount = 0
        await addDoc(collection(db, 'posts'), postData)
        showToast('Post created!', 'success')
      }
      
      setIsPublished(finalPublishState)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving post:', error)
      showToast('Failed to save: ' + error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    await handleSave(true)
    showToast('Post published!', 'success')
  }

  async function handleUnpublish() {
    await handleSave(false)
    showToast('Post unpublished', 'info')
  }

  function handleCancel() {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return
      }
    }
    navigate('/admin/blog')
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await uploadImage(file)
      if (result.success && result.url) {
        const imageMarkdown = `\n![${file.name}](${result.url})\n`
        setContent(prev => prev + imageMarkdown)
        showToast('Image inserted!', 'success')
      }
    } catch (err) {
      showToast('Image upload failed: ' + err.message, 'error')
    } finally {
      e.target.value = ''
    }
  }

  // AI Actions
  async function handleAIAction(action) {
    setAiLoading(true)
    try {
      const textToProcess = selectedText || content
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: textToProcess,
          customPrompt: action === 'custom' ? aiPrompt : null
        })
      })
      
      if (!response.ok) throw new Error('AI request failed')
      
      const data = await response.json()
      if (data.result) {
        if (selectedText) {
          setContent(prev => prev.replace(selectedText, data.result))
        } else {
          setContent(data.result)
        }
        showToast('AI applied!', 'success')
      }
    } catch (error) {
      showToast('AI error: ' + error.message, 'error')
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#00d4ff'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div className="blog-editor-container" data-color-mode="dark">
      <style>{`
        .blog-editor-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
        }

        /* Header */
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .unsaved-indicator {
          font-size: 0.75rem;
          color: #ffaa00;
          padding: 4px 8px;
          background: rgba(255, 170, 0, 0.1);
          border-radius: 4px;
        }

        /* Main Layout */
        .editor-main {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* Left Sidebar */
        .left-sidebar {
          width: ${leftSidebarCollapsed ? '50px' : '280px'};
          background: rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          overflow: hidden;
          flex-shrink: 0;
        }

        .sidebar-toggle {
          padding: 0.75rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          color: #00d4ff;
          font-size: 1.2rem;
        }

        .sidebar-toggle:hover {
          background: rgba(0, 212, 255, 0.1);
        }

        .sidebar-content {
          padding: 1rem;
          overflow-y: auto;
          flex: 1;
          display: ${leftSidebarCollapsed ? 'none' : 'block'};
        }

        /* Center Editor */
        .center-editor {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        .editor-toolbar-custom {
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .md-editor-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Right AI Panel */
        .right-panel {
          width: ${rightPanelCollapsed ? '50px' : '320px'};
          background: rgba(0, 0, 0, 0.3);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          overflow: hidden;
          flex-shrink: 0;
        }

        .panel-toggle {
          padding: 0.75rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          color: #39ff14;
          font-size: 1.2rem;
        }

        .panel-toggle:hover {
          background: rgba(57, 255, 20, 0.1);
        }

        .panel-content {
          padding: 1rem;
          overflow-y: auto;
          flex: 1;
          display: ${rightPanelCollapsed ? 'none' : 'block'};
        }

        /* Form Elements */
        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: #00d4ff;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
        }

        .form-input {
          width: 100%;
          padding: 0.6rem 0.75rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          color: white;
          font-size: 0.85rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .form-input:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 8px rgba(0, 212, 255, 0.2);
        }

        .form-textarea {
          min-height: 60px;
          resize: vertical;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
        }

        .checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: #39ff14;
        }

        /* Reading Time */
        .reading-time-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(0, 212, 255, 0.1);
          border-radius: 4px;
          font-size: 0.85rem;
          color: #00d4ff;
        }

        .reading-time-override {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .time-input {
          width: 60px;
          padding: 0.4rem;
          text-align: center;
        }

        /* AI Panel Styling */
        .ai-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #39ff14;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ai-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .ai-btn {
          padding: 0.6rem 1rem;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 4px;
          color: #39ff14;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .ai-btn:hover:not(:disabled) {
          background: rgba(57, 255, 20, 0.2);
          border-color: #39ff14;
        }

        .ai-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-custom-prompt {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ai-textarea {
          width: 100%;
          min-height: 80px;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(57, 255, 20, 0.2);
          border-radius: 4px;
          color: white;
          font-size: 0.85rem;
          resize: vertical;
          margin-bottom: 0.5rem;
        }

        .ai-textarea:focus {
          outline: none;
          border-color: #39ff14;
        }

        .ai-hint {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.75rem;
        }

        /* MD Editor Overrides */
        .w-md-editor {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          background: transparent !important;
          border: none !important;
        }

        .w-md-editor-toolbar {
          background: rgba(0, 0, 0, 0.5) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .w-md-editor-content {
          flex: 1 !important;
          overflow: hidden !important;
        }

        .w-md-editor-text-pre > code,
        .w-md-editor-text-input,
        .w-md-editor-text {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 14px !important;
        }

        .w-md-editor-preview,
        .w-md-editor-text {
          height: 100% !important;
          overflow-y: auto !important;
        }

        .wmde-markdown {
          background: transparent !important;
          color: rgba(255, 255, 255, 0.9) !important;
          padding: 1rem !important;
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

        /* Responsive */
        @media (max-width: 1024px) {
          .left-sidebar {
            width: ${leftSidebarCollapsed ? '50px' : '220px'};
          }
          .right-panel {
            width: ${rightPanelCollapsed ? '50px' : '260px'};
          }
        }

        @media (max-width: 768px) {
          .left-sidebar, .right-panel {
            position: absolute;
            z-index: 50;
            height: calc(100vh - 60px);
            top: 60px;
          }
          .left-sidebar {
            left: 0;
          }
          .right-panel {
            right: 0;
          }
        }
      `}</style>

      {/* Header */}
      <header className="editor-header">
        <div className="header-left">
          <SectionTitle 
            title={isEditing ? 'EDIT_POST' : 'NEW_POST'} 
            extension=".md"
            style={{ margin: 0 }}
          />
          {hasUnsavedChanges && (
            <span className="unsaved-indicator">● Unsaved</span>
          )}
        </div>
        <div className="header-actions">
          <PixelButton variant="outline" size="small" onClick={handleCancel}>
            Cancel
          </PixelButton>
          <PixelButton 
            variant="outline" 
            color="electric" 
            size="small"
            onClick={() => handleSave()}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save'}
          </PixelButton>
          {isPublished ? (
            <PixelButton 
              variant="outline" 
              color="fire" 
              size="small"
              onClick={handleUnpublish}
              disabled={saving}
            >
              📤 Unpublish
            </PixelButton>
          ) : (
            <PixelButton 
              variant="filled" 
              color="matrix" 
              size="small"
              onClick={handlePublish}
              disabled={saving}
            >
              🚀 Publish
            </PixelButton>
          )}
        </div>
      </header>

      {/* Main 3-Panel Layout */}
      <div className="editor-main">
        
        {/* Left Sidebar - Metadata */}
        <aside className="left-sidebar">
          <div 
            className="sidebar-toggle" 
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            title={leftSidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {leftSidebarCollapsed ? '▶' : '◀'}
          </div>
          
          <div className="sidebar-content">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Post title..."
                value={title}
                onChange={handleTitleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                type="text"
                className="form-input"
                placeholder="url-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Excerpt</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Brief summary..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cover Image</label>
              <ImageUpload
                value={coverImage}
                onChange={setCoverImage}
                placeholder="Drop image"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                className="form-input"
                placeholder="React, Web Dev..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reading Time</label>
              <div className="reading-time-display">
                ⏱️ {readingTime} min read
              </div>
              <div className="reading-time-override">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={useCustomReadingTime}
                    onChange={(e) => setUseCustomReadingTime(e.target.checked)}
                  />
                  Override
                </label>
                {useCustomReadingTime && (
                  <input
                    type="number"
                    className="form-input time-input"
                    min="1"
                    value={readingTimeOverride || calculatedReadingTime()}
                    onChange={(e) => setReadingTimeOverride(parseInt(e.target.value) || 1)}
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Affiliate URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://..."
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                />
                💎 Premium Content
              </label>
            </div>
          </div>
        </aside>

        {/* Center - Markdown Editor */}
        <main className="center-editor">
          <div className="editor-toolbar-custom">
            <input
              ref={inlineImageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <PixelButton 
              variant="outline" 
              size="small"
              onClick={() => inlineImageInputRef.current?.click()}
            >
              🖼️ Insert Image
            </PixelButton>
          </div>
          
          <div className="md-editor-wrapper">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height="100%"
              preview="live"
              hideToolbar={false}
              visibleDragbar={false}
              onTextSelected={(text) => setSelectedText(text)}
            />
          </div>
        </main>

        {/* Right Panel - AI Assistant */}
        <aside className="right-panel">
          <div 
            className="panel-toggle"
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            title={rightPanelCollapsed ? 'Expand AI' : 'Collapse AI'}
          >
            {rightPanelCollapsed ? '🤖' : '▶'}
          </div>
          
          <div className="panel-content">
            <h3 className="ai-title">🤖 AI Assistant</h3>
            
            <p className="ai-hint">
              {selectedText 
                ? `Selected: "${selectedText.substring(0, 30)}..."` 
                : 'Select text to apply AI, or use on full content'}
            </p>

            <div className="ai-actions">
              <button 
                className="ai-btn" 
                onClick={() => handleAIAction('improve')}
                disabled={aiLoading || !content}
              >
                ✨ Improve Writing
              </button>
              <button 
                className="ai-btn" 
                onClick={() => handleAIAction('expand')}
                disabled={aiLoading || !content}
              >
                📝 Expand Content
              </button>
              <button 
                className="ai-btn" 
                onClick={() => handleAIAction('summarize')}
                disabled={aiLoading || !content}
              >
                📋 Summarize
              </button>
              <button 
                className="ai-btn" 
                onClick={() => handleAIAction('generate')}
                disabled={aiLoading}
              >
                💡 Generate from Title
              </button>
              <button 
                className="ai-btn" 
                onClick={() => handleAIAction('grammar')}
                disabled={aiLoading || !content}
              >
                🔤 Fix Grammar
              </button>
            </div>

            <div className="ai-custom-prompt">
              <label className="form-label">Custom Prompt</label>
              <textarea
                className="ai-textarea"
                placeholder="Enter custom instructions for AI..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <PixelButton 
                variant="filled" 
                color="matrix" 
                size="small"
                onClick={() => handleAIAction('custom')}
                disabled={aiLoading || !aiPrompt}
                style={{ width: '100%' }}
              >
                {aiLoading ? '⏳ Processing...' : '🚀 Run Custom'}
              </PixelButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
