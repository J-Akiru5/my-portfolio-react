/**
 * Firebase Seed Utility
 * 
 * Import this in browser console or a component to seed Firestore.
 * Call seedAllData() to populate all collections.
 */

import { db } from '../firebase';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { certificates } from '../data/certificateData';

// Projects data - matches FALLBACK_PROJECTS in ProjectsSection
const projects = [
  {
    id: 'sineai-hub',
    title: 'SineAI Hub',
    description: 'AI-powered learning management system with real-time chat, collaboration features, and intelligent tutoring.',
    image: '/assets/Screenshot 2025-12-16 094218.png',
    tags: ['Laravel', 'Supabase', 'Gemini', 'Tailwind'],
    liveUrl: 'https://sineai.tech',
    codeUrl: 'https://github.com/J-Akiru5/sineai-hub',
    color: '#00d4ff',
    status: 100,
    linkedBlogId: null,
    order: 1,
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description: '8-bit Universe themed portfolio with GSAP animations, glassmorphism, and Firebase integration.',
    image: '/assets/Screenshot 2025-12-25 113451.png',
    tags: ['React', 'GSAP', 'Firebase', 'Lenis'],
    liveUrl: '#',
    codeUrl: 'https://github.com/J-Akiru5/my-portfolio-react',
    color: '#39ff14',
    status: 100,
    linkedBlogId: null,
    order: 2,
  },
  {
    id: 'cict-portal',
    title: 'CICT Tech Portal',
    description: 'Technology portal for the College of ICT with student resources and department management.',
    image: '/assets/Screenshot 2025-12-25 122142.png',
    tags: ['Laravel', 'TypeScript', 'Tailwind'],
    liveUrl: '#',
    codeUrl: 'https://github.com/J-Akiru5/cict-tech-portal',
    color: '#9d4edd',
    status: 100,
    linkedBlogId: null,
    order: 3,
  },
  {
    id: 'gsus',
    title: 'GSUS',
    description: 'General Services Unified System - comprehensive service management platform.',
    image: '/assets/image copy 2.png',
    tags: ['React', 'Vite', 'Vercel'],
    liveUrl: '#',
    codeUrl: 'https://github.com/J-Akiru5/GSUS-Hackathon-Project',
    color: '#ff6b35',
    status: 100,
    linkedBlogId: null,
    order: 4,
  },
  {
    id: 'ebhm-connect',
    title: 'E-BHM Connect',
    description: 'Electronic Barangay Health Management System for community healthcare.',
    image: '/assets/Screenshot 2025-12-18 222001.png',
    tags: ['PHP', 'MySQL', 'Bootstrap'],
    liveUrl: '#',
    codeUrl: 'https://github.com/J-Akiru5/e-bhm_connect',
    color: '#00d4ff',
    status: 100,
    linkedBlogId: null,
    order: 5,
  },
  {
    id: 'lingsarloka',
    title: 'LingsarLoka',
    description: 'High-fidelity Figma prototype with modern UI/UX design principles.',
    image: '/assets/image.png',
    tags: ['Figma', 'UI/UX'],
    liveUrl: 'https://thick-break-42913670.figma.site/',
    codeUrl: 'https://github.com/J-Akiru5/LingsarLoka',
    color: '#39ff14',
    status: 100,
    linkedBlogId: null,
    order: 6,
  },
];

// Social links data
const socialLinks = [
  { id: 'github', platform: 'github', url: 'https://github.com/J-Akiru5', label: 'GitHub', order: 1 },
  { id: 'linkedin', platform: 'linkedin', url: 'https://www.linkedin.com/in/jeff-edrick-martinez-888575300/', label: 'LinkedIn', order: 2 },
  { id: 'x', platform: 'x', url: '#', label: 'X', order: 3 },
  { id: 'instagram', platform: 'instagram', url: '#', label: 'Instagram', order: 4 },
  { id: 'youtube', platform: 'youtube', url: '#', label: 'YouTube', order: 5 },
  { id: 'tiktok', platform: 'tiktok', url: '#', label: 'TikTok', order: 6 },
];

// Settings data
const settings = {
  siteName: 'JEFF.DEV',
  siteTagline: 'AI-Powered Developer',
  heroTitle: 'Jeff Edrick Martinez',
  heroSubtitle: 'Vibecoder • Creative Director',
  aboutText: 'Third-year IT student and President of the SineAI Guild. Passionate about blending AI technology with creative development.',
  contactEmail: 'jeffmartinez474@gmail.com',
};

/**
 * Seed certificates collection
 */
export async function seedCertificates() {
  console.log('📜 Seeding certificates...');
  const batch = writeBatch(db);
  
  for (const cert of certificates) {
    const docRef = doc(db, 'certificates', cert.id);
    batch.set(docRef, {
      ...cert,
      createdAt: new Date().toISOString(),
    });
  }
  
  await batch.commit();
  console.log(`✅ Added ${certificates.length} certificates`);
  return certificates.length;
}

