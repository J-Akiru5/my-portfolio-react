// src/components/CertCard.jsx
import React, { useState } from 'react';
import { getCertificateImagePath } from '../data/certificateData';

/**
 * Certificate Card Component with Lightbox
 * 
 * Displays a certificate thumbnail that opens a full-view modal on click.
 */
const CertCard = ({ title, provider, filename, category }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imagePath = getCertificateImagePath(filename);

  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);

  // Handle keyboard events for accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox();
    }
  };

  // Handle lightbox keyboard events
  const handleLightboxKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  };

  return (
    <>
      {/* Certificate Card */}
      <div
        className="cert-card"
        onClick={openLightbox}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View certificate: ${title}`}
      >
        <div className="cert-card-image-wrapper">
          <img
            src={imagePath}
            alt={`${title} certificate`}
            className="cert-card-image"
            loading="lazy"
          />
          <div className="cert-card-overlay">
            <span className="cert-card-view-icon">🔍</span>
            <span className="cert-card-view-text">Click to view</span>
          </div>
        </div>
        <div className="cert-card-content">
          <h3 className="cert-card-title">{title}</h3>
          <p className="cert-card-provider">{provider}</p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="cert-lightbox"
          onClick={closeLightbox}
          onKeyDown={handleLightboxKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} certificate full view`}
        >
          <div className="cert-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="cert-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ✕
            </button>
            <img
              src={imagePath}
              alt={`${title} certificate - full view`}
              className="cert-lightbox-image"
            />
            <div className="cert-lightbox-info">
              <h2 className="cert-lightbox-title">{title}</h2>
              <p className="cert-lightbox-provider">Issued by: {provider}</p>
              <span className="cert-lightbox-category">{category}</span>
              <a
                href={imagePath}
                download={filename}
                className="cert-lightbox-download"
                onClick={(e) => e.stopPropagation()}
              >
                ⬇️ Download Certificate
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertCard;