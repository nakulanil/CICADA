import React from 'react'
import CaseFileCard from './CaseFileCard'

/**
 * Dual Column Case Feed Grid (Figma Page 1 Frame 5)
 * - Left Column: Blue #0E3366 "e-SAKSHYA Pending and Active Files ▾"
 * - Right Column: Ochre/Gold #B37D2E "Special - Confidential Case Files ▾"
 */
export default function CaseFeedGrid({
  ownCases = [],
  delegatedCases = [],
  onSelectCase,
  onResetFilters,
  hasActiveFilters = false,
}) {
  return (
    <div className="dual-case-feed-grid-container">
      {/* ================= LEFT COLUMN: PENDING & ACTIVE FILES ================= */}
      <div className="case-feed-column column-pending-active">
        <div className="column-banner-bar blue-banner">
          <div className="banner-left-content">
            <span className="banner-eyebrow">PRIMARY JURISDICTION</span>
            <h2 className="banner-main-title">
              e-SAKSHYA Pending and Active Files <span className="dropdown-caret">▾</span>
              <span className="banner-count-badge">{ownCases.length}</span>
            </h2>
          </div>
          <span className="banner-role-pill">DIRECT IO</span>
        </div>

        <div className="column-cards-wrapper">
          {ownCases.length === 0 ? (
            <div className="empty-cases-placeholder-card">
              <span className="empty-icon">🗂️</span>
              <h4 className="empty-title">No Pending / Active Files Found</h4>
              <p className="empty-desc">
                There are no self-assigned case records matching your current search or status filter.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn-animated btn-reset-filters-action"
                  onClick={onResetFilters}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            ownCases.map((caseItem) => (
              <CaseFileCard
                key={caseItem.id}
                caseItem={caseItem}
                type="own"
                onSelect={(item) => onSelectCase(item)}
              />
            ))
          )}
        </div>
      </div>

      {/* ================= RIGHT COLUMN: SPECIAL CONFIDENTIAL FILES ================= */}
      <div className="case-feed-column column-confidential-special">
        <div className="column-banner-bar ochre-banner">
          <div className="banner-left-content">
            <span className="banner-eyebrow">SUPERVISORY DIRECTIVES</span>
            <h2 className="banner-main-title">
              Special - Confidential Case Files <span className="dropdown-caret">▾</span>
              <span className="banner-count-badge count-gold">{delegatedCases.length}</span>
            </h2>
          </div>
          <span className="banner-role-pill pill-gold">CONFIDENTIAL ACCESS</span>
        </div>

        <div className="column-cards-wrapper">
          {delegatedCases.length === 0 ? (
            <div className="empty-cases-placeholder-card">
              <span className="empty-icon">⚡</span>
              <h4 className="empty-title">No Confidential Delegations Found</h4>
              <p className="empty-desc">
                No high-priority senior authority mandates or confidential inquiry dockets active.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn-animated btn-reset-filters-action"
                  onClick={onResetFilters}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            delegatedCases.map((caseItem) => (
              <CaseFileCard
                key={caseItem.id}
                caseItem={caseItem}
                type="delegated"
                onSelect={(item) => onSelectCase(item)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

