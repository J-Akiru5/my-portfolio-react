import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { SectionTitle, GlassCard } from '../components/ui'
import { Helmet } from 'react-helmet-async'

/**
 * Blog - Public blog listing page
 * 
 * Displays all published posts with tag filtering.
 */
export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState(null)
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsRef = collection(db, 'posts')
        const q = query(
          postsRef, 
          where('isPublished', '==', true),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        
        const postsData = []
        const tagsSet = new Set()
        
        snapshot.forEach(doc => {
          const data = { id: doc.id, ...doc.data() }
          postsData.push(data)
          data.tags?.forEach(tag => tagsSet.add(tag))
        })
        
        setPosts(postsData)
        setAllTags(Array.from(tagsSet))
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [])

  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts

  return (
    <div className="blog-page">
      <Helmet>
        <title>Blog | Jeff Martinez - Developer Logs</title>
        <meta name="description" content="Developer tutorials, insights, and project breakdowns by Jeff Martinez." />
      </Helmet>
      
      <style>{`
        .blog-page {
          min-height: 100vh;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .blog-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .blog-subtitle {
          font-family: 'JetBrains Mono', monospace;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        
        .tags-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .tag-btn {
          padding: 0.4rem 0.8rem;
          border: 1px solid rgba(0, 212, 255, 0.3);
          background: transparent;
          color: #00d4ff;
          border-radius: 20px;
          font-size: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .tag-btn:hover, .tag-btn.active {
          background: rgba(0, 212, 255, 0.2);
          border-color: #00d4ff;
        }
        
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .post-card {
          padding: 0 !important;
          overflow: hidden;
          transition: transform 0.3s;
        }
        
        .post-card:hover {
          transform: translateY(-5px);
        }
        
        .post-cover {
          width: 100%;
          height: 180px;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(157, 78, 221, 0.1));
          object-fit: cover;
        }
        
        .post-content {
          padding: 1.5rem;
        }
        
        .post-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.85rem;
          color: white;
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }
        
        .post-excerpt {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        
        .post-tag {
          font-size: 0.65rem;
          padding: 0.2rem 0.5rem;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 4px;
          color: #39ff14;
        }
        
        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .post-date {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'JetBrains Mono', monospace;
        }
        
        .premium-badge {
          font-size: 0.6rem;
          padding: 0.2rem 0.5rem;
          background: linear-gradient(135deg, #ff6b35, #ff9500);
          border-radius: 4px;
          color: white;
          font-weight: bold;
        }
        
        .read-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        @media (max-width: 768px) {
          .posts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="blog-header">
        <SectionTitle title="DEV_LOGS" extension=".blog" />
        <p className="blog-subtitle">Tutorials, insights, and project breakdowns</p>
      </div>
      
      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="tags-filter">
          <button 
            className={`tag-btn ${!selectedTag ? 'active' : ''}`}
            onClick={() => setSelectedTag(null)}
          >
            ALL
          </button>
          {allTags.map(tag => (
            <button 
              key={tag}
              className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="empty-state">Loading posts...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="read-link">
              <GlassCard className="post-card" hoverEffect={false}>
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="post-cover" />
                ) : (
                  <div className="post-cover" />
                )}
                <div className="post-content">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-excerpt">{post.excerpt}</p>
                  
                  {post.tags?.length > 0 && (
                    <div className="post-tags">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="post-tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="post-meta">
                    <span className="post-date">
                      {post.createdAt?.toDate?.().toLocaleDateString() || 'Draft'}
                    </span>
                    {post.isPremium && <span className="premium-badge">PREMIUM</span>}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
