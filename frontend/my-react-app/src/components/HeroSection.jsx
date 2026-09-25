import React from 'react'
import { useNavigate } from 'react-router-dom'
import secretariatHeroImg from '../assets/tiranga.png'
/**
 * Hero Section (Exact Figma Page 1 Frame 1)
 * - Central Secretariat architectural background
 * - White bold headline: "Welcome to e-SAKSHYA"
 * - Subtitle: "A unified platform for secure, tamper-evident digital evidence workflow across agencies."
 * - [ Register ] and [ Login ] buttons
 */
export default function HeroSection({ onOpenLogin, onOpenRegister, copy }) {
  const navigate = useNavigate()

  return (
    <section
      id="hero-section"
      className="hero-architectural-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.36)), url(${secretariatHeroImg})`,
      }}
    >
      <div className="site-container hero-inner-container">
        <div className="hero-content-block">
          <h1 className="hero-main-headline">
            {copy.title}
          </h1>

          <p className="hero-sub-text">
            {copy.description}
          </p>

          <div className="hero-cta-buttons-row">
            <button
              type="button"
              className="btn-animated btn-hero-action btn-hero-reg"
              onClick={() => (onOpenRegister ? onOpenRegister() : navigate('/register'))}
            >
              {copy.register}
            </button>
            <button
              type="button"
              className="btn-animated btn-hero-action btn-hero-log"
              onClick={() => (onOpenLogin ? onOpenLogin() : navigate('/login'))}
            >
              {copy.login}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