/**
 * Seed projects collection
 */
export async function seedProjects() {
  console.log('🚀 Seeding projects...');
  const batch = writeBatch(db);
  
  for (const project of projects) {
    const docRef = doc(db, 'projects', project.id);
    batch.set(docRef, {
      ...project,
      createdAt: new Date().toISOString(),
    });
  }
  
  await batch.commit();
  console.log(`✅ Added ${projects.length} projects`);
  return projects.length;
}

/**
 * Seed social links collection
 */
export async function seedSocialLinks() {
  console.log('🔗 Seeding social links...');
  const batch = writeBatch(db);
  
  for (const link of socialLinks) {
    const docRef = doc(db, 'socialLinks', link.id);
    batch.set(docRef, link);
  }
  
  await batch.commit();
  console.log(`✅ Added ${socialLinks.length} social links`);
  return socialLinks.length;
}

/**
 * Seed settings document
 */
export async function seedSettings() {
  console.log('⚙️ Seeding settings...');
  const docRef = doc(db, 'settings', 'general');
  await setDoc(docRef, {
    ...settings,
    updatedAt: new Date().toISOString(),
  });
  console.log('✅ Settings saved');
  return 1;
}

// Services data
const services = [
  {
    id: 'web-development',
    slug: 'web-development',
    title: 'Web Development',
    icon: '💻',
    description: 'Transform your ideas into robust, high-performance web applications using Laravel, React, and Inertia.js.',
    features: [
      'Full-Stack Architecture',
      'Database Design & Optimization',
      'Real-time Features (WebSockets)',
      'API Development & Integration',
      'Payment Gateway Integration',
      'Admin Dashboards'
    ],
    tech: ['Laravel', 'React', 'Inertia.js', 'MySQL', 'Redis', 'Tailwind CSS'],
    color: '#00d4ff',
    starterPrice: 500,
    packages: [
      { name: 'Starter', price: 500, description: 'Landing page or simple site' },
      { name: 'Standard', price: 1500, description: 'Full web app with auth & dashboard' },
      { name: 'Premium', price: 3000, description: 'Complex system with API integrations' }
    ],
    ctaText: 'START PROJECT',
    order: 1,
    active: true
  },
  {
    id: 'ui-ux-design',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: '🎨',
    description: 'Create intuitive, engaging user experiences with pixel-perfect designs and modern aesthetics.',
    features: [
      'User Research & Personas',
      'Wireframing & Prototyping',
      'Design Systems',
      'Interactive Mockups',
      'Mobile-First Design',
      'Accessibility Compliance'
    ],
    tech: ['Figma', 'Adobe XD', 'Protopie'],
    color: '#9d4edd',
    starterPrice: 300,
    packages: [
      { name: 'Starter', price: 300, description: 'UI mockups for 3-5 screens' },
      { name: 'Standard', price: 800, description: 'Full app design with components' },
      { name: 'Premium', price: 1500, description: 'Complete design system + prototypes' }
    ],
    ctaText: 'VIEW PROCESS',
    order: 2,
    active: true
  },
  {
    id: 'mobile-apps',
    slug: 'mobile-apps',
    title: 'Mobile Development',
    icon: '📱',
    description: 'Build native-quality mobile applications for Android using Java or cross-platform solutions with React Native.',
    features: [
      'Native Android Development',
      'Cross-Platform (React Native)',
      'Offline Functionality',
      'Push Notifications',
      'Google Maps Integration',
      'Play Store Deployment'
    ],
    tech: ['Java', 'React Native', 'Android Studio', 'Firebase'],
    color: '#39ff14',
    starterPrice: 600,
    packages: [
      { name: 'Starter', price: 600, description: 'Simple utility app' },
      { name: 'Standard', price: 2000, description: 'Full app with backend integration' },
      { name: 'Premium', price: 4000, description: 'Enterprise app with complex features' }
    ],
    ctaText: 'DISCUSS APP',
    order: 3,
    active: true
  }
];

/**
 * Seed services collection
 */
export async function seedServices() {
  console.log('🛠️ Seeding services...');
  const batch = writeBatch(db);
  
  for (const service of services) {
    const docRef = doc(db, 'services', service.id);
    batch.set(docRef, {
      ...service,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  await batch.commit();
  console.log(`✅ Added ${services.length} services`);
  return services.length;
}

/**
 * Seed all collections
 */
export async function seedAllData() {
  console.log('\n🌱 Starting Firebase seed...\n');
  
  try {
    const certsCount = await seedCertificates();
    const projectsCount = await seedProjects();
    const socialCount = await seedSocialLinks();
    await seedSettings();
    
    console.log('\n🎉 All data seeded successfully!');
    return {
      success: true,
      counts: {
        certificates: certsCount,
        projects: projectsCount,
        socialLinks: socialCount,
        settings: 1,
      },
    };
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

export default seedAllData;
