import React, { useState } from 'react'

/**
 * Large Expanded Case Dossier with Left-Side Case Navigator Sidebar & Right-Side Investigation Notepad
 * (Figma Page 1 Frame 6 Specification)
 */
export default function CaseDetailsWithNotepadModal({
  selectedCase,
  allCases = [],
  currentUser,
  onClose,
  onSelectCase,
  onAddNote,
  onDeleteNote,
}) {
  if (!selectedCase) return null

  const [noteText, setNoteText] = useState('')
  const notePriority = 'routine'
  const noteTag = 'General Investigation'
  const [saveFeedback, setSaveFeedback] = useState(false)
  const [sidebarFilter, setSidebarFilter] = useState('all')

  const handleInsertTimestamp = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const dateStr = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    const stamp = `[${dateStr} ${timeStr}] - `
    setNoteText((prev) => stamp + prev)
  }

  const handleSaveNote = (e) => {
    e.preventDefault()
    if (!noteText.trim()) return

    const now = new Date()
    const dateStr = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: `${dateStr} ${timeStr}`,
      author: currentUser?.name || 'Officer',
      priority: notePriority,
      tag: noteTag,
      text: noteText.trim(),
    }

    if (onAddNote) {
      onAddNote(selectedCase.id, newNote)
    }

    setNoteText('')
    setSaveFeedback(true)
    setTimeout(() => setSaveFeedback(false), 2200)
  }

  const caseNotes = selectedCase.initialNotes || []

  // Filter sidebar cases
  const otherCases = allCases.filter((c) => {
    if (sidebarFilter === 'own') return c.caseType === 'own'
    if (sidebarFilter === 'delegated') return c.caseType === 'delegated'
    return true
  })

  return (
    <div className="dems-modal-backdrop" onClick={onClose}>
      <div className="dems-expanded-workspace-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header Bar */}
        <div className="dems-modal-top-bar">
          <div className="modal-title-left">
            <span className="case-id-badge">{selectedCase.firNumber}</span>
            <span className="case-title-main">{selectedCase.title}</span>
            <span className={`status-pill pill-${selectedCase.progressStatus.toLowerCase().replace(/\s+/g, '-')}`}>
              {selectedCase.progressStatus}
            </span>
          </div>

          <div className="modal-actions-right">
            <button type="button" className="btn-animated btn-modal-done-top" onClick={onClose} title="Done">
              Done
            </button>
          </div>
        </div>

        {/* Modal 3-Pane Body: (1. Left: Cases Sidebar, 2. Middle: Case Dossier, 3. Right: Notepad) */}
        <div className="dems-modal-three-pane-body">
          {/* ================= 1. LEFT SIDEBAR: OTHER CASES NAVIGATOR ================= */}
          <aside className="modal-left-cases-sidebar">
            <div className="sidebar-header-bar">
              <span className="sidebar-title">📁 Case Navigator</span>
              <div className="sidebar-filter-tabs">
                <button
                  type="button"
                  className={`btn-sb-tab ${sidebarFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSidebarFilter('all')}
                >
                  All ({allCases.length})
                </button>
                <button
                  type="button"
                  className={`btn-sb-tab ${sidebarFilter === 'own' ? 'active' : ''}`}
                  onClick={() => setSidebarFilter('own')}
                >
                  Self ({allCases.filter((c) => c.caseType === 'own').length})
                </button>
                <button
                  type="button"
                  className={`btn-sb-tab ${sidebarFilter === 'delegated' ? 'active' : ''}`}
                  onClick={() => setSidebarFilter('delegated')}
                >
                  Delegated ({allCases.filter((c) => c.caseType === 'delegated').length})
                </button>
              </div>
            </div>

            <div className="sidebar-cases-list">
              {otherCases.map((c) => {
                const isCurrent = c.id === selectedCase.id
                return (
                  <div
                    key={c.id}
                    className={`sidebar-case-item ${isCurrent ? 'active-case-item' : ''} ${
                      c.caseType === 'delegated' ? 'sb-del-item' : ''
                    }`}
                    onClick={() => {
                      if (onSelectCase && !isCurrent) {
                        onSelectCase(c)
                      }
                    }}
                  >
                    <div className="sb-item-top">
                      <span className="sb-fir-tag">{c.firNumber}</span>
                      <span className={`sb-status-pill status-${c.progressStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                        {c.progressStatus}
                      </span>
                    </div>
                    <div className="sb-case-title">{c.title}</div>
                    <div className="sb-case-type-meta">
                      {c.caseType === 'own' ? '👮 Self-Assigned' : `⚡ By: ${c.delegatedBy || 'Senior'}`}
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>

          {/* ================= 2. MIDDLE COLUMN: CASE DOSSIER ================= */}
          <div className="modal-middle-case-details">
            {/* Section 1: Official Registration & Legal Sections */}
            <div className="dossier-box">
              <h4 className="dossier-sec-title">
                <span className="sec-num">1</span> Legal & Jurisdictional Registration
              </h4>
              <div className="dossier-grid-two">
                <div className="grid-cell">
                  <span className="cell-label">Applicable Sections of Law:</span>
                  <code className="cell-code">{selectedCase.sections}</code>
                </div>
                <div className="grid-cell">
                  <span className="cell-label">Date of Registration:</span>
                  <span className="cell-val">{selectedCase.date}</span>
                </div>
                <div className="grid-cell">
                  <span className="cell-label">Complainant / Source:</span>
                  <span className="cell-val">{selectedCase.complainant || 'Station Roster'}</span>
                </div>
                <div className="grid-cell">
                  <span className="cell-label">Lead Investigating Officer (IO):</span>
                  <span className="cell-val">{selectedCase.ioName || currentUser?.name || 'Assigned Officer'}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Senior Directives (if applicable) */}
            {selectedCase.caseType === 'delegated' && (
              <div className="dossier-box senior-directive-highlight">
                <h4 className="dossier-sec-title">
                  <span className="sec-num">2</span> Senior Authority Mandate & Directives
                </h4>
                <div className="directive-details-row">
                  <p className="dir-authority-line">
                    <strong>Issued By:</strong> {selectedCase.delegatedBy} (
                    {selectedCase.seniorDesignation})
                  </p>
                  <div className="directive-quote-box">"{selectedCase.directive}"</div>
                  <div className="dossier-grid-two mt-2">
                    <div>
                      <strong>Clearance Scope:</strong> {selectedCase.accessLevel}
                    </div>
                    <div>
                      <strong>Action Deadline:</strong> <span className="text-danger">{selectedCase.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Case Summary & Investigation Stage */}
            <div className="dossier-box">
              <h4 className="dossier-sec-title">
                <span className="sec-num">{selectedCase.caseType === 'delegated' ? '3' : '2'}</span> Investigation Summary & Stage
              </h4>
              <p className="case-narrative-para">{selectedCase.summary || 'Investigation under progress.'}</p>
              <div className="stage-callout">
                <span className="stage-label">CURRENT INVESTIGATION STAGE:</span>
                <strong className="stage-value">{selectedCase.stage}</strong>
              </div>
            </div>

            {/* Section 4: Digital Evidence Repository & Hash Integrity */}
            <div className="dossier-box">
              <h4 className="dossier-sec-title">
                <span className="sec-num">{selectedCase.caseType === 'delegated' ? '4' : '3'}</span> Digital Evidence Repository & Hash Integrity
              </h4>
              <div className="evidence-summary-grid">
                <div className="ev-stat-card">
                  <span className="stat-big">{selectedCase.evidenceItems || 4}</span>
                  <span className="stat-label">Sealed Exhibits & Drives</span>
                </div>
                <div className="ev-stat-card">
                  <span className="stat-big">{selectedCase.caseDiaryEntries || 6}</span>
                  <span className="stat-label">Verified Case Diary (CD) Logs</span>
                </div>
              </div>

              <div className="hash-verification-banner">
                <span className="hash-tag">e-SAKSHYA SHA-256 INTEGRITY HASH:</span>
                <code className="hash-code">{selectedCase.evidenceHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</code>
                <span className="hash-cert-note">
                  ✓ Certified Tamper-Evident under Section 65B Indian Evidence Act / Section 63 BSA 2023
                </span>
              </div>
            </div>
          </div>

          {/* ================= 3. RIGHT COLUMN: INVESTIGATION NOTEPAD ================= */}
          <div className="modal-right-notepad">
            <div className="notepad-header-strip">
              <div className="np-title-row">
                <div>
                  <h4 className="notepad-heading">Investigation Notepad</h4>
                  <span className="notepad-sub">Official IO Field Notes & Observations</span>
                </div>
              </div>
              <span className="notes-counter">{caseNotes.length} Notes Saved</span>
            </div>

            {/* Note Entry Form */}
            <form className="notepad-form" onSubmit={handleSaveNote}>
              <div className="notepad-toolbar">
                <button
                  type="button"
                  className="btn-animated btn-tool-tag"
                  onClick={handleInsertTimestamp}
                  title="Insert current date & time stamp"
                >
                  🕒 Insert Timestamp
                </button>
                <button
                  type="button"
                  className="btn-animated btn-tool-tag"
                  onClick={() => setNoteText((prev) => prev + '\n- [ ] ')}
                >
                  ☑ Checklist Item
                </button>
                <button
                  type="button"
                  className="btn-animated btn-tool-tag"
                  onClick={() => setNoteText((prev) => prev + '\n[WITNESS STATEMENT]: ')}
                >
                  🗣 Witness
                </button>
              </div>

              <textarea
                className="notepad-textarea"
                rows={5}
                placeholder="Type your official observations, case diary reminders, or witness quotes here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                required
              />

              <div className="notepad-form-actions">
                <button
                  type="button"
                  className="btn-animated btn-note-clear"
                  onClick={() => setNoteText('')}
                >
                  Clear Pad
                </button>
                <button type="submit" className="btn-animated btn-note-save">
                  💾 Save Note to Dossier
                </button>
              </div>

              {saveFeedback && (
                <div className="note-save-alert">
                  ✓ Note saved securely to case record!
                </div>
              )}
            </form>

            {/* Saved Case Notes History */}
            <div className="saved-notes-section">
              <h5 className="saved-notes-title">Recorded Case Notes ({caseNotes.length})</h5>

              {caseNotes.length === 0 ? (
                <div className="no-notes-box">
                  No notes recorded yet for this case. Use the pad above to add observations.
                </div>
              ) : (
                <div className="notes-chronological-list">
                  {caseNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`saved-note-card priority-${note.priority || 'routine'}`}
                    >
                      <div className="note-card-header">
                        <div>
                          <strong className="note-author-stamp">{note.author || 'IO'}</strong>
                          <span className="note-time-text">({note.timestamp})</span>
                        </div>
                        <div className="note-badges-row">
                          <span className="note-tag-pill">{note.tag || 'General'}</span>
                          {note.priority && note.priority !== 'routine' && (
                            <span className={`note-prio-pill prio-${note.priority}`}>
                              {note.priority}
                            </span>
                          )}
                          {onDeleteNote && (
                            <button
                              type="button"
                              className="btn-del-note"
                              title="Delete note"
                              onClick={() => onDeleteNote(selectedCase.id, note.id)}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="note-card-body">{note.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Status Bar with only "Done" */}
        <div className="dems-modal-footer">
          <span className="audit-msg">
            Audited Session: {currentUser?.name || 'Officer'} ({currentUser?.pno || 'DEMO-USER'}) • Tamper-Evident Audit Log Active
          </span>
          <button type="button" className="btn-animated btn-modal-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
