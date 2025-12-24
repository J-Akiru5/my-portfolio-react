/**
 * Certificate Data for Jeff Edrick Martinez Portfolio
 * 
 * All 30 certificates organized by category.
 * SVG files are located in /public/certs/
 */

export const categories = [
  'Cloud Computing',
  'ICT & Data',
  'Web Development',
  'Mobile App Development',
  'Graphic Design',
  'Digital Marketing',
  'Python',
  'JavaScript',
];

export const CATEGORY_ICONS = {
  'Cloud Computing': '☁️',
  'ICT & Data': '💾',
  'Web Development': '🌐',
  'Mobile App Development': '📱',
  'Graphic Design': '🎨',
  'Digital Marketing': '📈',
  'Python': '🐍',
  'JavaScript': '⚡',
};

export const certificates = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CLOUD COMPUTING (3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cloud-1',
    title: 'Basic Level of Cloud Computing',
    provider: 'DICT',
    category: 'Cloud Computing',
    image: '/certs/DICT-ICT014 Basic Level of Cloud Computing.png',
    order: 1,
  },
  {
    id: 'cloud-2',
    title: 'Intermediate Level of Cloud Computing',
    provider: 'DICT',
    category: 'Cloud Computing',
    image: '/certs/DICT-ICT015 Intermediate Level of Cloud Computing.png',
    order: 2,
  },
  {
    id: 'cloud-3',
    title: 'Advanced Level of Cloud Computing',
    provider: 'DICT',
    category: 'Cloud Computing',
    image: '/certs/DICT-ICT016 Advanced Level of Cloud Computing.png',
    order: 3,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ICT & DATA (7)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ict-1',
    title: 'Digital Innovation in Government',
    provider: 'DICT',
    category: 'ICT & Data',
    image: '/certs/DICT-ICT001 Digital Innovation in Government.png',
    order: 1,
  },
  {
    id: 'ict-2',
    title: 'Internet of Things Using Arduino in TinkerCad',
    provider: 'DICT',
    category: 'ICT & Data',
    image: '/certs/DICT-ICT003 Internet of Things Using Arduino in TinkerCad.png',
    order: 2,
  },
  {
    id: 'ict-3',
    title: 'Big Data Fundamentals',
    provider: 'DICT',
    category: 'ICT & Data',
    image: '/certs/DICT-ICT004 Big Data Fundamentals.png',
    order: 3,
  },
  {
    id: 'ict-4',
    title: 'Introduction to Data Privacy',
    provider: 'DICT',
    category: 'ICT & Data',
    image: '/certs/DICT-ICT006 Introduction to Data Privacy.png',
    order: 4,
  },
  {
    id: 'ict-5',
    title: 'Data Privacy - Good Governance',
    provider: 'DICT',
    category: 'ICT & Data',
    image: '/certs/DICT-ICT007 Data Privacy - Good Governance.png',
    order: 5,
  },
  {
    id: 'ict-6',
    title: 'Digital Transformation 101: Reimagining Businesses',
    provider: 'DICT',
    category: 'ICT & Data',
    image: '/certs/DICT-ICT010 Digital Transformation 101 Reimagining Businesses.png',
    order: 6,
  },
  {
    id: 'ict-7',
    title: 'Intermediate Level of Digital Transformation',
    provider: 'DICT',
    category: 'ICT & Data',
    image: '/certs/DICT-ICT011 Intermediate Level of Digital Transformation.png',
    order: 7,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEB DEVELOPMENT (5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'web-1',
    title: 'Principles of Web Development and Introduction to HTML',
    provider: 'DICT',
    category: 'Web Development',
    image: '/certs/DICT-WD001 Principles of Web Development and Introduction to HTML.png',
    order: 1,
  },
  {
    id: 'web-2',
    title: 'Using HTML and CSS to Design a Website',
    provider: 'DICT',
    category: 'Web Development',
    image: '/certs/DICT-WD002 Using HTML and CSS to Design a Website .png',
    order: 2,
  },
  {
    id: 'web-3',
    title: 'Basic JavaScript for Web Development',
    provider: 'DICT',
    category: 'Web Development',
    image: '/certs/DICT-WD003 Basic Javascript for Web Development.png',
    order: 3,
  },
  {
    id: 'web-4',
    title: 'Project 1: Developing a Static Website',
    provider: 'DICT',
    category: 'Web Development',
    image: '/certs/WD005 Project 1-Developing a Static Website.png',
    order: 4,
  },
  {
    id: 'web-5',
    title: 'Build Python Web Apps with Flask',
    provider: 'Codecademy',
    category: 'Web Development',
    image: '/certs/Build Python Web Apps with Flask.png',
    order: 5,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MOBILE APP DEVELOPMENT (2)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'mobile-1',
    title: 'Introduction to Android Application',
    provider: 'DICT',
    category: 'Mobile App Development',
    image: '/certs/DICT-MAD006 Introduction to Android Application.png',
    order: 1,
  },
  {
    id: 'mobile-2',
    title: 'Basic Building Blocks of the User Interface',
    provider: 'DICT',
    category: 'Mobile App Development',
    image: '/certs/DICT-MAD007 Basic Building Blocks of the User Interface.png',
    order: 2,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRAPHIC DESIGN (4)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'design-1',
    title: 'Principles of Design',
    provider: 'DICT',
    category: 'Graphic Design',
    image: '/certs/DICT-GD001 Principles of Design.png',
    order: 1,
  },
  {
    id: 'design-2',
    title: 'Canva for Graphic Design',
    provider: 'DICT',
    category: 'Graphic Design',
    image: '/certs/DICT-GD002 Canva for Graphic Design.png',
    order: 2,
  },
  {
    id: 'design-3',
    title: 'Trends in Art and Design',
    provider: 'DICT',
    category: 'Graphic Design',
    image: '/certs/DICT-GD003 Trends in Art and Design.png',
    order: 3,
  },
  {
    id: 'design-4',
    title: 'Functional Composition',
    provider: 'DICT',
    category: 'Graphic Design',
    image: '/certs/DICT-GD004 Functional Composition.png',
    order: 4,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DIGITAL MARKETING (3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'marketing-1',
    title: 'Fundamentals of Marketing',
    provider: 'DICT',
    category: 'Digital Marketing',
    image: '/certs/DICT-DM001 Fundamentals of Marketing .png',
    order: 1,
  },
  {
    id: 'marketing-2',
    title: 'Digital Marketing Channels and Funnel',
    provider: 'DICT',
    category: 'Digital Marketing',
    image: '/certs/DICT-DM002 Digital Marketing Channels and Funnel.png',
    order: 2,
  },
  {
    id: 'marketing-3',
    title: 'Copywriting Basics: Advertising Copy & Trends',
    provider: 'DICT',
    category: 'Digital Marketing',
    image: '/certs/DICT-DM003 Copywriting Basics Advertising Copy Trends in Art and Design.png',
    order: 3,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PYTHON (5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'python-1',
    title: 'Programming for Beginners Using Python',
    provider: 'DICT',
    category: 'Python',
    image: '/certs/Programming for Beginners Using Python.png',
    order: 1,
  },
  {
    id: 'python-2',
    title: 'Programming for Intermediate Users Using Python',
    provider: 'DICT',
    category: 'Python',
    image: '/certs/Programming for Intermediate Users Using Python.png',
    order: 2,
  },
  {
    id: 'python-3',
    title: 'Learn Basic Statistics with Python',
    provider: 'Codecademy',
    category: 'Python',
    image: '/certs/Learn Basic Statistics with Python.png',
    order: 3,
  },
  {
    id: 'python-4',
    title: 'Analyze Data with Python',
    provider: 'Codecademy',
    category: 'Python',
    image: '/certs/Analyze Data with Python.png',
    order: 4,
  },
  {
    id: 'python-5',
    title: 'Visualize Data with Python',
    provider: 'Codecademy',
    category: 'Python',
    image: '/certs/Visualize Data with Python.png',
    order: 5,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JAVASCRIPT (1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'js-1',
    title: 'JavaScript Essentials 1',
    provider: 'Cisco Networking Academy',
    category: 'JavaScript',
    image: '/certs/JavaScript_Essentials_1_certificate_jeffmartinez474-gmail-com_89f79e0e-95b9-467e-aadf-903a1f8baea4.png',
    order: 1,
  },
];

/**
 * Get certificates filtered by category
 * @param {string} category - Category name or 'all'
 * @returns {Array} Filtered certificates
 */
export function getCertificatesByCategory(category) {
  if (!category || category === 'all') {
    return certificates;
  }
  return certificates.filter(cert => cert.category === category);
}

/**
 * Get total certificate count
 * @returns {number}
 */
export function getTotalCount() {
  return certificates.length;
}

/**
 * Get certificate by ID
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getCertificateById(id) {
  return certificates.find(cert => cert.id === id);
}

/**
 * Get category stats
 * @returns {Array} Array of { category, count, icon }
 */
export function getCategoryStats() {
  return categories.map(category => ({
    category,
    count: certificates.filter(c => c.category === category).length,
    icon: CATEGORY_ICONS[category] || '📜',
  }));
}

export default certificates;
