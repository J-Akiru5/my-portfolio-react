import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../firebase'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SupportMe from '../components/blog/SupportMe'

/**
 * BlogPost - Individual blog article page
 * 
 * Renders full article content with SEO and monetization components.
 */
export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        const postsRef = collection(db, 'posts')
        const q = query(postsRef, where('slug', '==', slug))
        const snapshot = await getDocs(q)
        
        if (snapshot.empty) {
          setError('Post not found')
          return
        }
        
        const postDoc = snapshot.docs[0]
        const postData = { id: postDoc.id, ...postDoc.data() }
        setPost(postData)
        
        // Increment view count
        try {
          await updateDoc(doc(db, 'posts', postDoc.id), {
            viewsCount: increment(1)
          })
        } catch {
          console.log('Could not update view count')
        }
      } catch (err) {
        console.error('Error fetching post:', err)
        setError('Error loading post')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="blog-post-loading">
        <style>{`
          .blog-post-loading {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.5);
          }
        `}</style>
        Loading...
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="blog-post-error">
        <style>{`
          .blog-post-error {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.7);
          }
          .blog-post-error a {
            color: #00d4ff;
            margin-top: 1rem;
          }
        `}</style>
        <p>{error || 'Post not found'}</p>
        <Link to="/blog">← Back to Blog</Link>
      </div>
    )
  }

  return (
    <article className="blog-post">
      <Helmet>
        <title>{post.title} | Jeff Martinez</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
      </Helmet>
      
      <style>{`
        .blog-post {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
        }
        
        .post-header {
          margin-bottom: 2rem;
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 0.85rem;
          margin-bottom: 2rem;
          transition: color 0.2s;
        }
        
        .back-link:hover {
          color: #00d4ff;
        }
        
        .post-cover-image {
          width: 100%;
          height: 350px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 2rem;
        }
        
        .post-title {
          font-family: 'Press Start 2P', cursive;
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          color: white;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .post-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .post-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .post-views {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }
        
        .premium-badge {
          padding: 0.3rem 0.8rem;
          background: linear-gradient(135deg, #ff6b35, #ff9500);
          border-radius: 4px;
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
        }
        
        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        
        .post-tag {
          padding: 0.3rem 0.6rem;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 4px;
          color: #00d4ff;
          font-size: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .post-content {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.9;
          background: rgba(10, 10, 18, 0.95);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .post-content h1,
        .post-content h2,
        .post-content h3 {
          color: #00d4ff;
          margin: 2rem 0 1rem;
          font-family: 'Press Start 2P', cursive;
        }
        
        .post-content h2 { font-size: 1.2rem; }
        .post-content h3 { font-size: 1rem; }
        
        .post-content p { margin-bottom: 1.5rem; }
        
        .post-content a {
          color: #39ff14;
          text-decoration: underline;
        }
        
        .post-content pre {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .post-content code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          background: rgba(0, 212, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }
        
        .post-content pre code {
          background: none;
          padding: 0;
        }
        
        .post-content img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .post-content ul, .post-content ol {
          margin: 1rem 0 1.5rem 1.5rem;
        }
        
        .post-content li {
          margin-bottom: 0.5rem;
        }
        
        .post-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .post-content th,
        .post-content td {
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.75rem 1rem;
          text-align: left;
        }
        
        .post-content th {
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
          font-weight: bold;
        }
        
        .post-content blockquote {
          border-left: 4px solid #9d4edd;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }
        
        .post-content hr {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          margin: 2rem 0;
        }
        
        .affiliate-banner {
          background: linear-gradient(135deg, rgba(157, 78, 221, 0.2), rgba(0, 212, 255, 0.2));
          border: 1px solid rgba(157, 78, 221, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
          text-align: center;
        }
        
        .affiliate-banner a {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: #9d4edd;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          transition: transform 0.2s;
        }
        
        .affiliate-banner a:hover {
          transform: scale(1.05);
        }
      `}</style>

      <header className="post-header">
        <Link to="/blog" className="back-link">← Back to Blog</Link>
        
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="post-cover-image" />
        )}
        
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-meta-row">
          <span className="post-date">
            {post.createdAt?.toDate?.().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) || 'Draft'}
          </span>
          <span className="post-views">{post.viewsCount || 0} views</span>
          {post.isPremium && <span className="premium-badge">PREMIUM</span>}
        </div>
        
        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="post-tag">#{tag}</span>
            ))}
          </div>
        )}
      </header>

      {/* Article Content */}
      <div className="post-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Affiliate Banner (if has affiliate URL) */}
      {post.affiliateUrl && (
        <div className="affiliate-banner">
          <p>🚀 Check out the tool I used in this tutorial!</p>
          <a href={post.affiliateUrl} target="_blank" rel="noopener noreferrer">
            Learn More →
          </a>
        </div>
      )}

      {/* Support CTA */}
      <SupportMe />
    </article>
  )
}
