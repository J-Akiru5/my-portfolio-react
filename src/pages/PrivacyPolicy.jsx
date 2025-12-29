import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { GlassCard } from '../components/ui'

/**
 * PrivacyPolicy - Data privacy disclosure
 */
export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page">
      <Seo 
        title="Privacy Policy | JeffDev Studio"
        description="How JeffDev Studio handles your data and protects your privacy."
      />

      <style>{`
        .legal-page {
          min-height: 100vh;
          padding: 6rem 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .legal-header {
          margin-bottom: 3rem;
        }

        .legal-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.5rem;
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .legal-updated {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .legal-content {
          padding: 2rem !important;
        }

        .legal-content h2 {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.7rem;
          color: #39ff14;
          margin: 2rem 0 1rem;
        }

        .legal-content p,
        .legal-content li {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .legal-content ul {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .legal-content a {
          color: #00d4ff;
        }

        .back-link {
          display: inline-block;
          margin-top: 2rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #00d4ff;
        }
      `}</style>

      <div className="legal-header">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: December 2024</p>
      </div>

      <GlassCard className="legal-content">
        <p>
          JeffDev Studio ("we", "us", "our") is committed to protecting your privacy. 
          This policy explains how we collect, use, and safeguard your information.
        </p>

        <h2>1. Information We Collect</h2>
        <p>When you interact with our website or services, we may collect:</p>
        <ul>
          <li><strong>Contact Information:</strong> Name, email, phone number when you submit inquiries</li>
          <li><strong>Project Details:</strong> Requirements and specifications you provide</li>
          <li><strong>Analytics Data:</strong> Anonymous usage data through Google Analytics</li>
          <li><strong>Payment Information:</strong> Transaction references (we do not store card details)</li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <ul>
          <li>To respond to your inquiries and provide services</li>
          <li>To send project updates and invoices</li>
          <li>To improve our website and user experience</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>3. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Firebase:</strong> For data storage and authentication</li>
          <li><strong>Google Analytics:</strong> For website analytics</li>
          <li><strong>Vercel:</strong> For website hosting</li>
          <li><strong>Resend:</strong> For email notifications</li>
        </ul>
        <p>
          Each service has its own privacy policy. We encourage you to review them.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your information. 
          However, no method of transmission over the Internet is 100% secure.
        </p>

        <h2>5. Data Retention</h2>
        <p>
          We retain your data for as long as necessary to provide services and 
          fulfill legal obligations. You may request deletion of your data at any time.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent for data processing</li>
        </ul>

        <h2>7. Contact Us</h2>
        <p>
          For privacy-related inquiries, contact us at:{' '}
          <a href="mailto:contact@jeffdev.studio">contact@jeffdev.studio</a>
        </p>

        <Link to="/" className="back-link">← Back to Home</Link>
      </GlassCard>
    </div>
  )
}
