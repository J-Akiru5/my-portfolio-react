import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { NavBar, FloatingStars, ToastProvider, VersionBadge } from './components/ui'
import ProtectedRoute from './components/ProtectedRoute'

// Main page
const SinglePage = lazy(() => import('./pages/SinglePage'))

// Individual pages (accessible via direct URL)
const Certifications = lazy(() => import('./pages/Certifications'))

// Blog pages
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const ServiceInquiry = lazy(() => import('./pages/ServiceInquiry'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Payment = lazy(() => import('./pages/Payment'))
const AdminGateway = lazy(() => import('./pages/AdminGateway'))

// Admin pages
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))
const SystemConfig = lazy(() => import('./pages/admin/SystemConfig'))
const Messages = lazy(() => import('./pages/admin/Messages'))
const AdminSeed = lazy(() => import('./pages/AdminSeed'))
const BlogDashboard = lazy(() => import('./pages/admin/BlogDashboard'))
const BlogEditor = lazy(() => import('./pages/admin/BlogEditor'))
const ProjectsDashboard = lazy(() => import('./pages/admin/ProjectsDashboard'))
const ProjectEditor = lazy(() => import('./pages/admin/ProjectEditor'))
const ServicesDashboard = lazy(() => import('./pages/admin/ServicesDashboard'))
const ServiceEditor = lazy(() => import('./pages/admin/ServiceEditor'))
const BookingsDashboard = lazy(() => import('./pages/admin/BookingsDashboard'))
const PaymentsDashboard = lazy(() => import('./pages/admin/PaymentsDashboard'))
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'))

const PageLoader = () => (
  <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#0a0a12', flexDirection: 'column', gap: '1rem' }}>
    <span className="star" style={{ color: '#39ff14', fontSize: '2rem', animation: 'pulse-glow 1s ease-in-out infinite alternate' }}>★</span>
    <div style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#00d4ff' }}>LOADING.DAT...</div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="app-wrapper pixel-grid" style={{ minHeight: '100vh', position: 'relative' }}>
          
          {/* Background effects */}
          <FloatingStars count={50} />
          
          {/* Navigation */}
          <NavBar />
          
          {/* Main content */}
          <main id="main-content" style={{ paddingTop: '60px', position: 'relative', zIndex: 1 }}>
            <Suspense fallback={<PageLoader />}>
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

                  {/* Payments Admin */}
                  <Route path="/admin/payments" element={<PaymentsDashboard />} />

                  {/* Audit Logs */}
                  <Route path="/admin/audit-logs" element={<AuditLogs />} />
                </Route>
              </Routes>
            </Suspense>
          </main>

          {/* Version Badge (persistent) */}
          <VersionBadge />
          </div>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}
