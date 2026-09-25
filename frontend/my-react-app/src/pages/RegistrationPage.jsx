import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { organizations } from '../data/demsData'
import { registerPrototypeUser } from '../utils/auth'
import secretariatHeroImg from '../assets/secretariat_hero.jpg'

/**
 * Dedicated Registration Page (Figma Page 1 Frame 4)
 */
export default function RegistrationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialOrgId = searchParams.get('org') || 'police'
  const [selectedOrgId, setSelectedOrgId] = useState(initialOrgId)
  const currentOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0]

  const [selectedRoleId, setSelectedRoleId] = useState(currentOrg.roles[0]?.id || '')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [badgeId, setBadgeId] = useState('')
  const [contactNo, setContactNo] = useState('')
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
  const usernameRef = useRef(null)
  const emailRef = useRef(null)
  const badgeIdRef = useRef(null)
  const contactNoRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  const declarationRef = useRef(null)

  useEffect(() => {
    if (currentOrg && currentOrg.roles.length > 0) {
      setSelectedRoleId(currentOrg.roles[0].id)
    }
  }, [selectedOrgId])

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

    if (!username.trim()) {
      setErrorMsg('Username is required.')
      usernameRef.current?.focus()
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
      setErrorMsg('You must declare official authorization under MHA guidelines.')
      declarationRef.current?.focus()
      return
    }

    const selectedRole = currentOrg.roles.find((r) => r.id === selectedRoleId) || currentOrg.roles[0]

    const newUser = {
      username: username.trim(),
      name: fullName.trim(),
      email: email.trim(),
      password: password,
      phone: contactNo.trim(),
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

    setSuccessMsg('Registration successful! Redirecting to login gateway...')
    setTimeout(() => {
      navigate(`/login?username=${encodeURIComponent(username.trim())}`)
    }, 1100)
  }

  return (
    <div className="auth-page-full-wrapper">
      <Navbar activePage="register" />

      <main
        className="auth-backdrop-stage"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 37, 64, 0.85) 0%, rgba(14, 51, 102, 0.88) 100%), url(${secretariatHeroImg})`,
        }}
      >
        <div className="auth-modal-card register-standalone-card">
          <div className="auth-modal-header navy-header">
            <div className="auth-title-left">
              <svg className="auth-title-svg" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
                <circle cx="12" cy="9" r="2.5" />
                <path d="M8.5 16c.9-1.2 2-1.8 3.5-1.8s2.6.6 3.5 1.8" />
              </svg>
              <span className="auth-modal-title">OFFICER REGISTRATION</span>
            </div>
          </div>

          <form className="auth-modal-body" onSubmit={handleRegisterSubmit} noValidate>
            <p className="auth-welcome-sub">
              Create an authenticated official account for evidence intake and directive handling.
            </p>

            {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}
            {successMsg && <div className="msg-box msg-success">{successMsg}</div>}

            <div className="form-grid-two">
              <div className="form-group">
                <label htmlFor="p-reg-org" className="field-label">
                  Department / Agency: <span className="req">*</span>
                </label>
                <select
                  id="p-reg-org"
                  ref={organizationRef}
                  className="input-select"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="p-reg-role" className="field-label">
                  Designated Rank / Role: <span className="req">*</span>
                </label>
                <select
                  id="p-reg-role"
                  ref={roleRef}
                  className="input-select"
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                >
                  {currentOrg.roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.cadre})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label htmlFor="p-reg-name" className="field-label">
                  Full Official Name: <span className="req">*</span>
                </label>
                <input
                  id="p-reg-name"
                  ref={fullNameRef}
                  type="text"
                  className="input-text"
                  placeholder="e.g. Rajesh Kumar Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-reg-username" className="field-label">
                  Portal Username: <span className="req">*</span>
                </label>
                <input
                  id="p-reg-username"
                  ref={usernameRef}
                  type="text"
                  className="input-text"
                  placeholder="e.g. sho_rajesh"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label htmlFor="p-reg-email" className="field-label">
                  Official Email (@gov.in / @nic.in): <span className="req">*</span>
                </label>
                <input
                  id="p-reg-email"
                  ref={emailRef}
                  type="email"
                  className="input-text"
                  placeholder="sho.central@police.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-reg-badge" className="field-label">
                  Badge / Officer ID: <span className="req">*</span>
                </label>
                <input
                  id="p-reg-badge"
                  ref={badgeIdRef}
                  type="text"
                  className="input-text"
                  placeholder="e.g. DL-481902"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label htmlFor="p-reg-contact" className="field-label">
                  Contact Number: <span className="req">*</span>
                </label>
                <input
                  id="p-reg-contact"
                  ref={contactNoRef}
                  type="tel"
                  className="input-text"
                  placeholder="Enter contact number"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label htmlFor="p-reg-pass" className="field-label">
                  Security Password: <span className="req">*</span>
                </label>
                <div className="password-field-wrapper">
                  <input
                    id="p-reg-pass"
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    className="input-text"
                    placeholder="Create secure password"
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

              <div className="form-group">
                <label htmlFor="p-reg-cpass" className="field-label">
                  Confirm Password: <span className="req">*</span>
                </label>
                <div className="password-field-wrapper">
                  <input
                    id="p-reg-cpass"
                    ref={confirmPasswordRef}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input-text"
                    placeholder="Repeat password"
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

            <div className="auth-remember-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptDeclaration}
                  ref={declarationRef}
                  onChange={(e) => setAcceptDeclaration(e.target.checked)}
                />
                <span>I certify official authorization under the Official Secrets Act & MHA guidelines. <span className="req">*</span></span>
              </label>
            </div>

            <button type="submit" className="btn-animated btn-auth-submit">
              Register Official Account ➔
            </button>

            <div className="auth-bottom-switch">
              <span>Already registered with e-SAKSHYA?</span>
              <Link to="/login" className="link-btn-switch">
                Sign In to Existing Account ➔
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
