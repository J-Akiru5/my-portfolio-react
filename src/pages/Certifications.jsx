import React from 'react'

const certs = [
  { id: 1, title: 'Frontend Specialist', issuer: 'Online Academy', year: 2023 },
  { id: 2, title: 'React Professional', issuer: 'CertOrg', year: 2024 },
]

const Certifications = () => {
  return (
    <section style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Certifications</h1>
      <p>Certifications and training. Upload certificates to your DB and replace these placeholders.</p>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {certs.map(c => (
          <li key={c.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: 8, marginBottom: '0.75rem' }}>
            <strong>{c.title}</strong>
            <div style={{ color: '#6b7280' }}>{c.issuer} — {c.year}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Export as default so `import Certifications from '.../Certifications'` works.
export default Certifications

// Also export named in case some files import { Certifications }.
export { Certifications }