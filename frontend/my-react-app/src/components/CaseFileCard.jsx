import React from 'react'

/**
 * Case File Card Component
 * Supports both Primary Assigned Cases and Senior-Delegated Cases
 */
export default function CaseFileCard({ caseItem, type, onSelect }) {
  if (type === 'delegated') {
    return (
      <article className={`case-file-card delegated-case-card priority-${caseItem.statusLevel}`}>
        {/* Top Metadata */}
        <div className="card-top-meta">
          <span className="fir-badge badge-del">{caseItem.firNumber}</span>
          <span className="case-date">Delegated: {caseItem.date}</span>
          <span className={`status-pill pill-${caseItem.statusLevel}`}>{caseItem.status}</span>
        </div>

        {/* Delegated By Authority Box */}
        <div className="senior-delegator-box">
          <span className="delegator-icon">🎖</span>
          <div className="delegator-text">
            <span className="delegator-label">Delegated By Senior Authority:</span>
            <strong className="delegator-name">{caseItem.delegatedBy}</strong>
            <span className="delegator-desig">({caseItem.seniorDesignation})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="case-title-text">{caseItem.title}</h3>

        {/* Legal Sections */}
        <div className="case-legal-sections">
          <span className="section-label">Under Sections:</span>
          <code className="section-code">{caseItem.sections}</code>
        </div>

        {/* Senior Mandate & Directive */}
        <div className="senior-directive-box">
          <div className="directive-header">
            <span className="directive-icon">⚡</span>
            <strong>SENIOR MANDATE & DIRECTIVE:</strong>
          </div>
          <p className="directive-body">"{caseItem.directive}"</p>
        </div>

        {/* Clearance & Deadline */}
        <div className="delegation-meta-row">
          <div className="del-meta-cell">
            <span className="m-label">Clearance Scope:</span>
            <span className="m-val">{caseItem.accessLevel}</span>
          </div>
          <div className="del-meta-cell">
            <span className="m-label">Action Deadline:</span>
            <span className="m-val highlight-deadline">{caseItem.deadline}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="case-footer-row">
          <div className="counts-badges">
            <span className="stat-pill">🗂 {caseItem.evidenceItems} Exhibits Shared</span>
            <span className="stat-pill pill-restricted">Restricted Clearance</span>
          </div>
          <button
            type="button"
            className="view-dossier-btn btn-del"
            onClick={() => onSelect({ ...caseItem, type: 'delegated' })}
          >
            Open Delegated Record ➔
          </button>
        </div>
      </article>
    )
  }

  // Default: Primary Assigned Own Case
  return (
    <article className={`case-file-card own-case-card priority-${caseItem.statusLevel}`}>
      {/* Top Metadata */}
      <div className="card-top-meta">
        <span className="fir-badge">{caseItem.firNumber}</span>
        <span className="case-date">Registered: {caseItem.date}</span>
        <span className={`status-pill pill-${caseItem.statusLevel}`}>{caseItem.status}</span>
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
          <span className="stat-pill">📖 {caseItem.caseDiaryEntries} Diary Logs</span>
          <span className="stat-pill">🗂 {caseItem.evidenceItems} Exhibits</span>
        </div>
        <button
          type="button"
          className="view-dossier-btn"
          onClick={() => onSelect({ ...caseItem, type: 'own' })}
        >
          Examine Case File ➔
        </button>
      </div>
    </article>
  )
}

