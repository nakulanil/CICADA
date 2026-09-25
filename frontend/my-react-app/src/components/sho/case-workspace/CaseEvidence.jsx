import React, { useEffect, useMemo, useState } from 'react'

const evidenceFilters = ['All', 'In Custody', 'With FSL', 'Returned', 'Released / Disposed']

const prototypeEvidence = {
	'FIR-2026-089': [
		{
			id: 'EVD-089-001', caseId: 'FIR-2026-089', type: 'Mobile Phone', description: 'Android smartphone seized from accused',
			custodian: 'HC Dilbagh Singh', location: 'CFSL Digital Forensics', status: 'With FSL',
			media: { fileName: 'mobile_device_record_01.jpg', type: 'image', uploadedDate: '30-Aug-2026' },
			custodyHistory: [
				{ date: '28-Aug-2026 14:20', action: 'Evidence seized', officer: 'SI Vikramaditya Singh', location: 'Crime Scene' },
				{ date: '28-Aug-2026 17:10', action: 'Deposited in Malkhana', officer: 'HC Dilbagh Singh', location: 'Central PS Malkhana' },
				{ date: '30-Aug-2026 09:30', action: 'Transferred to FSL', officer: 'HC Dilbagh Singh', location: 'CFSL Digital Forensics' },
			],
		},
		{
			id: 'EVD-089-002', caseId: 'FIR-2026-089', type: 'CCTV DVR', description: 'Basement parking surveillance recorder',
			custodian: 'SI Vikramaditya Singh', location: 'Central PS Malkhana', status: 'In Custody',
			media: null,
			custodyHistory: [
				{ date: '28-Aug-2026 13:45', action: 'Evidence seized', officer: 'SI Vikramaditya Singh', location: 'Sector 4 Commercial Complex' },
				{ date: '28-Aug-2026 17:30', action: 'Deposited in Malkhana', officer: 'HC Dilbagh Singh', location: 'Central PS Malkhana' },
			],
		},
		{
			id: 'EVD-089-003', caseId: 'FIR-2026-089', type: 'Questioned Document', description: 'Handwritten access register recovered from security desk',
			custodian: 'Inspector Rajesh Kumar Sharma', location: 'Central PS Malkhana', status: 'In Custody',
			media: null,
			custodyHistory: [
				{ date: '29-Aug-2026 10:15', action: 'Evidence seized', officer: 'Inspector Rajesh Kumar Sharma', location: 'Security Office, Sector 4' },
				{ date: '29-Aug-2026 12:40', action: 'Sealed and deposited', officer: 'HC Dilbagh Singh', location: 'Central PS Malkhana' },
			],
		},
	],
	'FIR-2026-074': [
		{
			id: 'EVD-074-001', caseId: 'FIR-2026-074', type: 'Laptop', description: 'Office laptop collected for financial records review',
			custodian: 'Inspector Rajesh Kumar Sharma', location: 'Central PS Malkhana', status: 'In Custody',
			media: null,
			custodyHistory: [
				{ date: '15-Aug-2026 11:00', action: 'Evidence seized', officer: 'Inspector Rajesh Kumar Sharma', location: 'Metro Infotech Office' },
				{ date: '15-Aug-2026 14:20', action: 'Deposited in Malkhana', officer: 'HC Dilbagh Singh', location: 'Central PS Malkhana' },
			],
		},
		{
			id: 'EVD-074-002', caseId: 'FIR-2026-074', type: 'Seized Property', description: 'Original bank guarantee files and transaction registers',
			custodian: 'SI Vikramaditya Singh', location: 'Central PS Malkhana', status: 'Returned',
			media: { fileName: 'seized_registers_01.jpg', type: 'image', uploadedDate: '16-Aug-2026' },
			custodyHistory: [
				{ date: '16-Aug-2026 09:40', action: 'Evidence seized', officer: 'SI Vikramaditya Singh', location: 'State Bank Audit Office' },
				{ date: '22-Aug-2026 16:00', action: 'Returned under receipt', officer: 'Inspector Rajesh Kumar Sharma', location: 'State Bank Audit Office' },
			],
		},
	],
}

function StatusBadge({ status }) {
	const statusClass = status.toLowerCase().replaceAll(' / ', '-').replaceAll(' ', '-').replaceAll('/', '-')
	return <span className={`sho-evidence-status ${statusClass}`}>{status}</span>
}

