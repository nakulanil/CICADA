import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { masterCaseDatabase, getTimeGreeting } from '../data/demsData'
import DashboardHeader from '../components/DashboardHeader'
import OfficerGreetingRibbon from '../components/OfficerGreetingRibbon'
import SearchAndFilterBar from '../components/SearchAndFilterBar'
import CaseFeedGrid from '../components/CaseFeedGrid'
import CaseDetailsWithNotepadModal from '../components/CaseDetailsWithNotepadModal'
import ProfileViewerModal from '../components/ProfileViewerModal'
import Footer from '../components/Footer'

/**
 * DEMS Master Dashboard (Figma Page 1 Frame 5, 6, & 7)
 * Modular architecture orchestrating:
 * - Master Top Dark Bar (Frame 5)
 * - Officer Greeting Ribbon (Frame 5)
 * - Full-Width Search & Folder-Style Tabs (Frame 5)
 * - Dual Column Case Grid (Frame 5)
 * - Expanded 3-Column Case Dossier & Live Notepad (Frame 6)
 * - Officer Profile & Settings Modal (Frame 7)
 */
export default function DashboardPage() {
  const navigate = useNavigate()
  const greeting = getTimeGreeting()

  const [currentUser, setCurrentUser] = useState(() => {
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

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

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
    <div className="dems-dashboard-page-root">
      {/* 1. Master Top Bar (Frame 5) */}
      <DashboardHeader
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Officer Greeting Ribbon (Frame 5) */}
      <OfficerGreetingRibbon
        currentUser={currentUser}
        greeting={greeting}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 3. Main Full-Width Dashboard Content */}
      <main className="dash-full-container dashboard-main-content-flow">
        {/* Search Bar & Progress Filter Tabs */}
        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          progressFilter={progressFilter}
          onProgressFilterChange={setProgressFilter}
          progressOptions={progressOptions}
          getProgressCount={getProgressCount}
          totalCasesCount={casesList.length}
          filteredCasesCount={filteredCases.length}
        />

        {/* Dual Column Case Feed Grid (Frame 5) */}
        <CaseFeedGrid
          ownCases={ownCases}
          delegatedCases={delegatedCases}
          onSelectCase={(c) => setSelectedCaseId(c.id)}
          onResetFilters={() => {
            setSearchQuery('')
            setProgressFilter('All')
          }}
          hasActiveFilters={searchQuery.trim() !== '' || progressFilter !== 'All'}
        />
      </main>

      {/* 4. Expanded Case Details Dossier with Left Sidebar & Right Notepad (Frame 6) */}
      <CaseDetailsWithNotepadModal
        selectedCase={selectedCase}
        allCases={filteredCases}
        currentUser={currentUser}
        onClose={() => setSelectedCaseId(null)}
        onSelectCase={(c) => setSelectedCaseId(c.id)}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />

      {/* 5. Officer Profile & Account Settings Dialog (Frame 7) */}
      <ProfileViewerModal
        isOpen={isProfileModalOpen}
        currentUser={currentUser}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateUser={(updated) => setCurrentUser(updated)}
      />

      {/* 6. Universal Government Footer */}
      <Footer />
    </div>
  )
}
