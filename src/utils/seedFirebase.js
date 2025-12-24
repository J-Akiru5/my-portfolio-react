/**
 * Firebase Seed Utility
 * 
 * Import this in browser console or a component to seed Firestore.
 * Call seedAllData() to populate all collections.
 */

import { db } from '../firebase';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { certificates } from '../data/certificateData';

// Projects data
const projects = [
  {
    id: 'sineai-hub',
    title: 'SineAI Hub',
    description: 'AI-powered learning management system with real-time chat and collaboration features.',
    image: '/projects/sineai-hub.jpg',
    category: 'web',
    tags: ['Laravel', 'React', 'Firebase', 'OpenAI'],
    liveUrl: 'https://sineai.tech',
    codeUrl: 'https://github.com/J-Akiru5/sineai-hub',
    featured: true,
    order: 1,
  },
  {
    id: 'profile-site',
    title: 'Profile Site',
    description: 'Personal portfolio with 8-bit aesthetic and modern animations.',
    image: '/projects/profile-site.jpg',
    category: 'web',
    tags: ['React', 'Tailwind', 'GSAP'],
    liveUrl: '#',
    codeUrl: 'https://github.com/J-Akiru5/my-portfolio-react',
    featured: true,
    order: 2,
  },
  {
    id: 'design-system',
    title: 'Design System',
    description: 'Comprehensive component library and design tokens.',
    image: '/projects/design-system.jpg',
    category: 'design',
    tags: ['Figma', 'React', 'Storybook'],
    liveUrl: '#',
    featured: false,
    order: 3,
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
