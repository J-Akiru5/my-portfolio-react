import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { SectionTitle, GlassCard, PixelButton, ImageUpload, useToast } from '../../components/ui'
import { uploadImage } from '../../services/uploadService'
import MDEditor from '@uiw/react-md-editor'
import * as Diff from 'diff'

/**
 * BlogEditor - 3-Panel Markdown Editor with Advanced AI Assistant
 * 
 * Features:
 * - Chat-style AI conversation
 * - Selection-based editing
 * - Inline diff preview in editor
 * - Accept/Reject workflow
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
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  
  // Selection and Diff state
  const [selectedText, setSelectedText] = useState('')
  const [selectionRange, setSelectionRange] = useState(null)
  const [pendingChanges, setPendingChanges] = useState(null)
  // { original: string, modified: string, fullOriginal: string, fullModified: string }
  
  const inlineImageInputRef = useRef(null)
  const initialLoadRef = useRef(true)
  const chatEndRef = useRef(null)
  const editorRef = useRef(null)

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

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Track text selection in editor
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      const text = selection?.toString() || ''
      setSelectedText(text)
      
      if (text && selection.rangeCount > 0) {
        // Find selection position in content
        const start = content.indexOf(text)
        if (start !== -1) {
          setSelectionRange({ start, end: start + text.length })
        }
      } else {
        setSelectionRange(null)
      }
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)
    
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
    }
  }, [content])

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

  // Generate diff content for preview
  function generateDiffContent(original, modified) {
    const diff = Diff.diffWords(original, modified)
    let result = ''
    
    diff.forEach(part => {
      if (part.added) {
        result += `<ins class="diff-added">${part.value}</ins>`
      } else if (part.removed) {
        result += `<del class="diff-removed">${part.value}</del>`
      } else {
        result += part.value
      }
    })
    
    return result
  }

  // AI Actions
  async function callAI(action, customPrompt = null) {
    setAiLoading(true)
    
    // Determine what text to process
    const textToProcess = selectedText || content
    const isPartialEdit = !!selectedText
    
    // Add user message to chat
    const userMessage = customPrompt || `${action} the ${isPartialEdit ? 'selected text' : 'content'}`
    setChatMessages(prev => [...prev, { 
      id: Date.now(), 
      role: 'user', 
      content: userMessage 
    }])

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: customPrompt ? 'custom' : action,
          text: textToProcess,
          customPrompt: customPrompt,
          title: title
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || error.error || 'AI request failed')
      }
      
      const data = await response.json()
      
      if (data.result) {
        // Calculate full modified content
        let fullModified = content
        if (isPartialEdit && selectionRange) {
          fullModified = content.slice(0, selectionRange.start) + 
                        data.result + 
                        content.slice(selectionRange.end)
        } else {
          fullModified = data.result
        }
        
        // Set pending changes for review
        setPendingChanges({
          original: textToProcess,
          modified: data.result,
          fullOriginal: content,
          fullModified: fullModified,
          isPartialEdit
        })
        
        // Add AI message
        setChatMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'ai', 
          content: 'I\'ve made some changes. Please review the diff in the editor and accept or reject.'
        }])
      }
    } catch (error) {
      console.error('AI Error:', error)
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'ai', 
        content: `Error: ${error.message}`,
        isError: true
      }])
      showToast('AI error: ' + error.message, 'error')
    } finally {
      setAiLoading(false)
    }
  }

  function handleQuickAction(action) {
    callAI(action)
  }

  function handleSendChat() {
    if (!chatInput.trim()) return
    callAI('custom', chatInput.trim())
    setChatInput('')
  }

  function handleAcceptChanges() {
    if (pendingChanges) {
      setContent(pendingChanges.fullModified)
      setPendingChanges(null)
      showToast('Changes applied!', 'success')
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'system', 
        content: '✅ Changes accepted and applied.'
      }])
    }
  }

  function handleRejectChanges() {
    setPendingChanges(null)
    showToast('Changes discarded', 'info')
    setChatMessages(prev => [...prev, { 
      id: Date.now(), 
      role: 'system', 
      content: '❌ Changes rejected.'
    }])
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

  // Show diff content when pending changes
  const displayContent = pendingChanges 
    ? generateDiffContent(pendingChanges.original, pendingChanges.modified)
    : null

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
          position: relative;
        }

        /* Diff Overlay */
        .diff-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 10;
          padding: 1.5rem;
          overflow-y: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
          white-space: pre-wrap;
        }

        .diff-overlay .diff-added {
          background: rgba(57, 255, 20, 0.25);
          color: #39ff14;
          text-decoration: none;
          padding: 0 2px;
          border-radius: 2px;
        }

        .diff-overlay .diff-removed {
          background: rgba(255, 107, 107, 0.25);
          color: #ff6b6b;
          text-decoration: line-through;
          padding: 0 2px;
          border-radius: 2px;
        }

        .diff-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .diff-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #00d4ff;
        }

        /* Right AI Panel */
        .right-panel {
          width: 350px;
          background: rgba(0, 0, 0, 0.3);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
        }

        .ai-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #39ff14;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Quick Actions */
        .quick-actions {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-actions.hidden {
          display: none;
        }

        .quick-btn {
          padding: 0.4rem 0.75rem;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 4px;
          color: #39ff14;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-btn:hover:not(:disabled) {
          background: rgba(57, 255, 20, 0.2);
          border-color: #39ff14;
        }

        .quick-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .selection-hint {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          padding: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Chat Messages */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .chat-message {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          line-height: 1.5;
          max-width: 90%;
        }

        .chat-message.user {
          background: rgba(0, 212, 255, 0.15);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #00d4ff;
          align-self: flex-end;
        }

        .chat-message.ai {
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.2);
          color: rgba(255, 255, 255, 0.9);
          align-self: flex-start;
        }

        .chat-message.ai.error {
          background: rgba(255, 107, 107, 0.1);
          border-color: rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
        }

        .chat-message.system {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          align-self: center;
          text-align: center;
        }

        /* Accept/Reject Bar */
        .accept-reject-bar {
          padding: 0.75rem 1rem;
          background: rgba(57, 255, 20, 0.1);
          border-top: 1px solid rgba(57, 255, 20, 0.3);
          border-bottom: 1px solid rgba(57, 255, 20, 0.3);
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .accept-btn {
          padding: 0.5rem 1.5rem;
          background: rgba(57, 255, 20, 0.2);
          border: 1px solid #39ff14;
          border-radius: 4px;
          color: #39ff14;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .accept-btn:hover {
          background: rgba(57, 255, 20, 0.4);
        }

        .reject-btn {
          padding: 0.5rem 1.5rem;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.5);
          border-radius: 4px;
          color: #ff6b6b;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reject-btn:hover {
          background: rgba(255, 107, 107, 0.2);
        }

        /* Chat Input */
        .chat-input-area {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-input-wrapper {
          display: flex;
          gap: 0.5rem;
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          color: white;
          font-size: 0.85rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .chat-input:focus {
          outline: none;
          border-color: #39ff14;
        }

        .chat-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .send-btn {
          padding: 0.75rem 1rem;
          background: rgba(57, 255, 20, 0.2);
          border: 1px solid #39ff14;
          border-radius: 4px;
          color: #39ff14;
          cursor: pointer;
          transition: all 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: rgba(57, 255, 20, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        @media (max-width: 1024px) {
          .left-sidebar {
            width: ${leftSidebarCollapsed ? '50px' : '220px'};
          }
          .right-panel {
            width: 300px;
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
          
          <div className="md-editor-wrapper" ref={editorRef}>
            {/* Diff Overlay when pending changes */}
            {pendingChanges && displayContent && (
              <div className="diff-overlay">
                <div className="diff-header">
                  <span className="diff-title">📝 REVIEW CHANGES</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                    {pendingChanges.isPartialEdit ? 'Selected text' : 'Full content'}
                  </span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: displayContent }} />
              </div>
            )}
            
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height="100%"
              preview="live"
              hideToolbar={false}
              visibleDragbar={false}
            />
          </div>
        </main>

        {/* Right Panel - AI Assistant */}
        <aside className="right-panel">
          <div className="ai-header">
            🤖 AI_ASSISTANT
          </div>
          
          {/* Quick Actions - Only show when text is selected */}
          <div className={`quick-actions ${selectedText ? '' : 'hidden'}`}>
            <button 
              className="quick-btn" 
              onClick={() => handleQuickAction('improve')}
              disabled={aiLoading}
            >
              ✨ Improve
            </button>
            <button 
              className="quick-btn" 
              onClick={() => handleQuickAction('expand')}
              disabled={aiLoading}
            >
              📝 Expand
            </button>
            <button 
              className="quick-btn" 
              onClick={() => handleQuickAction('summarize')}
              disabled={aiLoading}
            >
              📋 Summarize
            </button>
            <button 
              className="quick-btn" 
              onClick={() => handleQuickAction('grammar')}
              disabled={aiLoading}
            >
              🔤 Fix Grammar
            </button>
          </div>

          {/* Selection hint */}
          {!selectedText && (
            <div className="selection-hint">
              Select text in editor for quick actions
            </div>
          )}

          {/* Chat Messages */}
          <div className="chat-messages">
            {chatMessages.length === 0 && (
              <div style={{ 
                color: 'rgba(255,255,255,0.4)', 
                textAlign: 'center', 
                marginTop: '2rem',
                fontSize: '0.85rem'
              }}>
                Start a conversation with the AI assistant.<br/>
                Select text for quick actions, or type below.
              </div>
            )}
            {chatMessages.map(msg => (
              <div 
                key={msg.id} 
                className={`chat-message ${msg.role} ${msg.isError ? 'error' : ''}`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Accept/Reject Bar - Only show when pending changes */}
          {pendingChanges && (
            <div className="accept-reject-bar">
              <button className="accept-btn" onClick={handleAcceptChanges}>
                ✓ ACCEPT
              </button>
              <button className="reject-btn" onClick={handleRejectChanges}>
                ✕ REJECT
              </button>
            </div>
          )}

          {/* Chat Input */}
          <div className="chat-input-area">
            <div className="chat-input-wrapper">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask AI anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                disabled={aiLoading}
              />
              <button 
                className="send-btn" 
                onClick={handleSendChat}
                disabled={aiLoading || !chatInput.trim()}
              >
                {aiLoading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
