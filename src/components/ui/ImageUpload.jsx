import React, { useState, useRef } from 'react'
import { uploadImage } from '../../services/uploadService'

/**
 * ImageUpload - Drag & Drop Image Upload Component
 * 
 * Supports drag & drop, click to select, and displays upload progress.
 */
export default function ImageUpload({ 
  value, 
  onChange, 
  placeholder = 'Drag & drop an image or click to select',
  className = '' 
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      await handleUpload(file)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleUpload(file)
    }
  }

  const handleUpload = async (file) => {
    setError(null)
    setIsUploading(true)

    try {
      const result = await uploadImage(file)
      if (result.success && result.url) {
        onChange(result.url)
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onChange('')
    setError(null)
  }

  return (
    <>
      <style>{`
        .image-upload {
          position: relative;
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(0, 0, 0, 0.2);
          min-height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .image-upload:hover {
          border-color: #00d4ff;
          background: rgba(0, 212, 255, 0.05);
        }

        .image-upload.dragging {
          border-color: #39ff14;
          background: rgba(57, 255, 20, 0.1);
          transform: scale(1.01);
        }

        .image-upload.has-image {
          padding: 0.5rem;
        }

        .image-upload-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          opacity: 0.6;
        }

        .image-upload-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .image-upload-preview {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 6px;
        }

        .image-upload-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .image-upload-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(0, 212, 255, 0.2);
          border-top-color: #00d4ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .image-upload-error {
          color: #ff6b6b;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        .image-upload-remove {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(255, 0, 0, 0.8);
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .image-upload-remove:hover {
          transform: scale(1.1);
        }
      `}</style>

      <div
        className={`image-upload ${isDragging ? 'dragging' : ''} ${value ? 'has-image' : ''} ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {isUploading ? (
          <div className="image-upload-loading">
            <div className="image-upload-spinner" />
            <span className="image-upload-text">Uploading...</span>
          </div>
        ) : value ? (
          <>
            <img src={value} alt="Preview" className="image-upload-preview" />
            <button className="image-upload-remove" onClick={handleRemove}>×</button>
          </>
        ) : (
          <>
            <div className="image-upload-icon">📷</div>
            <span className="image-upload-text">{placeholder}</span>
          </>
        )}

        {error && <div className="image-upload-error">{error}</div>}
      </div>
    </>
  )
}
