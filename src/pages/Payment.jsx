import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
  }
}

const LANDBANK_DETAILS = {
  accountName: 'JEFF EDRICK C MARTINEZ',
  accountNumber: '1936209196',
  bank: 'Landbank of the Philippines'
}

export default function Payment() {
  const [activeMethod, setActiveMethod] = useState('gcash')
  const [copied, setCopied] = useState('')
  const { showToast } = useToast()

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
        description="Pay for your project via GCash or Landbank"
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

        <div className="confirm-section">
          <p className="confirm-text">
            After payment, please send your receipt via email for verification.
          </p>
          <a 
            href="mailto:jeffdev.studio@gmail.com?subject=Payment Confirmation&body=Hi Jeff, I have completed my payment. Please see attached receipt."
            style={{ textDecoration: 'none' }}
          >
            <PixelButton variant="filled" icon="📧">
              SEND RECEIPT
            </PixelButton>
          </a>
          <p className="warning-text">
            ⚠️ Payment will be verified within 24 hours
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
