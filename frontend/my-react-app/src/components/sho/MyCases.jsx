import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { masterCaseDatabase } from '../../data/demsData'
import { policeRoles } from '../../data/policeData'

const progressFilters = ['All', 'Active', 'Under Investigation', 'In Court', 'Closed']

function getPoliceRole(currentUser) {
	const roleId = currentUser?.roleId?.replace(/^police_/, '')
	return policeRoles.find((role) => role.id === roleId) || policeRoles.find((role) => role.id === 'sho')
}

export function getCurrentOfficerId(currentUser) {
	return currentUser?.officerId || currentUser?.roleId?.replace(/^police_/, '') || getPoliceRole(currentUser)?.id
}

function getCaseMetadata() {
	const metadata = new Map()
	masterCaseDatabase.filter((caseItem) => caseItem.orgType === 'police').forEach((caseItem) => metadata.set(caseItem.id, caseItem))
	return metadata
}

function matchesSearch(caseItem, query) {
	return [caseItem.firNumber, caseItem.title, caseItem.sections, caseItem.stage]
		.some((field) => field?.toLowerCase().includes(query))
}

function getProgressStatus(caseItem) {
	if (caseItem.progressStatus) return caseItem.progressStatus
	if (caseItem.statusLevel === 'routine' && caseItem.status?.toLowerCase().includes('court')) return 'In Court'
	if (caseItem.status?.toLowerCase().includes('court')) return 'In Court'
	return 'Under Investigation'
}

export function getAssignmentDrivenCases(currentUser, caseTeams = {}) {
	const officerId = getCurrentOfficerId(currentUser)
	const caseMetadata = getCaseMetadata()
	const assignedCaseIds = Object.entries(caseTeams)
		.filter(([, team]) => team.some((member) => member.officerId === officerId))
		.map(([caseId]) => caseId)

	return assignedCaseIds
		.map((caseId) => caseMetadata.get(caseId))
		.filter(Boolean)
		.map((caseItem) => ({
			...caseItem,
			progressStatus: getProgressStatus(caseItem),
		}))
}

function CaseListItem({ caseItem, onOpen, station }) {
	return (
		<button type="button" className="sho-my-case-item" onClick={() => onOpen(caseItem)}>
			<div className="sho-my-case-main">
				<span className="sho-case-number">{caseItem.firNumber}</span>
				<h2>{caseItem.title}</h2>
			</div>
			<span className={`sho-case-progress ${caseItem.progressStatus.toLowerCase().replaceAll(' ', '-')}`}>{caseItem.progressStatus}</span>
			<div className="sho-my-case-meta">
				<div><span>Current stage</span><strong>{caseItem.stage || 'Stage not recorded'}</strong></div>
				<div><span>FIR date</span><strong>{caseItem.date || 'Date not recorded'}</strong></div>
				<div><span>Police station</span><strong>{caseItem.policeStation || station}</strong></div>
			</div>
		</button>
	)
}

export default function MyCases({ currentUser, caseTeams }) {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [activeFilter, setActiveFilter] = useState('All')
	const cases = getAssignmentDrivenCases(currentUser, caseTeams)
	const station = currentUser?.station || 'Central Police Station, Division I'
	const filteredCases = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		return cases.filter((caseItem) => (
			(activeFilter === 'All' || caseItem.progressStatus === activeFilter)
			&& (!query || matchesSearch(caseItem, query))
		))
	}, [activeFilter, cases, searchQuery])

	return (
		<section className="sho-workspace-view sho-my-cases" aria-labelledby="my-cases-title">
			<header className="sho-workspace-heading">
				<div>
					<p className="sho-eyebrow">Assigned casework</p>
					<h1 id="my-cases-title">My Cases</h1>
					<p>Cases directly assigned to you for investigation and station oversight.</p>
				</div>
				<div className="sho-my-cases-count"><strong>{filteredCases.length}</strong><span>Total cases</span></div>
			</header>

			<div className="sho-my-cases-toolbar">
				<label className="sho-inbox-search"><span>Search cases</span><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="FIR no., title, section or stage" /></label>
				<div className="sho-inbox-filters" role="group" aria-label="Filter cases by progress status">
					{progressFilters.map((filter) => <button type="button" key={filter} className={activeFilter === filter ? 'is-active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
				</div>
			</div>

			<div className="sho-my-case-list">
					{filteredCases.map((caseItem) => <CaseListItem key={caseItem.id} caseItem={caseItem} station={station} onOpen={(selectedCase) => navigate(`/dashboard/my-cases/${selectedCase.id}`, { state: { from: 'my-cases' } })} />)}
				{filteredCases.length === 0 && <div className="sho-empty-state sho-my-cases-empty">No cases match the current search and progress filter.</div>}
			</div>
		</section>
	)
}
