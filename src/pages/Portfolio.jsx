import React from 'react'

const projects = [
  { id: 1, title: 'SineAI', tag: 'AI', desc: 'A generative audio assistant (demo in Sine‑AI page).' },
  { id: 2, title: 'Profile Site', tag: 'Web', desc: 'Personal profile with CMS-ready content.' },
  { id: 3, title: 'Design System', tag: 'Design', desc: 'Reusable UI components and tokens.' },
]

const Portfolio = () => {
  return (
    <main>
      <h1>Portfolio</h1>
      <p>Selected projects. Images and full descriptions will be added from your database.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem', marginTop: '1rem' }}>
        {projects.map(p => (
          <article key={p.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: 8 }}>
            <div style={{ background: '#f3f4f6', height: 140, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#9ca3af' }}>Image placeholder</span>
            </div>
            <h3 style={{ marginTop: '0.75rem' }}>{p.title}</h3>
            <small style={{ color: '#6b7280' }}>{p.tag}</small>
            <p style={{ marginTop: '0.5rem' }}>{p.desc}</p>
          </article>
        ))}
      </div>
    </main>
  )
}

// Export as default so `import Portfolio from '.../Portfolio'` works.
export default Portfolio

// Also export named in case some files import { Portfolio }.
export { Portfolio }