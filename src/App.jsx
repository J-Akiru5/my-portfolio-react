import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NavBar, FloatingStars } from './components/ui'
import ProtectedRoute from './components/ProtectedRoute'

// Main page
import SinglePage from './pages/SinglePage'

// Individual pages (accessible via direct URL)
import Certifications from './pages/Certifications'

// Admin pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Analytics from './pages/admin/Analytics'
import SystemConfig from './pages/admin/SystemConfig'
import Messages from './pages/admin/Messages'
import AdminSeed from './pages/AdminSeed'

export default function App() {
  return (
    <AuthProvider>
      <div className="app-wrapper pixel-grid" style={{ minHeight: '100vh', position: 'relative' }}>
        {/* Background effects */}
        <FloatingStars count={80} />
        
        {/* Navigation */}
        <NavBar />
        
        {/* Main content */}
        <main style={{ paddingTop: '60px', position: 'relative', zIndex: 1 }}>
          <Routes>
            {/* One-Page Catalogue */}
            <Route path="/" element={<SinglePage />} />
            
            {/* Full certificates page */}
            <Route path="/certifications" element={<Certifications />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/seed" element={<AdminSeed />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<SystemConfig />} />
              <Route path="/admin/messages" element={<Messages />} />
            </Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
