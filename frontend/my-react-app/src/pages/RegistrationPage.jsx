import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { organizations } from '../data/demsData'
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

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!username.trim() || !fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (!acceptDeclaration) {
      setErrorMsg('You must declare official authorization under MHA guidelines.')
      return
    }

    const selectedRole = currentOrg.roles.find((r) => r.id === selectedRoleId) || currentOrg.roles[0]

    const newUser = {
      username: username.trim(),
      name: fullName.trim(),
      email: email.trim(),
      password: password,
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
              <span className="auth-key-icon">👤</span>
              <span className="auth-modal-title">OFFICER REGISTRATION</span>
            </div>
          </div>

          <form className="auth-modal-body" onSubmit={handleRegisterSubmit}>
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
                  type="email"
                  className="input-text"
                  placeholder="sho.central@police.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-reg-badge" className="field-label">
                  Officer ID / Belt No.:
                </label>
                <input
                  id="p-reg-badge"
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
                <label htmlFor="p-reg-pass" className="field-label">
                  Security Password: <span className="req">*</span>
                </label>
                <input
                  id="p-reg-pass"
                  type="password"
                  className="input-text"
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-reg-cpass" className="field-label">
                  Confirm Password: <span className="req">*</span>
                </label>
                <input
                  id="p-reg-cpass"
                  type="password"
                  className="input-text"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-remember-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptDeclaration}
                  onChange={(e) => setAcceptDeclaration(e.target.checked)}
                />
                <span>I certify official authorization under the Official Secrets Act & MHA guidelines.</span>
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
