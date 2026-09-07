import React from 'react'
import { useNavigate } from 'react-router-dom'
import { policeRoles } from '../data/policeData'
import PoliceEmblem from '../components/PoliceEmblem'
import RankInsigniaBadge from '../components/RankInsigniaBadge'

/**
 * Page 1: Role Selection Page
 * Allows officer to select their rank within normal Indian Police Station hierarchy.
 * Pressing a role button immediately navigates to the login page.
 */
export default function RoleSelectionPage() {
  const navigate = useNavigate()

  const handleRoleSelect = (roleId) => {
    // Single click directly redirects to credentials login page
    navigate(`/login/${roleId}`)
  }

  return (
    <div className="official-page-container">
      {/* Top Government Banner */}
      <header className="gov-top-bar">
        <div className="gov-tricolor-strip" />
        <div className="gov-bar-content">
          <div className="gov-seal-wrap">
            <PoliceEmblem size={68} />
            <div className="gov-titles">
              <span className="gov-dept-tag">GOVERNMENT OF INDIA • STATE POLICE DEPARTMENT</span>
              <h1 className="gov-main-title">Crime & Criminal Tracking Network & Systems (CCTNS)</h1>
              <span className="gov-sub-title">Central Police Station Records & Investigation Vault</span>
            </div>
          </div>
          <div className="gov-right-badge">
            <span className="official-stamp-badge">RESTRICTED GOVT. ACCESS</span>
            <span className="station-code-text">STATION CODE: DL-CPS-01</span>
          </div>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="official-content-area">
        <div className="official-card role-selection-card">
          <div className="card-official-header">
            <div className="header-meta-left">
              <span className="doc-ref-number">STEP 1 OF 3 • PERSONNEL AUTHENTICATION</span>
              <h2 className="card-title">Select Officer Rank / Station Role</h2>
              <p className="card-subtitle">
                Access to case documents, General Diary entries, and investigation dossiers is governed strictly by the hierarchy of police officers. Select your designated role to proceed to credential verification.
              </p>
            </div>
            <div className="official-seal-watermark">
              <span className="seal-text">POLICE DEPT</span>
            </div>
          </div>

          <div className="hierarchy-flow-notice">
            <span className="notice-icon">ℹ</span>
            <span>
              <strong>Station Hierarchy Level:</strong> Higher-ranked officers hold supervisory oversight; junior officers access assigned cases and senior-delegated directives.
            </span>
          </div>

          {/* Role Buttons Grid */}
          <div className="roles-hierarchy-grid">
            {policeRoles.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`role-select-btn role-${role.id}`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <div className="role-btn-left">
                  <span className="role-hierarchy-num">Rank Level {role.rankLevel}</span>
                  <RankInsigniaBadge
                    rankId={role.id}
                    insignia={role.insignia}
                    insigniaDesc={role.insigniaDesc}
                  />
                </div>

                <div className="role-btn-center">
                  <div className="role-name-row">
                    <h3 className="role-title">{role.name}</h3>
                    <span className="badge-code-pill">{role.badgeCode}</span>
                  </div>
                  <p className="role-cadre">{role.cadre}</p>
                  <p className="role-department">{role.department}</p>
                  <div className="role-scope-tags">
                    <span className="scope-tag">{role.insigniaDesc}</span>
                    <span className="scope-tag">
                      {role.ownCases.length} Active Direct Cases
                    </span>
                    <span className="scope-tag">
                      {role.delegatedCases.length} Senior Directives
                    </span>
                  </div>
                </div>

                <div className="role-btn-action">
                  <span className="action-btn-label">AUTHENTICATE & LOG IN</span>
                  <span className="action-btn-arrow">➔</span>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Security Footer */}
          <div className="official-footer-note">
            <div className="security-item">
              <span className="sec-dot" />
              <span>CCTNS Encryption Standard AES-256 Enabled</span>
            </div>
            <div className="security-item">
              <span>Section 43 IT Act • Audit Trail Active</span>
            </div>
            <div className="security-item">
              <span>Station Shift: General & Night Roster Active</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

