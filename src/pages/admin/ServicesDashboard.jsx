import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'
import { SectionTitle, GlassCard, PixelButton, useToast } from '../../components/ui'

/**
 * ServicesDashboard - Admin page for managing services
 */
export default function ServicesDashboard() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { showToast } = useToast()

  // Fetch services from Firestore
  useEffect(() => {
    async function fetchServices() {
      try {
        const servicesRef = collection(db, 'services')
        const q = query(servicesRef, orderBy('order', 'asc'))
        const snapshot = await getDocs(q)
        
        const servicesData = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        setServices(servicesData)
      } catch (error) {
        console.error('Error fetching services:', error)
        showToast('Failed to load services', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [showToast])

  // Delete a service
  async function handleDelete(serviceId, title) {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    
    try {
      await deleteDoc(doc(db, 'services', serviceId))
      setServices(prev => prev.filter(s => s.id !== serviceId))
      showToast(`Deleted: ${title}`, 'success')
    } catch (error) {
      console.error('Error deleting service:', error)
      showToast('Failed to delete service', 'error')
    }
  }

  return (
    <section className="services-dashboard">
      <style>{`
        .services-dashboard {
          min-height: 100vh;
          padding: 4rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .back-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          display: inline-block;
        }
        .back-link:hover { color: #00d4ff; }

        .services-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .service-item {
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
        }

        .service-icon {
          font-size: 2.5rem;
        }

        .service-info h3 {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.85rem;
          color: white;
          margin-bottom: 0.5rem;
        }

        .service-info p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .service-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .status-badge {
          padding: 0.3rem 0.8rem;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
        }

        .status-badge.active {
          background: rgba(57, 255, 20, 0.15);
          border: 1px solid rgba(57, 255, 20, 0.4);
          color: #39ff14;
        }

        .status-badge.inactive {
          background: rgba(255, 107, 53, 0.15);
          border: 1px solid rgba(255, 107, 53, 0.4);
          color: #ff6b35;
        }

        .service-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .action-btn.delete:hover {
          border-color: #ff6b35;
          color: #ff6b35;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .loading-state {
          text-align: center;
          padding: 4rem;
          color: #00d4ff;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .service-item {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .service-actions {
            justify-content: center;
          }
        }
      `}</style>

      <Link to="/admin" className="back-link">← Back to Dashboard</Link>

      <div className="dashboard-header">
        <SectionTitle title="SERVICES" extension=".admin" />
        <PixelButton 
          variant="filled" 
          color="matrix" 
          icon="➕"
          onClick={() => navigate('/admin/services/new')}
        >
          ADD SERVICE
        </PixelButton>
      </div>

      {loading ? (
        <div className="loading-state">LOADING SERVICES...</div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <p>No services found. Add your first service!</p>
        </div>
      ) : (
        <div className="services-list">
          {services.map(service => (
            <GlassCard key={service.id} className="service-item">
              <span className="service-icon">{service.icon}</span>
              <div className="service-info">
                <h3 style={{ color: service.color }}>{service.title}</h3>
                <p>{service.description?.substring(0, 100)}...</p>
              </div>
              <div className="service-status">
                <span className={`status-badge ${service.active ? 'active' : 'inactive'}`}>
                  {service.active ? 'ACTIVE' : 'HIDDEN'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                  ${service.starterPrice}+
                </span>
              </div>
              <div className="service-actions">
                <button 
                  className="action-btn"
                  onClick={() => navigate(`/admin/services/${service.id}`)}
                >
                  EDIT
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDelete(service.id, service.title)}
                >
                  DELETE
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  )
}
