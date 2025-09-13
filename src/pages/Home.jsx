import React from 'react'
import '../styles/index.css'
import { Link } from 'react-router-dom'
import profilePic from '../assets/profilepic.jpg' // copy original image to src/assets
import SkillLevel from '../components/SkillLevel'

const skills = [
  { name: 'JavaScript', level: 90 },
  { name: 'React', level: 85 },
  { name: 'Node.js', level: 75 },
  { name: 'CSS / Tailwind', level: 80 },
  { name: 'UI/UX', level: 70 },
]

export default function Home() {
  return (
    <section>
      <div className="background-image-layer" />
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-name">Jeff Edrick Martinez</h1>
          <p className="hero-subheadline">IT Student | Web Developer | Creative Director</p>
          <p className="hero-description">
            A third-year IT student and the Pioneering President of the SineAI Guild, specializing in web development, video production, and digital arts.<br />
            Passionate about technology, creativity, and leadership.
          </p>
          <div className="hero-buttons">
            <a href="#featured-work" className="work-btn">View My Work</a>
            <a href="#" className="contact-btn">Contact Me</a>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <div className="about-left">
            <img src={profilePic} alt="" className="about-initials-circle" />
          </div>
          <div className="about-right">
            <div className="about-header">
              <h2 className="about-title">About Me</h2>
              <a href="#" className="personal-info-btn">Personal Information</a>
            </div>
            <p className="about-description"> My journey in technology began with curiosity and has evolved into a passion for creating digital experiences that matter. As a third-year IT student, I've developed expertise in web development, video production, and digital arts.</p>
            <p className="about-description">Beyond the digital realm, I'm a well-rounded individual who enjoys beatboxing, swimming, and calisthenics. These diverse interests fuel my creativity and bring unique perspectives to my technical work.</p>
            <p className="about-description">As the Pioneering President of the <Link to="/sine-ai" className="sine-link">SineAI Guild</Link>, I lead initiatives that bridge technology and creativity, fostering innovation in our academic community.</p>
          </div>
        </div>
      </section>

      <section className="featured-work-section" id="featured-work">
        <h2 className="section-title">Featured Work</h2>
        <div className="work-gallery">
          <div className="work-card webdev-card">
            <div className="work-card-top">
              <svg width="60" height="60" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></svg>
            </div>
            <div className="work-card-bottom">
              <h3 className="work-card-title">IT-Tech Portal</h3>
              <p className="work-card-subtitle">Web Development</p>
              <a href="pages/webdev.html" className="work-card-btn webdev-btn">Explore Web Projects</a>
            </div>
          </div>
          <div className="work-card video-card">
            <div className="work-card-top">
              <svg width="60" height="60" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="15" height="10" rx="2" /><polygon points="21 7 21 17 17 14 17 10 21 7" /></svg>
            </div>
            <div className="work-card-bottom">
              <h3 className="work-card-title">Sytem Error: Bayanihan</h3>
              <p className="work-card-subtitle">Video Production</p>
              <a href="pages/videos.html" className="work-card-btn video-btn">Watch Films</a>
            </div>
          </div>
          <div className="work-card art-card">
            <div className="work-card-top">
              <svg width="60" height="60" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="18" rx="2" /><rect x="14" y="3" width="7" height="18" rx="2" /></svg>
            </div>
            <div className="work-card-bottom">
              <h3 className="work-card-title">Digital Art Collection</h3>
              <p className="work-card-subtitle">Graphic Design</p>
              <a href="#" className="work-card-btn art-btn">View Gallery</a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
        <header>
          <h1>Full‑Stack Developer / Designer</h1>
          <p>
            I build clean, accessible web apps with a focus on performance and
            delightful UX. This portfolio will show projects, certifications and
            a few case studies.
          </p>
        </header>

        <section style={{ marginTop: '2rem' }}>
          <h2>About me</h2>
          <p>
            I'm a pragmatic developer who enjoys turning ideas into polished
            products. I work across the stack, prefer component-driven UI, and
            value automated tests and good developer experience.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>Skills & proficiency</h2>
          <SkillLevel skills={skills} />
        </section>
      </section>
    </section>
  )
}