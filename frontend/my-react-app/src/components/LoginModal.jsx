import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { organizations } from '../data/demsData'

/**
 * Officer Login Modal Dialog (Exact Figma Page 1 Frame 3)
 * Centered white card on blurred Secretariat backdrop with LOGIN 🔑 header
 */
export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('sho_rajesh')
  const [password, setPassword] = useState('Password@123')
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

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
    onClose()
    navigate('/dashboard')
  }

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-figma-card login-figma-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="auth-figma-header">
          <h2 className="auth-figma-title">
            LOGIN <span className="auth-figma-icon">🔑</span>
          </h2>
          <button type="button" className="btn-figma-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form className="auth-figma-form" onSubmit={handleLoginSubmit}>
          {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}

          <div className="figma-input-wrapper">
            <input
              type="text"
              className="figma-input-gray"
              placeholder="Username / Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="figma-input-wrapper">
            <input
              type="password"
              className="figma-input-gray"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
