import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssignmentDrivenCases } from './MyCases'
import { getStationCases } from './StationCases'

function getAuthorizedCases(currentUser, caseTeams) {
	const visibleCases = [...getAssignmentDrivenCases(currentUser, caseTeams), ...getStationCases(caseTeams)]
	return Array.from(new Map(visibleCases.map((caseItem) => [caseItem.id, caseItem])).values())
}

function matchesSearch(caseItem, query) {
	return [caseItem.firNumber, caseItem.title, caseItem.sections, caseItem.complainant, caseItem.ioName, caseItem.summary]
		.some((field) => field?.toLowerCase().includes(query))
}

function ResultRow({ caseItem, onOpen }) {
	return (
		<article className="sho-search-result">
			<div className="sho-search-result-type">Case</div>
			<div className="sho-search-result-content"><strong className="sho-search-result-fir">{caseItem.firNumber}</strong><h3>{caseItem.title}</h3><p>{caseItem.ioName || 'Investigating officer not recorded'}</p><div className="sho-search-result-meta"><span>{caseItem.progressStatus}</span><span>{caseItem.priority || 'Priority not recorded'}</span></div></div>
			<button type="button" className="sho-search-open-button" onClick={() => onOpen(caseItem.id)}>Open Case</button>
		</article>
	)
}

export default function GlobalSearch({ currentUser, caseTeams = {} }) {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const authorizedCases = useMemo(() => getAuthorizedCases(currentUser, caseTeams), [caseTeams, currentUser])
	const normalizedQuery = searchQuery.trim().toLowerCase()
	const results = useMemo(() => authorizedCases.filter((caseItem) => !normalizedQuery || matchesSearch(caseItem, normalizedQuery)), [authorizedCases, normalizedQuery])
	const clearSearch = () => {
		setSearchQuery('')
	}

	return (
		<section className="sho-global-search" aria-labelledby="global-search-title">
			<header className="sho-global-search-heading"><div><p className="sho-eyebrow">Authorized record search</p><h1 id="global-search-title">Global Search</h1><p>Search authorized cases, FIRs and case records across the station.</p></div><div className="sho-global-search-scope"><span>Search scope</span><strong>SHO case visibility</strong></div></header>
			<div className="sho-global-search-toolbar"><label className="sho-inbox-search"><span>Search case records</span><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search FIR number, case title, officer or case details..." /></label></div>

			{!normalizedQuery ? <div className="sho-global-search-empty"><h2>Search authorized case records</h2><p>Search across cases and FIRs within the SHO's current case visibility.</p></div> : <>
				<h2 className="sho-global-search-results-heading">Search results</h2>
				<div className="sho-global-search-summary"><strong>{results.length}</strong> result{results.length === 1 ? '' : 's'} found</div>
				{results.length === 0 ? <div className="sho-global-search-empty"><h2>No records found</h2><p>Try a different search term.</p><button type="button" className="sho-secondary-button" onClick={clearSearch}>Clear Search</button></div> : <div className="sho-global-search-results">{results.map((caseItem) => <ResultRow key={caseItem.id} caseItem={caseItem} onOpen={(caseId) => navigate(`/dashboard/my-cases/${caseId}`)} />)}</div>}
			</>}
		</section>
	)
}
