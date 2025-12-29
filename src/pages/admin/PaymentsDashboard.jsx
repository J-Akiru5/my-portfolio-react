import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { SectionTitle, GlassCard, PixelButton, useToast } from '../../components/ui'
import { logAction, AUDIT_ACTIONS } from '../../utils/auditLog'

/**
 * PaymentsDashboard - Admin page for verifying client payment confirmations
 */

const STATUS_COLORS = {
  pending: { bg: 'rgba(255, 193, 7, 0.15)', border: 'rgba(255, 193, 7, 0.4)', color: '#ffc107' },
  confirmed: { bg: 'rgba(57, 255, 20, 0.15)', border: 'rgba(57, 255, 20, 0.4)', color: '#39ff14' },
  rejected: { bg: 'rgba(255, 107, 53, 0.15)', border: 'rgba(255, 107, 53, 0.4)', color: '#ff6b35' }
}

const METHOD_ICONS = {
  gcash: '📱',
  landbank: '🏦',
  paypal: '🌐'
}

export default function PaymentsDashboard() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const { showToast } = useToast()

  // Fetch payments
  useEffect(() => {
    async function fetchPayments() {
      try {
        const paymentsRef = collection(db, 'payments')
        const q = query(paymentsRef, orderBy('submittedAt', 'desc'))
        const snapshot = await getDocs(q)
        
        const paymentsData = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        setPayments(paymentsData)
      } catch (error) {
        console.error('Error fetching payments:', error)
        showToast('Failed to load payments', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [showToast])

  // Confirm payment
  async function handleConfirm(paymentId) {
    const payment = payments.find(p => p.id === paymentId)
    
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'confirmed',
        confirmedAt: new Date().toISOString()
      })
      
      // Update booking payment status if linked
      if (payment?.bookingId) {
        // Calculate total confirmed payments for this booking
        const allPayments = payments.filter(p => 
          p.bookingId === payment.bookingId && 
          (p.status === 'confirmed' || p.id === paymentId)
        )
        const totalPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
        
        // Update booking payment status based on total
        // Simple logic: if any payment confirmed, at least it's downpayment
        await updateDoc(doc(db, 'bookings', payment.bookingId), {
          paymentStatus: totalPaid > 0 ? 'downpayment' : 'unpaid',
          updatedAt: new Date().toISOString()
        })
      }
      
      setPayments(prev => prev.map(p => 
        p.id === paymentId ? { ...p, status: 'confirmed', confirmedAt: new Date().toISOString() } : p
      ))
      
      showToast('Payment confirmed!', 'success')
      
      // Log action
      logAction({
        action: AUDIT_ACTIONS.BOOKING_PAYMENT_CHANGED,
        entityType: 'payment',
        entityId: paymentId,
        details: `Confirmed ₱${payment?.amount?.toLocaleString()} via ${payment?.method}`,
        after: { status: 'confirmed' }
      })
      
    } catch (error) {
      console.error('Error confirming payment:', error)
      showToast('Failed to confirm payment', 'error')
    }
  }

  // Reject payment
  async function handleReject(paymentId) {
    if (!confirm('Reject this payment? The client will need to resubmit.')) return
    
    const payment = payments.find(p => p.id === paymentId)
    
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      })
      
      setPayments(prev => prev.map(p => 
        p.id === paymentId ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString() } : p
      ))
      
      showToast('Payment rejected', 'success')
      
      // Log action
      logAction({
        action: AUDIT_ACTIONS.BOOKING_PAYMENT_CHANGED,
        entityType: 'payment',
        entityId: paymentId,
        details: `Rejected ₱${payment?.amount?.toLocaleString()} - ${payment?.referenceNumber}`,
        after: { status: 'rejected' }
      })
      
    } catch (error) {
      console.error('Error rejecting payment:', error)
      showToast('Failed to reject payment', 'error')
    }
  }

  // Delete payment record
  async function handleDelete(paymentId) {
    if (!confirm('Delete this payment record permanently?')) return
    
    try {
      await deleteDoc(doc(db, 'payments', paymentId))
      setPayments(prev => prev.filter(p => p.id !== paymentId))
      showToast('Payment deleted', 'success')
    } catch (error) {
      console.error('Error deleting payment:', error)
      showToast('Failed to delete', 'error')
    }
  }

  // Filter payments
  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(p => p.status === filter)

  // Stats
  const pendingCount = payments.filter(p => p.status === 'pending').length
  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <section className="payments-dashboard">
      <style>{`
        .payments-dashboard {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .stats-row {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .stat-box {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          text-align: center;
        }

        .stat-value {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.5rem;
          color: #ffc107;
        }

        .stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.5rem;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover { border-color: rgba(255, 255, 255, 0.4); }
        .filter-btn.active { 
          border-color: #00d4ff; 
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
        }

        .payments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .payment-card {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          display: grid;
          grid-template-columns: 60px 1fr 150px 200px;
          gap: 1.5rem;
          align-items: center;
        }

        .payment-method {
          font-size: 2.5rem;
          text-align: center;
        }

        .payment-info h4 {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: #39ff14;
          margin-bottom: 0.5rem;
        }

        .payment-detail {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.25rem;
        }

        .payment-ref {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
          margin-top: 0.5rem;
        }

        .payment-status {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          text-align: center;
          text-transform: uppercase;
        }

        .payment-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: 1px solid;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
        }

        .action-btn.confirm {
          border-color: #39ff14;
          color: #39ff14;
        }
        .action-btn.confirm:hover {
          background: rgba(57, 255, 20, 0.2);
        }

        .action-btn.reject {
          border-color: #ff6b35;
          color: #ff6b35;
        }
        .action-btn.reject:hover {
          background: rgba(255, 107, 53, 0.2);
        }

        .action-btn.delete {
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.4);
        }
        .action-btn.delete:hover {
          border-color: #ff6b35;
          color: #ff6b35;
        }

        .screenshot-link {
          color: #00d4ff;
          text-decoration: none;
          font-size: 0.75rem;
        }
        .screenshot-link:hover {
          text-decoration: underline;
        }

        .empty-state {
          text-align: center;
          padding: 4rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .loading-state {
          text-align: center;
          padding: 4rem;
          color: #00d4ff;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
        }

        @media (max-width: 900px) {
          .payment-card {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .payment-method {
            text-align: left;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <SectionTitle title="PAYMENTS" extension=".verify" />
        <Link to="/admin" style={{ textDecoration: 'none' }}>
          <PixelButton variant="outline">← BACK</PixelButton>
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Pending Verification</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">₱{totalPending.toLocaleString()}</div>
          <div className="stat-label">Pending Amount</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['pending', 'confirmed', 'rejected', 'all'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
            {f === 'pending' && pendingCount > 0 && ` (${pendingCount})`}
          </button>
        ))}
      </div>

      {/* Payments List */}
      {loading ? (
        <div className="loading-state">LOADING PAYMENTS...</div>
      ) : filteredPayments.length === 0 ? (
        <GlassCard className="empty-state">
          <p>No {filter === 'all' ? '' : filter} payments</p>
        </GlassCard>
      ) : (
        <div className="payments-list">
          {filteredPayments.map(payment => {
            const statusStyle = STATUS_COLORS[payment.status] || STATUS_COLORS.pending
            return (
              <div key={payment.id} className="payment-card">
                <div className="payment-method">
                  {METHOD_ICONS[payment.method] || '💳'}
                </div>
                
                <div className="payment-info">
                  <h4>₱{payment.amount?.toLocaleString()}</h4>
                  <div className="payment-detail">
                    {payment.clientName || 'Unknown'} • {payment.method?.toUpperCase()}
                  </div>
                  <div className="payment-detail">
                    Ref: {payment.referenceNumber}
                  </div>
                  {payment.bookingRef && (
                    <span className="payment-ref">Booking: {payment.bookingRef}</span>
                  )}
                  {payment.screenshotUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <a 
                        href={payment.screenshotUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="screenshot-link"
                      >
                        📷 View Screenshot
                      </a>
                    </div>
                  )}
                  <div className="payment-detail" style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(payment.submittedAt).toLocaleString()}
                  </div>
                </div>

                <div 
                  className="payment-status"
                  style={{
                    backgroundColor: statusStyle.bg,
                    border: `1px solid ${statusStyle.border}`,
                    color: statusStyle.color
                  }}
                >
                  {payment.status}
                </div>

                <div className="payment-actions">
                  {payment.status === 'pending' && (
                    <>
                      <button 
                        className="action-btn confirm"
                        onClick={() => handleConfirm(payment.id)}
                      >
                        ✓ CONFIRM
                      </button>
                      <button 
                        className="action-btn reject"
                        onClick={() => handleReject(payment.id)}
                      >
                        ✗ REJECT
                      </button>
                    </>
                  )}
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(payment.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
