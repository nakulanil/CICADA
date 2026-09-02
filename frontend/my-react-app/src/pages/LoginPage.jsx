import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CDACHeader from '../components/CDACHeader'
import CDACFooter from '../components/CDACFooter'
import { DEMSBadge } from '../components/DEMSLogo'
import { organizations } from '../data/demsData'

/**
 * Login Page
 * Credentials required: username, password (no Station LAN).
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const prefillUsername = searchParams.get('username') || ''
  const [username, setUsername] = useState(prefillUsername || 'sho_rajesh')
  const [password, setPassword] = useState('••••••••••••')
  const [errorMsg, setErrorMsg] = useState('')

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.')
      return
    }

    let loggedUser = null

    // Check in default organizations
    for (const org of organizations) {
      const match = org.roles.find(
        (r) =>
          r.defaultUsername.toLowerCase() === username.trim().toLowerCase() ||
          r.defaultEmail.toLowerCase() === username.trim().toLowerCase()
      )
      if (match) {
        loggedUser = {
          username: match.defaultUsername,
          name: match.defaultName,
          email: match.defaultEmail,
          pno: match.pno,
          orgId: org.id,
          orgName: org.name,
          roleId: match.id,
          roleName: match.name,
          cadre: match.cadre,
          station: match.station,
        }
        break
      }
    }

    // Check in localStorage
    if (!loggedUser) {
      try {
        const regUsers = JSON.parse(localStorage.getItem('dems_registered_users') || '[]')
        const found = regUsers.find(
          (u) =>
            u.username.toLowerCase() === username.trim().toLowerCase() ||
            u.email.toLowerCase() === username.trim().toLowerCase()
        )
        if (found) {
          loggedUser = found
        }
      } catch (err) {
        console.warn('Lookup error:', err)
      }
    }

    // Fallback
    if (!loggedUser) {
      loggedUser = {
        username: username.trim(),
        name: username.trim().toUpperCase(),
        email: `${username.trim()}@police.gov.in`,
        pno: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        orgId: 'police',
        orgName: 'Police Department (Law Enforcement)',
        roleId: 'police_sho',
        roleName: 'Station House Officer (SHO)',
        cadre: 'Supervisory Station In-Charge',
        station: 'Central Police Station, Division I',
      }
    }

    localStorage.setItem('dems_active_user', JSON.stringify(loggedUser))
    navigate('/dashboard')
  }

  const handleQuickSelectDemo = (orgId, roleId) => {
    const org = organizations.find((o) => o.id === orgId)
    const role = org?.roles.find((r) => r.id === roleId)
    if (role) {
      setUsername(role.defaultUsername)
      setPassword('Password@123')
    }
  }

  return (
    <div className="app-page-wrapper">
      <CDACHeader activePage="login" />

      <main className="site-container page-content-box">
        <div className="login-panel-shell">
          <div className="panel-header-bar login-header-bar">
            <DEMSBadge size={40} />
            <div>
              <h1 className="panel-main-title">Officer Login</h1>
              <span className="panel-subtitle">Sign in with your username and password</span>
            </div>
          </div>

          {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}

          <form className="clean-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-username" className="field-label">
                Username / Email: <span className="req">*</span>
              </label>
              <input
                id="login-username"
                type="text"
                className="input-text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="field-label">
                Password: <span className="req">*</span>
              </label>
              <input
                id="login-password"
                type="password"
                className="input-text"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit-action btn-block">
              Sign In ➔
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="quick-demo-box">
            <span className="quick-demo-label">Quick Test Login Profiles:</span>
            <div className="quick-demo-buttons">
              <button
                type="button"
                className="btn-demo-tag"
                onClick={() => handleQuickSelectDemo('police', 'police_sho')}
              >
                👮 Police: SHO Rajesh
              </button>
              <button
                type="button"
                className="btn-demo-tag"
                onClick={() => handleQuickSelectDemo('police', 'police_si')}
              >
                🔍 Police: SI Vikramaditya (IO)
              </button>
              <button
                type="button"
                className="btn-demo-tag"
                onClick={() => handleQuickSelectDemo('forensics', 'fsl_digital')}
              >
                🔬 Forensics: Prateek (FSL)
              </button>
              <button
                type="button"
                className="btn-demo-tag"
                onClick={() => handleQuickSelectDemo('prosecution', 'pro_cpp')}
              >
                ⚖️ Prosecution: Adv. Bhardwaj
              </button>
              <button
                type="button"
                className="btn-demo-tag"
                onClick={() => handleQuickSelectDemo('court', 'court_judge')}
              >
                🏛️ Court: Justice Shastri
              </button>
            </div>
          </div>

          <div className="login-bottom-links">
            <span>Don't have an account?</span>
            <Link to="/register" className="link-register">
              + Register here
            </Link>
          </div>
        </div>
      </main>

      <CDACFooter />
    </div>
  )
}
