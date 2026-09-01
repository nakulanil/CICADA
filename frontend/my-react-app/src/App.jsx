import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'

const roles = [
  {
    id: 'inspector',
    name: 'Inspector',
    department: 'Criminal Investigations Unit',
    summary: 'Case files, investigation notes, and evidence records for active investigations.',
    accent: '#f59e0b',
    emailDomain: 'police.gov',
    metrics: [
      { label: 'Open cases', value: '842' },
      { label: 'Evidence logs', value: '118k' },
      { label: 'Case closure', value: '94.7%' },
    ],
  },
  {
    id: 'officer',
    name: 'Station Officer',
    department: 'Operations & Patrol Desk',
    summary: 'Daily patrol records, incident reports, and operational dispatch documentation.',
    accent: '#3b82f6',
    emailDomain: 'police.gov',
    metrics: [
      { label: 'Incidents', value: '9.4k' },
      { label: 'Dispatch logs', value: '1.3k' },
      { label: 'Response time', value: '12 min' },
    ],
  },
  {
    id: 'records',
    name: 'Records Clerk',
    department: 'Records Management Division',
    summary: 'Official reports, archive requests, filing records, and retention schedules.',
    accent: '#22c55e',
    emailDomain: 'police.gov',
    metrics: [
      { label: 'Reports filed', value: '2,184' },
      { label: 'Archived docs', value: '77k' },
      { label: 'Retention', value: '100%' },
    ],
  },
]

function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate(`/login/${selectedRole.id}`)
  }

  return (
    <div className="page-shell">
      <div className="single-panel">
        <div className="panel-header">
          <div className="brand-mark">G</div>
          <div>
            <p className="eyebrow">Police station secure access</p>
            <h1>Station Vault</h1>
          </div>
        </div>

        <div className="section-copy">
          <p className="welcome">Access portal</p>
          <h2>Select your station role</h2>
        </div>

        <div className="role-grid">
          {roles.map((role) => {
            const getIcon = (roleId) => {
              const icons = {
                inspector: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                ),
                officer: (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 8c-4 0-8 2-8 4v3h16v-3c0-2-4-4-8-4z" />
                  </svg>
                ),
                records: (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H4zm2 2h10v2H6V7zm0 4h10v2H6v-2zm0 4h6v2H6v-2z" />
                  </svg>
                ),
              }
              return icons[roleId] || icons.inspector
            }

            return (
              <button
                key={role.id}
                type="button"
                className={`role-icon-btn ${selectedRole.id === role.id ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role)}
                title={role.name}
              >
                <div className="icon-badge" style={{ background: role.accent }}>
                  <span className="icon-symbol">{getIcon(role.id)}</span>
                </div>
                <span className="icon-label">{role.name}</span>
              </button>
            )
          })}
        </div>


        <button 
          type="button" 
          className="primary-button" 
          onClick={handleContinue}
          style={{ background: selectedRole.accent }}
        >
          Continue to {selectedRole.name} login
        </button>

        <div className="security-note">
          <span className="status-dot" aria-hidden="true" />
          Protected by multi-factor authentication and audit logging
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  const { roleId } = useParams()
  const role = roles.find((item) => item.id === roleId) || roles[0]
  const navigate = useNavigate()

  return (
    <div className="page-shell">
      <div className="single-panel login-panel">
        <div className="panel-header compact-header">
          <div
            className="brand-mark"
            style={{ background: `linear-gradient(135deg, ${role.accent}, #dde6e2)` }}
          >
            {role.name.charAt(0)}
          </div>
          <div>
            <p className="eyebrow">{role.department}</p>
            <h1>{role.name}</h1>
          </div>
        </div>

        <div className="section-copy">
          <p className="welcome">Station access</p>
          <h2>Sign in to your records portal</h2>
        </div>

        <form className="login-form">
          <label className="input-group">
            <span>Station email</span>
            <input type="email" placeholder="name@police.gov" defaultValue={`officer@${role.emailDomain}`} />
          </label>

          <label className="input-group">
            <span>Password</span>
            <input type="password" placeholder="Enter your password" defaultValue="••••••••••" />
          </label>

          <div className="form-row">
            <label className="checkbox-wrap">
              <input type="checkbox" defaultChecked />
              <span>Keep access active</span>
            </label>
            <button type="button" className="link-button" onClick={() => navigate('/')}>
              Change role
            </button>
          </div>

          <button type="submit" className="primary-button">
            Open {role.name} archive
          </button>
        </form>

        <div className="security-note">
          <span className="status-dot" aria-hidden="true" />
          Role-specific access enabled with internal audit controls
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/login/:roleId" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
