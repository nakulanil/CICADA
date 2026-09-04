import React from 'react'
import { Link } from 'react-router-dom'
import NationalEmblem from './NationalEmblem'

/**
 * Top Master Dashboard Header (Figma Page 1 Frame 5)
 * Dark Navy #0A2540 with Emblem, System Title, Lock Icon, User Pill, and Signout
 */
export default function DashboardHeader({ currentUser, onOpenProfile, onLogout }) {
  return (
    <header className="dashboard-master-top-bar">
      <div className="dash-full-container top-bar-flex-row">
        {/* Left: Emblem & System Title */}
        <Link to="/" className="top-brand-group" title="DEMS Home">
          <NationalEmblem size={32} color="#C5832B" />
          <div className="top-title-column">
            <span className="top-system-title">DIGITAL EVIDENCE MANAGEMENT SYSTEM</span>
            <span className="top-gov-agency">MINISTRY OF HOME AFFAIRS • GOVT. OF INDIA</span>
          </div>
        </Link>

        {/* Center: Secure Session Indicator */}
        <div className="top-secure-status">
          <span className="lock-icon">🔒</span>
          <span className="secure-text">RESTRICTED RECORD VAULT</span>
        </div>

        {/* Right: Officer Profile Pill & Signout */}
        <div className="top-user-actions-group">
          <button
            type="button"
            className="btn-animated top-user-profile-pill"
            onClick={onOpenProfile}
            title="Click to view/edit officer profile"
          >
            <span className="top-user-avatar">
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                : 'OF'}
            </span>
            <span className="top-user-name">{currentUser?.name || 'Officer'}</span>
            <span className="profile-edit-icon">⚙️</span>
          </button>

          <button
            type="button"
            className="btn-animated btn-top-logout"
            onClick={onLogout}
            title="Secure Sign Out"
          >
            Logout ➔
          </button>
        </div>
      </div>
    </header>
  )
}

