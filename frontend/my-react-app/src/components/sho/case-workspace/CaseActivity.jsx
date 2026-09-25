import React, { useMemo, useState } from 'react'

const eventCategories = ['All', 'Case', 'Document', 'Evidence', 'Team', 'FSL', 'System']

const prototypeActivity = {
	'FIR-2026-089': [
		{ id: 'ACT-089-007', timestamp: '03 Sep 2026 · 10:24', actor: 'Inspector Rajesh Kumar Sharma', action: 'FSL report received', entityType: 'FSL', entityName: 'FSL-REQ-021 · FR-021', description: 'Forensic examination report received for the CCTV DVR submitted to CFSL Digital Forensics Division.' },
		{ id: 'ACT-089-008', timestamp: '02 Sep 2026 · 16:05', actor: 'Station Records Administrator', action: 'Document access updated', entityType: 'System', entityName: 'Case document register', description: 'Read access to the case document register was updated for the assigned investigation team.' },
		{ id: 'ACT-089-006', timestamp: '01 Sep 2026 · 09:12', actor: 'CFSL Digital Forensics Division', action: 'FSL examination started', entityType: 'FSL', entityName: 'FSL-REQ-026 · EVD-089-001', description: 'Digital extraction and data examination started for the seized mobile phone.' },
		{ id: 'ACT-089-005', timestamp: '30 Aug 2026 · 15:40', actor: 'SI Vikramaditya Singh', action: 'Evidence transferred to FSL', entityType: 'Evidence', entityName: 'EVD-089-001 · Mobile Phone', description: 'Mobile phone transferred from Central PS Malkhana to CFSL Digital Forensics Division.' },
		{ id: 'ACT-089-004', timestamp: '30 Aug 2026 · 11:05', actor: 'Inspector Rajesh Kumar Sharma', action: 'Document uploaded', entityType: 'Document', entityName: 'DOC-089-014 · Seizure Memo', description: 'Signed seizure memo uploaded to the case document register.' },
		{ id: 'ACT-089-003', timestamp: '29 Aug 2026 · 17:20', actor: 'Inspector Rajesh Kumar Sharma', action: 'Investigation team member added', entityType: 'Team', entityName: 'Investigation Team · Evidence / Custody Officer', description: 'Dilbagh Singh was added to the case as the Evidence / Custody Officer.' },
		{ id: 'ACT-089-002', timestamp: '28 Aug 2026 · 16:15', actor: 'Inspector Rajesh Kumar Sharma', action: 'Investigation officer assigned', entityType: 'Team', entityName: 'Investigation Team · Primary Investigating Officer', description: 'Inspector Rajesh Kumar Sharma assigned as the Primary Investigating Officer.' },
		{ id: 'ACT-089-001', timestamp: '28 Aug 2026 · 09:10', actor: 'DEMS Intake System', action: 'FIR received', entityType: 'Case', entityName: 'FIR No. 89/2026', description: 'FIR received in the station casework queue for review and investigation assignment.' },
	],
	'FIR-2026-074': [
		{ id: 'ACT-074-004', timestamp: '02 Sep 2026 · 14:10', actor: 'CFSL Digital Forensics Division', action: 'Evidence received by FSL', entityType: 'FSL', entityName: 'FSL-REQ-031 · EVD-074-001', description: 'Laptop received by the receiving laboratory for digital and financial data examination.' },
		{ id: 'ACT-074-003', timestamp: '01 Sep 2026 · 10:30', actor: 'Inspector Rajesh Kumar Sharma', action: 'Evidence transferred to FSL', entityType: 'Evidence', entityName: 'EVD-074-001 · Laptop', description: 'Office laptop transferred from Central PS Malkhana to CFSL Digital Forensics Division.' },
		{ id: 'ACT-074-002', timestamp: '16 Aug 2026 · 12:15', actor: 'Case Records Desk', action: 'Document processed', entityType: 'Document', entityName: 'DOC-074-006 · Bank Guarantee Register', description: 'Uploaded financial records were processed and linked to the case file.' },
		{ id: 'ACT-074-001', timestamp: '14 Aug 2026 · 09:00', actor: 'DEMS Intake System', action: 'FIR received', entityType: 'Case', entityName: 'FIR No. 74/2026', description: 'FIR received in the station casework queue for review and investigation assignment.' },
	],
}

function categoryClass(category) {
	return category.toLowerCase()
}

export default function CaseActivity({ caseItem }) {
	const [activeCategory, setActiveCategory] = useState('All')
	const [searchQuery, setSearchQuery] = useState('')
	const events = prototypeActivity[caseItem.id] || []
	const filteredEvents = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		return events.filter((event) => (
			(activeCategory === 'All' || event.entityType === activeCategory)
			&& (!query || [event.actor, event.action, event.entityName, event.description].some((field) => field.toLowerCase().includes(query)))
		))
	}, [activeCategory, events, searchQuery])

	return (
		<section className="sho-activity-workspace" aria-labelledby="case-activity-title">
			<header className="sho-activity-heading">
				<div><p className="sho-eyebrow">{caseItem.firNumber}</p><h2 id="case-activity-title">Activity &amp; Audit</h2><p>Chronological record of important actions and case events</p></div>
				<div className="sho-activity-scope"><span>Case scope</span><strong>{caseItem.id}</strong></div>
			</header>

			<div className="sho-activity-toolbar">
				<label className="sho-inbox-search"><span>Search activity</span><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Actor, action, entity or description" /></label>
				<div className="sho-activity-filters" role="group" aria-label="Filter activity by category">{eventCategories.map((category) => <button type="button" key={category} className={activeCategory === category ? 'is-active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
			</div>

			{events.length === 0 ? <div className="sho-activity-empty"><h3>No activity recorded</h3><p>No case activity or audit events are currently available.</p></div> : filteredEvents.length === 0 ? <div className="sho-activity-empty"><p>No activity matches the current search and category filter.</p></div> : <div className="sho-activity-timeline" aria-label="Case activity timeline">{filteredEvents.map((event) => <article className="sho-activity-event" key={event.id}><div className="sho-activity-marker" aria-hidden="true" /><div className="sho-activity-event-body"><div className="sho-activity-event-meta"><time>{event.timestamp}</time><span className={`sho-activity-category ${categoryClass(event.entityType)}`}>{event.entityType}</span></div><strong className="sho-activity-actor">{event.actor}</strong><h3>{event.action}</h3><p className="sho-activity-entity">{event.entityType} · {event.entityName}</p><p className="sho-activity-description">{event.description}</p></div></article>)}</div>}
		</section>
	)
}
