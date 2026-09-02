import React from 'react'

/**
 * Case File Card Component
 * Renders case summary with Progress Status badge, legal sections, exhibits,
 * notes count, and action button to open Case Dossier with Right-Side Notepad.
 */
export default function CaseFileCard({ caseItem, type, onSelect }) {
  const notesCount = (caseItem.initialNotes || []).length

  // Helper for progress status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'status-active'
      case 'Under Investigation':
        return 'status-under-inv'
      case 'In Court':
        return 'status-court'
      case 'Closed':
        return 'status-closed'
      case 'Archived':
        return 'status-archived'
      default:
        return 'status-active'
    }
  }

  if (type === 'delegated') {
    return (
      <article className="case-file-card delegated-case-card">
        {/* Top Header Row */}
        <div className="card-top-meta">
          <span className="fir-badge badge-del">{caseItem.firNumber}</span>
          <span className="case-date">Delegated: {caseItem.date}</span>
          <span className={`progress-badge ${getStatusClass(caseItem.progressStatus)}`}>
            {caseItem.progressStatus}
          </span>
        </div>

        {/* Delegated By Authority Box */}
        <div className="senior-delegator-box">
          <span className="delegator-icon">🎖</span>
          <div className="delegator-text">
            <span className="delegator-label">Delegated By Authority:</span>
            <strong className="delegator-name">{caseItem.delegatedBy}</strong>
            <span className="delegator-desig">({caseItem.seniorDesignation})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="case-title-text">{caseItem.title}</h3>

        {/* Legal Sections */}
        <div className="case-legal-sections">
          <span className="section-label">Sections of Law:</span>
          <code className="section-code">{caseItem.sections}</code>
        </div>

        {/* Senior Mandate & Directive Box */}
        <div className="senior-directive-box">
          <div className="directive-header">
            <span className="directive-icon">⚡</span>
            <strong>MANDATE & ACTION DIRECTIVE:</strong>
          </div>
          <p className="directive-body">"{caseItem.directive}"</p>
        </div>

        {/* Delegation Metadata */}
        <div className="delegation-meta-row">
          <div className="del-meta-cell">
            <span className="m-label">Clearance Scope:</span>
            <span className="m-val">{caseItem.accessLevel}</span>
          </div>
          <div className="del-meta-cell">
            <span className="m-label">Target Deadline:</span>
            <span className="m-val highlight-deadline">{caseItem.deadline}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="case-footer-row">
          <div className="counts-badges">
            <span className="stat-pill">🗂 {caseItem.evidenceItems} Exhibits</span>
            <span className="stat-pill pill-notes">📝 {notesCount} Notes</span>
          </div>
          <button
            type="button"
            className="view-dossier-btn btn-del"
            onClick={() => onSelect({ ...caseItem, type: 'delegated' })}
          >
            Open Dossier & Notepad ➔
          </button>
        </div>
      </article>
    )
  }

  // Self-Assigned / Primary Case Card
  return (
    <article className="case-file-card own-case-card">
      {/* Top Header Row */}
      <div className="card-top-meta">
        <span className="fir-badge">{caseItem.firNumber}</span>
        <span className="case-date">Registered: {caseItem.date}</span>
        <span className={`progress-badge ${getStatusClass(caseItem.progressStatus)}`}>
          {caseItem.progressStatus}
        </span>
      </div>

      {/* Case Title */}
      <h3 className="case-title-text">{caseItem.title}</h3>

      {/* Legal Sections */}
      <div className="case-legal-sections">
        <span className="section-label">Sections of Law:</span>
        <code className="section-code">{caseItem.sections}</code>
      </div>

      {/* Metadata Grid */}
      <div className="case-meta-grid">
        <div className="meta-item">
          <span className="m-label">Complainant / Source:</span>
          <span className="m-val">{caseItem.complainant}</span>
        </div>
        <div className="meta-item">
          <span className="m-label">Current Stage:</span>
          <span className="m-val highlight-stage">{caseItem.stage}</span>
        </div>
      </div>

      {/* Summary */}
      <p className="case-summary-para">{caseItem.summary}</p>

      {/* Card Footer */}
      <div className="case-footer-row">
        <div className="counts-badges">
          <span className="stat-pill">📖 {caseItem.caseDiaryEntries} CD Logs</span>
          <span className="stat-pill">🗂 {caseItem.evidenceItems} Exhibits</span>
          <span className="stat-pill pill-notes">📝 {notesCount} Notes</span>
        </div>
        <button
          type="button"
          className="view-dossier-btn"
          onClick={() => onSelect({ ...caseItem, type: 'own' })}
        >
          Open Case & Notepad ➔
        </button>
      </div>
    </article>
  )
}