export default function CaseEvidence({ caseItem }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [activeFilter, setActiveFilter] = useState('All')
	const [selectedEvidence, setSelectedEvidence] = useState(null)
	const [mediaMessage, setMediaMessage] = useState('')
	const evidence = prototypeEvidence[caseItem.id] || []
	useEffect(() => {
		if (!selectedEvidence) return undefined
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') setSelectedEvidence(null)
		}
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.body.style.overflow = previousOverflow
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [selectedEvidence])
	const filteredEvidence = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		return evidence.filter((item) => (
			(activeFilter === 'All' || item.status === activeFilter)
			&& (!query || [item.id, item.type, item.description, item.custodian, item.location].some((field) => field.toLowerCase().includes(query)))
		))
	}, [activeFilter, evidence, searchQuery])

	const resetFilters = () => {
		setSearchQuery('')
		setActiveFilter('All')
	}

	return (
		<section className="sho-evidence-workspace" aria-labelledby="case-evidence-title">
			<header className="sho-evidence-heading">
				<div>
					<p className="sho-eyebrow">Controlled exhibits</p>
					<h2 id="case-evidence-title">Evidence</h2>
					<p>Exhibits, custody status and movement history for this case</p>
				</div>
				<div className="sho-evidence-scope"><span>Case scope</span><strong>{caseItem.id}</strong></div>
			</header>

			<div className="sho-evidence-toolbar">
				<label className="sho-inbox-search"><span>Search evidence</span><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="ID, type, custodian or location" /></label>
				<div className="sho-evidence-filters" role="group" aria-label="Filter evidence by custody status">
					{evidenceFilters.map((filter) => <button type="button" key={filter} className={activeFilter === filter ? 'is-active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
				</div>
			</div>

			<div className="sho-evidence-summary"><strong>{filteredEvidence.length}</strong> of {evidence.length} exhibits shown</div>
			{filteredEvidence.length > 0 ? <div className="sho-evidence-table-wrap">
				<table className="sho-evidence-table">
					<thead><tr><th>Evidence ID</th><th>Type</th><th>Description</th><th>Custodian</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
					<tbody>{filteredEvidence.map((item) => <tr key={item.id}>
						<td><strong className="sho-evidence-id">{item.id}</strong></td><td>{item.type}</td><td className="sho-evidence-description">{item.description}</td><td>{item.custodian}</td><td className="sho-evidence-muted">{item.location}</td><td><StatusBadge status={item.status} /></td><td><button type="button" className="sho-review-button" onClick={() => setSelectedEvidence(item)}>View</button></td>
					</tr>)}</tbody>
				</table>
			</div> : <div className="sho-evidence-empty"><h3>{evidence.length === 0 ? 'No evidence recorded' : 'No evidence found'}</h3><p>{evidence.length === 0 ? 'No evidence records are currently available for this case.' : 'Try a different search term or reset the evidence filter.'}</p>{evidence.length > 0 && <button type="button" className="sho-secondary-button" onClick={resetFilters}>Reset filters</button>}</div>}

			{selectedEvidence && <div className="sho-detail-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedEvidence(null)}>
				<aside className="sho-detail-modal sho-evidence-detail" role="dialog" aria-modal="true" aria-labelledby="evidence-detail-title">
				<div className="sho-evidence-detail-heading"><div><p className="sho-eyebrow">Exhibit record</p><h3 id="evidence-detail-title">{selectedEvidence.id}</h3></div><button type="button" className="sho-detail-modal-close" aria-label="Close evidence details" onClick={() => setSelectedEvidence(null)}>×</button></div>
				<dl className="sho-evidence-detail-fields"><div><dt>Evidence ID</dt><dd>{selectedEvidence.id}</dd></div><div><dt>Type</dt><dd>{selectedEvidence.type}</dd></div><div className="sho-evidence-detail-wide"><dt>Description</dt><dd>{selectedEvidence.description}</dd></div><div><dt>Current custodian</dt><dd>{selectedEvidence.custodian}</dd></div><div><dt>Current location</dt><dd>{selectedEvidence.location}</dd></div><div><dt>Current status</dt><dd><StatusBadge status={selectedEvidence.status} /></dd></div></dl>
				<section className="sho-evidence-media" aria-labelledby="evidence-media-title">
					<div className="sho-evidence-detail-heading"><div><p className="sho-eyebrow">Attachment area</p><h3 id="evidence-media-title">Evidence Media</h3></div><button type="button" className="sho-secondary-button" disabled>Upload Media</button></div>
					{selectedEvidence.media ? <div className="sho-evidence-media-record"><div className="sho-evidence-media-placeholder" aria-hidden="true">{selectedEvidence.media.type.toUpperCase()}</div><div className="sho-evidence-media-copy"><strong>{selectedEvidence.media.fileName}</strong><span>Type: {selectedEvidence.media.type}</span><span>Uploaded: {selectedEvidence.media.uploadedDate}</span></div><div className="sho-evidence-media-actions"><button type="button" className="sho-review-button" onClick={() => setMediaMessage('Media preview will be enabled after backend integration.')}>View</button><button type="button" className="sho-document-download" onClick={() => setMediaMessage('Download will be enabled after backend integration.')}>Download</button></div></div> : <div className="sho-evidence-media-empty"><strong>No evidence photo or media uploaded</strong><span>Media will appear here after backend integration.</span></div>}
					{mediaMessage && <p className="sho-evidence-media-message" role="status">{mediaMessage}<button type="button" onClick={() => setMediaMessage('')}>Dismiss</button></p>}
				</section>
				<div className="sho-custody-history"><div className="sho-evidence-detail-heading"><div><p className="sho-eyebrow">Traceability</p><h3>Custody History</h3></div><span className="sho-evidence-history-note">Prototype record</span></div><ol>{selectedEvidence.custodyHistory.map((event) => <li key={`${event.date}-${event.action}`}><time>{event.date}</time><strong>{event.action}</strong><span>{event.officer}</span><small>{event.location}</small></li>)}</ol></div>
				</aside>
			</div>}
		</section>
	)
}
