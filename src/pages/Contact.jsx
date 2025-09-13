import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'profile_contact_messages_v1'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setMessages(JSON.parse(raw))
  }, [])

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Please include a message'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e) {
    setForm(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    const payload = { ...form, id: Date.now(), sentAt: new Date().toISOString() }
    const updated = [payload, ...messages].slice(0, 20)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setMessages(updated)
    setSent(payload)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(null), 4000)
  }

  return (
    <section style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Contact me</h1>
      <p>Send a message — messages are stored locally for demo purposes and will be saved to your database later.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
        <div>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
          {errors.name && <div style={{ color: 'crimson' }}>{errors.name}</div>}
        </div>
        <div>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
          {errors.email && <div style={{ color: 'crimson' }}>{errors.email}</div>}
        </div>
        <div>
          <input name="subject" placeholder="Subject (optional)" value={form.subject} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div>
          <textarea name="message" placeholder="Your message" value={form.message} onChange={handleChange} rows={6} style={{ width: '100%', padding: '0.5rem' }} />
          {errors.message && <div style={{ color: 'crimson' }}>{errors.message}</div>}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Send message</button>
          {sent && <div style={{ color: 'green' }}>Message sent (local demo)</div>}
        </div>
      </form>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Preview</h2>
        <div style={{ border: '1px dashed #e5e7eb', padding: '1rem', borderRadius: 6 }}>
          <strong>{form.subject || '(No subject)'}</strong>
          <div style={{ color: '#6b7280' }}>From: {form.name || '—'} {form.email ? `(${form.email})` : ''}</div>
          <p style={{ marginTop: '0.5rem' }}>{form.message || 'Your message preview will appear here.'}</p>
        </div>
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Recent messages (demo)</h2>
        {messages.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No messages yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map(m => (
              <li key={m.id} style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: 6, marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{m.name}</strong>
                  <small style={{ color: '#6b7280' }}>{new Date(m.sentAt).toLocaleString()}</small>
                </div>
                <div style={{ color: '#6b7280' }}>{m.email} — {m.subject || 'No subject'}</div>
                <p style={{ marginTop: '0.5rem' }}>{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
