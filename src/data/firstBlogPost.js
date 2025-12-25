/**
 * Blog Post Seed Data
 * 
 * First blog post: How I Built My Portfolio with Claude Opus 4.5 on Antigravity
 * 
 * To seed: Import this in AdminSeed.jsx or run via console
 */

export const firstBlogPost = {
  slug: 'building-portfolio-with-claude-opus-antigravity',
  title: 'How I Built My 8-Bit Portfolio with Claude Opus 4.5 on Antigravity',
  excerpt: 'A deep dive into my AI-powered development workflow using Claude Opus 4.5 as my pair programmer, from Figma design to deployed React app.',
  coverImage: '/assets/blog-hero.png',
  content: `
# How I Built My 8-Bit Portfolio with Claude Opus 4.5 on Antigravity

Building a portfolio that stands out is no easy feat. But what if I told you I had an AI pair programmer working alongside me 24/7? Let me take you through my journey of creating this retro-futuristic portfolio using **Claude Opus 4.5** on Google's **Antigravity** platform.

## The Vision: Nostalgic Meets Modern

I wanted something that would make developers stop scrolling. The answer? A blend of:
- **8-bit pixel aesthetics** that trigger nostalgia
- **Modern glassmorphism** for that premium feel
- **GSAP-powered animations** for smooth interactions
- **AI-assisted development** for rapid iteration

## The Design System: From Figma to Code

Before writing a single line of code, I created a comprehensive design brief for Figma. Here's the prompt I used:

---

## 🎨 Design Brief: "8-Bit Universe × Modern Tech"

### Visual Identity

#### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| \`--pixel-void\` | \`#0a0a12\` | Primary background (deep space) |
| \`--pixel-nebula\` | \`#1a1a2e\` | Secondary backgrounds |
| \`--pixel-electric\` | \`#00d4ff\` | Primary accent (CTAs, links) |
| \`--pixel-matrix\` | \`#39ff14\` | Success states, skill bars |
| \`--pixel-sunset\` | \`#ff6b35\` | Warm accent, hover states |
| \`--pixel-purple\` | \`#9d4edd\` | Gradient mixing, badges |

#### Typography Rules

- **Headers/CTAs:** Pixelated font (Press Start 2P)
- **Body Text:** Modern sans-serif (Inter, Outfit)
- **Code/Tech:** Monospace (JetBrains Mono)

#### Visual Effects

- **Glassmorphism:** Cards with \`backdrop-filter: blur(12px)\`
- **Scanlines:** Subtle CRT overlay on hero
- **Pixel grid:** Faint 8×8 pattern on backgrounds
- **Glitch effects:** Micro-glitch on hover
- **Floating particles:** Subtle stars drifting

---

## The Development Stack

### Frontend
- **React 19** with Vite for blazing fast HMR
- **GSAP ScrollTrigger** for scroll-driven animations
- **Lenis** for smooth scrolling
- **CSS Variables** for theming

### Backend
- **Firebase** for authentication and Firestore
- **Vercel Serverless Functions** for APIs
- **Cloudflare R2** for image storage

### The AI Advantage
- **Claude Opus 4.5** on Antigravity as my pair programmer
- Real-time code suggestions and debugging
- Architecture decisions and best practices
- Instant refactoring and optimization

## Key Features Built with AI

### 1. The Hybrid Story Animation

One of the trickiest parts was the "Story" section with its clip-reveal and filmstrip animation. Claude helped me:

\`\`\`javascript
// GSAP Timeline for hybrid animation
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    pin: true,
    scrub: 1,
    end: '+=500%',
  }
});

// Clip-path reveal for "awakening" panel
tl.fromTo('#panel-awakening',
  { clipPath: 'circle(0% at 50% 50%)' },
  { clipPath: 'circle(150% at 50% 50%)', duration: 1.5 }
);

// Filmstrip slides up to cover
tl.to('#filmstrip-container', { yPercent: 0, duration: 1 });
\`\`\`

### 2. The Blog CMS

Built a complete content management system with:
- **Tiptap Editor** for rich text with code blocks
- **Secret Admin Gateway** for security
- **SEO meta tags** via react-helmet-async
- **Monetization hooks** (Buy Me a Coffee ready!)

### 3. Google Analytics Integration

Real-time analytics dashboard powered by GA4 API:

\`\`\`javascript
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY,
  },
});
\`\`\`

## Lessons Learned

1. **AI accelerates, doesn't replace** - Claude helped me move 10x faster, but I still made all architectural decisions
2. **Design systems pay dividends** - The Figma-first approach saved countless hours
3. **Mobile-first is non-negotiable** - 70% of portfolio traffic comes from mobile
4. **Animations must be purposeful** - Every GSAP animation serves a storytelling function

## What's Next?

- Premium content section with Stripe integration
- AI-generated project thumbnails
- Interactive code playgrounds
- Multi-language support

---

## Try It Yourself

Want to replicate this workflow? Here's the stack:

1. **Design:** Figma with the 8-bit design system
2. **Development:** Vite + React + GSAP
3. **AI Partner:** Claude Opus 4.5 on Antigravity
4. **Deployment:** Vercel + Firebase + Cloudflare R2

The future of development is collaborative—human creativity amplified by AI precision.

---

*If you found this helpful, consider [buying me a coffee](https://buymeacoffee.com/j_akiru)! ☕*
  `,
  tags: ['AI Development', 'Portfolio', 'React', 'GSAP', 'Claude', 'Figma', 'Web Design'],
  isPublished: true,
  isPremium: false,
  readTime: '8 min read',
  viewsCount: 0,
  affiliateUrl: '',
  affiliateText: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: {
    name: 'Jeff Edrick Martinez',
    avatar: '/assets/avatar.png',
    bio: 'AI-Powered Developer | Vibecoder | Creative Director'
  }
};

export default firstBlogPost;
