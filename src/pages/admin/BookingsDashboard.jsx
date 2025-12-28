import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { SectionTitle, GlassCard, PixelButton, useToast } from '../../components/ui'

/**
 * BookingsDashboard - Admin page for managing client bookings
 */

const STATUS_COLORS = {
  pending: { bg: 'rgba(255, 193, 7, 0.15)', border: 'rgba(255, 193, 7, 0.4)', color: '#ffc107' },
  quoted: { bg: 'rgba(0, 212, 255, 0.15)', border: 'rgba(0, 212, 255, 0.4)', color: '#00d4ff' },
  accepted: { bg: 'rgba(57, 255, 20, 0.15)', border: 'rgba(57, 255, 20, 0.4)', color: '#39ff14' },
  in_progress: { bg: 'rgba(157, 78, 221, 0.15)', border: 'rgba(157, 78, 221, 0.4)', color: '#9d4edd' },
  completed: { bg: 'rgba(57, 255, 20, 0.25)', border: 'rgba(57, 255, 20, 0.6)', color: '#39ff14' },
  cancelled: { bg: 'rgba(255, 107, 53, 0.15)', border: 'rgba(255, 107, 53, 0.4)', color: '#ff6b35' }
}

const PAYMENT_COLORS = {
  unpaid: { bg: 'rgba(255, 107, 53, 0.15)', border: 'rgba(255, 107, 53, 0.4)', color: '#ff6b35' },
  downpayment: { bg: 'rgba(255, 193, 7, 0.15)', border: 'rgba(255, 193, 7, 0.4)', color: '#ffc107' },
  paid: { bg: 'rgba(57, 255, 20, 0.15)', border: 'rgba(57, 255, 20, 0.4)', color: '#39ff14' }
}

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { showToast } = useToast()

  // Fetch bookings from Firestore
  useEffect(() => {
    async function fetchBookings() {
      try {
        const bookingsRef = collection(db, 'bookings')
        const q = query(bookingsRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        
        const bookingsData = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        setBookings(bookingsData)
      } catch (error) {
        console.error('Error fetching bookings:', error)
        showToast('Failed to load bookings', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [showToast])

  // Update booking status
  async function updateStatus(bookingId, newStatus) {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ))
      showToast(`Status updated to ${newStatus}`, 'success')
    } catch (error) {
      console.error('Error updating status:', error)
      showToast('Failed to update status', 'error')
    }
  }

  // Update payment status
  async function updatePayment(bookingId, newPaymentStatus) {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        paymentStatus: newPaymentStatus,
        updatedAt: new Date().toISOString()
      })
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, paymentStatus: newPaymentStatus } : b
      ))
      showToast(`Payment status updated to ${newPaymentStatus}`, 'success')
    } catch (error) {
      console.error('Error updating payment:', error)
      showToast('Failed to update payment status', 'error')
    }
  }

  // Delete booking
  async function handleDelete(bookingId) {
    if (!window.confirm('Are you sure you want to delete this booking?')) return
    
    try {
      await deleteDoc(doc(db, 'bookings', bookingId))
      setBookings(prev => prev.filter(b => b.id !== bookingId))
      showToast('Booking deleted', 'success')
    } catch (error) {
      console.error('Error deleting booking:', error)
      showToast('Failed to delete booking', 'error')
    }
  }

  // Filter bookings
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter)

  return (
    <section className="bookings-dashboard">
      <style>{`
        .bookings-dashboard {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1200px;
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

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover,
        .filter-btn.active {
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .booking-card {
          padding: 1.5rem;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .booking-client h3 {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          color: white;
          margin-bottom: 0.3rem;
        }

        .booking-client p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        .booking-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
        }

        .booking-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
        }

        .detail-item label {
          display: block;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.3rem;
        }

        .detail-item span {
          color: white;
          font-size: 0.85rem;
        }

        .booking-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border-left: 3px solid rgba(0, 212, 255, 0.3);
        }

        .booking-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .action-select {
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
        }

        .action-btn {
          padding: 0.5rem 0.8rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
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

        .booking-date {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          text-align: right;
        }
      `}</style>

      <Link to="/admin" className="back-link">← Back to Dashboard</Link>

      <div className="dashboard-header">
        <SectionTitle title="BOOKINGS" extension=".admin" />
        
        <div className="filter-tabs">
          {['all', 'pending', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">LOADING BOOKINGS...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found{filter !== 'all' ? ` with status "${filter}"` : ''}.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map(booking => (
            <GlassCard key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-client">
                  <h3>{booking.clientName}</h3>
                  <p>{booking.clientEmail}</p>
                </div>
                <div className="booking-badges">
                  <span 
                    className="badge" 
                    style={{
                      background: STATUS_COLORS[booking.status]?.bg,
                      border: `1px solid ${STATUS_COLORS[booking.status]?.border}`,
                      color: STATUS_COLORS[booking.status]?.color
                    }}
                  >
                    {booking.status}
                  </span>
                  <span 
                    className="badge"
                    style={{
                      background: PAYMENT_COLORS[booking.paymentStatus]?.bg,
                      border: `1px solid ${PAYMENT_COLORS[booking.paymentStatus]?.border}`,
                      color: PAYMENT_COLORS[booking.paymentStatus]?.color
                    }}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-item">
                  <label>SERVICE</label>
                  <span>{booking.serviceName}</span>
                </div>
                <div className="detail-item">
                  <label>BUDGET</label>
                  <span>{booking.budget}</span>
                </div>
                <div className="detail-item">
                  <label>TIMELINE</label>
                  <span>{booking.timeline}</span>
                </div>
                <div className="detail-item">
                  <label>DATE</label>
                  <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {booking.projectDescription && (
                <div className="booking-description">
                  {booking.projectDescription}
                </div>
              )}

              <div className="booking-actions">
                <select 
                  className="action-select"
                  value={booking.status}
                  onChange={(e) => updateStatus(booking.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select 
                  className="action-select"
                  value={booking.paymentStatus}
                  onChange={(e) => updatePayment(booking.id, e.target.value)}
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="downpayment">Downpayment</option>
                  <option value="paid">Paid</option>
                </select>

                <a 
                  href={`mailto:${booking.clientEmail}?subject=Re: ${booking.serviceName} Inquiry`}
                  className="action-btn"
                >
                  📧 EMAIL
                </a>

                <button 
                  className="action-btn delete"
                  onClick={() => handleDelete(booking.id)}
                >
                  🗑️ DELETE
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  )
}
