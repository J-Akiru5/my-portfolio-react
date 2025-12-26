import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { NavBar, FloatingStars } from './components/ui'
import ProtectedRoute from './components/ProtectedRoute'

// Main page
import SinglePage from './pages/SinglePage'

// Individual pages (accessible via direct URL)
import Certifications from './pages/Certifications'

// Blog pages
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import AdminGateway from './pages/AdminGateway'

// Admin pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Analytics from './pages/admin/Analytics'
import SystemConfig from './pages/admin/SystemConfig'
import Messages from './pages/admin/Messages'
import AdminSeed from './pages/AdminSeed'
import BlogDashboard from './pages/admin/BlogDashboard'
import BlogEditor from './pages/admin/BlogEditor'

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="app-wrapper pixel-grid" style={{ minHeight: '100vh', position: 'relative' }}>
          
          {/* Background effects */}
          <FloatingStars count={80} />
          
          {/* Navigation */}
          <NavBar />
          
          {/* Main content */}
          <main id="main-content" style={{ paddingTop: '60px', position: 'relative', zIndex: 1 }}>
            <Routes>
              {/* One-Page Catalogue */}
              <Route path="/" element={<SinglePage />} />
              
              {/* Full certificates page */}
              <Route path="/certifications" element={<Certifications />} />
              
              {/* Blog pages (public) */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              
              {/* Secret Admin Gateway */}
              <Route path="/admin/gateway" element={<AdminGateway />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/seed" element={<AdminSeed />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/settings" element={<SystemConfig />} />
                <Route path="/admin/messages" element={<Messages />} />
                <Route path="/admin/blog" element={<BlogDashboard />} />
                <Route path="/admin/blog/new" element={<BlogEditor />} />
                <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </HelmetProvider>
  )
}
