import React from 'react'

/**
 * Case Details Modal Component
 * Renders full case dossier, legal sections, investigation logs, and senior directives
 */
export default function CaseDetailsModal({ selectedCase, officer, onClose }) {
  if (!selectedCase) return null

  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-doc-stamp">
              {selectedCase.type === 'own'
                ? 'PRIMARY INVESTIGATION DOSSIER'
                : 'SUPERVISORY DELEGATED RECORD'}
            </span>
            <h3 className="modal-case-title">{selectedCase.firNumber}</h3>
            <p className="modal-case-sub">{selectedCase.title}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
          >
            ✕ Close Record
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-scroll">
          {/* Section 1: Legal Registration */}
          <div className="modal-section-box">
            <h4 className="modal-sec-head">1. Legal & Jurisdictional Registration</h4>
            <div className="modal-grid-two">
              <div>
                <strong>Applicable Sections:</strong> <code>{selectedCase.sections}</code>
              </div>
              <div>
                <strong>Date of Entry:</strong> {selectedCase.date}
              </div>
              <div>
                <strong>Case Status:</strong>{' '}
                <span className={`status-pill pill-${selectedCase.statusLevel}`}>
                  {selectedCase.status}
                </span>
              </div>
              <div>
                <strong>Station Vault Unit:</strong> Central Police Station, Division I
              </div>
            </div>
          </div>

          {/* Section 2: Senior Orders (if delegated) */}
          {selectedCase.type === 'delegated' && (
            <div className="modal-section-box directive-highlight">
              <h4 className="modal-sec-head">2. Senior Officer Orders & Directives</h4>
              <p>
                <strong>Issued By:</strong> {selectedCase.delegatedBy} ({selectedCase.seniorDesignation})
              </p>
              <div className="modal-quote">"{selectedCase.directive}"</div>
              <p>
                <strong>Clearance Level:</strong> {selectedCase.accessLevel}
              </p>
              <p>
                <strong>Target Compliance Date:</strong> {selectedCase.deadline}
              </p>
            </div>
          )}

          {/* Section 2: Primary IO Notes (if own case) */}
          {selectedCase.type === 'own' && (
            <div className="modal-section-box">
              <h4 className="modal-sec-head">2. Case Summary & Primary IO Notes</h4>
              <p className="modal-summary-text">{selectedCase.summary}</p>
              <p>
                <strong>Complainant:</strong> {selectedCase.complainant}
              </p>
              <p>
                <strong>Investigation Stage:</strong> {selectedCase.stage}
              </p>
              <p>
                <strong>Lead IO:</strong> {selectedCase.ioName}
              </p>
            </div>
          )}

          {/* Section 3: Evidence & Case Diary Repository */}
          <div className="modal-section-box">
            <h4 className="modal-sec-head">3. Case Diary & Evidence Repository</h4>
            <div className="modal-grid-two">
              <div className="repo-card">
                <span className="repo-title">General Case Diary (CD)</span>
                <span className="repo-count">
                  {selectedCase.caseDiaryEntries || 6} Registered CD Entries
                </span>
                <span className="repo-desc">
                  Consecutively numbered and verified in accordance with State Police Regulations.
                </span>
              </div>
              <div className="repo-card">
                <span className="repo-title">Malkhana & Forensic Exhibits</span>
                <span className="repo-count">
                  {selectedCase.evidenceItems} Sealed Evidence Items
                </span>
                <span className="repo-desc">
                  Chain of custody verified with station brass seal and Road Certificate.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <span className="modal-audit-note">
            Access logged under User ID: {officer.pno} ({officer.name}) • Time:{' '}
            {new Date().toLocaleTimeString()}
          </span>
          <button
            type="button"
            className="gov-btn-primary"
            onClick={onClose}
          >
            Close Case Record
          </button>
        </div>
      </div>
    </div>
  )
}

