import React, { useMemo, useState } from 'react'
import { masterCaseDatabase } from '../../data/demsData'
import { policeRoles } from '../../data/policeData'
import FIRDetail from './FIRDetail'

const initialInboxRecords = masterCaseDatabase
	.filter((caseItem) => caseItem.orgType === 'police' && caseItem.roleTarget === 'police_sho')
	.map((caseItem, index) => ({
		...caseItem,
		policeStation: 'Central Police Station, Division I',
		team: caseItem.caseType === 'own' && index < 2
			? [{ officer: 'Rajesh Kumar Sharma', designation: 'Inspector (SHO)', assignmentRole: 'Primary Investigating Officer' }]
			: [],
	}))

const officerOptions = policeRoles.map((role) => ({
		id: role.id,
		name: role.defaultOfficer.name,
		designation: role.shortTitle,
	}))

const filters = ['All', 'Unassigned', 'Assigned', 'Under Review']

function matchesSearch(record, query) {
	const searchableFields = [
		record.firNumber,
		record.title,
		record.complainant,
		record.policeStation,
		record.sections,
	]
	return searchableFields.some((field) => field?.toLowerCase().includes(query))
}

export default function FIRInbox({ currentUser, caseTeams, onMarkReviewed, onAddOfficer, onRemoveOfficer, onBack }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [activeFilter, setActiveFilter] = useState('All')
	const [selectedFirId, setSelectedFirId] = useState(null)

	const records = useMemo(() => initialInboxRecords.map((record) => {
		const isReviewed = Object.prototype.hasOwnProperty.call(caseTeams, record.id)
		const team = isReviewed ? caseTeams[record.id] : record.team
		const reviewed = isReviewed || record.team.length > 0
		const inboxStatus = !reviewed && team.length === 0
			? 'Unassigned'
			: team.length === 0 ? 'Under Review' : 'Assigned'

		return { ...record, team, inboxStatus }
	}), [caseTeams])

	const filteredRecords = records.filter((record) => {
		const matchesFilter = activeFilter === 'All' || record.inboxStatus === activeFilter
		const normalizedQuery = searchQuery.trim().toLowerCase()
		return matchesFilter && (!normalizedQuery || matchesSearch(record, normalizedQuery))
	})
	const selectedFir = records.find((record) => record.id === selectedFirId) || null

	const handleOpenFir = (firId) => {
		onMarkReviewed(firId)
		setSelectedFirId(firId)
	}

	if (selectedFir) {
		return (
			<FIRDetail
				fir={selectedFir}
				team={selectedFir.team}
				currentUser={currentUser}
				officerOptions={officerOptions}
				onAddOfficer={onAddOfficer}
				onRemoveOfficer={onRemoveOfficer}
				onBack={() => setSelectedFirId(null)}
				onClose={() => setSelectedFirId(null)}
			/>
		)
	}

	return (
		<section className="sho-workspace-view sho-fir-inbox" aria-labelledby="fir-inbox-title">
			<header className="sho-workspace-heading">
				<div>
					<p className="sho-eyebrow">Station work queue</p>
					<h1 id="fir-inbox-title">FIR Inbox</h1>
					<p>Review newly received and pending FIRs before assigning them for investigation.</p>
				</div>
				<button type="button" className="sho-secondary-button" onClick={onBack}>Back to Dashboard</button>
			</header>

			<div className="sho-inbox-toolbar">
				<label className="sho-inbox-search">
					<span>Search FIR records</span>
					<input
						type="search"
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
						placeholder="FIR no., offence, complainant or section"
					/>
				</label>
				<div className="sho-inbox-filters" role="group" aria-label="Filter FIR records">
					{filters.map((filter) => (
						<button
							type="button"
							key={filter}
							className={activeFilter === filter ? 'is-active' : ''}
							onClick={() => setActiveFilter(filter)}
						>
							{filter}
						</button>
					))}
				</div>
			</div>

			<div className="sho-inbox-summary"><strong>{filteredRecords.length}</strong> records shown <span>·</span> {activeFilter} queue</div>
			<div className="sho-fir-table-wrap">
				<table className="sho-fir-table">
					<thead>
						<tr><th>FIR No.</th><th>Date</th><th>Offence / Title</th><th>Police Station</th><th>Status</th><th>Assignment</th><th>Action</th></tr>
					</thead>
					<tbody>
						{filteredRecords.map((record) => (
							<tr key={record.id}>
								<td><strong className="sho-table-fir-number">{record.firNumber}</strong></td>
								<td className="sho-table-muted">{record.date}</td>
								<td><strong className="sho-table-title">{record.title}</strong><span className="sho-table-secondary">{record.sections}</span></td>
								<td className="sho-table-station">{record.policeStation}</td>
								<td><span className={`sho-inbox-status ${record.inboxStatus.toLowerCase().replace(' ', '-')}`}>{record.inboxStatus}</span></td>
								<td className="sho-assignment-cell">{record.team.length > 0 ? <><strong>{record.team[0].officer}</strong><span>{record.team.length} officer{record.team.length === 1 ? '' : 's'}</span></> : <span className="sho-unassigned-label">Unassigned</span>}</td>
								<td><button type="button" className="sho-review-button" onClick={() => handleOpenFir(record.id)}>{record.team.length > 0 ? 'View' : 'Review'}</button></td>
							</tr>
						))}
						{filteredRecords.length === 0 && <tr><td colSpan="7" className="sho-empty-state">No FIR records match the current search and filter.</td></tr>}
					</tbody>
				</table>
			</div>
		</section>
	)
}
