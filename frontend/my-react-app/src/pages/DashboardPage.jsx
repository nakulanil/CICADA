import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { policeRoles, getTimeGreeting } from '../data/policeData'
import PoliceEmblem from '../components/PoliceEmblem'
import CaseFileCard from '../components/CaseFileCard'
import CaseDetailsModal from '../components/CaseDetailsModal'

/**
 * Page 3: Case Files Dashboard Page
 * Top Left: Profile icon and rank insignia
 * Top Right: Time greeting, officer name, and position
 * Vertical division: Left side (Own cases) vs Right side (Senior-delegated cases)
 */
export default function DashboardPage() {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const role = policeRoles.find((item) => item.id === roleId) || policeRoles[0]
  const officer = role.defaultOfficer

  const greeting = getTimeGreeting()
  const [selectedCase, setSelectedCase] = useState(null)

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="official-page-container dashboard-page">
      {/* Top Government Official Header Bar */}
      <header className="dashboard-top-header">
        <div className="gov-tricolor-strip" />

        <div className="dash-header-main">
          {/* Top Left: Profile Icon & Officer Badge */}
          <div className="dash-top-left-profile">
            <div className="profile-badge-frame" style={{ borderColor: role.defaultOfficer.avatarColor }}>
              <div
                className="profile-avatar-circle"
                style={{ backgroundColor: role.defaultOfficer.avatarColor }}
              >
                <span className="profile-avatar-letters">
                  {officer.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </span>
              </div>
              <div className="profile-rank-chip" title={role.insigniaDesc}>
                {role.insignia}
              </div>
            </div>

            <div className="profile-title-block">
              <span className="profile-pno-tag">PNO: {officer.pno}</span>
              <span className="profile-rank-name">{role.shortTitle}</span>
              <span className="profile-cadre-tag">{role.cadre}</span>
            </div>
          </div>

          {/* Center: Official System Seal & Title */}
          <div className="dash-center-system-title">
            <div className="center-seal-row">
              <PoliceEmblem size={32} />
              <div>
                <h1 className="system-heading">CRIME & CRIMINAL TRACKING NETWORK & SYSTEMS</h1>
                <p className="system-sub">CENTRAL POLICE STATION • DIVISION I CASE MANAGEMENT VAULT</p>
              </div>
            </div>
          </div>

          {/* Top Right: Greeting, User Name, Position & Exit */}
          <div className="dash-top-right-user">
            <div className="greeting-user-box">
              <div className="greeting-line">
                <span className="greeting-prefix">Hello,</span>{' '}
                <strong className="greeting-time">{greeting}!</strong>
              </div>
              <div className="officer-full-name">{officer.name}</div>
              <div className="officer-position-title">{officer.rankTitle}</div>
              <div className="officer-station-sub">{officer.station}</div>
            </div>

            <button
              type="button"
              className="dash-logout-btn"
              onClick={handleLogout}
              title="Sign Out / Switch Station Officer"
            >
              Sign Out / Switch Role
            </button>
          </div>
        </div>

        {/* Status Strip */}
        <div className="dash-status-strip">
          <div className="status-strip-left">
            <span className="live-bullet" />
            <span className="status-item">
              <strong>STATUS:</strong> Station Online (CCTNS Central Server Connected)
            </span>
            <span className="status-divider">•</span>
            <span className="status-item">
              <strong>OFFICER CLEARANCE:</strong> Level {role.rankLevel} ({role.name})
            </span>
            <span className="status-divider">•</span>
            <span className="status-item">
              <strong>STATION:</strong> Central Police Station, Division I
            </span>
          </div>
          <div className="status-strip-right">
            <span className="status-item">
              <strong>DATE:</strong>{' '}
              {new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="status-divider">•</span>
            <span className="status-item">
              <strong>SHIFT:</strong> General Duty
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Vertical Split (Left vs Right) */}
      <main className="dashboard-vertical-split-area">
        {/* LEFT COLUMN: My Assigned Case Files */}
        <section className="case-column column-left-own">
          <div className="column-header-bar own-cases-bar">
            <div className="col-header-info">
              <span className="col-ref-code">PRIMARY INVESTIGATION JURISDICTION</span>
              <h2 className="col-main-title">
                My Assigned Case Files
                <span className="case-count-bubble">{role.ownCases.length}</span>
              </h2>
              <p className="col-desc">
                Cases where you are designated as the Primary Investigating Officer (IO) or direct desk handler.
              </p>
            </div>
            <div className="col-header-tag tag-primary">PRIMARY IO</div>
          </div>

          <div className="case-cards-list">
            {role.ownCases.map((caseItem) => (
              <CaseFileCard
                key={caseItem.id}
                caseItem={caseItem}
                type="own"
                onSelect={(selected) => setSelectedCase(selected)}
              />
            ))}
          </div>
        </section>

        {/* RIGHT COLUMN: Cases Delegated by Seniors */}
        <section className="case-column column-right-delegated">
          <div className="column-header-bar delegated-cases-bar">
            <div className="col-header-info">
              <span className="col-ref-code">SUPERVISORY & CROSS-ASSISTANCE REQUISITIONS</span>
              <h2 className="col-main-title">
                Senior-Delegated Case Files
                <span className="case-count-bubble bubble-delegated">
                  {role.delegatedCases.length}
                </span>
              </h2>
              <p className="col-desc">
                Cases whose access and specific investigation directives have been assigned to you by senior officers.
              </p>
            </div>
            <div className="col-header-tag tag-delegated">DELEGATED ACCESS</div>
          </div>

          <div className="case-cards-list">
            {role.delegatedCases.map((delItem) => (
              <CaseFileCard
                key={delItem.id}
                caseItem={delItem}
                type="delegated"
                onSelect={(selected) => setSelectedCase(selected)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Case Details Dossier Modal */}
      <CaseDetailsModal
        selectedCase={selectedCase}
        officer={officer}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  )
}

