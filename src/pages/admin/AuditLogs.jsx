import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'
import { SectionTitle, GlassCard, PixelButton, useToast } from '../../components/ui'

/**
 * AuditLogs - Admin page for viewing and managing audit logs
 * Features: date range filter, action type filter, entity filter, delete old records
 */

const ACTION_TYPE_LABELS = {
  'booking.created': { label: 'Booking Created', color: '#39ff14' },
  'booking.status_changed': { label: 'Status Changed', color: '#ffc107' },
  'booking.payment_changed': { label: 'Payment Changed', color: '#00d4ff' },
  'booking.deleted': { label: 'Booking Deleted', color: '#ff6b35' },
  'calendar.event_created': { label: 'Event Created', color: '#39ff14' },
  'calendar.event_updated': { label: 'Event Updated', color: '#00d4ff' },
  'calendar.event_deleted': { label: 'Event Deleted', color: '#ff6b35' },
  'project.created': { label: 'Project Created', color: '#39ff14' },
  'project.updated': { label: 'Project Updated', color: '#00d4ff' },
  'project.deleted': { label: 'Project Deleted', color: '#ff6b35' },
  'service.created': { label: 'Service Created', color: '#39ff14' },
  'service.updated': { label: 'Service Updated', color: '#00d4ff' },
  'service.deleted': { label: 'Service Deleted', color: '#ff6b35' },
  'admin.login': { label: 'Admin Login', color: '#9d4edd' },
  'admin.logout': { label: 'Admin Logout', color: '#9d4edd' },
  'settings.updated': { label: 'Settings Updated', color: '#00d4ff' }
}

const ENTITY_TYPES = ['all', 'booking', 'calendar', 'project', 'service', 'admin', 'settings']

