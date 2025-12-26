import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * NavBar Component
 * 
 * 8-bit styled navigation with JEFF.DEV branding and section links.
 */
const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Calculate scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
      
      // Detect active section based on scroll position
      const sections = ['hero', 'about', 'projects', 'certificates', 'contact'];
      const scrollY = window.scrollY + 100;
      
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    
    // If not on homepage, navigate to homepage with hash
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'hero', label: 'HOME' },
    { id: 'blog', label: 'BLOG', isRoute: true, path: '/blog' },
    { id: 'about', label: 'ABOUT' },
    { id: 'projects', label: 'WORK' },
    { id: 'certificates', label: 'CERTS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          overflow: visible;
        }
        
        .navbar.scrolled {
          background: rgba(10, 10, 18, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          color: white;
          text-decoration: none;
        }
        
        .navbar-brand .star {
          color: #39ff14;
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .navbar-brand .dot {
          color: #00d4ff;
        }
        
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-link {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          padding: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: #00d4ff;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #00d4ff;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-link.active {
          color: #00d4ff;
        }
        
        .nav-link.active::after {
          width: 100%;
        }
        
        /* Scroll progress bar */
        .scroll-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            #ff6b35, 
            #9d4edd, 
            #00d4ff, 
            #39ff14
          );
          transition: width 0.1s ease-out;
          z-index: 10;
        }
        
        /* Gradient line at top (bg track) */
        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
        }
        
        /* Mobile menu button */
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .mobile-menu-btn span {
          display: block;
          width: 24px;
          height: 2px;
          background: white;
          transition: all 0.3s ease;
        }
        
        .mobile-menu-btn.open span:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }
        
        .mobile-menu-btn.open span:nth-child(2) {
          opacity: 0;
        }
        
        .mobile-menu-btn.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }
        
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
          }
          
          .navbar-nav {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 10, 18, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .navbar-nav.open {
            transform: translateX(0);
          }
          
          .navbar-nav li {
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
          }
          
          .navbar-nav.open li {
            opacity: 1;
            transform: translateX(0);
          }
          
          .navbar-nav.open li:nth-child(1) { transition-delay: 0.1s; }
          .navbar-nav.open li:nth-child(2) { transition-delay: 0.15s; }
          .navbar-nav.open li:nth-child(3) { transition-delay: 0.2s; }
          .navbar-nav.open li:nth-child(4) { transition-delay: 0.25s; }
          .navbar-nav.open li:nth-child(5) { transition-delay: 0.3s; }
          .navbar-nav.open li:nth-child(6) { transition-delay: 0.35s; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
        <Link to="/" className="navbar-brand">
          <span className="star">★</span>
          <span>JEFF</span>
          <span className="dot">.</span>
          <span>DEV</span>
        </Link>
        
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <ul className={`navbar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.id}>
              {link.isRoute ? (
                <Link 
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a 
                  href={`#${link.id}`}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
