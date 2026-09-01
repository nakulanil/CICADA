import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { policeRoles } from '../data/policeData'
import PoliceEmblem from '../components/PoliceEmblem'
import RankInsigniaBadge from '../components/RankInsigniaBadge'

/**
 * Page 2: Official Credentials Login Page
 * Official verification interface for entering PNO, Name, Password, Shift, and Terminal
 */
export default function LoginPage() {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const role = policeRoles.find((item) => item.id === roleId) || policeRoles[0]
  const officer = role.defaultOfficer

  const [pnoInput, setPnoInput] = useState(officer.pno)
  const [officerName, setOfficerName] = useState(officer.name)
  const [password, setPassword] = useState('••••••••••••')
  const [stationShift, setStationShift] = useState('Day Shift (08:00 - 20:00 hrs)')
  const [terminalCode] = useState('CPS-LAN-NODE-07')

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
                <span className="field-hint">Logs active shift hours in the Station Daily General Diary</span>
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

          {/* Statutory Warning */}
          <div className="official-statute-warning">
            <strong>OFFICIAL STATUTORY WARNING:</strong> This system is exclusively for authorized police personnel in the discharge of official duties. Unauthorized access or falsification of case diaries is punishable under Section 43 & 66 of the Information Technology Act, 2000 and Section 166/218 of the Indian Penal Code / Bharatiya Nyaya Sanhita.
          </div>
        </div>
      </main>
    </div>
  )
}

