import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import ReactMarkdown from 'react-markdown'
import Seo from '../components/Seo'
import { PixelButton } from '../components/ui'

/**
 * ProjectDetail - Dedicated project detail page
 * 
 * Replaces the modal approach with a full-page experience.
 * Includes CTAs for user engagement.
 */

// Fallback data if Firestore fails
const FALLBACK_PROJECTS = {
  'sineai-hub': {
    id: 'sineai-hub',
    title: 'SineAI Hub',
    description: 'AI-powered learning management system with real-time chat, collaboration features, and intelligent tutoring.',
    image: '/assets/Screenshot 2025-12-16 094218.png',
    tags: ['Laravel', 'Supabase', 'Gemini', 'Tailwind'],
    liveUrl: 'https://sineai.tech',
    codeUrl: 'https://github.com/J-Akiru5/sineai-hub',
    status: 100,
    color: '#00d4ff',
    details: `## Overview\n\nSineAI Hub is an AI-powered learning management system designed to deliver personalized education at scale. It combines real-time collaboration with intelligent tutoring powered by Google's Gemini API.\n\n## Key Features\n\n- **AI Tutoring** — Gemini-powered chat assistant that adapts to each student's learning pace\n- **Real-time Collaboration** — Live chat, shared whiteboards, and group study rooms\n- **Course Management** — Instructors can create, publish, and track course progress\n- **Analytics Dashboard** — Detailed insights into student engagement and performance\n\n## Architecture\n\n- **Backend:** Laravel 11 with RESTful API endpoints\n- **Database:** Supabase (PostgreSQL) for real-time subscriptions and auth\n- **AI Layer:** Gemini API integration for contextual tutoring responses\n- **Frontend:** Blade templates with Tailwind CSS and Alpine.js for interactivity\n\n## Challenges Solved\n\n- Streaming AI responses in real-time while maintaining conversation context\n- Optimizing Supabase real-time subscriptions for concurrent users\n- Building a prompt engineering pipeline for subject-specific tutoring`
  },
  'portfolio': {
    id: 'portfolio',
    title: 'This Portfolio',
    description: '8-bit Universe themed portfolio with GSAP animations, glassmorphism, and Firebase integration.',
    image: '/assets/Screenshot 2025-12-25 113451.png',
    tags: ['React', 'GSAP', 'Firebase', 'Lenis'],
    liveUrl: '#',
    codeUrl: 'https://github.com/J-Akiru5/my-portfolio-react',
    status: 100,
    color: '#39ff14',
    details: `## Overview\n\nA retro-themed single-page portfolio built with React and GSAP, featuring a terminal-inspired UI with glassmorphism effects and buttery smooth scrolling.\n\n## Key Features\n\n- **GSAP Animations** — Scroll-triggered reveals, parallax layers, and staggered card entrances\n- **Glassmorphism UI** — Frosted-glass cards with backdrop blur and neon accents\n- **Lenis Smooth Scroll** — Custom easing for a premium browsing feel\n- **Firebase Backend** — Firestore for projects/services data, with hardcoded fallback\n- **Blog System** — TipTap rich-text editor with markdown support\n- **Admin Dashboard** — Full CMS for managing projects, services, blog posts, and messages\n\n## Architecture\n\n- **Framework:** React 19 with Vite\n- **Animations:** GSAP + ScrollTrigger for scroll-based effects\n- **Routing:** React Router v7\n- **Database:** Firebase Firestore (with hardcoded fallback arrays)\n- **Deployment:** Vercel with automatic CI/CD\n\n## Design Philosophy\n\nThe 8-bit universe theme blends retro pixel aesthetics with modern glassmorphism, creating a unique visual identity that stands out from typical developer portfolios.`
  },
  'cict-portal': {
    id: 'cict-portal',
    title: 'CICT Tech Portal',
    description: 'Technology portal for the College of ICT with student resources and department management.',
    image: '/assets/Screenshot 2025-12-25 122142.png',
    tags: ['Laravel', 'TypeScript', 'Tailwind'],
    liveUrl: '#',
    codeUrl: 'https://github.com/J-Akiru5/cict-tech-portal',
    status: 100,
    color: '#9d4edd',
    details: `## Overview\n\nA centralized technology portal for the College of Information and Communications Technology, providing students and faculty with streamlined access to resources, announcements, and department services.\n\n## Key Features\n\n- **Student Dashboard** — Personalized feed with announcements, schedules, and deadlines\n- **Resource Library** — Downloadable materials organized by course and semester\n- **Department Management** — Admin panel for faculty to manage courses, students, and events\n- **Authentication** — Role-based access for students, faculty, and administrators\n\n## Architecture\n\n- **Backend:** Laravel with Eloquent ORM and blade templating\n- **Frontend:** TypeScript for type-safe interactivity, Tailwind CSS for styling\n- **Database:** MySQL with migrations and seeders\n- **Auth:** Laravel Breeze with role-based middleware\n\n## Impact\n\nDigitized the CICT department's workflow, replacing manual announcement boards and paper-based resource distribution with a modern web portal.`
  },
  'gsus': {
    id: 'gsus',
    title: 'GSUS',
    description: 'General Services Unified System - comprehensive service management platform.',
    image: '/assets/image copy 2.png',
    tags: ['React', 'Vite', 'Vercel'],
    liveUrl: '#',
    codeUrl: 'https://github.com/J-Akiru5/GSUS-Hackathon-Project',
    status: 100,
    color: '#ff6b35',
    details: `## Overview\n\nGSUS (General Services Unified System) is a hackathon project that consolidates multiple municipal services into a single, accessible platform for citizens and government employees.\n\n## Key Features\n\n- **Unified Service Portal** — Single interface for permits, complaints, and public records\n- **Request Tracking** — Real-time status updates with notification system\n- **Dashboard Analytics** — Government admins see service metrics and bottlenecks\n- **Responsive Design** — Mobile-first approach for citizens on any device\n\n## Architecture\n\n- **Frontend:** React 18 with Vite for fast builds\n- **Deployment:** Vercel with edge functions\n- **State Management:** React Context + useReducer for predictable state flow\n\n## Hackathon Context\n\nBuilt in 48 hours for a local government innovation hackathon. Focused on demonstrating how technology can streamline citizen-to-government interactions in underserved municipalities.`
  },
  'ebhm-connect': {
    id: 'ebhm-connect',
    title: 'E-BHM Telehealth',
    description: 'Electronic Barangay Health Management System with AI-powered health chatbot Gabby, medicine inventory, and resident triage management.',
    image: '/assets/telehealth.png',
    tags: ['PHP', 'MySQL', 'AI', 'Bootstrap'],
    liveUrl: 'https://health.syntaxure.dev/',
    codeUrl: 'https://github.com/J-Akiru5/e-bhm_connect',
    status: 100,
    color: '#00d4ff',
    details: `## Overview\n\nE-BHM Telehealth is an enhanced electronic barangay health management system designed for rural health workers. It covers medicine inventory, dispensing, and resident triage management, with an AI-powered health chatbot named "Gabby" for preliminary health assessments.\n\n## Key Features\n\n- **AI Health Chatbot (Gabby)** — Conversational AI assistant for symptom checking and health guidance\n- **Medicine Inventory** — Track stock levels, expiration dates, and dispensing history\n- **Resident Triage** — Priority-based patient queue with vital signs recording\n- **Telehealth Consultations** — Remote health consultations for underserved communities\n- **Reporting Engine** — Automated health reports for barangay officials and the DOH\n\n## Architecture\n\n- **Backend:** PHP with modular MVC structure\n- **Database:** MySQL with normalized schema for patient data integrity\n- **AI Layer:** Gabby chatbot for conversational health assessments\n- **Frontend:** Bootstrap 5 for responsive, mobile-friendly interface\n- **Auth:** Session-based authentication with role separation (health worker, official, resident)\n\n## Community Impact\n\nDeployed in pilot barangays, reducing patient wait times by 40% and providing AI-assisted health guidance to communities with limited access to medical professionals.`
  },
  'lingsarloka': {
    id: 'lingsarloka',
    title: 'LingsarLoka',
    description: 'High-fidelity Figma prototype with modern UI/UX design principles.',
    image: '/assets/image.png',
    tags: ['Figma', 'UI/UX'],
    liveUrl: 'https://thick-break-42913670.figma.site/',
    codeUrl: 'https://github.com/J-Akiru5/LingsarLoka',
    status: 100,
    color: '#39ff14',
    details: `## Overview\n\nLingsarLoka is a high-fidelity Figma prototype for a cultural tourism platform showcasing the Lingsar temple complex in Lombok, Indonesia. It demonstrates modern UI/UX design principles applied to heritage tourism.\n\n## Key Features\n\n- **Interactive Map** — Clickable zones with zoom-in details for each temple area\n- **Cultural Timeline** — Scrollable history of the Lingsar complex with archival imagery\n- **Visit Planner** — itinerary builder with opening hours, ticket info, and nearby attractions\n- **Responsive Prototype** — Fully interactive Figma prototype with working navigation flows\n\n## Design Process\n\n- **Research:** User interviews with tourists and local guides\n- **Wireframing:** Low-fi sketches → mid-fi wireframes in Figma\n- **Visual Design:** Earth-tone palette with Balinese-inspired typography\n- **Prototyping:** Interactive flows with smart animations and component variants\n\n## Outcome\n\nPresented as a semester project, the prototype was praised for its accessibility-first approach and culturally respectful visual language.`
  },
  'prism-context-engine': {
    id: 'prism-context-engine',
    title: 'Prism Context Engine',
    description: 'AI-powered context engine for intelligent workflow management.',
    image: '/assets/prism-context.png',
    tags: ['React', 'Node.js', 'AI'],
    liveUrl: 'https://prism.syntaxure.dev/',
    codeUrl: '#',
    status: 100,
    color: '#8B7BFF',
    details: `## Overview\n\nPrism Context Engine is an AI-powered tool that captures, indexes, and retrieves contextual information across development workflows. It acts as a intelligent memory layer for developers, reducing context-switching overhead.\n\n## Key Features\n\n- **Context Capture** — Automatically indexes code, conversations, and documentation\n- **Semantic Search** — Natural language queries to find relevant context across your workspace\n- **Workflow Integration** — Works alongside existing dev tools without disruption\n- **Smart Suggestions** — Proactively surfaces relevant context based on current task\n\n## Architecture\n\n- **Frontend:** React with real-time updates and responsive dashboard\n- **Backend:** Node.js API with vector embedding pipeline\n- **AI Layer:** Semantic search powered by embedding models for contextual retrieval\n- **Deployment:** Hosted at prism.syntaxure.dev\n\n## Vision\n\nPrism aims to solve the "context amnesia" problem in software development — where developers spend 20-30% of their time re-discovering information they've already seen.`
  },
  'syntaxure-labs': {
    id: 'syntaxure-labs',
    title: 'Syntaxure Labs',
    description: 'Startup enterprise web-development studio. SaaS monorepo with 8 apps and 5 shared packages including marketing site, Prism SaaS, admin dashboards, MCP server, and VS Code extension.',
    image: '/assets/syntaxure-labs.png',
    tags: ['Next.js', 'Turborepo', 'Supabase', 'TypeScript'],
    liveUrl: 'https://www.syntaxure.dev/',
    codeUrl: '#',
    status: 100,
    color: '#ff2e6c',
    details: `## Overview\n\nSyntaxure Labs is a startup enterprise web-development studio incubated at KWADRA TBI (Cohort 5). The flagship product is a SaaS monorepo consisting of 8 apps and 5 shared packages, built for scalability and developer experience.\n\n## Monorepo Structure\n\n- **Marketing Site** — Public-facing website at syntaxure.dev\n- **Prism Context Engine** — AI coding-context manager SaaS\n- **Admin Dashboards** — Internal management tools for operations\n- **MCP Server** — Model Context Protocol server for AI integrations\n- **VS Code Extension** — IDE integration for the Prism ecosystem\n- **Shared Packages** — 5 reusable packages for auth, UI, utils, types, and config\n\n## Architecture\n\n- **Monorepo:** Turborepo for build orchestration and dependency management\n- **Framework:** Next.js 16 with App Router and Server Components\n- **Database:** Supabase (PostgreSQL) with real-time subscriptions\n- **Language:** TypeScript throughout for type safety\n- **Deployment:** Vercel with per-app deployment pipelines\n\n## Incubation\n\nCurrently incubated at KWADRA TBI (Cohort 5), a technology business incubator supporting early-stage startups in the Philippines.`
  },
  'lagavista': {
    id: 'lagavista',
    title: 'Lagavista',
    description: 'Cultural-exchange platform connecting Indonesian and Philippine communities. Awarded Best Poster and 2nd place at INESCOM International Competition, Universitas Brawijaya.',
    image: '/assets/lagavista.png',
    tags: ['Next.js', 'Vercel', 'Cultural Exchange'],
    liveUrl: 'https://lagavista-web.vercel.app/en',
    codeUrl: '#',
    status: 100,
    color: '#ffd60a',
    details: `## Overview\n\nLagavista is a cultural-exchange platform connecting Indonesian and Philippine communities through shared heritage, stories, and collaborative projects. Built as part of the INESCOM International Competition hosted by FACE-IT (FILKOM, Universitas Brawijaya).\n\n## Key Features\n\n- **Cultural Profiles** — Rich multimedia profiles showcasing traditions, cuisine, and art from both cultures\n- **Story Exchange** — Users share personal narratives connecting their cultural experiences\n- **Community Matching** — Algorithm pairs users with similar cultural interests across borders\n- **Multilingual Support** — Full Indonesian and English localization\n\n## Architecture\n\n- **Framework:** Next.js with App Router\n- **Deployment:** Vercel with edge functions for global performance\n- **Internationalization:** i18n routing with locale-based content delivery\n\n## Competition Results\n\nRepresented ISUFST as part of "Team 404: Problem Not Found" at INESCOM International Competition, Universitas Brawijaya:\n- **Best Poster Award** — Recognized for visual design and cultural presentation\n- **2nd Place, Essay Competition** — For the accompanying research paper on digital cultural exchange`
  },
  'ictirc': {
    id: 'ictirc',
    title: 'ICTIRC',
    description: 'Full-stack research-repository and conference-management platform with dual hot/cold storage, multi-tier RBAC, paper submission workflows, plagiarism detection, and QR-based event registration.',
    image: '/assets/ictirc.png',
    tags: ['Next.js', 'Prisma', 'Supabase', 'TypeScript'],
    liveUrl: 'https://irjict.isufstcict.com/',
    codeUrl: '#',
    status: 100,
    color: '#00ff88',
    details: `## Overview\n\nICTIRC (Information & Communication Technology International Research Conference) is a full-stack platform for managing research paper submissions, peer review workflows, and conference event logistics. Built as Lead Developer for the ICT department.\n\n## Key Features\n\n- **Paper Submission** — Multi-step submission workflow with file uploads and co-author management\n- **Peer Review** — Double-blind review system with reviewer assignment and scoring\n- **Plagiarism Detection** — Automated similarity checking on submitted manuscripts\n- **QR Registration** — QR-based event check-in for conference attendees\n- **Dual Storage** — Hot storage (Supabase) for active data, cold storage for archival\n- **Multi-tier RBAC** — Role-based access for authors, reviewers, editors, and admins\n\n## Architecture\n\n- **Framework:** Next.js 16 with App Router and Server Actions\n- **ORM:** Prisma with type-safe database queries\n- **Database:** Supabase (PostgreSQL) with hot/cold storage strategy\n- **Language:** TypeScript throughout\n- **Auth:** Multi-tier RBAC with role escalation workflows\n\n## Impact\n\nServed as the primary platform for the ICT department's international research conference, handling 100+ paper submissions and 300+ event registrations.`
  },
  'energy-monitoring': {
    id: 'energy-monitoring',
    title: 'Energy Monitoring',
    description: 'Real-time IoT power-tracking system with PZEM-004T sensor and ESP32. Features telemetry ingestion, overvoltage/undervoltage alert detection, and configurable PHP/kWh billing engine.',
    image: '/assets/energy-monitoring.png',
    tags: ['ESP32', 'IoT', 'React', 'PHP'],
    liveUrl: 'https://energy-monitoring-web.vercel.app/dashboard',
    codeUrl: '#',
    status: 100,
    color: '#ff4444',
    details: `## Overview\n\nEnergy Monitoring is a real-time IoT power-tracking system that integrates a PZEM-004T sensor with an ESP32 microcontroller to provide granular electricity monitoring, alert detection, and automated billing.\n\n## Key Features\n\n- **Real-time Telemetry** — Live voltage, current, power, and energy readings streamed via WebSocket\n- **Alert System** — Automatic detection of overvoltage, undervoltage, and blackout events with push notifications\n- **Billing Engine** — Configurable PHP/kWh rate calculation with daily, weekly, and monthly summaries\n- **Historical Analytics** — Interactive charts showing consumption trends and peak usage periods\n- **Device Management** — Register and monitor multiple ESP32 sensor nodes from a single dashboard\n\n## Architecture\n\n- **Hardware:** ESP32 microcontroller + PZEM-004T power meter sensor\n- **Firmware:** Arduino-based firmware with WiFi connectivity and MQTT telemetry\n- **Backend:** PHP API for data ingestion, alert processing, and billing calculations\n- **Frontend:** React dashboard with real-time WebSocket updates and Chart.js visualizations\n- **Deployment:** Vercel for the web dashboard, local server for MQTT broker\n\n## Use Case\n\nDesigned for households and small businesses in the Philippines seeking visibility into their electricity consumption and protection against power anomalies.`
  },
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchProject() {
      try {
        const docRef = doc(db, 'projects', slug)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() })
        } else {
          // Try fallback
          setProject(FALLBACK_PROJECTS[slug] || null)
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setProject(FALLBACK_PROJECTS[slug] || null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProject()
    window.scrollTo(0, 0)
  }, [slug])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(project?.title || 'Project')
    
    const links = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check out ${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    }
    
    window.open(links[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="project-detail-loading">
        <style>{`
          .project-detail-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00d4ff;
            font-family: 'Press Start 2P', cursive;
            font-size: 0.8rem;
          }
          .loading-text::after {
            content: '';
            animation: dots 1.5s steps(4) infinite;
          }
          @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
          }
        `}</style>
        <span className="loading-text">LOADING PROJECT</span>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="project-not-found">
        <style>{`
          .project-not-found {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            padding: 2rem;
          }
          .not-found-title {
            font-family: 'Press Start 2P', cursive;
            color: #ff6b35;
            font-size: 1.2rem;
          }
        `}</style>
        <h1 className="not-found-title">PROJECT NOT FOUND</h1>
        <PixelButton onClick={() => navigate('/#projects')}>
          ← BACK TO PROJECTS
        </PixelButton>
      </div>
    )
  }

  return (
    <div className="project-detail-page">
      <Seo 
        title={`${project.title} | JeffDev Projects`}
        description={project.description}
        image={project.image}
      />
      
      <style>{`
        .project-detail-page {
          min-height: 100vh;
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          transition: color 0.3s;
        }

        .back-link:hover {
          color: #00d4ff;
        }

        .project-hero {
          position: relative;
          width: 100%;
          height: 400px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .project-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                      linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .project-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1.8rem;
          color: white;
          text-shadow: 3px 3px 0px ${project.color || '#00d4ff'};
          margin: 0;
        }

        .status-badge {
          display: inline-block;
          margin-top: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
        }

        .status-badge.complete {
          background: rgba(57, 255, 20, 0.15);
          border: 1px solid rgba(57, 255, 20, 0.4);
          color: #39ff14;
        }

        .status-badge.progress {
          background: rgba(255, 170, 0, 0.15);
          border: 1px solid rgba(255, 170, 0, 0.4);
          color: #ffaa00;
        }

        .project-links {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .project-description {
          font-size: 1.15rem;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 3rem;
        }

        .section-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .section-title::after {
          content: '';
          height: 1px;
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
        }

        .details-section {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .markdown-content {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.95rem;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.85);
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3 {
          color: #00d4ff;
          margin: 1.5rem 0 1rem;
          font-family: 'Press Start 2P', cursive;
        }

        .markdown-content h1 { font-size: 1rem; }
        .markdown-content h2 { font-size: 0.85rem; }
        .markdown-content h3 { font-size: 0.75rem; color: #39ff14; }

        .markdown-content p { margin-bottom: 1rem; }

        .markdown-content ul,
        .markdown-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .markdown-content li { margin-bottom: 0.5rem; }
        .markdown-content li::marker { color: #39ff14; }

        .markdown-content code {
          background: rgba(0, 212, 255, 0.15);
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          color: #00d4ff;
        }

        .markdown-content pre {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 6px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .markdown-content a {
          color: #00d4ff;
          text-decoration: underline;
        }

        .markdown-content blockquote {
          border-left: 3px solid #9d4edd;
          padding-left: 1rem;
          margin: 1rem 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 3rem;
        }

        .tech-tag {
          padding: 0.6rem 1.2rem;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 6px;
          color: #39ff14;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(157, 78, 221, 0.1));
          border: 2px solid rgba(0, 212, 255, 0.3);
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          margin: 3rem 0;
        }

        .cta-title {
          font-family: 'Press Start 2P', cursive;
          font-size: 1rem;
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        /* Share Section */
        .share-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .share-label {
          color: rgba(255, 255, 255, 0.5);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
        }

        .share-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .share-btn:hover {
          background: rgba(0, 212, 255, 0.1);
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .share-btn.copied {
          background: rgba(57, 255, 20, 0.15);
          border-color: #39ff14;
          color: #39ff14;
        }

        @media (max-width: 768px) {
          .project-detail-page {
            padding: 1rem;
          }

          .project-hero {
            height: 250px;
          }

          .project-title {
            font-size: 1.2rem;
          }

          .project-header {
            flex-direction: column;
          }

          .cta-section {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      {/* Back Link */}
      <Link to="/#projects" className="back-link">
        ← Back to Projects
      </Link>

      {/* Hero Image */}
      <div className="project-hero">
        <img src={project.image} alt={project.title} />
      </div>

      {/* Header */}
      <div className="project-header">
        <div>
          <h1 className="project-title">{project.title}</h1>
          {project.status !== undefined && (
            <span className={`status-badge ${project.status >= 100 ? 'complete' : 'progress'}`}>
              {project.status >= 100 ? '✓ Complete' : `${project.status}% In Progress`}
            </span>
          )}
        </div>
        <div className="project-links">
          {project.liveUrl && project.liveUrl !== '#' && (
            <PixelButton href={project.liveUrl} icon="🚀">
              LIVE DEMO
            </PixelButton>
          )}
          {project.codeUrl && project.codeUrl !== '#' && (
            <PixelButton href={project.codeUrl} icon="💻" variant="outline">
              VIEW CODE
            </PixelButton>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="project-description">{project.description}</p>

      {/* Architecture / Details */}
      {project.details && (
        <>
          <h2 className="section-title">ARCHITECTURE.md</h2>
          <div className="details-section">
            <div className="markdown-content">
              <ReactMarkdown>{project.details}</ReactMarkdown>
            </div>
          </div>
        </>
      )}

      {/* Tech Stack */}
      <h2 className="section-title">TECH_STACK.json</h2>
      <div className="tech-tags">
        {project.tags && project.tags.map(tag => (
          <span key={tag} className="tech-tag">{tag}</span>
        ))}
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2 className="cta-title">💬 Interested in this project?</h2>
        <p className="cta-subtitle">
          Let's discuss how I can build something similar for you, or collaborate on your next big idea.
        </p>
        <div className="cta-buttons">
          <PixelButton 
            href={`mailto:contact@jeffdev.studio?subject=Interested%20in%20${encodeURIComponent(project.title)}&body=Hi%20Jeff!%0A%0AI%20saw%20your%20${encodeURIComponent(project.title)}%20project%20and%20would%20love%20to%20chat%20about%20working%20together.`}
            icon="�"
            variant="filled"
            color="matrix"
          >
            LET'S TALK
          </PixelButton>
          <PixelButton 
            href="/#contact"
            icon="💼"
            variant="outline"
            color="electric"
          >
            HIRE ME
          </PixelButton>
        </div>

        {/* Share Buttons */}
        <div className="share-section">
          <span className="share-label">Share:</span>
          <button 
            className={`share-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
          <button className="share-btn" onClick={() => handleShare('twitter')}>
            𝕏 Twitter
          </button>
          <button className="share-btn" onClick={() => handleShare('linkedin')}>
            in LinkedIn
          </button>
        </div>
      </div>

      {/* Back to Projects */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <PixelButton href="/#projects" variant="outline">
          ← VIEW ALL PROJECTS
        </PixelButton>
      </div>
    </div>
  )
}
