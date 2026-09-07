import React, { useState, useEffect } from 'react'
import { organizations } from '../data/demsData'

/**
 * Officer Registration Modal Dialog (Exact Figma Page 1 Frame 4)
 * Centered white card on blurred Secretariat backdrop with REGISTER 👤 header
 */
export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [selectedOrgId, setSelectedOrgId] = useState('police')
  const currentOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0]
  const [selectedRoleId, setSelectedRoleId] = useState(currentOrg.roles[0]?.id || '')

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [badgeId, setBadgeId] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptDeclaration, setAcceptDeclaration] = useState(true)

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (currentOrg && currentOrg.roles.length > 0) {
      setSelectedRoleId(currentOrg.roles[0].id)
    }
  }, [selectedOrgId])

  if (!isOpen) return null

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (!acceptDeclaration) {
      setErrorMsg('You must declare official authorization to register.')
      return
    }

    const selectedRole = currentOrg.roles.find((r) => r.id === selectedRoleId) || currentOrg.roles[0]
    const derivedUsername = username.trim() || fullName.trim().toLowerCase().replace(/\s+/g, '_')

    const newUser = {
      username: derivedUsername,
      name: fullName.trim(),
      email: email.trim(),
      password: password,
      phone: contactNo.trim() || '+91 98110 00000',
      pno: badgeId.trim() || `${currentOrg.badgePrefix}-${Math.floor(100000 + Math.random() * 900000)}`,
      orgId: selectedOrgId,
      orgName: currentOrg.name,
      roleId: selectedRoleId,
      roleName: selectedRole.name,
      cadre: selectedRole.cadre,
      station: selectedRole.station,
      registeredAt: new Date().toISOString(),
    }

    try {
      const existingUsers = JSON.parse(localStorage.getItem('dems_registered_users') || '[]')
      existingUsers.push(newUser)
      localStorage.setItem('dems_registered_users', JSON.stringify(existingUsers))
    } catch (err) {
      console.warn('LocalStorage save error:', err)
    }

    setSuccessMsg('Official registration successful! Redirecting to login...')
    setTimeout(() => {
      if (onSwitchToLogin) {
        onSwitchToLogin()
      } else {
        onClose()
      }
    }, 1000)
  }

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-figma-card register-figma-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="auth-figma-header">
          <h2 className="auth-figma-title">
            REGISTER <span className="auth-figma-icon">👤</span>
          </h2>
          <button type="button" className="btn-figma-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form className="auth-figma-form" onSubmit={handleRegisterSubmit}>
          {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}
          {successMsg && <div className="msg-box msg-success">{successMsg}</div>}

          {/* Row 1: Select Organisation */}
          <div className="figma-input-wrapper">
            <select
              className="figma-input-gray"
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  Select Organisation: {org.name}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Select Role */}
          <div className="figma-input-wrapper">
            <select
              className="figma-input-gray"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              {currentOrg.roles.map((r) => (
                <option key={r.id} value={r.id}>
                  Select Role: {r.name} ({r.cadre})
                </option>
              ))}
            </select>
          </div>

          {/* Row 3: Full Official Name */}
          <div className="figma-input-wrapper">
            <input
              type="text"
              className="figma-input-gray"
              placeholder="Full Official Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Row 4: Badge ID | Contact Number */}
          <div className="figma-grid-two">
            <input
              type="text"
              className="figma-input-gray"
              placeholder="Badge / Officer ID"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
            />
            <input
              type="tel"
              className="figma-input-gray"
              placeholder="Contact Number"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
            />
          </div>

          {/* Row 5: Official Email */}
          <div className="figma-input-wrapper">
            <input
              type="email"
              className="figma-input-gray"
              placeholder="Official Email (@gov.in / @nic.in)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Row 6: Password | Confirm Password */}
          <div className="figma-grid-two">
            <input
              type="password"
              className="figma-input-gray"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="figma-input-gray"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="figma-auth-options-row">
            <label className="figma-checkbox-label">
              <input
                type="checkbox"
                checked={acceptDeclaration}
                onChange={(e) => setAcceptDeclaration(e.target.checked)}
              />
              <span>I declare official authorization under MHA guidelines.</span>
            </label>
          </div>

          <button type="submit" className="btn-animated btn-figma-submit">
            Create Account
          </button>

          <div className="figma-auth-footer-switch">
            <span>Already registered with e-SAKSHYA?</span>
            <button
              type="button"
              className="btn-figma-link"
              onClick={onSwitchToLogin}
            >
              Sign In to Existing Account ➔
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
