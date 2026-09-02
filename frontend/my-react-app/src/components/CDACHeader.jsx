import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEMSBadge } from './DEMSLogo'

/**
 * Clean Early 2010s Official Top Header Bar
 */
export default function CDACHeader({ activePage = 'home' }) {
  const navigate = useNavigate()

  return (
    <header className="gov-main-header">
      {/* Top Banner Strip */}
      <div className="gov-top-ticker">
        <div className="site-container ticker-content">
          <div className="ticker-left">
            <span className="gov-tag">GOVERNMENT OF INDIA</span>
            <span className="ticker-divider">|</span>
            <span className="ticker-title">National Digital Evidence & Case Management System</span>
          </div>
          <div className="ticker-right">
            <span className="secure-tag">● SECURE PORTAL</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="gov-navbar">
        <div className="site-container nav-flex">
          {/* Logo & Title */}
          <Link to="/" className="brand-link">
            <DEMSBadge size={38} />
            <div className="brand-text">
              <span className="brand-title">Digital Evidence Management System (DEMS)</span>
              <span className="brand-subtitle">Integrated Police, Forensics, Prosecution & Court Repository</span>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="nav-actions">
            <Link to="/" className={`nav-link-btn ${activePage === 'home' ? 'active' : ''}`}>
              Home
            </Link>
            <button
              type="button"
              className="btn-glossy-register"
              onClick={() => navigate('/register')}
            >
              + Register
            </button>
            <button
              type="button"
              className="btn-glossy-login"
              onClick={() => navigate('/login')}
            >
              Login ➔
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
