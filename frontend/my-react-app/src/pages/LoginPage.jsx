import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { organizations } from '../data/demsData'
import { authenticatePrototypeUser } from '../utils/auth'
import secretariatHeroImg from '../assets/secretariat_hero.jpg'

/**
 * Dedicated Login Page (Figma Page 1 Frame 3)
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const prefillUsername = searchParams.get('username') || ''
  const [username, setUsername] = useState(prefillUsername)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  useEffect(() => {
    if (prefillUsername) {
      passwordRef.current?.focus()
    }
  }, [prefillUsername])

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username.trim()) {
      setErrorMsg('Please enter both username and password.')
      usernameRef.current?.focus()
      return
    }

    if (!password) {
      setErrorMsg('Please enter both username and password.')
      passwordRef.current?.focus()
      return
    }

    const loggedUser = authenticatePrototypeUser(username, password)

    if (!loggedUser) {
      setErrorMsg('Invalid username/email or password.')
      return
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
              <svg className="auth-title-svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3" />
                <rect x="4.5" y="10" width="15" height="10" rx="1.5" />
                <path d="M12 14v2" />
              </svg>
              <span className="auth-modal-title">OFFICER LOGIN</span>
            </div>
          </div>

          <form className="auth-modal-body" onSubmit={handleLoginSubmit} noValidate>
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
                ref={usernameRef}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="field-label">
                Password: <span className="req">*</span>
              </label>
              <div className="password-field-wrapper">
                <input
                  id="login-password"
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  className="input-text"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={showPassword ? 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12ZM3 3l18 18' : 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z'} />
                    {!showPassword && <circle cx="12" cy="12" r="2.5" />}
                  </svg>
                </button>
              </div>
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
