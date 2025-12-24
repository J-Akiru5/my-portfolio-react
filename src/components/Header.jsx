import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../styles/navbar.css'

export default function Header() {
  // add scroll detection to toggle header background
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        <Link to="/" className="nav-brand">ITPE 3124|Portfolio</Link>
        <ul className="nav-menu">
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Home</NavLink></li>
          <li><NavLink to="/portfolio" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Portfolio</NavLink></li>
          <li><NavLink to="/certifications" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Certifications</NavLink></li>
          <li><NavLink to="/sine-ai" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>SineAI Guild</NavLink></li>
        </ul>
        <a href="#" className="nav-contact-btn">Join Us</a>
      </nav>
    </header>
  )
}