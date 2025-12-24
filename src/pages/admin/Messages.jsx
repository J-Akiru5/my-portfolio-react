import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionTitle, GlassCard, PixelButton } from '../../components/ui'
import { db } from '../../firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore'

/**
 * Messages Admin Page
 * 
 * View and manage contact form submissions from Firestore.
 */
export default function Messages() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }))
      setMessages(msgs)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id) {
    try {
      await updateDoc(doc(db, 'messages', id), { read: true })
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm('Delete this message?')) return
    try {
      await deleteDoc(doc(db, 'messages', id))
      setMessages(prev => prev.filter(m => m.id !== id))
      setSelectedMessage(null)
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <section className="messages-page">
      <style>{`
        .messages-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .header-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .unread-badge {
          padding: 0.4rem 0.8rem;
          background: rgba(255, 107, 53, 0.15);
          border: 1px solid #ff6b35;
          border-radius: 15px;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.55rem;
          color: #ff6b35;
        }
        
        .messages-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
          min-height: 500px;
        }
        
        @media (max-width: 900px) {
          .messages-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .message-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 600px;
          overflow-y: auto;
        }
        
        .message-item {
          padding: 1rem !important;
          cursor: pointer;
          transition: all 0.3s;
          border-left: 3px solid transparent;
        }
        
        .message-item:hover {
          border-left-color: #00d4ff;
        }
        
        .message-item.selected {
          border-left-color: #39ff14;
          background: rgba(57, 255, 20, 0.05) !important;
        }
        
        .message-item.unread {
          border-left-color: #ff6b35;
        }
        
        .message-item.unread::before {
          content: '●';
          color: #ff6b35;
          margin-right: 0.5rem;
          font-size: 0.6rem;
        }
        
        .message-sender {
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
        }
        
        .message-preview {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .message-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 0.5rem;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .message-detail {
          padding: 2rem !important;
        }
        
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .detail-sender {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: #00d4ff;
          margin-bottom: 0.5rem;
        }
        
        .detail-email {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: #39ff14;
        }
        
        .detail-date {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
        }
        
        .detail-body {
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          white-space: pre-wrap;
        }
        
        .detail-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          padding: 3rem;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .loading {
          text-align: center;
          padding: 3rem;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
      
      <div className="page-header">
        <div className="header-info">
          <SectionTitle title="INBOX" extension=".msg" />
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} NEW</span>
          )}
        </div>
        <PixelButton variant="outline" onClick={() => navigate('/admin')}>
          ← BACK
        </PixelButton>
      </div>
      
      {loading ? (
        <div className="loading">Loading messages...</div>
      ) : messages.length === 0 ? (
        <GlassCard>
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No messages yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Messages from the contact form will appear here.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="messages-grid">
          {/* Message List */}
          <div className="message-list">
            {messages.map((msg) => (
              <GlassCard 
                key={msg.id} 
                className={`message-item ${!msg.read ? 'unread' : ''} ${selectedMessage?.id === msg.id ? 'selected' : ''}`}
                hoverEffect={false}
                onClick={() => {
                  setSelectedMessage(msg)
                  if (!msg.read) markAsRead(msg.id)
                }}
              >
                <div className="message-sender">{msg.name}</div>
                <div className="message-preview">{msg.message}</div>
                <div className="message-time">
                  {msg.createdAt.toLocaleDateString()} {msg.createdAt.toLocaleTimeString()}
                </div>
              </GlassCard>
            ))}
          </div>
          
          {/* Message Detail */}
          <GlassCard className="message-detail">
            {selectedMessage ? (
              <>
                <div className="detail-header">
                  <div>
                    <div className="detail-sender">{selectedMessage.name}</div>
                    <a href={`mailto:${selectedMessage.email}`} className="detail-email">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="detail-date">
                    {selectedMessage.createdAt.toLocaleDateString()} at{' '}
                    {selectedMessage.createdAt.toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="detail-body">{selectedMessage.message}</div>
                
                <div className="detail-actions">
                  <PixelButton 
                    variant="outline" 
                    color="electric"
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                  >
                    REPLY
                  </PixelButton>
                  <PixelButton 
                    variant="outline" 
                    color="sunset"
                    onClick={() => deleteMessage(selectedMessage.id)}
                  >
                    DELETE
                  </PixelButton>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📨</div>
                <p>Select a message to view</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </section>
  )
}
