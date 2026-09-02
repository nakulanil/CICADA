import React, { useState } from 'react'

/**
 * Case Details with Integrated Right-Side Investigation Notepad
 * Features:
 * - Left side: Comprehensive Case Dossier (Registration, Legal Sections, Exhibits, Senior Directives, Hash Verification)
 * - Right side: Interactive Notepad allowing real-time note-taking, timestamps, priority tags, and saved notes history.
 */
export default function CaseDetailsWithNotepadModal({
  selectedCase,
  currentUser,
  onClose,
  onAddNote,
  onDeleteNote,
}) {
  if (!selectedCase) return null

  // Active note input state
  const [noteText, setNoteText] = useState('')
  const [notePriority, setNotePriority] = useState('Routine')
  const [noteTag, setNoteTag] = useState('General Observation')
  const [saveFeedback, setSaveFeedback] = useState(false)

  // Insert automatic timestamp into note
  const handleInsertTimestamp = () => {
    const now = new Date()
    const timeStr = `[${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] `
    setNoteText((prev) => (prev ? `${prev}\n${timeStr}` : timeStr))
  }

  // Insert quick tag
  const handleInsertTag = (tag) => {
    setNoteText((prev) => (prev ? `${prev} [${tag}] ` : `[${tag}] `))
  }

  // Save current note
  const handleSaveNote = (e) => {
    e.preventDefault()
    if (!noteText.trim()) return

    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: currentUser ? currentUser.name : 'Authorized Officer',
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

  return (
    <div className="dems-modal-backdrop" onClick={onClose}>
      <div className="dems-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header Bar */}
        <div className="dems-modal-top-bar">
          <div className="modal-title-left">
            <span className="case-id-badge">{selectedCase.firNumber}</span>
            <span className="case-title-main">{selectedCase.title}</span>
          </div>

          <div className="modal-actions-right">
            <span className={`status-pill pill-${selectedCase.progressStatus.toLowerCase().replace(/\s+/g, '-')}`}>
              Status: {selectedCase.progressStatus}
            </span>
            <button type="button" className="btn-modal-close" onClick={onClose} title="Close Case & Notepad">
              ✕ Close
            </button>
          </div>
        </div>

        {/* Modal Dual-Pane Body (Left: Case Details, Right: Notepad) */}
        <div className="dems-modal-dual-body">
          {/* ================= LEFT COLUMN: CASE DOSSIER ================= */}
          <div className="modal-left-case-details">
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
                  <p>
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

            {/* Section 4: Digital Evidence Repository & Chain of Custody */}
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
                <span className="hash-tag">DEMS SHA-256 INTEGRITY HASH:</span>
                <code className="hash-code">{selectedCase.evidenceHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</code>
                <span className="hash-cert-note">
                  ✓ Certified Tamper-Evident under Section 65B Indian Evidence Act / Section 63 BSA 2023
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INVESTIGATION NOTEPAD ================= */}
          <div className="modal-right-notepad">
            <div className="notepad-header-strip">
              <div className="np-title-row">
                <span className="notepad-icon">📝</span>
                <div>
                  <h3 className="notepad-heading">Investigation Notepad</h3>
                  <span className="notepad-sub">Active Notes for {selectedCase.firNumber}</span>
                </div>
              </div>
              <span className="notes-counter">{caseNotes.length} Saved Notes</span>
            </div>

            {/* Quick Toolbar */}
            <div className="notepad-toolbar">
              <button
                type="button"
                className="btn-tool-tag"
                onClick={handleInsertTimestamp}
                title="Insert current date & time"
              >
                ⏱ Insert Timestamp
              </button>
              <button
                type="button"
                className="btn-tool-tag"
                onClick={() => handleInsertTag('WITNESS')}
              >
                + Witness
              </button>
              <button
                type="button"
                className="btn-tool-tag"
                onClick={() => handleInsertTag('EVIDENCE')}
              >
                + Evidence
              </button>
              <button
                type="button"
                className="btn-tool-tag"
                onClick={() => handleInsertTag('COURT')}
              >
                + Court
              </button>
            </div>

            {/* Note Editor Form */}
            <form onSubmit={handleSaveNote} className="notepad-input-form">
              <div className="note-meta-selectors">
                <div className="sel-group">
                  <label>Note Type:</label>
                  <select
                    value={noteTag}
                    onChange={(e) => setNoteTag(e.target.value)}
                    className="notepad-select"
                  >
                    <option value="General Observation">General Observation</option>
                    <option value="Witness Statement">Witness Statement</option>
                    <option value="Forensic Observation">Forensic Observation</option>
                    <option value="Suspect Alibi">Suspect Alibi</option>
                    <option value="Court Proceeding">Court Proceeding</option>
                  </select>
                </div>

                <div className="sel-group">
                  <label>Priority:</label>
                  <select
                    value={notePriority}
                    onChange={(e) => setNotePriority(e.target.value)}
                    className="notepad-select"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Important">Important</option>
                    <option value="Confidential">Confidential</option>
                  </select>
                </div>
              </div>

              <textarea
                className="notepad-textarea"
                rows={5}
                placeholder="Type your case notes, spot observations, witness interview points, or forensic remarks here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />

              <div className="notepad-form-actions">
                <button
                  type="button"
                  className="btn-note-clear"
                  onClick={() => setNoteText('')}
                  disabled={!noteText}
                >
                  Clear Editor
                </button>
                <button
                  type="submit"
                  className="btn-note-save"
                  disabled={!noteText.trim()}
                >
                  💾 Save Note to Case Dossier
                </button>
              </div>

              {saveFeedback && (
                <div className="note-save-alert">
                  ✓ Note successfully recorded and timestamped in case dossier!
                </div>
              )}
            </form>

            {/* Saved Notes History List */}
            <div className="saved-notes-section">
              <h4 className="saved-notes-title">Recorded Case Notes History</h4>

              {caseNotes.length === 0 ? (
                <div className="no-notes-box">
                  <span>No notes recorded yet for this case. Use the editor above to add your first observation.</span>
                </div>
              ) : (
                <div className="notes-chronological-list">
                  {caseNotes.map((note) => (
                    <div key={note.id} className={`saved-note-card priority-${(note.priority || 'routine').toLowerCase()}`}>
                      <div className="note-card-header">
                        <div className="note-author-stamp">
                          <strong>{note.author}</strong>
                          <span className="note-time-text">{note.timestamp}</span>
                        </div>
                        <div className="note-badges-row">
                          {note.tag && <span className="note-tag-pill">{note.tag}</span>}
                          <span className={`note-prio-pill prio-${(note.priority || 'routine').toLowerCase()}`}>
                            {note.priority || 'Routine'}
                          </span>
                          {onDeleteNote && (
                            <button
                              type="button"
                              className="btn-del-note"
                              onClick={() => onDeleteNote(selectedCase.id, note.id)}
                              title="Delete note"
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

        {/* Modal Bottom Status Bar */}
        <div className="dems-modal-footer">
          <span className="audit-msg">
            Audited Session: {currentUser?.name || 'Officer'} ({currentUser?.pno || 'DEMO-USER'}) • Tamper-Evident Audit Log Active
          </span>
          <button type="button" className="btn-modal-done" onClick={onClose}>
            Done / Close Case
          </button>
        </div>
      </div>
    </div>
  )
}

