import React, { useEffect, useMemo, useState } from 'react'

const fslStatuses = ['All', 'Submitted', 'Received by FSL', 'Under Examination', 'Report Ready', 'Report Received']

const prototypeRequests = {
	'FIR-2026-089': [
		{
			id: 'FSL-REQ-026', caseId: 'FIR-2026-089', evidenceId: 'EVD-089-001', evidenceName: 'Mobile Phone',
			examinationType: 'Digital Forensics / Data Extraction', submittedDate: '30-Aug-2026', receivingLab: 'CFSL Digital Forensics Division', status: 'Under Examination', reportId: null, reportDate: null,
			timeline: [
				{ date: '30-Aug-2026', event: 'Submitted to FSL' },
				{ date: '31-Aug-2026', event: 'Received by FSL' },
				{ date: '01-Sep-2026', event: 'Examination started' },
			],
		},
		{
			id: 'FSL-REQ-021', caseId: 'FIR-2026-089', evidenceId: 'EVD-089-002', evidenceName: 'CCTV DVR',
			examinationType: 'Video / Digital Evidence Examination', submittedDate: '28-Aug-2026', receivingLab: 'CFSL Digital Forensics Division', status: 'Report Received', reportId: 'FR-021', reportDate: '03-Sep-2026',
			timeline: [
				{ date: '28-Aug-2026', event: 'Submitted to FSL' },
				{ date: '29-Aug-2026', event: 'Received by FSL' },
				{ date: '30-Aug-2026', event: 'Examination started' },
				{ date: '02-Sep-2026', event: 'Report ready' },
				{ date: '03-Sep-2026', event: 'Report received by police' },
			],
		},
	],
	'FIR-2026-074': [
		{
			id: 'FSL-REQ-031', caseId: 'FIR-2026-074', evidenceId: 'EVD-074-001', evidenceName: 'Laptop',
			examinationType: 'Digital Forensics / Financial Data Review', submittedDate: '01-Sep-2026', receivingLab: 'CFSL Digital Forensics Division', status: 'Received by FSL', reportId: null, reportDate: null,
			timeline: [
				{ date: '01-Sep-2026', event: 'Submitted to FSL' },
				{ date: '02-Sep-2026', event: 'Received by FSL' },
			],
		},
	],
}

function statusClass(status) {
	return status.toLowerCase().replaceAll(' ', '-').replaceAll('/', '-')
}

function StatusBadge({ status }) {
	return <span className={`sho-fsl-status ${statusClass(status)}`}>{status}</span>
}

function RequestDetails({ request, onViewReport, reportMessage, onClose }) {
	return (
		<section className="sho-fsl-detail" aria-labelledby="fsl-request-detail-title">
			<div className="sho-fsl-detail-heading"><div><p className="sho-eyebrow">Request detail</p><h3 id="fsl-request-detail-title">{request.id}</h3></div><div className="sho-fsl-detail-actions"><StatusBadge status={request.status} /><button type="button" className="sho-detail-modal-close" aria-label="Close FSL request details" onClick={onClose}>×</button></div></div>
			<dl className="sho-fsl-detail-fields">
				<div><dt>Evidence ID</dt><dd>{request.evidenceId}</dd></div><div><dt>Evidence name</dt><dd>{request.evidenceName}</dd></div><div><dt>Examination type</dt><dd>{request.examinationType}</dd></div><div><dt>Submitted date</dt><dd>{request.submittedDate}</dd></div><div className="sho-fsl-detail-wide"><dt>Receiving laboratory</dt><dd>{request.receivingLab}</dd></div><div><dt>Current status</dt><dd><StatusBadge status={request.status} /></dd></div>
			</dl>
			<div className="sho-fsl-timeline"><div className="sho-fsl-detail-heading"><div><p className="sho-eyebrow">Prototype event record</p><h3>Examination Timeline</h3></div></div><ol>{request.timeline.map((entry) => <li key={`${request.id}-${entry.date}-${entry.event}`}><time>{entry.date}</time><span>{entry.event}</span></li>)}</ol></div>
			<div className="sho-fsl-report"><div><p className="sho-eyebrow">Report</p><h3>FSL Report</h3></div>{request.reportId ? <><dl className="sho-fsl-report-fields"><div><dt>Report ID</dt><dd>{request.reportId}</dd></div><div><dt>Report date</dt><dd>{request.reportDate}</dd></div><div><dt>Status</dt><dd>Report Available</dd></div></dl><button type="button" className="sho-secondary-button" onClick={onViewReport}>View Report</button></> : <p>No FSL report available yet.</p>}{reportMessage && <p className="sho-fsl-report-message" role="status">{reportMessage}</p>}</div>
		</section>
	)
}

