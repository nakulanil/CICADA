import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { masterCaseDatabase, getTimeGreeting } from '../data/demsData'
import CDACHeader from '../components/CDACHeader'
import CDACFooter from '../components/CDACFooter'
import CaseFileCard from '../components/CaseFileCard'
import CaseDetailsWithNotepadModal from '../components/CaseDetailsWithNotepadModal'

/**
 * Dashboard / Home Page
 * - Top greeting with profile icon and officer position
 * - Search bar
 * - Case progress filters: Active, Under Investigation, In Court, Closed, Archived
 * - Vertical division: Self-Assigned Cases (Left) vs Senior-Delegated Cases (Right)
 * - Case Dossier with Right-Side Investigation Notepad
 */
export default function DashboardPage() {
  const navigate = useNavigate()
  const greeting = getTimeGreeting()

  const [currentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('dems_active_user')
      if (stored) return JSON.parse(stored)
    } catch (err) {
      console.warn('LocalStorage parse error:', err)
    }
    return {
      username: 'sho_rajesh',
      name: 'Rajesh Kumar Sharma',
      email: 'sho.central@police.gov.in',
      pno: 'DL-481902',
      orgId: 'police',
      orgName: 'Police Department',
      roleId: 'police_sho',
      roleName: 'Station House Officer (SHO)',
      cadre: 'Supervisory Station In-Charge',
      station: 'Central Police Station, Division I',
    }
  })

  // Master Cases State with persisted notes
  const [casesList, setCasesList] = useState(() => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem('dems_case_notes_db') || '{}')
      return masterCaseDatabase.map((c) => {
        if (storedNotes[c.id]) {
          return { ...c, initialNotes: storedNotes[c.id] }
        }
        return c
      })
    } catch (err) {
      return masterCaseDatabase
    }
  })

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [progressFilter, setProgressFilter] = useState('All')
  const [selectedCaseId, setSelectedCaseId] = useState(null)

  const selectedCase = casesList.find((c) => c.id === selectedCaseId) || null

  const handleAddNote = (caseId, newNote) => {
    setCasesList((prev) => {
      const updated = prev.map((c) => {
        if (c.id === caseId) {
          const updatedNotes = [newNote, ...(c.initialNotes || [])]
          return { ...c, initialNotes: updatedNotes }
        }
        return c
      })

      try {
        const storedNotes = JSON.parse(localStorage.getItem('dems_case_notes_db') || '{}')
        const targetCase = updated.find((c) => c.id === caseId)
        storedNotes[caseId] = targetCase?.initialNotes || []
        localStorage.setItem('dems_case_notes_db', JSON.stringify(storedNotes))
      } catch (err) {
        console.warn('Save notes error:', err)
      }

      return updated
    })
  }

  const handleDeleteNote = (caseId, noteId) => {
    setCasesList((prev) => {
      const updated = prev.map((c) => {
        if (c.id === caseId) {
          const updatedNotes = (c.initialNotes || []).filter((n) => n.id !== noteId)
          return { ...c, initialNotes: updatedNotes }
        }
        return c
      })

      try {
        const storedNotes = JSON.parse(localStorage.getItem('dems_case_notes_db') || '{}')
        const targetCase = updated.find((c) => c.id === caseId)
        storedNotes[caseId] = targetCase?.initialNotes || []
        localStorage.setItem('dems_case_notes_db', JSON.stringify(storedNotes))
      } catch (err) {
        console.warn('Delete note error:', err)
      }

      return updated
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('dems_active_user')
    navigate('/')
  }

  // Filter cases by search and progress status
  const filteredCases = casesList.filter((caseItem) => {
    if (progressFilter !== 'All' && caseItem.progressStatus !== progressFilter) {
      return false
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchFir = caseItem.firNumber.toLowerCase().includes(q)
      const matchTitle = caseItem.title.toLowerCase().includes(q)
      const matchSec = caseItem.sections.toLowerCase().includes(q)
      const matchComp = (caseItem.complainant || '').toLowerCase().includes(q)
      const matchSum = (caseItem.summary || '').toLowerCase().includes(q)
      const matchDel = (caseItem.delegatedBy || '').toLowerCase().includes(q)
      const matchDir = (caseItem.directive || '').toLowerCase().includes(q)

      return matchFir || matchTitle || matchSec || matchComp || matchSum || matchDel || matchDir
    }

    return true
  })

  const ownCases = filteredCases.filter((c) => c.caseType === 'own')
  const delegatedCases = filteredCases.filter((c) => c.caseType === 'delegated')

  const progressOptions = ['All', 'Active', 'Under Investigation', 'In Court', 'Closed', 'Archived']

  const getProgressCount = (status) => {
    if (status === 'All') return casesList.length
    return casesList.filter((c) => c.progressStatus === status).length
  }

  return (
    <div className="app-page-wrapper">
      <CDACHeader activePage="dashboard" />

      {/* Officer Profile Header Banner */}
      <section className="user-profile-header-strip">
        <div className="site-container user-strip-flex">
          {/* Left: Avatar & Rank */}
          <div className="profile-left-block">
            <div className="profile-avatar-square">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="profile-text-block">
              <div className="pno-row">
                <span className="badge-pno">{currentUser.pno}</span>
                <span className="badge-org">{currentUser.orgName}</span>
              </div>
              <h2 className="profile-officer-name">{currentUser.name}</h2>
              <span className="profile-rank-subtitle">
                {currentUser.roleName} • {currentUser.cadre}
              </span>
            </div>
          </div>

          {/* Right: Dynamic Greeting & Logout */}
          <div className="profile-right-block">
            <div className="greeting-box">
              <span className="greeting-label">Hello,</span>{' '}
              <strong className="greeting-bold">{greeting}!</strong>
              <div className="date-time-tag">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>

            <button
              type="button"
              className="btn-signout"
              onClick={handleLogout}
              title="Sign Out"
            >
              Sign Out ➔
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Workspace */}
      <main className="site-container page-content-box">
        {/* Search Bar & Progress Filter Tabs */}
        <div className="search-filter-portlet">
          <div className="search-bar-row">
            <div className="search-box-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="input-case-search"
                placeholder="Search specific cases by FIR No., title, sections, complainant, directive, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn-clear-input"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <span className="search-count-label">
              Showing <strong>{filteredCases.length}</strong> of {casesList.length} Total Cases
            </span>
          </div>

          {/* Folder-Style Progress Filter Tabs */}
          <div className="folder-tabs-row">
            <span className="tabs-heading-label">Filter Progress:</span>
            <div className="tabs-group">
              {progressOptions.map((status) => {
                const isSelected = progressFilter === status
                const count = getProgressCount(status)
                return (
                  <button
                    key={status}
                    type="button"
                    className={`folder-tab-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setProgressFilter(status)}
                  >
                    {status}
                    <span className="tab-pill-count">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Dual-Column Layout: Self Assigned Cases (Left) vs Senior Delegated Cases (Right) */}
        <div className="dual-column-cases-wrap">
          {/* ================= LEFT COLUMN: SELF ASSIGNED CASES ================= */}
          <div className="cases-column column-self">
            <div className="column-bar bar-self">
              <div>
                <span className="column-sub-tag">PRIMARY JURISDICTION</span>
                <h3 className="column-title">
                  Self-Assigned Case Files
                  <span className="count-tag count-self">{ownCases.length}</span>
                </h3>
              </div>
              <span className="role-tag-pill">DIRECT IO</span>
            </div>

            <div className="column-card-list">
              {ownCases.length === 0 ? (
                <div className="empty-state-card">
                  <span className="empty-icon">🗂</span>
                  <p>No self-assigned cases found matching the active filter.</p>
                  {(searchQuery || progressFilter !== 'All') && (
                    <button
                      type="button"
                      className="btn-reset-filter"
                      onClick={() => {
                        setSearchQuery('')
                        setProgressFilter('All')
                      }}
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              ) : (
                ownCases.map((c) => (
                  <CaseFileCard
                    key={c.id}
                    caseItem={c}
                    type="own"
                    onSelect={(item) => setSelectedCaseId(item.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SENIOR DELEGATED CASES ================= */}
          <div className="cases-column column-delegated">
            <div className="column-bar bar-del">
              <div>
                <span className="column-sub-tag">SUPERVISORY DIRECTIVES</span>
                <h3 className="column-title">
                  Senior-Delegated Case Files
                  <span className="count-tag count-del">{delegatedCases.length}</span>
                </h3>
              </div>
              <span className="role-tag-pill pill-amber">DELEGATED ACCESS</span>
            </div>

            <div className="column-card-list">
              {delegatedCases.length === 0 ? (
                <div className="empty-state-card">
                  <span className="empty-icon">⚡</span>
                  <p>No delegated directives found matching the active filter.</p>
                  {(searchQuery || progressFilter !== 'All') && (
                    <button
                      type="button"
                      className="btn-reset-filter"
                      onClick={() => {
                        setSearchQuery('')
                        setProgressFilter('All')
                      }}
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              ) : (
                delegatedCases.map((c) => (
                  <CaseFileCard
                    key={c.id}
                    caseItem={c}
                    type="delegated"
                    onSelect={(item) => setSelectedCaseId(item.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Case Details Dossier with Integrated Right-Side Investigation Notepad */}
      <CaseDetailsWithNotepadModal
        selectedCase={selectedCase}
        currentUser={currentUser}
        onClose={() => setSelectedCaseId(null)}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />

      <CDACFooter />
    </div>
  )
}
