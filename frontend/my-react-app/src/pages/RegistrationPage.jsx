import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CDACHeader from '../components/CDACHeader'
import CDACFooter from '../components/CDACFooter'
import { organizations } from '../data/demsData'

/**
 * Registration Page
 * Organization dropdown -> Role dropdown
 * Credentials required: username, first & last name, email, password.
 */
export default function RegistrationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialOrgId = searchParams.get('org') || 'police'
  const [selectedOrgId, setSelectedOrgId] = useState(initialOrgId)
  const currentOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0]

  const [selectedRoleId, setSelectedRoleId] = useState(currentOrg.roles[0]?.id || '')

  // Form Fields
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Update role dropdown when organization changes
  useEffect(() => {
    if (currentOrg && currentOrg.roles.length > 0) {
      setSelectedRoleId(currentOrg.roles[0].id)
    }
  }, [selectedOrgId])

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    const selectedRole = currentOrg.roles.find((r) => r.id === selectedRoleId) || currentOrg.roles[0]

    const newUser = {
      username: username.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password,
      orgId: selectedOrgId,
      orgName: currentOrg.name,
      roleId: selectedRoleId,
      roleName: selectedRole.name,
      cadre: selectedRole.cadre,
      pno: `${currentOrg.badgePrefix}-${Math.floor(100000 + Math.random() * 900000)}`,
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

    setSuccessMsg('Registration successful! Redirecting to login...')
    setTimeout(() => {
      navigate(`/login?username=${encodeURIComponent(username.trim())}`)
    }, 1000)
  }

  return (
    <div className="app-page-wrapper">
      <CDACHeader activePage="register" />

      <main className="site-container page-content-box">
        <div className="form-panel-shell">
          <div className="panel-header-bar">
            <h1 className="panel-main-title">User Registration</h1>
            <span className="panel-subtitle">Create an official account to access case files and directives</span>
          </div>

          {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}
          {successMsg && <div className="msg-box msg-success">{successMsg}</div>}

          <form className="clean-form" onSubmit={handleRegisterSubmit}>
            {/* Step 1: Organization Dropdown */}
            <div className="form-group">
              <label htmlFor="orgSelect" className="field-label">
                Select Organization: <span className="req">*</span>
              </label>
              <select
                id="orgSelect"
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

            {/* Step 2: Role Dropdown (Dynamically Loaded) */}
            <div className="form-group">
              <label htmlFor="roleSelect" className="field-label">
                Select Role in {currentOrg.name}: <span className="req">*</span>
              </label>
              <select
                id="roleSelect"
                className="input-select"
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                required
              >
                {currentOrg.roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.cadre})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Required Credentials */}
            <div className="form-group">
              <label htmlFor="username" className="field-label">
                Username: <span className="req">*</span>
              </label>
              <input
                id="username"
                type="text"
                className="input-text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="firstName" className="field-label">
                  First Name: <span className="req">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="input-text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="field-label">
                  Last Name: <span className="req">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="input-text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="field-label">
                Email Address: <span className="req">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="input-text"
                placeholder="name@organization.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="password" className="field-label">
                  Password: <span className="req">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  className="input-text"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="field-label">
                  Confirm Password: <span className="req">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="input-text"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-actions-bar">
              <Link to="/login" className="link-back-login">
                ← Already registered? Sign in
              </Link>
              <button type="submit" className="btn-submit-action">
                Register Account ➔
              </button>
            </div>
          </form>
        </div>
      </main>

      <CDACFooter />
    </div>
  )
}
