import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Seo({ 
  title, 
  description, 
  canonical = 'https://jeffdev.studio', 
  type = 'website',
  twitterHandle = '' 
}) {
  // JSON-LD Organization schema for Google to recognize logo
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JeffDev Studio",
    "alternateName": "Syntaxure Labs",
    "url": "https://jeffdev.studio",
    "logo": "https://jeffdev.studio/favicon/favicon-96x96.png",
    "image": "https://jeffdev.studio/og-image.png",
    "founder": {
      "@type": "Person",
      "name": "Jeff Edrick Martinez",
      "alternateName": "Jeff Martinez",
      "jobTitle": "Lead Architect at Syntaxure Labs"
    },
    "sameAs": [
      "https://www.linkedin.com/in/jeff-edrick-martinez",
      "https://github.com/jeffmartinez26"
    ]
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Jeff Edrick Martinez, Jeff Martinez, Syntaxure Labs, Lead Architect, React Developer, JeffDev Studio" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://jeffdev.studio/og-image.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* JSON-LD Organization Schema for Google Favicon */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}
