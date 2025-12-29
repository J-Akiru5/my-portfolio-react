import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { GlassCard } from '../components/ui'

/**
 * TermsOfService - B2B focused terms
 */
export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page">
      <Seo 
        title="Terms of Service | JeffDev Studio"
        description="Terms and conditions for engaging JeffDev Studio's services."
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
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: December 2024</p>
      </div>

      <GlassCard className="legal-content">
        <p>
          These Terms of Service ("Terms") govern your engagement with JeffDev Studio 
          ("we", "us", "our"), a DTI-registered business (VLLP979818395984) based in 
          the Philippines.
        </p>

        <h2>1. Services</h2>
        <p>
          We provide web development, UI/UX design, and mobile application development 
          services. All project scopes, deliverables, and timelines will be documented 
          in a separate project proposal or contract.
        </p>

        <h2>2. Payment Terms</h2>
        <ul>
          <li>A 50% downpayment is required before project commencement.</li>
          <li>Final payment (50%) is due upon project completion and approval.</li>
          <li>Accepted payment methods: GCash, Bank Transfer (Landbank), PayPal.</li>
          <li>Late payments may incur additional fees as specified in the project contract.</li>
        </ul>

        <h2>3. Intellectual Property</h2>
        <p>
          Upon full payment, all custom code, designs, and deliverables created 
          specifically for your project will be transferred to you. We retain the 
          right to showcase the work in our portfolio unless otherwise agreed in writing.
        </p>

        <h2>4. Revisions</h2>
        <p>
          Each project includes a reasonable number of revision rounds as specified 
          in the project proposal. Additional revisions beyond the agreed scope may 
          incur additional charges.
        </p>

        <h2>5. Confidentiality</h2>
        <p>
          We will keep all project-related information confidential and will not 
          share your proprietary business information with third parties.
        </p>

        <h2>6. Project Cancellation</h2>
        <ul>
          <li>Client-initiated cancellation: Downpayment is non-refundable.</li>
          <li>Work completed up to cancellation date will be billed proportionally.</li>
          <li>Deliverables will be released upon settlement of outstanding balances.</li>
        </ul>

        <h2>7. Limitation of Liability</h2>
        <p>
          Our liability is limited to the total amount paid for the project. We are 
          not liable for indirect, incidental, or consequential damages arising from 
          our services.
        </p>

        <h2>8. Contact</h2>
        <p>
          For questions about these Terms, contact us at:{' '}
          <a href="mailto:contact@jeffdev.studio">contact@jeffdev.studio</a>
        </p>

        <Link to="/" className="back-link">← Back to Home</Link>
      </GlassCard>
    </div>
  )
}
