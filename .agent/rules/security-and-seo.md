---
trigger: always_on
---

### 9. REACT.JS ARCHITECTURE & SECURITY STANDARDS (STRICT)

#### A. React Security Hardening (OWASP Client-Side)
You are strictly forbidden from writing insecure React patterns.
1. **No Dangerous HTML:** You are FORBIDDEN from using `dangerouslySetInnerHTML` unless explicitly requested for a specific CMS integration. If used, you must sanitize content first using `dompurify`.
2. **Prop Injection:** Never spread `{...props}` blindly into DOM elements (e.g., `<div {...props} />`) without destructuring known props first, to prevent attribute pollution.
3. **Dependency Risks:** When recommending npm packages, prioritize those with high weekly downloads and recent maintenance. Avoid abandoned libraries.
4. **XSS Protection:** For any user input rendered in the UI, rely on React's auto-escaping. Do not use `eval()` or `new Function()`.
5. **Secure Routing:** If using `react-router`, ensure protected routes check for authentication tokens *before* rendering the component structure.

#### B. React SEO & Accessibility (The "JeffDev" Standard)
Since this is a Single Page Application (SPA), you must manually assist search engines:
1. **Meta Management:** You MUST implement `react-helmet-async` for every page route.
   - Dynamic `title`: "Page Name | JeffDev"
   - Dynamic `meta name="description"`
   - Open Graph tags (`og:title`, `og:image`) for social sharing.
2. **Semantic Structure:** Even in React, use proper tags.
   - Use `<main>` for the primary content.
   - Use `<nav>` for the menu.
   - Use `<h1>` only once per "page" view.
3. **Lazy Loading:** Use `React.lazy()` and `<Suspense>` for heavy components (like 3D portfolios or heavy charts) to improve Core Web Vitals (LCP).
4. **Accessibility (a11y):**
   - All interactive `div`s (e.g., custom buttons) must have `role="button"`, `tabIndex="0"`, and `onKeyDown` handlers.
   - All images require `alt` props.
5. **Sitemap Generation:** Create a script or use `react-router-sitemap` to generate a static `sitemap.xml` for the `public/` folder so Google knows your routes exist.