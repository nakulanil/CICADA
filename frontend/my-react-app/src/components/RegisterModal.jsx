import React, { useEffect, useRef, useState } from 'react'
import { organizations } from '../data/demsData'
import { registerPrototypeUser } from '../utils/auth'

/**
 * Officer Registration Modal Dialog (Exact Figma Page 1 Frame 4)
 * Centered white card on blurred Secretariat backdrop with a secure registration header
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const organizationRef = useRef(null)
  const roleRef = useRef(null)
  const fullNameRef = useRef(null)
  const badgeIdRef = useRef(null)
  const contactNoRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  const declarationRef = useRef(null)

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

    if (!selectedOrgId) {
      setErrorMsg('Organisation is required.')
      organizationRef.current?.focus()
      return
    }

    if (!selectedRoleId) {
      setErrorMsg('Role is required.')
      roleRef.current?.focus()
      return
    }

    if (!fullName.trim()) {
      setErrorMsg('Full name is required.')
      fullNameRef.current?.focus()
      return
    }

    if (!badgeId.trim()) {
      setErrorMsg('Badge / Officer ID is required.')
      badgeIdRef.current?.focus()
      return
    }

    if (!contactNo.trim()) {
      setErrorMsg('Contact number is required.')
      contactNoRef.current?.focus()
      return
    }

    if (!email.trim()) {
      setErrorMsg('Official email is required.')
      emailRef.current?.focus()
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid official email address.')
      emailRef.current?.focus()
      return
    }

    if (!password) {
      setErrorMsg('Password is required.')
      passwordRef.current?.focus()
      return
    }

    if (!confirmPassword) {
      setErrorMsg('Please confirm your password.')
      confirmPasswordRef.current?.focus()
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      confirmPasswordRef.current?.focus()
      return
    }

    if (!acceptDeclaration) {
      setErrorMsg('You must declare official authorization to register.')
      declarationRef.current?.focus()
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
      const registrationResult = registerPrototypeUser(newUser)
      if (!registrationResult.ok) {
        setErrorMsg(registrationResult.error)
        return
      }
    } catch (err) {
      console.warn('LocalStorage save error:', err)
    }

    setSuccessMsg('Official registration successful! Redirecting to login...')
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('auth:registration-login', {
        detail: { username: derivedUsername },
      }))
      if (onSwitchToLogin) {
        onSwitchToLogin(derivedUsername)
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
            <svg className="auth-title-svg" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
              <circle cx="12" cy="9" r="2.5" />
              <path d="M8.5 16c.9-1.2 2-1.8 3.5-1.8s2.6.6 3.5 1.8" />
            </svg>
            <span>REGISTER</span>
          </h2>
          <button type="button" className="btn-figma-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form className="auth-figma-form" onSubmit={handleRegisterSubmit} noValidate>
          {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}
          {successMsg && <div className="msg-box msg-success">{successMsg}</div>}

          {/* Row 1: Select Organisation */}
          <div className="figma-input-wrapper figma-field-group">
            <label htmlFor="modal-reg-org" className="figma-field-label">
              Organisation <span className="req">*</span>
            </label>
            <select
              id="modal-reg-org"
              ref={organizationRef}
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
          <div className="figma-input-wrapper figma-field-group">
            <label htmlFor="modal-reg-role" className="figma-field-label">
              Role <span className="req">*</span>
            </label>
            <select
              id="modal-reg-role"
              ref={roleRef}
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
          <div className="figma-input-wrapper figma-field-group">
            <label htmlFor="modal-reg-name" className="figma-field-label">
              Full Name <span className="req">*</span>
            </label>
            <input
              id="modal-reg-name"
              ref={fullNameRef}
              type="text"
              className="figma-input-gray"
              placeholder="Full Official Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Row 4: Badge ID | Contact Number */}
          <div className="figma-grid-two">
            <div className="figma-field-group">
              <label htmlFor="modal-reg-badge" className="figma-field-label">
                Badge / Officer ID <span className="req">*</span>
              </label>
              <input
                id="modal-reg-badge"
                ref={badgeIdRef}
                type="text"
                className="figma-input-gray"
                placeholder="Badge / Officer ID"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
              />
            </div>
            <div className="figma-field-group">
              <label htmlFor="modal-reg-contact" className="figma-field-label">
                Contact Number <span className="req">*</span>
              </label>
              <input
                id="modal-reg-contact"
                ref={contactNoRef}
                type="tel"
                className="figma-input-gray"
                placeholder="Contact Number"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
              />
            </div>
          </div>

          {/* Row 5: Official Email */}
          <div className="figma-input-wrapper figma-field-group">
            <label htmlFor="modal-reg-email" className="figma-field-label">
              Official Email <span className="req">*</span>
            </label>
            <input
              id="modal-reg-email"
              ref={emailRef}
              type="email"
              className="figma-input-gray"
              placeholder="Official Email (@gov.in / @nic.in)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Row 6: Password | Confirm Password */}
          <div className="figma-grid-two">
            <div className="figma-field-group">
              <label htmlFor="modal-reg-password" className="figma-field-label">
                Password <span className="req">*</span>
              </label>
              <div className="password-field-wrapper figma-password-field-wrapper">
                <input
                  id="modal-reg-password"
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
            <div className="figma-field-group">
              <label htmlFor="modal-reg-confirm-password" className="figma-field-label">
                Confirm Password <span className="req">*</span>
              </label>
              <div className="password-field-wrapper figma-password-field-wrapper">
                <input
                  id="modal-reg-confirm-password"
                  ref={confirmPasswordRef}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="figma-input-gray"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={showConfirmPassword ? 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12ZM3 3l18 18' : 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z'} />
                    {!showConfirmPassword && <circle cx="12" cy="12" r="2.5" />}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="figma-auth-options-row">
            <label className="figma-checkbox-label">
              <input
                type="checkbox"
                checked={acceptDeclaration}
                ref={declarationRef}
                onChange={(e) => setAcceptDeclaration(e.target.checked)}
              />
              <span>I declare official authorization under MHA guidelines. <span className="req">*</span></span>
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
