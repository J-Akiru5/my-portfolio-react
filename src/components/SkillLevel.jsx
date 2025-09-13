import React from 'react'

export default function SkillLevel({ skills = [] }) {
  return (
    <div>
      {skills.map(s => (
        <div key={s.name} style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <strong>{s.name}</strong>
            <small style={{ color: '#6b7280' }}>{s.level}%</small>
          </div>
          <div style={{ background: '#e5e7eb', height: 10, borderRadius: 6 }}>
            <div style={{ width: `${s.level}%`, height: '100%', background: '#2563eb', borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  )
}
