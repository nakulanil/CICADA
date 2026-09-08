import React from 'react'

/**
 * Case File Card (Figma Page 1 Specification)
 * Interactive card with hover lift, status badges, and action triggers
 */
export default function CaseFileCard({ caseItem, type = 'own', onSelect }) {
  const isDelegated = type === 'delegated'
  const notesCount = caseItem.initialNotes?.length || 0

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-')
    if (s.includes('active')) return 'status-active'
    if (s.includes('investigation')) return 'status-under-investigation'
    if (s.includes('court')) return 'status-in-court'
    if (s.includes('closed')) return 'status-closed'
    if (s.includes('archived')) return 'status-archived'
    return 'status-active'
  }

  return (
    <div
      className={`case-file-card ${isDelegated ? 'delegated-case-card' : ''}`}
      onClick={() => onSelect && onSelect(caseItem)}
    >
      {/* Top Header Row */}
      <div className="card-top-meta">
        <div className="meta-left-tags">
          <span className={`fir-badge ${isDelegated ? 'badge-del' : ''}`}>
            {caseItem.firNumber}
          </span>
          <span className="case-date">
            {isDelegated ? `Delegated: ${caseItem.date}` : `Registered: ${caseItem.date}`}
          </span>
        </div>

        <span className={`progress-badge ${getStatusClass(caseItem.progressStatus)}`}>
          {caseItem.progressStatus}
        </span>
      </div>

      {/* Case Title */}
      <h3 className="case-title-text">{caseItem.title}</h3>

      {/* Delegated Senior Officer Directive Box */}
      {isDelegated && caseItem.delegatedBy && (
        <div className="senior-delegator-box">
          <span className="delegator-icon">⚡</span>
          <span className="delegator-label">Mandate Authority: </span>
          <strong>{caseItem.delegatedBy}</strong> ({caseItem.seniorDesignation || 'DCP / Supervisory'})
        </div>
      )}

      {isDelegated && caseItem.directive && (
        <div className="senior-directive-box">
          <div className="directive-header">
            <span>📌 ACTION DIRECTIVE:</span>
          </div>
          <p className="directive-body">"{caseItem.directive}"</p>
        </div>
      )}

      {/* Case Metadata Details */}
      {!isDelegated ? (
        <div className="case-meta-grid">
          <div className="meta-cell">
            <span className="m-label">Complainant / Source: </span>
            <span className="m-val">{caseItem.complainant || 'Station Roster'}</span>
          </div>
          <div className="meta-cell">
            <span className="m-label">Current Stage: </span>
            <span className="m-val highlight-stage">{caseItem.stage}</span>
          </div>
        </div>
      ) : (
        <div className="delegation-meta-row">
          <div>
            <span className="m-label">Clearance Scope: </span>
            <span className="m-val">{caseItem.accessLevel || 'Full Supervisory'}</span>
          </div>
          <div>
            <span className="m-label">Target Deadline: </span>
            <span className="m-val highlight-deadline">{caseItem.deadline || 'Immediate'}</span>
          </div>
        </div>
      )}

      {/* Summary Narrative */}
      <p className="case-summary-para">{caseItem.summary}</p>

      {/* Footer Exhibits & Trigger Button */}
      <div className="case-footer-row">
        <div className="counts-badges">
          {caseItem.caseDiaryEntries && (
            <span className="stat-pill">📋 {caseItem.caseDiaryEntries} CD Logs</span>
          )}
          <span className="stat-pill">🗂️ {caseItem.evidenceItems || 4} Exhibits</span>
          <span className={`stat-pill ${notesCount > 0 ? 'pill-notes' : ''}`}>
            📝 {notesCount} Notes
          </span>
        </div>

        <button
          type="button"
          className={`btn-animated view-dossier-btn ${isDelegated ? 'btn-del' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            if (onSelect) onSelect(caseItem)
          }}
        >
          {isDelegated ? 'Open Dossier & Notepad ➔' : 'Open Case & Notepad ➔'}
        </button>
      </div>
    </div>
  )
}
