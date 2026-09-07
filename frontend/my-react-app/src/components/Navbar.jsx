import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NationalEmblem from './NationalEmblem'

/**
 * Universal Government Top Navbar (Exact Figma Page 1 Specification)
 * - Black Ashoka Lion Capital + DEMS + MINISTRY OF HOME AFFAIRS
 * - Nav links: HOME ⌵, ABOUT US ⌵, CONTACT US ⌵
 * - Hover & click animated action buttons
 */
export default function Navbar({
  activePage = 'home',
  onNavClick,
}) {
  const navigate = useNavigate()

  const handleScrollTo = (sectionId) => {
    if (onNavClick) {
      onNavClick(sectionId)
      return
    }
    const elem = document.getElementById(sectionId)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${sectionId}`)
    }
  }

  return (
    <header className="gov-universal-header">
      <nav className="gov-main-navbar">
        <div className="site-container nav-flex-wrapper">
          {/* Brand Logo & Authority */}
          <Link to="/" className="brand-logo-group" title="e-SAKSHYA - Home">
            <NationalEmblem size={82} color="#0f172a" />
            <div className="brand-identity-text">
              <span className="brand-primary-acronym">e-SAKSHYA</span>
              <span className="brand-authority-title">MINISTRY OF HOME AFFAIRS</span>
            </div>
          </Link>

          {/* Navigation Links (Figma Page 1 Frame 1) */}
          <div className="nav-center-menu">
            <button
              type="button"
              className={`nav-menu-link ${activePage === 'home' ? 'active-nav' : ''}`}
              onClick={() => handleScrollTo('hero-section')}
            >
              HOME <span className="chevron-down">⌵</span>
            </button>
            <button
              type="button"
              className={`nav-menu-link ${activePage === 'about' ? 'active-nav' : ''}`}
              onClick={() => handleScrollTo('about-section')}
            >
              ABOUT US <span className="chevron-down">⌵</span>
            </button>
            <button
              type="button"
              className="nav-menu-link link-highlight-gold"
              onClick={() => handleScrollTo('contact-section')}
            >
              CONTACT US <span className="chevron-down">⌵</span>
            </button>
          </div>

        </div>
      </nav>
    </header>
  )
}
