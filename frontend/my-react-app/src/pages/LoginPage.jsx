import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { organizations } from '../data/demsData'
import secretariatHeroImg from '../assets/secretariat_hero.jpg'

/**
 * Dedicated Login Page (Figma Page 1 Frame 3)
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const prefillUsername = searchParams.get('username') || ''
  const [username, setUsername] = useState(prefillUsername || 'sho_rajesh')
  const [password, setPassword] = useState('Password@123')
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.')
      return
    }

    let loggedUser = null

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

  const handleQuickDemo = (orgId, roleId) => {
    const org = organizations.find((o) => o.id === orgId)
    const role = org?.roles.find((r) => r.id === roleId)
    if (role) {
      setUsername(role.defaultUsername)
      setPassword('Password@123')
    }
  }

  return (
    <div className="auth-page-full-wrapper">
      <Navbar activePage="login" />

      <main
        className="auth-backdrop-stage"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 37, 64, 0.85) 0%, rgba(14, 51, 102, 0.88) 100%), url(${secretariatHeroImg})`,
        }}
      >
        <div className="auth-modal-card login-standalone-card">
          <div className="auth-modal-header navy-header">
            <div className="auth-title-left">
              <span className="auth-key-icon">🔑</span>
              <span className="auth-modal-title">OFFICER LOGIN</span>
            </div>
          </div>

          <form className="auth-modal-body" onSubmit={handleLoginSubmit}>
            <p className="auth-welcome-sub">
              Sign in with your official credentials to access the secure evidence vault.
            </p>

            {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}

            <div className="form-group">
              <label htmlFor="login-username" className="field-label">
                Username or Official Email: <span className="req">*</span>
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

            <div className="auth-remember-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            <button type="submit" className="btn-animated btn-auth-submit">
              Sign In to e-SAKSHYA Gateway ➔
            </button>

            {/* Quick Demo Test Profiles */}
            <div className="quick-demo-container">
              <span className="quick-demo-title">⚡ Quick Test Login Profiles:</span>
              <div className="demo-pills-row">
                <button
                  type="button"
                  className="btn-demo-pill"
                  onClick={() => handleQuickDemo('police', 'police_sho')}
                >
                  👮 Police: SHO Rajesh
                </button>
                <button
                  type="button"
                  className="btn-demo-pill"
                  onClick={() => handleQuickDemo('police', 'police_si')}
                >
                  🔍 Police: SI Vikramaditya
                </button>
                <button
                  type="button"
                  className="btn-demo-pill"
                  onClick={() => handleQuickDemo('forensics', 'fsl_digital')}
                >
                  🔬 Forensics: Prateek
                </button>
                <button
                  type="button"
                  className="btn-demo-pill"
                  onClick={() => handleQuickDemo('court', 'court_judge')}
                >
                  🏛️ Court: Justice Shastri
                </button>
              </div>
            </div>

            <div className="auth-bottom-switch">
              <span>New officer or department onboarding?</span>
              <Link to="/register" className="link-btn-switch">
                + Register Official Account
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
