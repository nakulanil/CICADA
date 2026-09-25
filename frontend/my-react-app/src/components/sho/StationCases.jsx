import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { masterCaseDatabase } from '../../data/demsData'

const progressFilters = ['All', 'Active', 'Under Investigation', 'In Court', 'Closed']

function getProgressStatus(caseItem) {
	if (caseItem.progressStatus) return caseItem.progressStatus
	if (caseItem.status?.toLowerCase().includes('court')) return 'In Court'
	return 'Under Investigation'
}


// The demo case model has no stationId, so existing police cases are the station metadata pool.
export function getStationCases(caseTeams = {}, currentUser = {}) {
	const stationCases = masterCaseDatabase
		.filter((caseItem) => caseItem.orgType === 'police')
		.map((caseItem) => ({ ...caseItem, progressStatus: getProgressStatus(caseItem) }))
	if (!caseTeams) return stationCases

	const currentOfficerId = currentUser?.officerId || currentUser?.roleId?.replace(/^police_/, '') || 'sho'
	return stationCases.filter((caseItem) => {
		const team = caseTeams[caseItem.id] || []
		const hasAssignedTeam = team.length > 0
		const currentOfficerIsMember = team.some((member) => member.officerId === currentOfficerId)
		return hasAssignedTeam && !currentOfficerIsMember
	})
}

export default function StationCases({ currentUser = {}, caseTeams = {} }) {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [progressFilter, setProgressFilter] = useState('All')
	const stationCases = useMemo(() => getStationCases(caseTeams, currentUser), [caseTeams, currentUser])
	const filteredCases = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		return stationCases.filter((caseItem) => {
			const team = caseTeams[caseItem.id] || []
			const primary = team.find((member) => member.assignmentRole === 'Primary Investigating Officer')
			const matchesProgress = progressFilter === 'All' || caseItem.progressStatus === progressFilter
			const matchesSearch = !query || [caseItem.firNumber, caseItem.title, primary?.name, primary?.officer, primary?.designation].some((field) => field?.toLowerCase().includes(query))
			return matchesProgress && matchesSearch
		})
	}, [caseTeams, progressFilter, searchQuery, stationCases])

	const activeCases = stationCases.filter((caseItem) => ['Active', 'Under Investigation'].includes(caseItem.progressStatus)).length
	const courtCases = stationCases.filter((caseItem) => caseItem.progressStatus === 'In Court').length
	const closedCases = stationCases.filter((caseItem) => caseItem.progressStatus === 'Closed').length
	const clearFilters = () => {
		setSearchQuery('')
		setProgressFilter('All')
	}

	return (
		<section className="sho-station-cases" aria-labelledby="station-cases-title">
			<header className="sho-station-heading">
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
					<p className="sho-eyebrow">STATION SUPERVISORY VIEW</p>
					<h1 id="station-cases-title">Station Cases</h1>
					<p>Supervisory view of cases handled by Central Police Station</p>
				</div>
				<div className="sho-station-scope">
					<span>Case scope</span>
					<strong>Central Police Station</strong>
				</div>
			</header>
			<div className="sho-station-summary"><div><strong>{stationCases.length}</strong><span>Total station cases</span></div><div><strong>{activeCases}</strong><span>Active / under investigation</span></div><div><strong>{courtCases}</strong><span>In court</span></div><div><strong>{closedCases}</strong><span>Closed</span></div></div>

			<div className="sho-station-toolbar"><label className="sho-inbox-search"><span>Search station cases</span><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search FIR number, case title or primary IO" /></label><label className="sho-station-select"><span>Progress status</span><select value={progressFilter} onChange={(event) => setProgressFilter(event.target.value)}>{progressFilters.map((filter) => <option key={filter}>{filter}</option>)}</select></label></div>

			<div className="sho-station-summary-line"><strong>{filteredCases.length}</strong> of {stationCases.length} cases shown</div>
			{stationCases.length === 0 ? <div className="sho-station-empty"><h2>No station cases available.</h2></div> : filteredCases.length === 0 ? <div className="sho-station-empty"><p>No cases match the current filters.</p><button type="button" className="sho-secondary-button" onClick={clearFilters}>Clear filters</button></div> : <div className="sho-station-table-wrap"><table className="sho-station-table"><thead><tr><th>FIR</th><th>CASE</th><th>PRIMARY IO</th><th>STATUS</th><th>STAGE</th><th>TEAM</th><th>ACTION</th></tr></thead><tbody>{filteredCases.map((caseItem) => { const team = caseTeams[caseItem.id] || []; const primary = team.find((member) => member.assignmentRole === 'Primary Investigating Officer'); return <tr key={caseItem.id}><td><strong className="sho-station-fir">{caseItem.firNumber}</strong><span>{caseItem.date}</span></td><td><strong className="sho-station-title">{caseItem.title}</strong></td><td>{primary?.name || primary?.officer || primary?.designation || 'Not assigned'}</td><td><span className={`sho-station-status ${caseItem.progressStatus.toLowerCase().replaceAll(' ', '-')}`}>{caseItem.progressStatus}</span></td><td>{caseItem.stage || 'Not recorded'}</td><td>{team.length ? `${team.length} officer${team.length === 1 ? '' : 's'}` : 'Team not recorded'}</td><td><button type="button" className="sho-open-station-case" onClick={() => navigate(`/dashboard/my-cases/${caseItem.id}`, { state: { from: 'station-cases' } })}>Open Case</button></td></tr> })}</tbody></table></div>}
		</section>
	)
}
