import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import { policeRoles, getTimeGreeting } from './data/policeData'

// National / State Police Crest Component
function PoliceEmblem({ size = 44, color = '#ffffff' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="police-crest-svg"
      aria-label="Police Emblem"
    >
      {/* Shield Background */}
      <path
        d="M32 3L8 12V32C8 46.5 18.2 56.8 32 61C45.8 56.8 56 46.5 56 32V12L32 3Z"
        fill="#0b2545"
        stroke="#c5a059"
        strokeWidth="2.5"
      />
      {/* Inner Shield Ring */}
      <path
        d="M32 7L12 14.5V31C12 43.5 20.5 52.5 32 56C43.5 52.5 52 43.5 52 31V14.5L32 7Z"
        fill="#13315c"
        stroke="#c5a059"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      {/* Ashok Chakra / Star Symbol */}
      <circle cx="32" cy="28" r="10" stroke="#f1c40f" strokeWidth="2" fill="#0b2545" />
      <circle cx="32" cy="28" r="3" fill="#f1c40f" />
      <path d="M32 18V38M22 28H42M25 21L39 35M25 35L39 21" stroke="#f1c40f" strokeWidth="1.2" />
      {/* Ribbon / Scroll Base */}
      <path
        d="M16 46C21 44 26 43 32 43C38 43 43 44 48 46L50 51C44 48.5 38 47.5 32 47.5C26 47.5 20 48.5 14 51L16 46Z"
        fill="#c5a059"
      />
      {/* Text Stamp */}
      <text
        x="32"
        y="50.5"
        textAnchor="middle"
        fill="#0b2545"
        fontSize="4.2"
        fontWeight="bold"
        letterSpacing="0.4"
      >
        POLICE
      </text>
    </svg>
  )
}

// Rank Badge Icon Component
function RankInsigniaBadge({ rankId, insignia, insigniaDesc }) {
  const getBadgeStyle = () => {
    switch (rankId) {
      case 'sho':
        return { bg: '#800000', border: '#c5a059', color: '#ffd700' }
      case 'si':
        return { bg: '#13315c', border: '#c5a059', color: '#ffd700' }
      case 'asi':
        return { bg: '#2d3748', border: '#c5a059', color: '#ffd700' }
      case 'hc':
        return { bg: '#374151', border: '#cbd5e1', color: '#ffffff' }
      case 'pc':
      default:
        return { bg: '#4b5563', border: '#9ca3af', color: '#f3f4f6' }
    }
  }

  const style = getBadgeStyle()

  return (
    <div
      className="rank-insignia-badge"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.color,
      }}
      title={insigniaDesc}
    >
      <span className="insignia-symbols">{insignia}</span>
    </div>
  )
}

