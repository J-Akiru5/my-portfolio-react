import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FloatingStars } from './ui'

export default function ProtectedRoute() {
  const { currentUser, isAdmin } = useAuth()

  if (!currentUser) {
    return <Navigate to="/admin/login" />
  }

  if (!isAdmin) {
    // Optional: Redirect to unauthorized page or show message
    // For now, redirect to login which might show "Not authorized"
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
        fontFamily: "'Space Grotesk', sans-serif"
      }}>
        <FloatingStars />
        <h1 style={{ fontFamily: "'Press Start 2P', cursive", color: '#ff6b35', marginBottom: '1rem' }}>ACCESS DENIED</h1>
        <p>You do not have permission to view this page.</p>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ 
            marginTop: '2rem',
            background: 'transparent',
            border: '1px solid #00d4ff',
            color: '#00d4ff',
            padding: '1rem 2rem',
            fontFamily: "'Press Start 2P', cursive",
            cursor: 'pointer'
          }}
        >
          RETURN HOME
        </button>
      </div>
    )
  }

  return <Outlet />
}