export default function AuditLogs() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  
  // Filters
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [entityFilter, setEntityFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch logs
  useEffect(() => {
    async function fetchLogs() {
      try {
        const logsRef = collection(db, 'audit_logs')
        const q = query(logsRef, orderBy('timestamp', 'desc'))
        const snapshot = await getDocs(q)
        
        const logsData = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        setLogs(logsData)
      } catch (error) {
        console.error('Error fetching audit logs:', error)
        showToast('Failed to load audit logs', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [showToast])

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Date from filter
      if (dateFrom) {
        const logDate = new Date(log.timestamp).setHours(0, 0, 0, 0)
        const fromDate = new Date(dateFrom).setHours(0, 0, 0, 0)
        if (logDate < fromDate) return false
      }
      
      // Date to filter
      if (dateTo) {
        const logDate = new Date(log.timestamp).setHours(23, 59, 59, 999)
        const toDate = new Date(dateTo).setHours(23, 59, 59, 999)
        if (logDate > toDate) return false
      }
      
      // Entity type filter
      if (entityFilter !== 'all' && log.entityType !== entityFilter) {
        return false
      }
      
      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const searchableText = [
          log.action,
          log.entityId,
          log.refId,
          log.details,
          log.userName
        ].filter(Boolean).join(' ').toLowerCase()
        
        if (!searchableText.includes(term)) return false
      }
      
      return true
    })
  }, [logs, dateFrom, dateTo, entityFilter, searchTerm])

  // Delete single log
  async function handleDeleteLog(logId) {
    if (!confirm('Delete this log entry?')) return
    
    try {
      await deleteDoc(doc(db, 'audit_logs', logId))
      setLogs(prev => prev.filter(l => l.id !== logId))
      showToast('Log deleted', 'success')
    } catch (error) {
      console.error('Error deleting log:', error)
      showToast('Failed to delete log', 'error')
    }
  }

  // Delete all filtered logs
  async function handleDeleteFiltered() {
    if (!confirm(`Delete ${filteredLogs.length} filtered log entries? This cannot be undone.`)) return
    
    setDeleting(true)
    try {
      const deletePromises = filteredLogs.map(log => 
        deleteDoc(doc(db, 'audit_logs', log.id))
      )
      await Promise.all(deletePromises)
      setLogs(prev => prev.filter(l => !filteredLogs.find(fl => fl.id === l.id)))
      showToast(`Deleted ${filteredLogs.length} logs`, 'success')
    } catch (error) {
      console.error('Error deleting logs:', error)
      showToast('Failed to delete logs', 'error')
    } finally {
      setDeleting(false)
    }
  }

  // Clear filters
  function clearFilters() {
    setDateFrom('')
    setDateTo('')
    setEntityFilter('all')
    setSearchTerm('')
  }

  // Format timestamp
  function formatTime(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <section className="audit-logs-page">
      <style>{`
        .audit-logs-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1400px;
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

        .filters-bar {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .filter-label {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.5rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .filter-input {
          padding: 0.5rem 0.75rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          min-width: 140px;
        }

        .filter-input:focus {
          outline: none;
          border-color: #00d4ff;
        }

        .filter-select {
          padding: 0.5rem;
          background: #1a1a24;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .filter-select option {
          background: #1a1a24;
          color: white;
        }

        .filter-actions {
          display: flex;
          gap: 0.5rem;
          margin-left: auto;
        }

        .stats-bar {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .log-item {
          display: grid;
          grid-template-columns: 150px 140px 100px 100px 1fr auto;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .log-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .log-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .log-action {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-align: center;
        }

        .log-entity {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: capitalize;
        }

        .log-ref {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.55rem;
          color: #00d4ff;
        }

        .log-details {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .log-delete {
          padding: 0.25rem 0.5rem;
          background: transparent;
          border: 1px solid rgba(255, 107, 53, 0.3);
          border-radius: 4px;
          color: #ff6b35;
          font-size: 0.65rem;
          cursor: pointer;
          opacity: 0.5;
          transition: all 0.2s;
        }

        .log-delete:hover {
          opacity: 1;
          background: rgba(255, 107, 53, 0.1);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .loading-state {
          text-align: center;
          padding: 4rem;
          color: #00d4ff;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
        }

        @media (max-width: 1024px) {
          .log-item {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-actions {
            margin-left: 0;
            margin-top: 0.5rem;
          }
        }
      `}</style>

      <div className="page-header">
        <SectionTitle title="AUDIT_LOGS" extension=".log" />
        <PixelButton variant="outline" onClick={() => navigate('/admin')}>
          ← BACK
        </PixelButton>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <span className="filter-label">FROM</span>
          <input
            type="date"
            className="filter-input"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <span className="filter-label">TO</span>
          <input
            type="date"
            className="filter-input"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <span className="filter-label">ENTITY</span>
          <select
            className="filter-select"
            value={entityFilter}
            onChange={e => setEntityFilter(e.target.value)}
          >
            {ENTITY_TYPES.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group" style={{ flex: 1, minWidth: '200px' }}>
          <span className="filter-label">SEARCH</span>
          <input
            type="text"
            className="filter-input"
            placeholder="Search ref, details..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        
        <div className="filter-actions">
          <PixelButton size="small" variant="outline" onClick={clearFilters}>
            CLEAR
          </PixelButton>
          {filteredLogs.length > 0 && (
            <PixelButton 
              size="small" 
              variant="outline" 
              color="sunset"
              onClick={handleDeleteFiltered}
              disabled={deleting}
            >
              {deleting ? 'DELETING...' : `DELETE ${filteredLogs.length}`}
            </PixelButton>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <span>Total: {logs.length}</span>
        <span>Showing: {filteredLogs.length}</span>
      </div>

      {/* Logs List */}
      {loading ? (
        <div className="loading-state">LOADING LOGS...</div>
      ) : filteredLogs.length === 0 ? (
        <GlassCard className="empty-state">
          <p>No audit logs found</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {logs.length > 0 ? 'Try adjusting your filters' : 'Logs will appear here as actions are performed'}
          </p>
        </GlassCard>
      ) : (
        <div className="logs-list">
          {filteredLogs.map(log => {
            const actionInfo = ACTION_TYPE_LABELS[log.action] || { label: log.action, color: '#888' }
            return (
              <div key={log.id} className="log-item">
                <span className="log-time">{formatTime(log.timestamp)}</span>
                <span 
                  className="log-action"
                  style={{ 
                    backgroundColor: `${actionInfo.color}20`,
                    color: actionInfo.color,
                    border: `1px solid ${actionInfo.color}40`
                  }}
                >
                  {actionInfo.label}
                </span>
                <span className="log-entity">{log.entityType}</span>
                <span className="log-ref">{log.refId || '—'}</span>
                <span className="log-details" title={log.details}>
                  {log.details || '—'}
                </span>
                <button 
                  className="log-delete"
                  onClick={() => handleDeleteLog(log.id)}
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