// -------------------------------------------------------------
// PAGE 1: ROLE SELECTION PAGE (Normal Indian Police Station Scope)
// -------------------------------------------------------------
function RoleSelectionPage() {
  const navigate = useNavigate()

  const handleRoleSelect = (roleId) => {
    // Directly redirect to Login page upon pressing the role button
    navigate(`/login/${roleId}`)
  }

  return (
    <div className="official-page-container">
      {/* Top Government Banner */}
      <header className="gov-top-bar">
        <div className="gov-tricolor-strip" />
        <div className="gov-bar-content">
          <div className="gov-seal-wrap">
            <PoliceEmblem size={48} />
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
            {policeRoles.map((role, index) => (
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

// -------------------------------------------------------------
// PAGE 2: OFFICIAL CREDENTIALS LOGIN PAGE
// -------------------------------------------------------------
function LoginPage() {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const role = policeRoles.find((item) => item.id === roleId) || policeRoles[0]
  const officer = role.defaultOfficer

  const [pnoInput, setPnoInput] = useState(officer.pno)
  const [officerName, setOfficerName] = useState(officer.name)
  const [password, setPassword] = useState('••••••••••••')
  const [stationShift, setStationShift] = useState('Day Shift (08:00 - 20:00 hrs)')
  const [terminalCode, setTerminalCode] = useState('CPS-LAN-NODE-07')

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    // Redirect to Dashboard (Page 3)
    navigate(`/dashboard/${role.id}`)
  }

  return (
    <div className="official-page-container">
      {/* Top Government Banner */}
      <header className="gov-top-bar">
        <div className="gov-tricolor-strip" />
        <div className="gov-bar-content">
          <div className="gov-seal-wrap">
            <PoliceEmblem size={48} />
            <div className="gov-titles">
              <span className="gov-dept-tag">GOVERNMENT OF INDIA • STATE POLICE DEPARTMENT</span>
              <h1 className="gov-main-title">Crime & Criminal Tracking Network & Systems (CCTNS)</h1>
              <span className="gov-sub-title">Officer Credentials Authentication Gateway</span>
            </div>
          </div>
          <div className="gov-right-badge">
            <span className="official-stamp-badge stamp-secure">SECURE GATEWAY</span>
            <span className="station-code-text">P.S. REF: DL-CENTRAL-01</span>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="official-content-area login-area">
        <div className="official-card login-card">
          <div className="card-official-header">
            <div className="header-meta-left">
              <span className="doc-ref-number">STEP 2 OF 3 • CREDENTIALS VERIFICATION</span>
              <h2 className="card-title">Official Police Portal Sign-In</h2>
              <p className="card-subtitle">
                Enter your official Police Personnel Number (PNO) and secure station credentials to access the case records repository.
              </p>
            </div>
            <button
              type="button"
              className="change-role-link-btn"
              onClick={() => navigate('/')}
              title="Return to Rank Selection"
            >
              ← Change Role
            </button>
          </div>

          {/* Designated Role Banner */}
          <div className="designated-role-banner">
            <div className="role-banner-insignia">
              <RankInsigniaBadge
                rankId={role.id}
                insignia={role.insignia}
                insigniaDesc={role.insigniaDesc}
              />
            </div>
            <div className="role-banner-info">
              <span className="banner-small-tag">DESIGNATED STATION ROLE</span>
              <h3 className="banner-role-name">{role.name}</h3>
              <p className="banner-cadre-desc">
                {role.cadre} • {officer.station}
              </p>
            </div>
            <div className="role-clearance-stamp">
              <span className="clearance-level">CLEARANCE LEVEL {role.rankLevel}</span>
              <span className="clearance-scope">Station Vault Access</span>
            </div>
          </div>

          {/* Official Login Form */}
          <form className="official-login-form" onSubmit={handleLoginSubmit}>
            <div className="form-grid-two">
              <div className="form-field-group">
                <label htmlFor="pno-input">
                  <span className="field-label">Police Personnel Number (PNO / Belt No.)</span>
                  <span className="req-star">*</span>
                </label>
                <input
                  id="pno-input"
                  type="text"
                  className="gov-input"
                  value={pnoInput}
                  onChange={(e) => setPnoInput(e.target.value)}
                  placeholder="e.g. DL-481902"
                  required
                />
                <span className="field-hint">Official 8-digit state police service identity number</span>
              </div>

              <div className="form-field-group">
                <label htmlFor="officer-name">
                  <span className="field-label">Officer Full Name</span>
                  <span className="req-star">*</span>
                </label>
                <input
                  id="officer-name"
                  type="text"
                  className="gov-input"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Officer Full Name"
                  required
                />
                <span className="field-hint">As registered in the Police Gazetted / Service Register</span>
              </div>
            </div>

            <div className="form-grid-two">
              <div className="form-field-group">
                <label htmlFor="pwd-input">
                  <span className="field-label">Station Password / Digital Token PIN</span>
                  <span className="req-star">*</span>
                </label>
                <input
                  id="pwd-input"
                  type="password"
                  className="gov-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  required
                />
                <span className="field-hint">Protected by CCTNS Multi-Factor Security Protocol</span>
              </div>

              <div className="form-field-group">
                <label htmlFor="shift-select">
                  <span className="field-label">Current Station Duty Shift</span>
                  <span className="req-star">*</span>
                </label>
                <select
                  id="shift-select"
                  className="gov-input gov-select"
                  value={stationShift}
                  onChange={(e) => setStationShift(e.target.value)}
                >
                  <option value="Day Shift (08:00 - 20:00 hrs)">Day Shift (08:00 - 20:00 hrs)</option>
                  <option value="Night Shift (20:00 - 08:00 hrs)">Night Shift (20:00 - 08:00 hrs)</option>
                  <option value="Emergency Investigation Duty">Emergency Investigation Duty</option>
                  <option value="Court Process & Summons Duty">Court Process & Summons Duty</option>
                </select>
                <span className="field-hint">Logs active shift hours in the Station General Diary</span>
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="terminal-id">
                <span className="field-label">Station LAN Terminal Identifier</span>
              </label>
              <input
                id="terminal-id"
                type="text"
                className="gov-input read-only-input"
                value={terminalCode}
                readOnly
              />
            </div>

            <div className="form-checkbox-row">
              <label className="gov-checkbox-wrap">
                <input type="checkbox" defaultChecked />
                <span>Log my session in the Station Daily General Diary (GD) Register</span>
              </label>
            </div>

            <div className="form-actions-row">
              <button type="button" className="gov-btn-secondary" onClick={() => navigate('/')}>
                ← Return to Rank Selection
              </button>
              <button type="submit" className="gov-btn-primary">
                VERIFY CREDENTIALS & ACCESS CASE VAULT ➔
              </button>
            </div>
          </form>

          {/* Legal Warning Notice */}
          <div className="official-statute-warning">
            <strong>OFFICIAL STATUTORY WARNING:</strong> This system is exclusively for authorized police personnel in the discharge of official duties. Unauthorized access or falsification of case diaries is punishable under Section 43 & 66 of the Information Technology Act, 2000 and Section 166/218 of the Indian Penal Code / Bharatiya Nyaya Sanhita.
          </div>
        </div>
      </main>
    </div>
  )
}

// -------------------------------------------------------------
// PAGE 3: CASE FILES DASHBOARD (Vertical Split: Own vs Delegated)
// -------------------------------------------------------------
function DashboardPage() {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const role = policeRoles.find((item) => item.id === roleId) || policeRoles[0]
  const officer = role.defaultOfficer

  const greeting = getTimeGreeting()
  const [selectedCase, setSelectedCase] = useState(null)
  const [activeTabFilter, setActiveTabFilter] = useState('all')

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
              <strong>STATION:</strong> Central Police Station, Parliament St.
            </span>
          </div>
          <div className="status-strip-right">
            <span className="status-item">
              <strong>DATE:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
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
              <article
                key={caseItem.id}
                className={`case-file-card own-case-card priority-${caseItem.statusLevel}`}
              >
                <div className="card-top-meta">
                  <span className="fir-badge">{caseItem.firNumber}</span>
                  <span className="case-date">Registered: {caseItem.date}</span>
                  <span className={`status-pill pill-${caseItem.statusLevel}`}>
                    {caseItem.status}
                  </span>
                </div>

                <h3 className="case-title-text">{caseItem.title}</h3>

                <div className="case-legal-sections">
                  <span className="section-label">Sections of Law:</span>
                  <code className="section-code">{caseItem.sections}</code>
                </div>

                <div className="case-meta-grid">
                  <div className="meta-item">
                    <span className="m-label">Complainant / Source:</span>
                    <span className="m-val">{caseItem.complainant}</span>
                  </div>
                  <div className="meta-item">
                    <span className="m-label">Current Stage:</span>
                    <span className="m-val highlight-stage">{caseItem.stage}</span>
                  </div>
                </div>

                <p className="case-summary-para">{caseItem.summary}</p>

                <div className="case-footer-row">
                  <div className="counts-badges">
                    <span className="stat-pill">📖 {caseItem.caseDiaryEntries} Diary Logs</span>
                    <span className="stat-pill">🗂 {caseItem.evidenceItems} Exhibits</span>
                  </div>
                  <button
                    type="button"
                    className="view-dossier-btn"
                    onClick={() => setSelectedCase({ ...caseItem, type: 'own' })}
                  >
                    Examine Case File ➔
                  </button>
                </div>
              </article>
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
              <article
                key={delItem.id}
                className={`case-file-card delegated-case-card priority-${delItem.statusLevel}`}
              >
                <div className="card-top-meta">
                  <span className="fir-badge badge-del">{delItem.firNumber}</span>
                  <span className="case-date">Delegated: {delItem.date}</span>
                  <span className={`status-pill pill-${delItem.statusLevel}`}>
                    {delItem.status}
                  </span>
                </div>

                <div className="senior-delegator-box">
                  <span className="delegator-icon">🎖</span>
                  <div className="delegator-text">
                    <span className="delegator-label">Delegated By Senior Authority:</span>
                    <strong className="delegator-name">{delItem.delegatedBy}</strong>
                    <span className="delegator-desig">({delItem.seniorDesignation})</span>
                  </div>
                </div>

                <h3 className="case-title-text">{delItem.title}</h3>

                <div className="case-legal-sections">
                  <span className="section-label">Under Sections:</span>
                  <code className="section-code">{delItem.sections}</code>
                </div>

                {/* Senior Directive Callout Box */}
                <div className="senior-directive-box">
                  <div className="directive-header">
                    <span className="directive-icon">⚡</span>
                    <strong>SENIOR MANDATE & DIRECTIVE:</strong>
                  </div>
                  <p className="directive-body">"{delItem.directive}"</p>
                </div>

                <div className="delegation-meta-row">
                  <div className="del-meta-cell">
                    <span className="m-label">Clearance Scope:</span>
                    <span className="m-val">{delItem.accessLevel}</span>
                  </div>
                  <div className="del-meta-cell">
                    <span className="m-label">Action Deadline:</span>
                    <span className="m-val highlight-deadline">{delItem.deadline}</span>
                  </div>
                </div>

                <div className="case-footer-row">
                  <div className="counts-badges">
                    <span className="stat-pill">🗂 {delItem.evidenceItems} Exhibits Shared</span>
                    <span className="stat-pill pill-restricted">Restricted Clearance</span>
                  </div>
                  <button
                    type="button"
                    className="view-dossier-btn btn-del"
                    onClick={() => setSelectedCase({ ...delItem, type: 'delegated' })}
                  >
                    Open Delegated Record ➔
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* CASE DETAILS MODAL */}
      {selectedCase && (
        <div className="case-modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="case-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="modal-doc-stamp">
                  {selectedCase.type === 'own'
                    ? 'PRIMARY INVESTIGATION DOSSIER'
                    : 'SUPERVISORY DELEGATED RECORD'}
                </span>
                <h3 className="modal-case-title">{selectedCase.firNumber}</h3>
                <p className="modal-case-sub">{selectedCase.title}</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedCase(null)}
              >
                ✕ Close Record
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="modal-section-box">
                <h4 className="modal-sec-head">1. Legal & Jurisdictional Registration</h4>
                <div className="modal-grid-two">
                  <div>
                    <strong>Applicable Sections:</strong> <code>{selectedCase.sections}</code>
                  </div>
                  <div>
                    <strong>Date of Entry:</strong> {selectedCase.date}
                  </div>
                  <div>
                    <strong>Case Status:</strong>{' '}
                    <span className={`status-pill pill-${selectedCase.statusLevel}`}>
                      {selectedCase.status}
                    </span>
                  </div>
                  <div>
                    <strong>Station Vault Unit:</strong> Central Police Station, Division I
                  </div>
                </div>
              </div>

              {selectedCase.type === 'delegated' && (
                <div className="modal-section-box directive-highlight">
                  <h4 className="modal-sec-head">2. Senior Officer Orders & Directives</h4>
                  <p>
                    <strong>Issued By:</strong> {selectedCase.delegatedBy} (
                    {selectedCase.seniorDesignation})
                  </p>
                  <div className="modal-quote">"{selectedCase.directive}"</div>
                  <p>
                    <strong>Clearance Level:</strong> {selectedCase.accessLevel}
                  </p>
                  <p>
                    <strong>Target Compliance Date:</strong> {selectedCase.deadline}
                  </p>
                </div>
              )}

              {selectedCase.type === 'own' && (
                <div className="modal-section-box">
                  <h4 className="modal-sec-head">2. Case Summary & Primary IO Notes</h4>
                  <p className="modal-summary-text">{selectedCase.summary}</p>
                  <p>
                    <strong>Complainant:</strong> {selectedCase.complainant}
                  </p>
                  <p>
                    <strong>Investigation Stage:</strong> {selectedCase.stage}
                  </p>
                  <p>
                    <strong>Lead IO:</strong> {selectedCase.ioName}
                  </p>
                </div>
              )}

              <div className="modal-section-box">
                <h4 className="modal-sec-head">3. Case Diary & Evidence Repository</h4>
                <div className="modal-grid-two">
                  <div className="repo-card">
                    <span className="repo-title">General Case Diary (CD)</span>
                    <span className="repo-count">
                      {selectedCase.caseDiaryEntries || 6} Registered CD Entries
                    </span>
                    <span className="repo-desc">
                      Consecutively numbered and verified in accordance with State Police Regulations.
                    </span>
                  </div>
                  <div className="repo-card">
                    <span className="repo-title">Malkhana & Forensic Exhibits</span>
                    <span className="repo-count">
                      {selectedCase.evidenceItems} Sealed Evidence Items
                    </span>
                    <span className="repo-desc">
                      Chain of custody verified with station brass seal and Road Certificate.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <span className="modal-audit-note">
                Access logged under User ID: {officer.pno} ({officer.name}) • Time:{' '}
                {new Date().toLocaleTimeString()}
              </span>
              <button
                type="button"
                className="gov-btn-primary"
                onClick={() => setSelectedCase(null)}
              >
                Close Case Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// APP ROUTING CONFIGURATION
// -------------------------------------------------------------
function App() {
  return (
    <Routes>
      {/* 1st Page: Role Selection */}
      <Route path="/" element={<RoleSelectionPage />} />
      {/* 2nd Page: Credentials Login */}
      <Route path="/login/:roleId" element={<LoginPage />} />
      {/* 3rd Page: Case Files Dashboard */}
      <Route path="/dashboard/:roleId" element={<DashboardPage />} />
      {/* Fallback to Role Selection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
