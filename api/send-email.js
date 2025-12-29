/**
 * Resend Email API Route for Vercel
 * 
 * Handles:
 * - Contact form submissions → notification to admin
 * - Service inquiry submissions → confirmation to client + notification to admin
 * 
 * Environment: RESEND_API_KEY must be set in Vercel
 */

export const config = {
  runtime: 'edge'
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'JeffDev Studio <contact@jeffdev.studio>'
const ADMIN_EMAIL = 'contact@jeffdev.studio'

export default async function handler(req) {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await req.json()
    const { type, data } = body

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let emailResult

    switch (type) {
      case 'contact':
        emailResult = await sendContactNotification(data)
        break
      
      case 'inquiry':
        // Send confirmation to client
        await sendInquiryConfirmation(data)
        // Send notification to admin
        emailResult = await sendInquiryNotification(data)
        break
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid email type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
    }

    return new Response(JSON.stringify({ success: true, id: emailResult?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Email error:', error)
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * Send contact form notification to admin
 */
async function sendContactNotification(data) {
  const { name, email, subject, message } = data

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a12; color: #fff; padding: 2rem; border-radius: 12px;">
      <h1 style="color: #00d4ff; font-size: 1.5rem; border-bottom: 2px solid #00d4ff; padding-bottom: 1rem;">
        📬 New Contact Form Submission
      </h1>
      
      <table style="width: 100%; margin: 1.5rem 0;">
        <tr>
          <td style="color: #888; padding: 0.5rem 0; width: 100px;">From:</td>
          <td style="color: #fff;">${name}</td>
        </tr>
        <tr>
          <td style="color: #888; padding: 0.5rem 0;">Email:</td>
          <td><a href="mailto:${email}" style="color: #00d4ff;">${email}</a></td>
        </tr>
        <tr>
          <td style="color: #888; padding: 0.5rem 0;">Subject:</td>
          <td style="color: #fff;">${subject || 'No subject'}</td>
        </tr>
      </table>
      
      <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1.5rem; margin-top: 1rem;">
        <h3 style="color: #39ff14; margin: 0 0 1rem 0; font-size: 0.9rem;">MESSAGE:</h3>
        <p style="color: #ddd; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
      
      <p style="color: #666; font-size: 0.75rem; margin-top: 2rem; text-align: center;">
        Sent from JeffDev Studio Contact Form
      </p>
    </div>
  `

  return await sendEmail({
    to: ADMIN_EMAIL,
    subject: `💬 Contact: ${subject || 'New Message'} from ${name}`,
    html
  })
}

/**
 * Send inquiry confirmation to client
 */
async function sendInquiryConfirmation(data) {
  const { clientName, clientEmail, serviceName, projectTitle, budget, timeline, refId } = data

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a12; color: #fff; padding: 2rem; border-radius: 12px;">
      <h1 style="color: #00d4ff; font-size: 1.5rem; border-bottom: 2px solid #00d4ff; padding-bottom: 1rem;">
        ✅ Inquiry Received!
      </h1>
      
      <p style="color: #ddd; line-height: 1.6;">
        Hi ${clientName},
      </p>
      
      <p style="color: #ddd; line-height: 1.6;">
        Thank you for reaching out! I've received your project inquiry and will get back to you within 24-48 hours.
      </p>
      
      <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="color: #00d4ff; margin: 0 0 1rem 0; font-size: 1rem;">YOUR BOOKING DETAILS</h3>
        <table style="width: 100%;">
          <tr>
            <td style="color: #888; padding: 0.25rem 0;">Reference:</td>
            <td style="color: #39ff14; font-family: monospace;">${refId}</td>
          </tr>
          <tr>
            <td style="color: #888; padding: 0.25rem 0;">Service:</td>
            <td style="color: #fff;">${serviceName}</td>
          </tr>
          ${projectTitle ? `
          <tr>
            <td style="color: #888; padding: 0.25rem 0;">Project:</td>
            <td style="color: #fff;">${projectTitle}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="color: #888; padding: 0.25rem 0;">Budget:</td>
            <td style="color: #fff;">${budget}</td>
          </tr>
          <tr>
            <td style="color: #888; padding: 0.25rem 0;">Timeline:</td>
            <td style="color: #fff;">${timeline}</td>
          </tr>
        </table>
      </div>
      
      <p style="color: #ddd; line-height: 1.6;">
        In the meantime, feel free to check out my <a href="https://jeffdev.studio" style="color: #00d4ff;">portfolio</a> or connect with me on social media.
      </p>
      
      <p style="color: #ddd; line-height: 1.6;">
        Best regards,<br/>
        <strong style="color: #00d4ff;">Jeff Martinez</strong><br/>
        JeffDev Studio
      </p>
      
      <p style="color: #666; font-size: 0.75rem; margin-top: 2rem; text-align: center; border-top: 1px solid #333; padding-top: 1rem;">
        This is an automated confirmation. Please do not reply directly to this email.
      </p>
    </div>
  `

  return await sendEmail({
    to: clientEmail,
    subject: `✅ Inquiry Received - ${serviceName} | JeffDev Studio [${refId}]`,
    html
  })
}

/**
 * Send inquiry notification to admin
 */
async function sendInquiryNotification(data) {
  const { clientName, clientEmail, serviceName, projectTitle, budget, timeline, description, refId } = data

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a12; color: #fff; padding: 2rem; border-radius: 12px;">
      <h1 style="color: #ffc107; font-size: 1.5rem; border-bottom: 2px solid #ffc107; padding-bottom: 1rem;">
        🚀 New Service Inquiry!
      </h1>
      
      <div style="background: rgba(57, 255, 20, 0.1); border: 1px solid rgba(57, 255, 20, 0.3); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <span style="color: #39ff14; font-family: monospace; font-size: 0.9rem;">REF: ${refId}</span>
      </div>
      
      <table style="width: 100%; margin: 1rem 0;">
        <tr>
          <td style="color: #888; padding: 0.5rem 0; width: 100px;">Client:</td>
          <td style="color: #fff;">${clientName}</td>
        </tr>
        <tr>
          <td style="color: #888; padding: 0.5rem 0;">Email:</td>
          <td><a href="mailto:${clientEmail}" style="color: #00d4ff;">${clientEmail}</a></td>
        </tr>
        <tr>
          <td style="color: #888; padding: 0.5rem 0;">Service:</td>
          <td style="color: #ffc107;">${serviceName}</td>
        </tr>
        ${projectTitle ? `
        <tr>
          <td style="color: #888; padding: 0.5rem 0;">Project:</td>
          <td style="color: #00d4ff;">${projectTitle}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="color: #888; padding: 0.5rem 0;">Budget:</td>
          <td style="color: #39ff14;">${budget}</td>
        </tr>
        <tr>
          <td style="color: #888; padding: 0.5rem 0;">Timeline:</td>
          <td style="color: #fff;">${timeline}</td>
        </tr>
      </table>
      
      ${description ? `
      <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1.5rem; margin-top: 1rem;">
        <h3 style="color: #00d4ff; margin: 0 0 1rem 0; font-size: 0.9rem;">PROJECT DESCRIPTION:</h3>
        <p style="color: #ddd; line-height: 1.6; white-space: pre-wrap;">${description}</p>
      </div>
      ` : ''}
      
      <div style="margin-top: 1.5rem; text-align: center;">
        <a href="https://jeffdev.studio/admin/bookings" style="display: inline-block; background: #ffc107; color: #000; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; font-weight: bold;">
          View in Dashboard →
        </a>
      </div>
      
      <p style="color: #666; font-size: 0.75rem; margin-top: 2rem; text-align: center;">
        New inquiry from JeffDev Studio
      </p>
    </div>
  `

  return await sendEmail({
    to: ADMIN_EMAIL,
    subject: `🚀 New Inquiry: ${serviceName} from ${clientName} [${refId}]`,
    html
  })
}

/**
 * Core email sending function using Resend API
 */
async function sendEmail({ to, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }

  return await response.json()
}
