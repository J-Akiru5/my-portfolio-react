import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import Seo from '../components/Seo'
import { PixelButton, GlassCard, useToast } from '../components/ui'

/**
 * Payment - Payment options page for clients
 * Displays GCash QR and Landbank details with copy functionality
 */

const PAYMENT_METHODS = {
  gcash: {
    name: 'GCash',
    icon: '📱',
    color: '#007DFE',
    description: 'Scan QR code with GCash app'
  },
  landbank: {
    name: 'Landbank',
    icon: '🏦',
    color: '#00843D',
    description: 'Bank transfer via online banking or branch'
  },
  paypal: {
    name: 'PayPal',
    icon: '🌐',
    color: '#003087',
    description: 'International payments via PayPal'
  }
}

const LANDBANK_DETAILS = {
  accountName: 'JEFF EDRICK C MARTINEZ',
  accountNumber: '1936209196',
  bank: 'Landbank of the Philippines'
}

export default function Payment() {
  const [searchParams] = useSearchParams()
  const bookingRef = searchParams.get('ref') || ''
  
  const [activeMethod, setActiveMethod] = useState('gcash')
  const [copied, setCopied] = useState('')
  const { showToast } = useToast()
  
  // Booking info (when ref is provided)
  const [booking, setBooking] = useState(null)
  const [loadingBooking, setLoadingBooking] = useState(false)
  
  // Confirmation form state
  const [confirmData, setConfirmData] = useState({
    amount: '',
    referenceNumber: '',
    notes: ''
  })
  const [screenshot, setScreenshot] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Fetch booking if ref provided
  useEffect(() => {
    async function fetchBooking() {
      if (!bookingRef || bookingRef.length < 8) return
      
      setLoadingBooking(true)
      try {
        // Search by ID prefix (first 8 chars uppercase match)
        const bookingsRef = collection(db, 'bookings')
        const snapshot = await getDocs(bookingsRef)
        
        const found = snapshot.docs.find(docSnap => 
          docSnap.id.slice(0, 8).toUpperCase() === bookingRef.toUpperCase()
        )
        
        if (found) {
          setBooking({ id: found.id, ...found.data() })
        }
      } catch (error) {
        console.error('Error fetching booking:', error)
      } finally {
        setLoadingBooking(false)
      }
    }
    fetchBooking()
  }, [bookingRef])
  
  // Validate reference number (min 8 chars for GCash/PayPal, 10 for bank)
  function validateReferenceNumber(refNum) {
    const minLength = activeMethod === 'landbank' ? 10 : 8
    return refNum.trim().length >= minLength
  }
  
  // Check for duplicate reference number
  async function checkDuplicateRef(refNum) {
    const paymentsRef = collection(db, 'payments')
    const q = query(paymentsRef, where('referenceNumber', '==', refNum.trim()))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  }
  
  // Handle screenshot selection
  function handleScreenshotChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('Screenshot too large (max 5MB)', 'error')
        return
      }
      setScreenshot(file)
    }
  }
  
  // Submit payment confirmation
  async function handleSubmitPayment(e) {
    e.preventDefault()
    
    // Validate amount
    const amount = parseFloat(confirmData.amount)
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error')
      return
    }
    
    // Validate reference number
    if (!validateReferenceNumber(confirmData.referenceNumber)) {
      showToast(`Reference number too short (min ${activeMethod === 'landbank' ? 10 : 8} characters)`, 'error')
      return
    }
    
    setSubmitting(true)
    
    try {
      // Check for duplicate reference
      const isDuplicate = await checkDuplicateRef(confirmData.referenceNumber)
      if (isDuplicate) {
        showToast('This reference number has already been used!', 'error')
        setSubmitting(false)
        return
      }
      
      // Upload screenshot if provided
      let screenshotUrl = null
      if (screenshot) {
        const fileName = `payments/${Date.now()}_${screenshot.name}`
        const storageRef = ref(storage, fileName)
        await uploadBytes(storageRef, screenshot)
        screenshotUrl = await getDownloadURL(storageRef)
      }
      
      // Create payment record
      const paymentData = {
        bookingId: booking?.id || null,
        bookingRef: bookingRef || null,
        amount,
        method: activeMethod,
        referenceNumber: confirmData.referenceNumber.trim(),
        notes: confirmData.notes.trim(),
        screenshotUrl,
        status: 'pending', // pending | confirmed | rejected
        submittedAt: new Date().toISOString(),
        confirmedAt: null,
        rejectedAt: null,
        clientEmail: booking?.clientEmail || null,
        clientName: booking?.clientName || null
      }
      
      await addDoc(collection(db, 'payments'), paymentData)
      
      // Send notification email
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'contact',
            data: {
              name: booking?.clientName || 'Client',
              email: booking?.clientEmail || 'unknown',
              subject: `💰 Payment Confirmation - ₱${amount.toLocaleString()}`,
              message: `Payment submitted:\n\nAmount: ₱${amount.toLocaleString()}\nMethod: ${activeMethod.toUpperCase()}\nRef #: ${confirmData.referenceNumber}\nBooking: ${bookingRef || 'N/A'}\n\nPlease verify in the admin dashboard.`
            }
          })
        })
      } catch (emailError) {
        console.warn('Email notification failed:', emailError)
      }
      
      setSubmitted(true)
      showToast('Payment confirmation submitted!', 'success')
      
    } catch (error) {
      console.error('Error submitting payment:', error)
      showToast('Failed to submit. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Copy to clipboard
  async function copyToClipboard(text, label) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      showToast(`${label} copied!`, 'success')
      setTimeout(() => setCopied(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="payment-page">
      <Seo 
        title="Payment | JeffDev Studio"
        description="Pay for your project via GCash, Landbank, or PayPal"
      />

      <style>{`
        .payment-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .back-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          display: inline-block;
        }
        .back-link:hover { color: #00d4ff; }

        .page-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.5rem;
          color: #00d4ff;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
          margin-bottom: 3rem;
        }

        .method-tabs {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .method-tab {
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .method-tab:hover {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .method-tab.active {
          border-color: var(--tab-color);
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .method-icon {
          font-size: 1.5rem;
        }

        .payment-content {
          padding: 2.5rem;
          text-align: center;
        }

        .qr-container {
          max-width: 280px;
          margin: 0 auto 2rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
        }

        .qr-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .bank-details {
          text-align: left;
          max-width: 400px;
          margin: 0 auto;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .detail-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.25rem;
        }

        .detail-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem;
          color: white;
        }

        .copy-btn {
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

        .copy-btn:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .copy-btn.copied {
          border-color: #39ff14;
          color: #39ff14;
        }

        .instructions {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(0, 212, 255, 0.05);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 8px;
        }

        .instructions h4 {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .instructions ol {
          text-align: left;
          color: rgba(255, 255, 255, 0.7);
          padding-left: 1.5rem;
          line-height: 1.8;
        }

        .confirm-section {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .confirm-text {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .warning-text {
          font-size: 0.75rem;
          color: rgba(255, 193, 7, 0.8);
          margin-top: 1rem;
        }
      `}</style>

      <Link to="/" className="back-link">← Back to Home</Link>

      <h1 className="page-title">PAYMENT</h1>
      <p className="page-subtitle">Choose your preferred payment method</p>

      <div className="method-tabs">
        {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
          <button
            key={key}
            className={`method-tab ${activeMethod === key ? 'active' : ''}`}
            style={{ '--tab-color': method.color }}
            onClick={() => setActiveMethod(key)}
          >
            <span className="method-icon">{method.icon}</span>
            <span>{method.name}</span>
          </button>
        ))}
      </div>

      <GlassCard className="payment-content">
        {activeMethod === 'gcash' && (
          <>
            <div className="qr-container">
              <img 
                src="/assets/GCash QR.jpg" 
                alt="GCash QR Code" 
                className="qr-image"
              />
            </div>
            
            <div className="instructions">
              <h4>HOW TO PAY</h4>
              <ol>
                <li>Open your <strong>GCash</strong> app</li>
                <li>Tap <strong>QR</strong> at the bottom menu</li>
                <li>Scan the QR code above</li>
                <li>Enter the payment amount</li>
                <li>Confirm and complete payment</li>
                <li>Screenshot your receipt!</li>
              </ol>
            </div>
          </>
        )}

        {activeMethod === 'landbank' && (
          <>
            <div className="bank-details">
              <div className="detail-row">
                <div>
                  <div className="detail-label">BANK</div>
                  <div className="detail-value">{LANDBANK_DETAILS.bank}</div>
                </div>
              </div>
              
              <div className="detail-row">
                <div>
                  <div className="detail-label">ACCOUNT NAME</div>
                  <div className="detail-value">{LANDBANK_DETAILS.accountName}</div>
                </div>
                <button 
                  className={`copy-btn ${copied === 'Name' ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(LANDBANK_DETAILS.accountName, 'Name')}
                >
                  {copied === 'Name' ? '✓ COPIED' : 'COPY'}
                </button>
              </div>
              
              <div className="detail-row">
                <div>
                  <div className="detail-label">ACCOUNT NUMBER</div>
                  <div className="detail-value" style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>
                    {LANDBANK_DETAILS.accountNumber}
                  </div>
                </div>
                <button 
                  className={`copy-btn ${copied === 'Number' ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(LANDBANK_DETAILS.accountNumber, 'Number')}
                >
                  {copied === 'Number' ? '✓ COPIED' : 'COPY'}
                </button>
              </div>
            </div>

            <div className="instructions">
              <h4>HOW TO PAY</h4>
              <ol>
                <li>Open your <strong>Online Banking</strong> app</li>
                <li>Select <strong>Transfer to Other Banks</strong></li>
                <li>Choose <strong>Landbank</strong> as recipient bank</li>
                <li>Enter the account number above</li>
                <li>Enter payment amount</li>
                <li>Screenshot your receipt!</li>
              </ol>
            </div>
          </>
        )}

        {activeMethod === 'paypal' && (
          <>
            <div className="paypal-section" style={{ marginBottom: '2rem' }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1rem' 
              }}>
                🌐
              </div>
              <h3 style={{ 
                fontFamily: 'Press Start 2P', 
                fontSize: '0.9rem', 
                color: '#003087',
                marginBottom: '0.5rem'
              }}>
                INTERNATIONAL PAYMENTS
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
                Pay securely via PayPal from anywhere in the world
              </p>
              
              <a 
                href="https://paypal.me/JeffDevStudio" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <PixelButton variant="filled" color="blue" size="large">
                  PAY WITH PAYPAL
                </PixelButton>
              </a>
              
              <p style={{ 
                marginTop: '1.5rem', 
                fontSize: '0.8rem', 
                color: 'rgba(255,255,255,0.5)' 
              }}>
                You'll be redirected to PayPal to complete your payment
              </p>
            </div>

            <div className="instructions">
              <h4>HOW TO PAY</h4>
              <ol>
                <li>Click the <strong>PAY WITH PAYPAL</strong> button above</li>
                <li>Log in to your PayPal account</li>
                <li>Enter the payment amount (in USD or PHP)</li>
                <li>Add a note with your project name</li>
                <li>Complete the payment</li>
                <li>You'll receive a confirmation email</li>
              </ol>
            </div>
          </>
        )}

        {/* Booking Info (if ref provided) */}
        {booking && (
          <div style={{
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h4 style={{ color: '#00d4ff', marginBottom: '1rem', fontFamily: 'Press Start 2P', fontSize: '0.7rem' }}>
              BOOKING DETAILS
            </h4>
            <div style={{ display: 'grid', gap: '0.5rem', fontFamily: 'JetBrains Mono' }}>
              <div><span style={{ color: '#888' }}>Ref:</span> <span style={{ color: '#39ff14' }}>{bookingRef.toUpperCase()}</span></div>
              <div><span style={{ color: '#888' }}>Service:</span> {booking.serviceName}</div>
              <div><span style={{ color: '#888' }}>Client:</span> {booking.clientName}</div>
              {booking.projectTitle && <div><span style={{ color: '#888' }}>Project:</span> {booking.projectTitle}</div>}
              <div><span style={{ color: '#888' }}>Budget:</span> <span style={{ color: '#ffc107' }}>{booking.budget}</span></div>
            </div>
          </div>
        )}

        {loadingBooking && (
          <div style={{ textAlign: 'center', color: '#00d4ff', marginBottom: '1rem' }}>
            Loading booking...
          </div>
        )}

        {/* Payment Confirmation Form */}
        <div className="confirm-section" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', marginTop: '1rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: '#39ff14', fontFamily: 'Press Start 2P', fontSize: '1rem', marginBottom: '1rem' }}>
                PAYMENT SUBMITTED!
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Your payment confirmation has been received.<br/>
                We'll verify it within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <h4 style={{ 
                color: '#00d4ff', 
                fontFamily: 'Press Start 2P', 
                fontSize: '0.8rem', 
                marginBottom: '1.5rem',
                textAlign: 'center' 
              }}>
                CONFIRM YOUR PAYMENT
              </h4>
              
              <form onSubmit={handleSubmitPayment} style={{ maxWidth: '400px', margin: '0 auto' }}>
                {/* Amount */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#00d4ff', fontSize: '0.7rem', fontFamily: 'Press Start 2P', marginBottom: '0.5rem' }}>
                    AMOUNT PAID (₱) *
                  </label>
                  <input
                    type="number"
                    className="terminal-input"
                    placeholder="e.g. 5000"
                    value={confirmData.amount}
                    onChange={e => setConfirmData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    min="1"
                    step="0.01"
                    style={{ width: '100%' }}
                  />
                </div>
                
                {/* Reference Number */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#00d4ff', fontSize: '0.7rem', fontFamily: 'Press Start 2P', marginBottom: '0.5rem' }}>
                    REFERENCE NUMBER *
                  </label>
                  <input
                    type="text"
                    className="terminal-input"
                    placeholder={`e.g. ${activeMethod === 'gcash' ? '1234567890123' : activeMethod === 'paypal' ? 'ABCD1234EFGH' : '12345678901234'}`}
                    value={confirmData.referenceNumber}
                    onChange={e => setConfirmData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                    required
                    minLength={activeMethod === 'landbank' ? 10 : 8}
                    style={{ width: '100%' }}
                  />
                  <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                    Min {activeMethod === 'landbank' ? '10' : '8'} characters. Found on your receipt.
                  </small>
                </div>
                
                {/* Screenshot Upload */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#00d4ff', fontSize: '0.7rem', fontFamily: 'Press Start 2P', marginBottom: '0.5rem' }}>
                    SCREENSHOT (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '4px',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  />
                  {screenshot && (
                    <small style={{ color: '#39ff14', fontSize: '0.7rem' }}>
                      ✓ {screenshot.name}
                    </small>
                  )}
                </div>
                
                {/* Notes */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#00d4ff', fontSize: '0.7rem', fontFamily: 'Press Start 2P', marginBottom: '0.5rem' }}>
                    NOTES (optional)
                  </label>
                  <textarea
                    className="terminal-input"
                    placeholder="Any additional info..."
                    value={confirmData.notes}
                    onChange={e => setConfirmData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>
                
                {/* Submit Button */}
                <PixelButton 
                  variant="filled" 
                  color="matrix"
                  style={{ width: '100%' }}
                  disabled={submitting}
                >
                  {submitting ? 'SUBMITTING...' : '✓ CONFIRM PAYMENT'}
                </PixelButton>
              </form>
              
              <p className="warning-text" style={{ marginTop: '1.5rem' }}>
                ⚠️ Duplicate reference numbers will be flagged
              </p>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