export default function CaseFSL({ caseItem }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [activeFilter, setActiveFilter] = useState('All')
	const [selectedRequest, setSelectedRequest] = useState(null)
	const [reportMessage, setReportMessage] = useState('')
	const requests = prototypeRequests[caseItem.id] || []
	useEffect(() => {
		if (!selectedRequest) return undefined
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') setSelectedRequest(null)
		}
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.body.style.overflow = previousOverflow
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [selectedRequest])
	const filteredRequests = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		return requests.filter((request) => (
			(activeFilter === 'All' || request.status === activeFilter)
			&& (!query || [request.id, request.evidenceId, request.evidenceName, request.examinationType].some((field) => field.toLowerCase().includes(query)))
		))
	}, [activeFilter, requests, searchQuery])
	const inProgressCount = requests.filter((request) => ['Submitted', 'Received by FSL', 'Under Examination'].includes(request.status)).length
	const reportCount = requests.filter((request) => ['Report Ready', 'Report Received'].includes(request.status)).length

	const handleViewReport = () => setReportMessage('FSL report viewing will be enabled after backend integration.')

	return (
		<section className="sho-fsl-workspace" aria-labelledby="case-fsl-title">
			<header className="sho-fsl-heading"><div><p className="sho-eyebrow">{caseItem.firNumber}</p><h2 id="case-fsl-title">FSL Examination</h2><p>Forensic requests, examination status and reports associated with this case</p></div><div className="sho-fsl-scope"><span>Case scope</span><strong>{caseItem.id}</strong></div></header>
			<div className="sho-fsl-summary"><div><strong>{requests.length}</strong><span>Total requests</span></div><div><strong>{inProgressCount}</strong><span>In progress</span></div><div><strong>{reportCount}</strong><span>Reports ready / received</span></div></div>

			{requests.length === 0 ? <div className="sho-fsl-empty"><h3>No FSL examinations</h3><p>No forensic examination requests have been recorded for this case.</p></div> : <>
				<div className="sho-fsl-toolbar"><label className="sho-inbox-search"><span>Search FSL requests</span><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Request, evidence or examination" /></label><div className="sho-fsl-filters" role="group" aria-label="Filter FSL requests by status">{fslStatuses.map((status) => <button type="button" key={status} className={activeFilter === status ? 'is-active' : ''} onClick={() => setActiveFilter(status)}>{status}</button>)}</div></div>
				<div className="sho-fsl-summary-line"><strong>{filteredRequests.length}</strong> of {requests.length} requests shown</div>
				<div className="sho-fsl-table-wrap"><table className="sho-fsl-table"><thead><tr><th>Request ID</th><th>Evidence</th><th>Examination</th><th>Submitted</th><th>Laboratory</th><th>Status</th><th>Report</th><th>Action</th></tr></thead><tbody>{filteredRequests.map((request) => <tr key={request.id}><td><strong>{request.id}</strong></td><td><strong>{request.evidenceId}</strong><span>{request.evidenceName}</span></td><td>{request.examinationType}</td><td>{request.submittedDate}</td><td>{request.receivingLab}</td><td><StatusBadge status={request.status} /></td><td>{request.reportId || '—'}</td><td><button type="button" className="sho-fsl-view-button" onClick={() => { setSelectedRequest(request); setReportMessage('') }}>View</button></td></tr>)}</tbody></table></div>
				{filteredRequests.length === 0 && <div className="sho-fsl-filter-empty">No FSL requests match the current search and status filter.</div>}
				{selectedRequest && <div className="sho-detail-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedRequest(null)}><div className="sho-detail-modal sho-fsl-modal" role="dialog" aria-modal="true" aria-labelledby="fsl-request-detail-title"><RequestDetails request={selectedRequest} onViewReport={handleViewReport} reportMessage={reportMessage} onClose={() => setSelectedRequest(null)} /></div></div>}
			</>}
		</section>
	)
}
