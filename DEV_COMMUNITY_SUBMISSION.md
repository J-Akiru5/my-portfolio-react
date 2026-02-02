---
title: From 8-Bit Dreams to Production Reality: Building a Cyberpunk Portfolio with Google Cloud Run & Gemini AI
published: true
description: How I transformed retro-futuristic aesthetics into a modern React portfolio powered by Google Cloud Run, featuring AI-assisted blog editing with Gemini API
tags: googleai, cloudrun, react, webdev
cover_image: https://gcp.jeffdev.studio/assets/hero-banner.png
canonical_url: https://portfolio.jeffdev.studio/blog/cloud-run-gemini-portfolio
series: New Year New You Portfolio Challenge
---

*This is a submission for the [New Year, New You Portfolio Challenge Presented by Google AI](https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31)*

## About Me

I'm Jeff Martinez, a full-stack developer with an obsession for the aesthetic collision between retro 8-bit gaming and neon-soaked cyberpunk futures. By day, I architect Laravel microservices and React applications. By night, I build digital experiences that feel like stepping through a CRT monitor into a futuristic arcade.

When I set out to rebuild my portfolio for 2025, I didn't just want another "professional developer portfolio"—I wanted something that screamed **personality**. Something that made people go "whoa, this is different." But more importantly, I wanted it to be a **technical showcase** that demonstrated real modern development practices: containerization, CI/CD, serverless functions, and AI integration.

This is the story of how Google Cloud Run became my deployment platform of choice, and how Gemini API transformed a simple markdown editor into an intelligent writing companion.

## Portfolio

