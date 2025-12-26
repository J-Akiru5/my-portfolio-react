/**
 * Meta Tag Sanitization Utilities
 * 
 * Prevents XSS and injection attacks through meta tags.
 * Always use these functions when setting dynamic meta content.
 */

/**
 * Sanitize text for safe use in meta tags and HTML attributes.
 * Removes/escapes characters that could break out of attribute values.
 * 
 * @param {string} text - Raw text to sanitize
 * @param {number} maxLength - Maximum length (default 160 for descriptions)
 * @returns {string} Sanitized text safe for meta tags
 */
export function sanitizeMetaContent(text, maxLength = 160) {
  if (!text || typeof text !== 'string') return ''
  
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-like patterns
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Remove newlines and excessive whitespace
    .replace(/\s+/g, ' ')
    .trim()
    // Truncate to max length
    .slice(0, maxLength)
}

/**
 * Sanitize URL for safe use in meta tags (og:url, og:image, etc.)
 * 
 * @param {string} url - Raw URL to sanitize
 * @returns {string} Sanitized URL or empty string if invalid
 */
export function sanitizeMetaUrl(url) {
  if (!url || typeof url !== 'string') return ''
  
  try {
    const parsed = new URL(url)
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return ''
    }
    return parsed.href
  } catch {
    // If not a valid absolute URL, check if it's a relative path
    if (url.startsWith('/') && !url.startsWith('//')) {
      // Relative paths are OK for site-relative URLs
      return url.replace(/[<>"']/g, '')
    }
    return ''
  }
}

/**
 * Sanitize title for document.title and og:title
 * 
 * @param {string} title - Raw title
 * @param {string} suffix - Site name suffix (e.g., " | JEFF.DEV")
 * @returns {string} Sanitized title
 */
export function sanitizeMetaTitle(title, suffix = '') {
  const sanitized = sanitizeMetaContent(title, 70)
  return sanitized ? `${sanitized}${suffix}` : suffix.replace(/^\s*\|\s*/, '')
}
