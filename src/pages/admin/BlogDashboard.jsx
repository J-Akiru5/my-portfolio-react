import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { SectionTitle, GlassCard, PixelButton } from '../../components/ui'

/**
 * BlogDashboard - Admin post management
 * 
 * List, edit, delete posts from admin panel.
 */
export default function BlogDashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setPosts(postsData)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(postId, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    
    try {
      await deleteDoc(doc(db, 'posts', postId))
      setPosts(posts.filter(p => p.id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  return (
    <div className="blog-dashboard">
      <style>{`
        .blog-dashboard {
          padding: 2rem;
          max-width: 1200px;
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
        
        .posts-table {
          width: 100%;
          overflow-x: auto;
        }
        
        .posts-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .posts-table th,
        .posts-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .posts-table th {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.65rem;
          color: #00d4ff;
          text-transform: uppercase;
        }
        
        .posts-table td {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .post-title-cell {
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        
        .status-published {
          background: rgba(57, 255, 20, 0.2);
          color: #39ff14;
        }
        
        .status-draft {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
        }
        
        .status-premium {
          background: rgba(255, 107, 53, 0.2);
          color: #ff6b35;
          margin-left: 0.5rem;
        }
        
        .action-btns {
          display: flex;
          gap: 0.5rem;
        }
        
        .action-btn {
          padding: 0.4rem 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: white;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
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
        
        .stats-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          flex: 1;
          padding: 1rem 1.5rem !important;
          text-align: center;
        }
        
        .stat-number {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.5rem;
          color: #00d4ff;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.5rem;
        }
      `}</style>

      <div className="dashboard-header">
        <SectionTitle title="BLOG_MANAGER" extension=".cms" />
        <Link to="/admin/blog/new">
          <PixelButton variant="filled" color="matrix">
            + NEW POST
          </PixelButton>
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <GlassCard className="stat-card">
          <div className="stat-number">{posts.length}</div>
          <div className="stat-label">Total Posts</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-number">
            {posts.filter(p => p.isPublished).length}
          </div>
          <div className="stat-label">Published</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-number">
            {posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0)}
          </div>
          <div className="stat-label">Total Views</div>
        </GlassCard>
      </div>

      {/* Posts Table */}
      <GlassCard>
        {loading ? (
          <div className="empty-state">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Start writing!</p>
          </div>
        ) : (
          <div className="posts-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td className="post-title-cell">{post.title}</td>
                    <td>
                      <span className={`status-badge ${post.isPublished ? 'status-published' : 'status-draft'}`}>
                        {post.isPublished ? 'LIVE' : 'DRAFT'}
                      </span>
                      {post.isPremium && (
                        <span className="status-badge status-premium">PRO</span>
                      )}
                    </td>
                    <td>{post.viewsCount || 0}</td>
                    <td>
                      {post.createdAt?.toDate?.().toLocaleDateString() || '-'}
                    </td>
                    <td>
                      <div className="action-btns">
                        <Link to={`/admin/blog/edit/${post.id}`} className="action-btn">
                          Edit
                        </Link>
                        <a 
                          href={`/blog/${post.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="action-btn"
                        >
                          View
                        </a>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDelete(post.id, post.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