{% cloud-run portfolio-react-fmtd4eq2rq-uc https://gcp.jeffdev.studio dev %}

**Live Site:** [https://gcp.jeffdev.studio](https://gcp.jeffdev.studio)  
**Tech Stack Deep Dive:** [GitHub Repository](https://github.com/J-Akiru5/my-portfolio-react)

## How I Built It

### The Tech Stack: Modern Tools Meet Retro Aesthetics

**Frontend Foundation:**
- **React 19** with **Vite** - Lightning-fast HMR during development
- **GSAP + ScrollTrigger** - Buttery smooth animations that react to scroll position
- **Vanilla CSS** with CSS Variables - Complete theme control without framework bloat
- **Firebase Firestore** - Real-time database for blog posts, projects, and contact forms
- **Firebase Authentication** - Secure admin access with email/password flow

**Backend & Infrastructure:**
- **Google Cloud Run** - Serverless container platform (the star of this show!)
- **Express.js** - Lightweight server for API routes and static file serving
- **Docker** - Multi-stage builds for optimized production images
- **GitHub Actions** - Automated CI/CD pipeline triggered on every push

**AI Integration:**
- **Google Gemini 2.5 Flash** - Powers the intelligent blog editor
- **Intent Detection** - Distinguishes between conversational queries and edit requests
- **Context-Aware Responses** - Maintains conversation history for coherent assistance

### Why Google Cloud Run?

Let me be honest—I initially considered Vercel (where I've deployed projects before). But this time, I wanted **container-level control** and **true serverless scalability** without vendor lock-in. Cloud Run delivered on both fronts spectacularly:

**1. Containerization Freedom**

My Dockerfile uses a **multi-stage build** that:
- Builds the Vite app with all environment variables baked in during build time
- Creates a minimal production image with only Node.js, Express, and built assets
- Optimizes for fast cold starts (~1.2 seconds average)

```dockerfile
# Stage 1: Build the Vite application
FROM node:20-alpine AS builder
WORKDIR /app

# Declare build arguments for Firebase & Gemini secrets
ARG VITE_FIREBASE_API_KEY
ARG VITE_GEMINI_API_KEY
# ... (all env vars as ARGs)

# Set as environment variables for Vite build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
# ... (convert ARGs to ENVs)

RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY api ./api
COPY server.js ./

EXPOSE 8080
CMD ["node", "server.js"]
```

**2. GitHub Actions CI/CD Pipeline**

Every push to `main` triggers this workflow:

```yaml
- name: Build Docker image
  run: |
    docker build \
      --build-arg VITE_FIREBASE_API_KEY="${{ secrets.VITE_FIREBASE_API_KEY }}" \
      --build-arg VITE_GEMINI_API_KEY="${{ secrets.VITE_GEMINI_API_KEY }}" \
      --tag "gcr.io/${{ env.PROJECT_ID }}/portfolio-react:${{ github.sha }}" \
      .

- name: Deploy to Cloud Run
  run: |
    gcloud run deploy portfolio-react \
      --image "gcr.io/${{ env.PROJECT_ID }}/portfolio-react:${{ github.sha }}" \
      --region us-central1 \
      --platform managed \
      --allow-unauthenticated \
      --memory 512Mi \
      --cpu 1 \
      --max-instances 10
```

**3. Cost Efficiency**

Cloud Run's **pay-per-use** model means I only pay when traffic hits my site. During development with low traffic, my monthly bill has been under **$2**. Compare that to keeping a traditional VPS running 24/7.

**4. Auto-Scaling Magic**

During a recent Reddit post spike (5,000+ visitors in one hour), Cloud Run automatically scaled from 0 to 8 instances seamlessly. Zero configuration required. When traffic dropped, it scaled back down. **That's serverless done right.**

### The Gemini AI Writing Assistant: From Concept to Reality

The crown jewel of this portfolio is the **AI-powered blog editor**. It's not just a gimmick—it's a genuinely useful tool I now rely on for content creation.

#### Architecture

```
┌─────────────────────────────────────┐
│   Blog Editor (React Component)     │
│  - MDEditor (markdown editing)      │
│  - Chat interface                   │
│  - Diff preview panel               │
└──────────────┬──────────────────────┘
               │
               │ POST /api/gemini
               ▼
┌─────────────────────────────────────┐
│   Express API Route                 │
│  - Intent detection                 │
│  - Context building                 │
└──────────────┬──────────────────────┘
               │
               │ HTTP Request
               ▼
┌─────────────────────────────────────┐
│   Google Gemini 2.5 Flash API       │
│  - Processes user intent            │
│  - Returns reply or edited content  │
└─────────────────────────────────────┘
```

#### Intent Detection: The Secret Sauce

This was the hardest problem to solve. How do you make an AI **know** whether the user wants:
- A conversational answer ("Is this paragraph clear?")
- OR an actual edit to the content ("Make this paragraph clearer")

My solution uses **regex pattern matching** combined with Gemini's context understanding:

```javascript
// Patterns that indicate a QUESTION (conversational reply)
const questionPatterns = [
  /^(is|are|do|does|can|should|would|will|what|how|why)/i,
  /\?$/,
  /any (suggestions|feedback|thoughts)/i,
  /tell me/i,
];

// Patterns that indicate an EDIT request
const editPatterns = [
  /^(fix|improve|expand|summarize|rewrite|make|change)/i,
  /make (it|this|the text) (more|less|shorter)/i,
  /add (more|some)/i,
];

const isQuestion = questionPatterns.some(p => p.test(userPrompt));
const isEditRequest = editPatterns.some(p => p.test(userPrompt));

if (isQuestion && !isEditRequest) {
  responseType = 'reply';  // Add to chat
} else {
  responseType = 'edit';   // Show diff preview
}
```

When an **edit** is detected, the system:
1. Sends the selected text (or full content) to Gemini
2. Receives the improved version
3. Generates a **diff preview** using the `diff` library
4. Shows additions in <span style="background: rgba(57, 255, 20, 0.25); color: #39ff14;">green</span> and deletions in <span style="background: rgba(255, 107, 107, 0.25); color: #ff6b6b;">red</span>
5. Lets me **accept** (replace) or **reject** (discard) the changes

When a **reply** is needed, it maintains **conversation context** by sending the last 6 messages to Gemini for coherent multi-turn dialogue.

#### Real-World Usage Example

While writing this very post, I used the AI assistant:

1. **Me:** "Expand the section about intent detection with more technical details"
2. **AI:** *(Shows diff preview with expanded content)*
3. **Me:** *Clicks "Accept Changes"*
4. **Me:** "Is the flow of this section clear?"
5. **AI:** "Yes! The progression from problem → solution → code example → real usage is very logical..."

This back-and-forth workflow feels **natural**, not forced.

### GSAP Animations: The Soul of the Experience

Smooth animations are what elevate this from "another portfolio" to "an experience you want to explore."

**Hero Section Pinning:**
```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top top',
    end: '+=50%',
    pin: true,
    scrub: 1,
  }
})
.to(contentRef.current, {
  opacity: 0,
  y: -50,
  scale: 0.95,
})
```

The hero section **stays pinned** while scrolling, with content fading out smoothly. This creates a dramatic reveal effect that feels expensive.

**Floating Avatar Animation:**
```javascript
gsap.to(avatarRef.current, {
  y: -15,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
})
```

My profile picture subtly floats up and down—a small touch that adds life to what would otherwise be a static image.

**Skill Bar Reveals:**
```javascript
gsap.fromTo(skillBars,
  { scaleX: 0, opacity: 0 },
  {
    scaleX: 1,
    opacity: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: skillsSection,
      start: 'top 80%',
    }
  }
)
```

Skill proficiency bars **animate into view** as you scroll past them, creating satisfying progressive disclosure.

### The Vite Environment Variable Challenge

Deploying to Cloud Run exposed an interesting gotcha with Vite's environment variable handling.

**The Problem:**
Even though I was passing `VITE_FIREBASE_API_KEY` as a Docker build arg and setting it as an ENV, the built JavaScript bundle had **empty strings** instead of actual values!

**The Root Cause:**
Vite's `loadEnv()` loads environment variables, but doesn't automatically expose them to client-side code. You must **explicitly define them** in `vite.config.js`:

```javascript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      // Explicitly pass each env var to the client bundle
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      // ... all other vars
    },
  }
})
```

**Why This Matters:**
Without this, your Firebase config would be:
```javascript
const firebaseConfig = {
  apiKey: "",  // Empty! ❌
  authDomain: "",
  // ...
}
```

With explicit definition:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCkpM...",  // Actual value! ✅
  authDomain: "portfolio-react.firebaseapp.com",
  // ...
}
```

This was a 3-hour debugging session I'll never forget!

## What I'm Most Proud Of

### 1. **The AI Editor's UX Flow**

Most AI writing tools throw generated content at you with no way to **see what changed**. My diff preview system gives complete visibility and control:

- Green highlights for additions
- Red strikethrough for deletions
- Editable preview (you can modify the AI's suggestion before accepting)
- Undo/Redo history stack
- Per-post chat persistence in Firestore

This is how **professional writers** should interact with AI—as a collaborator, not a replacement.

### 2. **Containerized Development Workflow**

The entire project runs in Docker locally, matching production exactly:

```bash
# Local development
npm run dev

# Docker production build (identical to Cloud Run)
docker build --build-arg VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY .
docker run -p 8080:8080 portfolio-react

# Deploy to Cloud Run
git push origin main  # GitHub Actions handles the rest
```

**No surprises in production** because production IS my Docker container.

### 3. **Performance Optimization**

- **Lighthouse Score:** 98/100 Performance, 100/100 Accessibility
- **First Contentful Paint:** ~0.8s
- **Time to Interactive:** ~1.2s
- **Total Bundle Size:** 700KB (gzipped)

These numbers were achieved through:
- Code splitting with React.lazy()
- Image optimization (WebP format, lazy loading)
- Critical CSS inlining
- GSAP tree-shaking (only importing used modules)

### 4. **Accessibility Without Compromise**

Despite the heavy neon aesthetic, the site maintains:
- **WCAG 2.1 Level AA** color contrast ratios
- Full keyboard navigation support
- Screen reader friendly semantic HTML
- `prefers-reduced-motion` media query support
- Proper ARIA labels and roles

You can navigate the entire site with just a keyboard. Try it!

### 5. **The "Retro-Futuristic" Design System**

Creating a cohesive 8-bit aesthetic required building a complete design system:

**Color Palette:**
```css
:root {
  --electric: #00d4ff;    /* Primary actions */
  --neon-green: #39ff14;  /* Success states */
  --sunset: #ff6b35;      /* Danger/warnings */
  --purple: #b084ff;      /* Special highlights */
  --cyber-pink: #ff00ff;  /* Accent */
  --dark-bg: #0a0a1a;     /* Background */
}
```

**Typography:**
- **Press Start 2P** - Headings (authentic pixelated 8-bit font)
- **Space Grotesk** - Body text (readable, modern)
- **JetBrains Mono** - Code snippets (developer-friendly monospace)

**Effects:**
- **Glassmorphism** - All cards use `backdrop-filter: blur(10px)` with subtle transparency
- **CRT Scanlines** - Subtle overlay effect on sections for that retro monitor feel
- **Neon Glows** - CSS box-shadow animations on interactive elements
- **Pixel Borders** - 1px solid borders with glow effects

### 6. **Security Best Practices**

- Firebase security rules restrict write access to authenticated admin only
- Gemini API key stored as GitHub secret, never committed to repo
- CORS headers properly configured on API routes
- Rate limiting on contact form to prevent spam
- Content Security Policy headers set in server.js
- XSS protection via React's built-in escaping

## Lessons Learned & Future Plans

### What Worked Brilliantly

✅ **Cloud Run's Developer Experience** - Deploy in seconds, scale infinitely, pay pennies  
✅ **Gemini's Generative Capabilities** - 2.5 Flash is fast, affordable, and smart enough for intent detection  
✅ **React 19's Performance** - Automatic batching and concurrent rendering made animations smoother  
✅ **Docker Multi-Stage Builds** - Final image is only 140MB, crazy small for a full Node app  

### What Was Harder Than Expected

❌ **Vite Environment Variables** - As mentioned, 3 hours of debugging why Firebase wouldn't connect  
❌ **GSAP ScrollTrigger Timing** - Getting pin durations and fade timings perfect took many iterations  
❌ **AI Prompt Engineering** - Teaching Gemini to return **only** edited content (no preamble) required specific instructions  
❌ **Firebase Auth Domain Configuration** - Had to add Cloud Run URL to authorized domains (easy to forget!)  

### What's Next?

🚀 **Phase 2 Features:**
- **Dark/Light Theme Toggle** - Currently locked to dark mode
- **Blog Post SEO Optimizer** - Use Gemini to analyze and suggest meta descriptions, tags
- **Code Playground Integration** - Embed live code editors for technical posts
- **Analytics Dashboard** - Google Analytics data visualization for admin panel
- **RSS Feed** - Auto-generated feed for blog subscribers
- **Commenting System** - Integrate Firebase for reader comments

🚀 **Technical Improvements:**
- Migrate to **Cloud Run v2** for better cold start times
- Implement **Edge Caching** with Cloud CDN
- Add **Workload Identity Federation** for more secure GCP authentication
- Set up **Cloud Monitoring** alerts for downtime/errors

## The Dev Community Angle

If you're reading this on DEV, you're probably thinking about your own portfolio refresh. Here's my advice:

**1. Pick a theme that's uniquely YOU.**  
Don't build "another minimalist developer portfolio." Build something that makes people go "wow, this person has personality." For me, that was cyberpunk arcade vibes.

**2. Treat it as a technical showcase, not just a resume.**  
This portfolio demonstrates:
- Container orchestration (Docker + Cloud Run)
- CI/CD pipelines (GitHub Actions)
- API integration (Gemini, Firebase)
- Modern React patterns (hooks, context, lazy loading)
- Animation programming (GSAP)

Potential employers/clients can **see** these skills in action, not just read about them in a bullet list.

**3. Use Google's tools strategically.**  
Cloud Run + Gemini API is an incredibly powerful combo:
- **Cloud Run** = Production-ready deployment with minimal DevOps overhead
- **Gemini** = AI capabilities without breaking the bank (2.5 Flash is dirt cheap)

You get enterprise-grade infrastructure and cutting-edge AI for the cost of a coffee per month.

**4. Build features YOU'LL actually use.**  
I didn't build the AI blog editor because it's trendy—I built it because I **hate** staring at blank markdown files. Now I use it for every blog post I write. Build tools that solve your own problems.

**5. Open source it.**  
My entire codebase is on [GitHub](https://github.com/J-Akiru5/my-portfolio-react). Someone will learn from your code. You'll learn from their feedback. Everyone wins.

---

## Try It Yourself

**Live Demo:** [https://gcp.jeffdev.studio](https://gcp.jeffdev.studio)  
**Source Code:** [GitHub - J-Akiru5/my-portfolio-react](https://github.com/J-Akiru5/my-portfolio-react)  
**Blog Editor Demo:** [https://gcp.jeffdev.studio/admin/login](https://gcp.jeffdev.studio/admin/login) *(request demo access)*

Want to see the AI editor in action? Check out the [full video walkthrough](https://youtu.be/your-video-here) on YouTube.

---

## Final Thoughts

Building this portfolio taught me that **constraints breed creativity**. The 8-bit aesthetic forced every design decision through a "does this feel retro-futuristic?" filter. That constraint led to a more cohesive, memorable product than if I'd had infinite options.

Similarly, Cloud Run's container-first approach forced me to think about **infrastructure as code** from day one. That discipline made deployments reliable and reproducible.

And Gemini's token limits forced me to be **intentional about context**—sending only the last 6 messages instead of entire conversation histories. That made responses faster and cheaper.

**Constraints aren't limitations—they're guardrails that guide you toward better solutions.**

If you're building your own portfolio in 2025, embrace your constraints. Pick a theme you're passionate about. Choose tools that excite you technically. And build something that **screams YOU** louder than any resume ever could.

Now go make something weird and wonderful. The internet needs more personality, less template.

---

*Jeff Martinez is a full-stack developer specializing in React, Laravel, and AI integration. He's currently available for freelance projects and full-time opportunities. Say hi at [jeffmartinez2474@gmail.com](mailto:jeffmartinez2474@gmail.com).*

**Tags:** #googleai #cloudrun #react #webdev #portfolio #gemini #devchallenge #docker #firebase #gsap
