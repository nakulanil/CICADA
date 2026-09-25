import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authenticatePrototypeUser } from '../utils/auth'

/**
 * Officer Login Modal Dialog (Exact Figma Page 1 Frame 3)
 * Centered white card on blurred Secretariat backdrop with a secure login header
 */
export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [focusPasswordOnOpen, setFocusPasswordOnOpen] = useState(false)
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  useEffect(() => {
    const handleRegistrationLogin = (event) => {
      setUsername(event.detail.username)
      setFocusPasswordOnOpen(true)
    }

    window.addEventListener('auth:registration-login', handleRegistrationLogin)
    return () => window.removeEventListener('auth:registration-login', handleRegistrationLogin)
  }, [])

  useEffect(() => {
    if (isOpen && focusPasswordOnOpen) {
      passwordRef.current?.focus()
      setFocusPasswordOnOpen(false)
    }
  }, [isOpen, focusPasswordOnOpen])

  if (!isOpen) return null

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
    onClose()
    navigate('/dashboard')
  }

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-figma-card login-figma-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="auth-figma-header">
          <h2 className="auth-figma-title">
            <svg className="auth-title-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3" />
              <rect x="4.5" y="10" width="15" height="10" rx="1.5" />
              <path d="M12 14v2" />
            </svg>
            <span>LOGIN</span>
          </h2>
          <button type="button" className="btn-figma-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form className="auth-figma-form" onSubmit={handleLoginSubmit} noValidate>
          {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}

          <div className="figma-input-wrapper figma-login-field-group">
            <label htmlFor="modal-login-username" className="figma-field-label">
              Username / Official Email
            </label>
            <input
              id="modal-login-username"
              type="text"
              className="figma-input-gray"
              placeholder="Username / Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={usernameRef}
              autoFocus
            />
          </div>

          <div className="figma-input-wrapper figma-login-field-group">
            <label htmlFor="modal-login-password" className="figma-field-label">
              Password
            </label>
            <div className="password-field-wrapper figma-password-field-wrapper">
              <input
                id="modal-login-password"
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                className="figma-input-gray"
                placeholder="Password"
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

          <div className="figma-auth-options-row">
            <label className="figma-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className="btn-animated btn-figma-submit">
            Log In
          </button>

          <div className="figma-auth-footer-switch">
            <span>New officer or agency?</span>
            <button
              type="button"
              className="btn-figma-link"
              onClick={onSwitchToRegister}
            >
              + Register Official Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
