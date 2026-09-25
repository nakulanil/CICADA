import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProfileViewerModal from '../components/ProfileViewerModal'
import FIRInbox from '../components/sho/FIRInbox'
import GlobalSearch from '../components/sho/GlobalSearch'
import MyCases, { getAssignmentDrivenCases } from '../components/sho/MyCases'
import CaseWorkspace from '../components/sho/case-workspace/CaseWorkspace'
import SHODashboardHome from '../components/sho/SHODashboardHome'
import SHOSidebar from '../components/sho/SHOSidebar'
import SHOTopbar from '../components/sho/SHOTopbar'
import StationCases, { getStationCases } from '../components/sho/StationCases'
import '../styles/sho-dashboard.css'
import '../styles/sho-pages.css'
import '../styles/sho-workspace.css'
import '../styles/sho-shell.css'

const initialCaseTeams = {
  'FIR-2026-089': [
    { officerId: 'sho', designation: 'Inspector (SHO)', assignmentRole: 'Primary Investigating Officer' },
  ],
  'FIR-2026-074': [
    { officerId: 'sho', designation: 'Inspector (SHO)', assignmentRole: 'Primary Investigating Officer' },
  ],
}

export default function DashboardPage() {
  const navigate = useNavigate()
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
  const [caseTeams, setCaseTeams] = useState(initialCaseTeams)
  const { pathname } = useLocation()
  const assignedCases = getAssignmentDrivenCases(currentUser, caseTeams)
  const stationCases = getStationCases(caseTeams, currentUser)
  const workspaceCases = [...assignedCases, ...stationCases.filter((stationCase) => !assignedCases.some((assignedCase) => assignedCase.id === stationCase.id))]

  const markFirReviewed = (caseId) => {
    setCaseTeams((previous) => (
      Object.prototype.hasOwnProperty.call(previous, caseId)
        ? previous
        : { ...previous, [caseId]: [] }
    ))
  }

  const addTeamMember = (caseId, member) => {
    setCaseTeams((previous) => {
      const currentTeam = previous[caseId] || []
      if (currentTeam.some((teamMember) => teamMember.officerId === member.officerId)) return previous
      if (member.assignmentRole === 'Primary Investigating Officer' && currentTeam.some((teamMember) => teamMember.assignmentRole === 'Primary Investigating Officer')) return previous
      return { ...previous, [caseId]: [...currentTeam, member] }
    })
  }

  const removeTeamMember = (caseId, officerId) => {
    setCaseTeams((previous) => ({
      ...previous,
      [caseId]: (previous[caseId] || []).filter((teamMember) => teamMember.officerId !== officerId),
    }))
  }

  const navigateToSection = (section) => {
    const sectionPaths = {
      dashboard: '/dashboard',
      'fir-inbox': '/dashboard/fir-inbox',
      'my-cases': '/dashboard/my-cases',
      'station-cases': '/dashboard/station-cases',
      search: '/dashboard/search',
    }
    navigate(sectionPaths[section] || '/dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('dems_active_user')
    navigate('/')
  }

  return (
    <div className="sho-dashboard-page-root">
      <SHOTopbar
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />
      <div className="sho-dashboard-body">
        <SHOSidebar
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
        <main className="sho-dashboard-content">
          {pathname === '/dashboard' ? (
            <SHODashboardHome currentUser={currentUser} myCases={assignedCases} onNavigate={navigateToSection} />
          ) : pathname === '/dashboard/fir-inbox' ? (
            <FIRInbox currentUser={currentUser} caseTeams={caseTeams} onMarkReviewed={markFirReviewed} onAddOfficer={addTeamMember} onRemoveOfficer={removeTeamMember} onBack={() => navigate('/dashboard')} />
          ) : pathname === '/dashboard/search' ? (
            <GlobalSearch currentUser={currentUser} caseTeams={caseTeams} />
          ) : pathname === '/dashboard/my-cases' ? (
            <MyCases currentUser={currentUser} caseTeams={caseTeams} />
          ) : pathname === '/dashboard/station-cases' ? (
            <StationCases caseTeams={caseTeams} />
          ) : pathname.startsWith('/dashboard/my-cases/') ? (
          <CaseWorkspace currentUser={currentUser} caseTeams={caseTeams} myCases={workspaceCases} />
          ) : (
            <section className="sho-placeholder-panel" aria-labelledby="coming-next-title">
              <span className="sho-placeholder-mark" aria-hidden="true">DEMS</span>
              <p className="sho-eyebrow">Workspace section</p>
              <h1 id="coming-next-title">Coming next</h1>
              <p>This workspace is being prepared for the next dashboard phase.</p>
            </section>
          )}
        </main>
      </div>

      <ProfileViewerModal
        isOpen={isProfileModalOpen}
        currentUser={currentUser}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateUser={(updated) => setCurrentUser(updated)}
      />
    </div>
  )
}
