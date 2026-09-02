import React from 'react'
import { useNavigate } from 'react-router-dom'
import CDACHeader from '../components/CDACHeader'
import CDACFooter from '../components/CDACFooter'
import { DEMSBadge } from '../components/DEMSLogo'
import { organizations } from '../data/demsData'

/**
 * Clean Early 2010s Landing Page
 * Direct, uncluttered, focused on Registration and Login
 */
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="app-page-wrapper">
      <CDACHeader activePage="home" />

      {/* Hero Section */}
      <section className="hero-banner-section">
        <div className="site-container hero-flex">
          <div className="hero-left-text">
            <div className="official-ref-badge">OFFICIAL RECORD PORTAL</div>
            <h1 className="hero-title">
              Digital Evidence Management System <span className="highlight-gold">(DEMS)</span>
            </h1>
            <p className="hero-desc">
              Secure case filing, digital evidence vault, and inter-agency coordination for Law Enforcement, Forensics, Prosecution, and Courts.
            </p>

            <div className="hero-btn-row">
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => navigate('/login')}
              >
                Officer Login ➔
              </button>
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => navigate('/register')}
              >
                + New Registration
              </button>
            </div>
          </div>

          <div className="hero-right-badge">
            <DEMSBadge size={72} />
            <span className="badge-caption">SECURE DIGITAL VAULT</span>
          </div>
        </div>
      </section>

      {/* Stakeholder Selection Grid */}
      <main className="site-container content-section">
        <div className="section-head-bar">
          <h2 className="section-title">Select Your Organization to Register</h2>
          <span className="section-help">Choose your department to register your official role and access credentials</span>
        </div>

        <div className="stakeholders-grid">
          {organizations.map((org) => (
            <div key={org.id} className="org-portal-card">
              <div className="org-card-title-bar">
                <span className="org-code-tag">{org.badgePrefix}</span>
                <h3 className="org-card-title">{org.name}</h3>
              </div>
              <p className="org-card-summary">{org.description}</p>

              <div className="org-card-roles">
                <strong>Key Roles:</strong>
                <ul>
                  {org.roles.slice(0, 3).map((r) => (
                    <li key={r.id}>• {r.name}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="btn-card-register"
                onClick={() => navigate(`/register?org=${org.id}`)}
              >
                Register as {org.shortName} →
              </button>
            </div>
          ))}
        </div>
      </main>

      <CDACFooter />
    </div>
  )
}
