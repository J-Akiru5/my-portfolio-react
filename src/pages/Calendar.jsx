import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import Seo from '../components/Seo'
import { PixelButton, GlassCard, useToast } from '../components/ui'

/**
 * Calendar - Full-screen retro calendar for project roadmaps
 * Displays: bookings, projects, tasks, and availability
 * Admin users can add/edit/delete events, public users can only view
 */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December']

const EVENT_TYPES = {
  booking: { color: '#ffc107', icon: '📋', label: 'Booking' },
  project: { color: '#00d4ff', icon: '🚀', label: 'Project' },
  task: { color: '#9d4edd', icon: '✓', label: 'Task' },
  content: { color: '#39ff14', icon: '📝', label: 'Content' },
  busy: { color: '#ff6b35', icon: '🚫', label: 'Busy' }
}

export default function Calendar() {
  const { user } = useAuth()
  const isAdmin = !!user // Logged in = admin
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('month') // month, week
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const { showToast } = useToast()

  // New event form
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'task',
    date: '',
    endDate: '',
    description: '',
    allDay: true
  })

  // Fetch events from Firestore + sync bookings
  useEffect(() => {
    async function fetchAllEvents() {
      try {
        // Fetch calendar events
        const eventsRef = collection(db, 'calendar_events')
        const q = query(eventsRef, orderBy('date', 'asc'))
        const snapshot = await getDocs(q)
        
        const calendarEvents = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          source: 'calendar',
          ...docSnap.data()
        }))

        // Fetch bookings and convert to events
        const bookingsRef = collection(db, 'bookings')
        const bookingsQuery = query(bookingsRef, where('status', 'in', ['accepted', 'in_progress']))
        const bookingsSnapshot = await getDocs(bookingsQuery)
        
        const bookingEvents = bookingsSnapshot.docs.map(docSnap => {
          const data = docSnap.data()
          return {
            id: `booking-${docSnap.id}`,
            source: 'booking',
            title: data.projectTitle || data.serviceName,
            type: 'booking',
            date: data.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
            description: `Client: ${data.clientName}\nBudget: ${data.budget}\nTimeline: ${data.timeline}`,
            allDay: true,
            bookingId: docSnap.id
          }
        })

        setEvents([...calendarEvents, ...bookingEvents])
      } catch (error) {
        console.warn('Error fetching events:', error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAllEvents()
  }, [])

  // Calculate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startPadding = firstDay.getDay()
    
    const days = []
    
    // Add padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      const prevDate = new Date(year, month, -startPadding + i + 1)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    
    // Add padding for remaining days
    const remaining = 42 - days.length // 6 rows x 7 days
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    
    return days
  }, [currentDate])

  // Get events for a specific date
  function getEventsForDate(date) {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(e => {
      const eventDate = e.date?.split('T')[0]
      const eventEndDate = e.endDate?.split('T')[0]
      
      if (eventEndDate) {
        return dateStr >= eventDate && dateStr <= eventEndDate
      }
      return eventDate === dateStr
    })
  }

  // Navigation
  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  function goToToday() {
    setCurrentDate(new Date())
  }

  // Handle date click (admin only)
  function handleDateClick(date) {
    if (!isAdmin) return // View-only for non-admin
    openAddModal(date)
  }

  // Open add modal with specific date (for admin button)
  function openAddModal(date = new Date()) {
    if (!isAdmin) return
    setNewEvent(prev => ({ ...prev, date: date.toISOString().split('T')[0] }))
    setShowModal(true)
    setEditingEvent(null)
  }

  // Handle event click (admin only, not for booking events)
  function handleEventClick(e, event) {
    e.stopPropagation()
    if (!isAdmin) return // View-only for non-admin
    if (event.source === 'booking') return // Can't edit booking events here
    
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      type: event.type,
      date: event.date?.split('T')[0] || '',
      endDate: event.endDate?.split('T')[0] || '',
      description: event.description || '',
      allDay: event.allDay !== false
    })
    setShowModal(true)
  }

  // Save event
  async function handleSaveEvent(e) {
    e.preventDefault()
    
    try {
      const eventData = {
        ...newEvent,
        date: new Date(newEvent.date).toISOString(),
        endDate: newEvent.endDate ? new Date(newEvent.endDate).toISOString() : null,
        updatedAt: new Date().toISOString()
      }

      if (editingEvent) {
        await updateDoc(doc(db, 'calendar_events', editingEvent.id), eventData)
        setEvents(prev => prev.map(ev => 
          ev.id === editingEvent.id ? { ...ev, ...eventData } : ev
        ))
        showToast('Event updated!', 'success')
      } else {
        const docRef = await addDoc(collection(db, 'calendar_events'), {
          ...eventData,
          createdAt: new Date().toISOString()
        })
        setEvents(prev => [...prev, { id: docRef.id, ...eventData }])
        showToast('Event created!', 'success')
      }

      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      showToast('Failed to save event', 'error')
    }
  }

  // Delete event
  async function handleDeleteEvent() {
    if (!editingEvent || !window.confirm('Delete this event?')) return
    
    try {
      await deleteDoc(doc(db, 'calendar_events', editingEvent.id))
      setEvents(prev => prev.filter(ev => ev.id !== editingEvent.id))
      showToast('Event deleted', 'success')
      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error('Error deleting event:', error)
      showToast('Failed to delete event', 'error')
    }
  }

  function resetForm() {
    setNewEvent({ title: '', type: 'task', date: '', endDate: '', description: '', allDay: true })
    setEditingEvent(null)
  }

  // Check if date is today
  function isToday(date) {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="calendar-page">
      <Seo 
        title="Calendar | JeffDev Studio"
        description="Project roadmap and availability calendar"
      />

      <style>{`
        .calendar-page {
          height: calc(100vh - 60px);
          padding: 1rem 2rem;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .calendar-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.5rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .month-year {
          color: #00d4ff;
        }

        .nav-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .nav-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .view-toggle {
          display: flex;
          gap: 0.5rem;
        }

        .view-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-btn.active {
          border-color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: auto repeat(6, 1fr);
          gap: 2px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
          flex: 1;
          min-height: 0;
        }

        .day-header {
          padding: 1rem;
          text-align: center;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: #00d4ff;
          background: rgba(0, 0, 0, 0.4);
        }

        .calendar-day {
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .calendar-day:hover {
          background: rgba(0, 212, 255, 0.1);
        }

        .calendar-day.other-month {
          opacity: 0.4;
        }

        .calendar-day.today {
          background: rgba(0, 212, 255, 0.15);
          border: 1px solid rgba(0, 212, 255, 0.3);
        }

        .day-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
        }

        .today .day-number {
          background: #00d4ff;
          color: #0a0a12;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .day-events {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .event-item {
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 0.65rem;
          font-family: 'JetBrains Mono', monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          transition: transform 0.1s;
        }

        .event-item:hover {
          transform: scale(1.02);
        }

        .event-icon {
          margin-right: 3px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: #0a0a12;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: #00d4ff;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #00d4ff;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .type-selector {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .type-btn {
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-btn.active {
          border-color: currentColor;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .action-btn.delete:hover {
          border-color: #ff6b35;
          color: #ff6b35;
        }

        .action-btn.save {
          background: #00d4ff;
          border-color: #00d4ff;
          color: #0a0a12;
        }

        .legend {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          flex-shrink: 0;
          padding: 0.5rem 0;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 3px;
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

        .loading-state {
          text-align: center;
          padding: 4rem;
          color: #00d4ff;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .calendar-day {
            min-height: 80px;
          }
          .event-item {
            font-size: 0.55rem;
          }
          .day-header {
            font-size: 0.5rem;
            padding: 0.5rem;
          }
        }
      `}</style>

      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="calendar-header">
        <div className="calendar-title">
          <span className="month-year">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
        </div>
        
        <div className="nav-buttons">
          <button className="nav-btn" onClick={prevMonth}>◀ PREV</button>
          <button className="nav-btn" onClick={goToToday}>TODAY</button>
          <button className="nav-btn" onClick={nextMonth}>NEXT ▶</button>
        </div>

        <div className="view-toggle">
          <button 
            className={`view-btn ${view === 'month' ? 'active' : ''}`}
            onClick={() => setView('month')}
          >
            MONTH
          </button>
          {isAdmin && (
            <PixelButton 
              size="small"
              onClick={() => openAddModal()}
            >
              + ADD EVENT
            </PixelButton>
          )}
        </div>
      </div>

      {/* Legend - Above Calendar */}
      <div className="legend">
        {Object.entries(EVENT_TYPES).map(([key, val]) => (
          <div key={key} className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: val.color }} />
            <span>{val.icon} {val.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">LOADING CALENDAR...</div>
      ) : (
        <>
          <div className="calendar-grid">
            {DAYS.map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
            
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDate(day.date)
              return (
                <div
                  key={idx}
                  className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday(day.date) ? 'today' : ''}`}
                  onClick={() => handleDateClick(day.date)}
                >
                  <div className="day-number">{day.date.getDate()}</div>
                  <div className="day-events">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className="event-item"
                        style={{ 
                          backgroundColor: `${EVENT_TYPES[event.type]?.color}20`,
                          borderLeft: `3px solid ${EVENT_TYPES[event.type]?.color}`
                        }}
                        onClick={(e) => handleEventClick(e, event)}
                      >
                        <span className="event-icon">{EVENT_TYPES[event.type]?.icon}</span>
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="event-item" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">
              {editingEvent ? 'EDIT EVENT' : 'NEW EVENT'}
            </h3>
            
            <form onSubmit={handleSaveEvent}>
              <div className="form-group">
                <label className="form-label">TITLE *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEvent.title}
                  onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Event title..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">TYPE</label>
                <div className="type-selector">
                  {Object.entries(EVENT_TYPES).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      className={`type-btn ${newEvent.type === key ? 'active' : ''}`}
                      style={{ color: newEvent.type === key ? val.color : undefined }}
                      onClick={() => setNewEvent(prev => ({ ...prev, type: key }))}
                    >
                      {val.icon} {val.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">START DATE *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newEvent.date}
                    onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">END DATE (optional)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newEvent.endDate}
                    onChange={e => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">DESCRIPTION</label>
                <textarea
                  className="form-textarea"
                  value={newEvent.description}
                  onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Event details..."
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                {editingEvent && (
                  <button 
                    type="button" 
                    className="action-btn delete"
                    onClick={handleDeleteEvent}
                  >
                    DELETE
                  </button>
                )}
                <button 
                  type="button" 
                  className="action-btn"
                  onClick={() => { setShowModal(false); resetForm(); }}
                >
                  CANCEL
                </button>
                <button type="submit" className="action-btn save">
                  {editingEvent ? 'UPDATE' : 'CREATE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
