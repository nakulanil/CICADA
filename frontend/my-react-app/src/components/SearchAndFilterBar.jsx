import React from 'react'

/**
 * Search & Progress Filter Bar (Figma Page 1 Frame 5)
 * Full-width search input & folder-style progress filter tabs
 */
export default function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  progressFilter,
  onProgressFilterChange,
  progressOptions = [],
  getProgressCount,
  totalCasesCount,
  filteredCasesCount,
}) {
  return (
    <div className="search-filter-card-bar">
      {/* Top Search Input Row */}
      <div className="search-bar-top-row">
        <div className="search-input-field-group">
          <span className="search-icon-symbol">🔍</span>
          <input
            type="text"
            className="input-main-case-search"
            placeholder="Search specific cases by FIR No., title, sections of law, complainant, directive, or evidence tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-animated btn-clear-search-icon"
              onClick={onClearSearch}
              title="Clear search query"
            >
              ✕
            </button>
          )}
        </div>

        <div className="search-results-count-badge">
          Showing <strong>{filteredCasesCount}</strong> of {totalCasesCount} Total Case Files
        </div>
      </div>

      {/* Bottom Folder-Style Filter Tabs */}
      <div className="filter-folder-tabs-row">
        <span className="filter-label-prefix">Filter Progress:</span>
        <div className="folder-tabs-button-group">
          {progressOptions.map((status) => {
            const isSelected = progressFilter === status
            const count = getProgressCount(status)
            return (
              <button
                key={status}
                type="button"
                className={`btn-animated folder-tab-button ${isSelected ? 'active-folder-tab' : ''}`}
                onClick={() => onProgressFilterChange(status)}
              >
                {status}
                <span className="tab-pill-badge">{count}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

