import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { masterCaseDatabase, getTimeGreeting } from '../data/demsData'
import DashboardHeader from '../components/DashboardHeader'
import OfficerGreetingRibbon from '../components/OfficerGreetingRibbon'
import SHOWorkspace from '../components/SHOWorkspace'
import CaseDetailsWithNotepadModal from '../components/CaseDetailsWithNotepadModal'
import ProfileViewerModal from '../components/ProfileViewerModal'
import Footer from '../components/Footer'

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
      cadre: 'Station In-Charge',
      station: 'Central Police Station, Division I',
    }
  })

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedCaseId, setSelectedCaseId] = useState(null)
  const [casesList, setCasesList] = useState(() => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem('dems_case_notes_db') || '{}')
      return masterCaseDatabase.map((caseItem) =>
        storedNotes[caseItem.id]
          ? { ...caseItem, initialNotes: storedNotes[caseItem.id] }
          : caseItem,
      )
    } catch (err) {
      return masterCaseDatabase
    }
  })

  const selectedCase = casesList.find((caseItem) => caseItem.id === selectedCaseId) || null

  const handleAddNote = (caseId, newNote) => {
    setCasesList((previous) => {
      const updated = previous.map((caseItem) =>
        caseItem.id === caseId
          ? { ...caseItem, initialNotes: [newNote, ...(caseItem.initialNotes || [])] }
          : caseItem,
      )

      try {
        const storedNotes = JSON.parse(localStorage.getItem('dems_case_notes_db') || '{}')
        const targetCase = updated.find((caseItem) => caseItem.id === caseId)
        storedNotes[caseId] = targetCase?.initialNotes || []
        localStorage.setItem('dems_case_notes_db', JSON.stringify(storedNotes))
      } catch (err) {
        console.warn('Save notes error:', err)
      }

      return updated
    })
  }

  const handleDeleteNote = (caseId, noteId) => {
    setCasesList((previous) => {
      const updated = previous.map((caseItem) =>
        caseItem.id === caseId
          ? { ...caseItem, initialNotes: (caseItem.initialNotes || []).filter((note) => note.id !== noteId) }
          : caseItem,
      )

      try {
        const storedNotes = JSON.parse(localStorage.getItem('dems_case_notes_db') || '{}')
        const targetCase = updated.find((caseItem) => caseItem.id === caseId)
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

  return (
    <div className="dems-dashboard-page-root sho-dashboard-root">
      <DashboardHeader
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      <OfficerGreetingRibbon
        currentUser={currentUser}
        greeting={greeting}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="sho-dashboard-main">
        <SHOWorkspace
          cases={casesList}
          onSelectCase={(caseItem) => setSelectedCaseId(caseItem.id)}
        />
      </main>

      <CaseDetailsWithNotepadModal
        selectedCase={selectedCase}
        allCases={casesList}
        currentUser={currentUser}
        onClose={() => setSelectedCaseId(null)}
        onSelectCase={(caseItem) => setSelectedCaseId(caseItem.id)}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />

      <ProfileViewerModal
        isOpen={isProfileModalOpen}
        currentUser={currentUser}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateUser={(updated) => setCurrentUser(updated)}
      />

      <Footer />
    </div>
  )
}
