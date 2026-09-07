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
        <Link to="/" className="top-brand-group" title="e-SAKSHYA Home">
          <NationalEmblem size={68} color="#C5832B" />
          <div className="top-title-column">
            <span className="top-system-title">e-SAKSHYA</span>
            <span className="top-gov-agency">MINISTRY OF HOME AFFAIRS • GOVT. OF INDIA</span>
          </div>
        </Link>

        {/* Right: Signout */}
        <div className="top-user-actions-group">
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

