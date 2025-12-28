import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { NavBar, FloatingStars, ToastProvider, VersionBadge } from './components/ui'
import ProtectedRoute from './components/ProtectedRoute'

// Main page
import SinglePage from './pages/SinglePage'

// Individual pages (accessible via direct URL)
import Certifications from './pages/Certifications'

// Blog pages
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import ProjectDetail from './pages/ProjectDetail'
import ServiceInquiry from './pages/ServiceInquiry'
import Calendar from './pages/Calendar'
import Payment from './pages/Payment'
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
import ProjectsDashboard from './pages/admin/ProjectsDashboard'
import ProjectEditor from './pages/admin/ProjectEditor'
import ServicesDashboard from './pages/admin/ServicesDashboard'
import ServiceEditor from './pages/admin/ServiceEditor'
import BookingsDashboard from './pages/admin/BookingsDashboard'

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
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
              
              {/* Project detail page */}
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              
              {/* Service inquiry page */}
              <Route path="/services/:slug" element={<ServiceInquiry />} />

              {/* Calendar (public) */}
              <Route path="/calendar" element={<Calendar />} />

              {/* Payment page (public) */}
              <Route path="/payment" element={<Payment />} />

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

                {/* Projects Admin */}
                <Route path="/admin/projects" element={<ProjectsDashboard />} />
                <Route path="/admin/projects/new" element={<ProjectEditor />} />
                <Route path="/admin/projects/:projectId" element={<ProjectEditor />} />

                {/* Services Admin */}
                <Route path="/admin/services" element={<ServicesDashboard />} />
                <Route path="/admin/services/new" element={<ServiceEditor />} />
                <Route path="/admin/services/:serviceId" element={<ServiceEditor />} />

                {/* Bookings Admin */}
                <Route path="/admin/bookings" element={<BookingsDashboard />} />
              </Route>
            </Routes>
          </main>

          {/* Version Badge (persistent) */}
          <VersionBadge />
          </div>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}
