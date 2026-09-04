import React, { useState } from 'react'

/**
 * Profile Viewer & Account Settings Modal
 * Early 2010s styled dialog for viewing and updating username, email, name, and password
 */
export default function ProfileViewerModal({ isOpen, currentUser, onClose, onUpdateUser }) {
  const [username, setUsername] = useState(currentUser?.username || '')
  const [name, setName] = useState(currentUser?.name || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen || !currentUser) return null

  const handleSave = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!username.trim() || !name.trim() || !email.trim()) {
      setErrorMsg('Username, Name, and Email cannot be empty.')
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.')
      return
    }

    const updatedUser = {
      ...currentUser,
      username: username.trim(),
      name: name.trim(),
      email: email.trim(),
      ...(newPassword ? { password: newPassword } : {}),
    }

    // Save to LocalStorage
    try {
      localStorage.setItem('dems_active_user', JSON.stringify(updatedUser))

      const regUsers = JSON.parse(localStorage.getItem('dems_registered_users') || '[]')
      const userIndex = regUsers.findIndex(
        (u) => u.username?.toLowerCase() === currentUser.username?.toLowerCase()
      )
      if (userIndex !== -1) {
        regUsers[userIndex] = { ...regUsers[userIndex], ...updatedUser }
        localStorage.setItem('dems_registered_users', JSON.stringify(regUsers))
      }
    } catch (err) {
      console.warn('Profile save error:', err)
    }

    if (onUpdateUser) {
      onUpdateUser(updatedUser)
    }

    setSuccessMsg('Profile updated successfully!')
    setTimeout(() => {
      onClose()
    }, 900)
  }

  return (
    <div className="dems-modal-backdrop" onClick={onClose}>
      <div className="profile-viewer-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="profile-modal-top">
          <div className="p-modal-title-row">
            <span className="p-modal-icon">👤</span>
            <div>
              <h3 className="p-modal-title">Officer Profile & Account Settings</h3>
              <span className="p-modal-sub">View and update your official credentials</span>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} title="Done">
            Done
          </button>
        </div>

        {/* Modal Body */}
        <form className="profile-modal-body" onSubmit={handleSave}>
          {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}
          {successMsg && <div className="msg-box msg-success">{successMsg}</div>}

          {/* Official Designation Info (Read-Only) */}
          <div className="profile-info-strip">
            <div className="info-cell">
              <span className="info-lbl">Organization:</span>
              <strong className="info-txt">{currentUser.orgName}</strong>
            </div>
            <div className="info-cell">
              <span className="info-lbl">Official Rank:</span>
              <strong className="info-txt">{currentUser.roleName}</strong>
            </div>
            <div className="info-cell">
              <span className="info-lbl">PNO / Belt No.:</span>
              <span className="badge-pno-view">{currentUser.pno || 'N/A'}</span>
            </div>
          </div>

          {/* Editable Credentials */}
          <div className="profile-fields-grid">
            <div className="form-group">
              <label htmlFor="pv-username" className="field-label">
                Username: <span className="req">*</span>
              </label>
              <input
                id="pv-username"
                type="text"
                className="input-text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pv-name" className="field-label">
                Full Name / Display Name: <span className="req">*</span>
              </label>
              <input
                id="pv-name"
                type="text"
                className="input-text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group span-full">
              <label htmlFor="pv-email" className="field-label">
                Official Email Address: <span className="req">*</span>
              </label>
              <input
                id="pv-email"
                type="email"
                className="input-text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pv-newpass" className="field-label">
                New Password (Optional):
              </label>
              <input
                id="pv-newpass"
                type="password"
                className="input-text"
                placeholder="Leave blank to keep current"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pv-confirmpass" className="field-label">
                Confirm New Password:
              </label>
              <input
                id="pv-confirmpass"
                type="password"
                className="input-text"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-modal-footer">
            <button type="button" className="btn-profile-cancel" onClick={onClose}>
              Done
            </button>
            <button type="submit" className="btn-profile-save">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

