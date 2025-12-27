import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { SectionTitle, PixelButton, ImageUpload, useToast } from '../../components/ui'
import { uploadImage } from '../../services/uploadService'
import MDEditor from '@uiw/react-md-editor'
import * as Diff from 'diff'

/**
 * BlogEditor - 3-Panel Markdown Editor with Advanced AI Assistant
 * 
 * Features:
 * - Smart conversational AI with intent detection
 * - Undo/Redo with history stack
 * - Editable diff preview
 * - Chat persistence per post in Firebase
 * - Selection-based editing
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
  const [editableDiff, setEditableDiff] = useState('') // For editing the suggested changes
  const [cursorPosition, setCursorPosition] = useState(null) // Track cursor for image insert
  
  // Undo/Redo history
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const MAX_HISTORY = 50
  
  const inlineImageInputRef = useRef(null)
  const initialLoadRef = useRef(true)
  const chatEndRef = useRef(null)
  const editorRef = useRef(null)
  const contentBeforeAI = useRef('')

  // Push content to undo stack
  const pushToUndo = useCallback((contentToPush) => {
    setUndoStack(prev => {
      const newStack = [...prev, contentToPush]
      return newStack.slice(-MAX_HISTORY)
    })
    setRedoStack([]) // Clear redo when new action is taken
  }, [])

  // Undo action
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return
    
    const previousContent = undoStack[undoStack.length - 1]
    setRedoStack(prev => [...prev, content])
    setUndoStack(prev => prev.slice(0, -1))
    setContent(previousContent)
    showToast('Undone', 'info')
  }, [undoStack, content, showToast])

  // Redo action
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    
    const nextContent = redoStack[redoStack.length - 1]
    setUndoStack(prev => [...prev, content])
    setRedoStack(prev => prev.slice(0, -1))
    setContent(nextContent)
    showToast('Redone', 'info')
  }, [redoStack, content, showToast])

  // Calculate reading time
  const calculatedReadingTime = useCallback(() => {
    if (!content) return 1
    const wordCount = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / 200))
  }, [content])

  const readingTime = useCustomReadingTime && readingTimeOverride 
    ? readingTimeOverride 
    : calculatedReadingTime()

  // Load existing post and chat history
  useEffect(() => {
    async function fetchPost() {
      if (!id) return
      setLoading(true)
      try {
        // Load post
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
        
        // Load chat history for this post
        const chatRef = doc(db, 'postChats', id)
        const chatSnapshot = await getDoc(chatRef)
        if (chatSnapshot.exists()) {
          setChatMessages(chatSnapshot.data().messages || [])
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

  // Save chat history to Firebase when it changes
  useEffect(() => {
    async function saveChatHistory() {
      if (!id || chatMessages.length === 0 || initialLoadRef.current) return
      
      try {
        const chatRef = doc(db, 'postChats', id)
        await setDoc(chatRef, {
          postId: id,
          messages: chatMessages,
          updatedAt: serverTimestamp()
        }, { merge: true })
      } catch (error) {
        console.error('Error saving chat:', error)
      }
    }
    
    // Debounce chat save
    const timer = setTimeout(saveChatHistory, 1000)
    return () => clearTimeout(timer)
  }, [id, chatMessages])

  // Track unsaved changes
  useEffect(() => {
    if (!initialLoadRef.current) {
      setHasUnsavedChanges(true)
    }
  }, [title, slug, excerpt, content, coverImage, tags, isPublished, isPremium, affiliateUrl])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Track text selection (debounced)
  useEffect(() => {
    let timeoutId
    
    const handleSelection = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const selection = window.getSelection()
        const text = selection?.toString() || ''
        setSelectedText(text)
        
        if (text && selection.rangeCount > 0) {
          const start = content.indexOf(text)
          if (start !== -1) {
            setSelectionRange({ start, end: start + text.length })
          }
        } else {
          setSelectionRange(null)
        }
      }, 100) // Debounce by 100ms
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)
    
    return () => {
      clearTimeout(timeoutId)
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
      console.error('Error saving:', error)
      showToast('Failed to save: ' + error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    await handleSave(true)
  }

  async function handleUnpublish() {
    await handleSave(false)
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

    showToast('Uploading image...', 'info')
    
    try {
      const result = await uploadImage(file)
      if (result.success && result.url) {
        pushToUndo(content)
        const imageMarkdown = `![${file.name}](${result.url})`
        
        // Insert at cursor position if available, otherwise append
        if (cursorPosition !== null && cursorPosition <= content.length) {
          const before = content.slice(0, cursorPosition)
          const after = content.slice(cursorPosition)
          setContent(before + '\n' + imageMarkdown + '\n' + after)
        } else {
          setContent(prev => prev + '\n' + imageMarkdown + '\n')
        }
        showToast('✅ Image uploaded and inserted!', 'success')
      } else {
        showToast('Upload failed: No URL returned', 'error')
      }
    } catch (err) {
      showToast('Image upload failed: ' + err.message, 'error')
    } finally {
      e.target.value = ''
    }
  }

  // Generate diff HTML for display
  function generateDiffHtml(original, modified) {
    const diff = Diff.diffWords(original, modified)
    let result = ''
    
    diff.forEach(part => {
      if (part.added) {
        result += `<ins class="diff-added">${escapeHtml(part.value)}</ins>`
      } else if (part.removed) {
        result += `<del class="diff-removed">${escapeHtml(part.value)}</del>`
      } else {
        result += escapeHtml(part.value)
      }
    })
    
    return result
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  // AI Actions
  async function callAI(action, customPrompt = null) {
    setAiLoading(true)
    
    const textToProcess = selectedText || content
    const isPartialEdit = !!selectedText
    
    // Store content before AI for undo
    contentBeforeAI.current = content
    
    // Add user message
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
          title: title,
          chatHistory: chatMessages.slice(-6) // Send last 6 for context
        })
      })
      
      // Handle response safely
      if (!response.ok) {
        const text = await response.text()
        let errorMsg = 'AI request failed'
        if (text) {
          try {
            const error = JSON.parse(text)
            errorMsg = error.details || error.error || errorMsg
          } catch {
            errorMsg = text.slice(0, 100)
          }
        }
        throw new Error(errorMsg)
      }
      
      const text = await response.text()
      if (!text) throw new Error('Empty response from AI')
      
      const data = JSON.parse(text)
      
      if (data.type === 'reply') {
        // Conversational response - just add to chat
        setChatMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'ai', 
          content: data.result,
          isReply: true
        }])
      } else if (data.result) {
        // Edit response - show diff
        let fullModified = content
        if (isPartialEdit && selectionRange) {
          fullModified = content.slice(0, selectionRange.start) + 
                        data.result + 
                        content.slice(selectionRange.end)
        } else {
          fullModified = data.result
        }
        
        setPendingChanges({
          original: textToProcess,
          modified: data.result,
          fullOriginal: content,
          fullModified: fullModified,
          isPartialEdit,
          storedSelectionRange: selectionRange // Store the range at time of AI call
        })
        setEditableDiff(data.result) // Allow editing the suggestion
        
        setChatMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'ai', 
          content: 'I\'ve made some changes. Review the diff in the editor, edit if needed, then accept or reject.'
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
      // Push current content to undo stack
      pushToUndo(content)
      
      // Apply the (possibly edited) changes using STORED selection range
      let newContent
      const range = pendingChanges.storedSelectionRange
      if (pendingChanges.isPartialEdit && range) {
        // Use the stored range from when AI was called, not current selection
        newContent = pendingChanges.fullOriginal.slice(0, range.start) + 
                    editableDiff + 
                    pendingChanges.fullOriginal.slice(range.end)
      } else {
        newContent = editableDiff
      }
      
      setContent(newContent)
      setPendingChanges(null)
      setEditableDiff('')
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
    setEditableDiff('')
    showToast('Changes discarded', 'info')
    setChatMessages(prev => [...prev, { 
      id: Date.now(), 
      role: 'system', 
      content: '❌ Changes rejected.'
    }])
  }

  function handleClearChat() {
    if (window.confirm('Clear all chat history for this post?')) {
      setChatMessages([])
      showToast('Chat cleared', 'info')
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

  const displayDiffHtml = pendingChanges 
    ? generateDiffHtml(pendingChanges.original, editableDiff)
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

        .header-left { display: flex; align-items: center; gap: 1rem; }
        .header-actions { display: flex; gap: 0.75rem; align-items: center; }
        
        .unsaved-indicator {
          font-size: 0.75rem;
          color: #ffaa00;
          padding: 4px 8px;
          background: rgba(255, 170, 0, 0.1);
          border-radius: 4px;
        }

        .undo-redo-group {
          display: flex;
          gap: 0.25rem;
          margin-right: 0.5rem;
        }

        .undo-redo-btn {
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .undo-redo-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .undo-redo-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .editor-main { display: flex; flex: 1; overflow: hidden; }

        .left-sidebar {
          width: ${leftSidebarCollapsed ? '50px' : '280px'};
          background: rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          overflow-y: auto;
          overflow-x: hidden;
          flex-shrink: 0;
        }

        .sidebar-toggle {
          padding: 0.75rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          color: #00d4ff;
        }

        .sidebar-toggle:hover { background: rgba(0, 212, 255, 0.1); }

        .sidebar-content {
          padding: 1rem;
          overflow-y: auto;
          flex: 1;
          display: ${leftSidebarCollapsed ? 'none' : 'block'};
        }

        .center-editor {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          min-width: 0;
        }

        .editor-toolbar-custom {
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 0.5rem;
        }

        .md-editor-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          position: relative;
          min-height: 0;
        }

        .diff-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 10;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .diff-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
        }

        .diff-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #00d4ff;
        }

        .diff-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .diff-preview {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
          white-space: pre-wrap;
          margin-bottom: 1.5rem;
        }

        .diff-preview .diff-added {
          background: rgba(57, 255, 20, 0.25);
          color: #39ff14;
          padding: 0 2px;
          border-radius: 2px;
        }

        .diff-preview .diff-removed {
          background: rgba(255, 107, 107, 0.25);
          color: #ff6b6b;
          text-decoration: line-through;
          padding: 0 2px;
          border-radius: 2px;
        }

        .diff-edit-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .diff-edit-label {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: #39ff14;
          margin-bottom: 0.75rem;
          display: block;
        }

        .diff-edit-textarea {
          width: 100%;
          min-height: 200px;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 8px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
          resize: vertical;
        }

        .diff-edit-textarea:focus {
          outline: none;
          border-color: #39ff14;
          box-shadow: 0 0 10px rgba(57, 255, 20, 0.2);
        }

        .right-panel {
          width: 350px;
          background: rgba(0, 0, 0, 0.3);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          flex-shrink: 0;
        }

        .ai-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #39ff14;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .clear-chat-btn {
          font-size: 0.5rem;
          padding: 0.3rem 0.5rem;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 4px;
          color: #ff6b6b;
          cursor: pointer;
          font-family: inherit;
        }

        .clear-chat-btn:hover { background: rgba(255, 107, 107, 0.2); }

        .quick-actions {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-actions.hidden { display: none; }

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

        .quick-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .selection-hint {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          padding: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

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

        .chat-message.ai.reply {
          background: rgba(157, 78, 221, 0.1);
          border-color: rgba(157, 78, 221, 0.3);
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

        .accept-reject-bar {
          padding: 0.75rem 1rem;
          background: rgba(57, 255, 20, 0.1);
          border-top: 1px solid rgba(57, 255, 20, 0.3);
          border-bottom: 1px solid rgba(57, 255, 20, 0.3);
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .accept-btn, .reject-btn {
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .accept-btn {
          background: rgba(57, 255, 20, 0.2);
          border: 1px solid #39ff14;
          color: #39ff14;
        }

        .accept-btn:hover { background: rgba(57, 255, 20, 0.4); }

        .reject-btn {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.5);
          color: #ff6b6b;
        }

        .reject-btn:hover { background: rgba(255, 107, 107, 0.2); }

        .chat-input-area { padding: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .chat-input-wrapper { display: flex; gap: 0.5rem; }

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

        .chat-input:focus { outline: none; border-color: #39ff14; }
        .chat-input::placeholder { color: rgba(255, 255, 255, 0.3); }

        .send-btn {
          padding: 0.75rem 1rem;
          background: rgba(57, 255, 20, 0.2);
          border: 1px solid #39ff14;
          border-radius: 4px;
          color: #39ff14;
          cursor: pointer;
        }

        .send-btn:hover:not(:disabled) { background: rgba(57, 255, 20, 0.4); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .form-group { margin-bottom: 1.25rem; }

        .form-label {
          display: block;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: #00d4ff;
          margin-bottom: 0.4rem;
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
        }

        .form-textarea { min-height: 60px; resize: vertical; }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
        }

        .checkbox-label input { width: 16px; height: 16px; accent-color: #39ff14; }

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

        .reading-time-override { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
        .time-input { width: 60px; padding: 0.4rem; text-align: center; }

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

        .w-md-editor-content { flex: 1 !important; overflow: hidden !important; }

        .w-md-editor-text-pre > code,
        .w-md-editor-text-input,
        .w-md-editor-text {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 14px !important;
        }

        .wmde-markdown {
          background: transparent !important;
          color: rgba(255, 255, 255, 0.9) !important;
          padding: 1rem !important;
        }

        .wmde-markdown h1, .wmde-markdown h2, .wmde-markdown h3 {
          color: #00d4ff !important;
        }

        .wmde-markdown code {
          background: rgba(0, 212, 255, 0.1) !important;
          color: #39ff14 !important;
        }

        @media (max-width: 1024px) {
          .left-sidebar { width: ${leftSidebarCollapsed ? '50px' : '220px'}; }
          .right-panel { width: 300px; }
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
          {hasUnsavedChanges && <span className="unsaved-indicator">● Unsaved</span>}
        </div>
        <div className="header-actions">
          {/* Undo/Redo */}
          <div className="undo-redo-group">
            <button 
              className="undo-redo-btn" 
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button 
              className="undo-redo-btn" 
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title="Redo (Ctrl+Y)"
            >
              ↷
            </button>
          </div>
          
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

      {/* Main Layout */}
      <div className="editor-main">
        
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <div 
            className="sidebar-toggle" 
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
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
              <ImageUpload value={coverImage} onChange={setCoverImage} placeholder="Drop image" />
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
              <div className="reading-time-display">⏱️ {readingTime} min read</div>
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

        {/* Center Editor */}
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
          
          <div 
            className="md-editor-wrapper" 
            ref={editorRef}
            onClick={(e) => {
              // Track cursor position from textarea
              const textarea = e.currentTarget.querySelector('textarea')
              if (textarea) setCursorPosition(textarea.selectionStart)
            }}
            onKeyUp={(e) => {
              // Update cursor position on key events
              const textarea = e.currentTarget.querySelector('textarea')
              if (textarea) setCursorPosition(textarea.selectionStart)
            }}
          >
            {/* Diff Overlay */}
            {pendingChanges && displayDiffHtml && (
              <div className="diff-overlay">
                <div className="diff-header">
                  <span className="diff-title">📝 REVIEW CHANGES</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                    {pendingChanges.isPartialEdit ? 'Selected text' : 'Full content'}
                  </span>
                </div>
                <div className="diff-content">
                  <div 
                    className="diff-preview" 
                    dangerouslySetInnerHTML={{ __html: displayDiffHtml }} 
                  />
                  
                  <div className="diff-edit-section">
                    <label className="diff-edit-label">✏️ EDIT SUGGESTION BEFORE ACCEPTING</label>
                    <textarea
                      className="diff-edit-textarea"
                      value={editableDiff}
                      onChange={(e) => setEditableDiff(e.target.value)}
                      placeholder="Edit the AI's suggestion here..."
                    />
                  </div>
                </div>
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

        {/* Right Panel - AI */}
        <aside className="right-panel">
          <div className="ai-header">
            <span>🤖 AI_ASSISTANT</span>
            {chatMessages.length > 0 && (
              <button className="clear-chat-btn" onClick={handleClearChat}>
                Clear
              </button>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className={`quick-actions ${selectedText ? '' : 'hidden'}`}>
            <button className="quick-btn" onClick={() => handleQuickAction('improve')} disabled={aiLoading}>
              ✨ Improve
            </button>
            <button className="quick-btn" onClick={() => handleQuickAction('expand')} disabled={aiLoading}>
              📝 Expand
            </button>
            <button className="quick-btn" onClick={() => handleQuickAction('summarize')} disabled={aiLoading}>
              📋 Summarize
            </button>
            <button className="quick-btn" onClick={() => handleQuickAction('grammar')} disabled={aiLoading}>
              🔤 Fix Grammar
            </button>
          </div>

          {!selectedText && (
            <div className="selection-hint">Select text in editor for quick actions</div>
          )}

          {/* Chat Messages */}
          <div className="chat-messages">
            {chatMessages.length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem' }}>
                Start a conversation with the AI.<br/>Select text for quick actions, or type below to chat.
              </div>
            )}
            {chatMessages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.role} ${msg.isReply ? 'reply' : ''} ${msg.isError ? 'error' : ''}`}>
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Accept/Reject Bar */}
          {pendingChanges && (
            <div className="accept-reject-bar">
              <button className="accept-btn" onClick={handleAcceptChanges}>✓ ACCEPT</button>
              <button className="reject-btn" onClick={handleRejectChanges}>✕ REJECT</button>
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
