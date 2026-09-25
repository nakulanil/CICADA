import React from 'react'
import { useNavigate } from 'react-router-dom'
import { policeRoles } from '../../data/policeData'

// Prototype-only notifications until the station notification source is connected.
const prototypeNotifications = [
	{ id: 1, tone: 'urgent', text: 'FSL response expected for FIR No. 89/2026.', time: 'Today, 09:40' },
	{ id: 2, tone: 'normal', text: 'Station case review queue was updated.', time: 'Yesterday, 16:20' },
	{ id: 3, tone: 'normal', text: 'Chargesheet scrutiny noted for FIR No. 74/2026.', time: 'Yesterday, 11:05' },
]

const attentionLabels = {
	'Under Investigation': 'Investigation action due',
	Active: 'Active case requires review',
	'In Court': 'Court-stage update',
}

function getGreeting() {
	const hour = new Date().getHours()
	if (hour < 12) return 'Good morning'
	if (hour < 17) return 'Good afternoon'
	return 'Good evening'
}

function CaseRow({ caseItem, onOpen }) {
	return (
		<li>
			<button type="button" className="sho-case-row" onClick={() => onOpen(caseItem)}>
				<div className="sho-case-row-content">
					<span className="sho-case-number">{caseItem.firNumber}</span>
					<strong>{caseItem.title}</strong>
				</div>
				<span className={`sho-status-tag ${caseItem.priority?.toLowerCase() || 'routine'}`}>
					{caseItem.priority || caseItem.progressStatus}
				</span>
			</button>
		</li>
	)
}

export default function SHODashboardHome({ currentUser, myCases = [], onNavigate }) {
	const navigate = useNavigate()
	const recentCases = myCases.slice(0, 3)
	const attentionCases = myCases.filter((caseItem) => caseItem.progressStatus !== 'Closed' && caseItem.progressStatus !== 'Archived').slice(0, 4)
	const officerProfile = policeRoles.find((role) => role.id === 'sho')?.defaultOfficer
	const openCase = (caseItem) => navigate(`/dashboard/my-cases/${caseItem.id}`)

	return (
		<div className="sho-home">
			<header className="sho-page-heading">
				<div>
					<p className="sho-eyebrow">{officerProfile?.station || currentUser?.station || 'Station command'}</p>
					<h1>{getGreeting()}, {currentUser?.name?.split(' ')[0] || 'Officer'}</h1>
					<p className="sho-page-intro">Here is what needs your attention across the station today.</p>
				</div>
				<div className="sho-duty-status"><span className="sho-status-dot" /> On duty</div>
			</header>

			<section className="sho-attention-section" aria-labelledby="attention-heading">
				<div className="sho-section-heading">
					<div><p className="sho-eyebrow">Priority queue</p><h2 id="attention-heading">Pending / Needs attention</h2></div>
					<span className="sho-count-badge">{attentionCases.length} items</span>
				</div>
				<div className="sho-attention-list">
					{attentionCases.map((caseItem) => (
						<button type="button" className="sho-attention-item" key={caseItem.id} onClick={() => openCase(caseItem)}>
							<span className={`sho-attention-marker ${caseItem.priority?.toLowerCase() || 'routine'}`} />
							<div className="sho-attention-content"><span className="sho-case-number">{caseItem.firNumber}</span><h3>{attentionLabels[caseItem.progressStatus] || 'Case requires action'}</h3><p>{caseItem.stage}</p></div>
							<span className="sho-attention-date">{caseItem.date}</span>
						</button>
					))}
				</div>
			</section>

			<div className="sho-dashboard-grid">
				<section className="sho-panel sho-quick-actions" aria-labelledby="quick-actions-heading">
					<div className="sho-section-heading"><div><p className="sho-eyebrow">Shortcuts</p><h2 id="quick-actions-heading">Quick actions</h2></div></div>
					<div className="sho-action-list">
						<button type="button" onClick={() => onNavigate('fir-inbox')}><span>01</span><strong>Review FIR Inbox</strong><small>Check new and unassigned FIRs</small><b>→</b></button>
						<button type="button" onClick={() => onNavigate('my-cases')}><span>02</span><strong>Open My Cases</strong><small>Continue active investigations</small><b>→</b></button>
						<button type="button" onClick={() => onNavigate('search')}><span>03</span><strong>Search Records</strong><small>Find a case or evidence record</small><b>→</b></button>
						<button type="button" onClick={() => onNavigate('station-cases')}><span>04</span><strong>Review Pending Actions</strong><small>See station-wide follow-ups</small><b>→</b></button>
					</div>
				</section>

				<section className="sho-panel" aria-labelledby="recent-cases-heading">
					<div className="sho-section-heading"><div><p className="sho-eyebrow">Assigned to you</p><h2 id="recent-cases-heading">My recent cases</h2></div><button type="button" className="sho-text-button" onClick={() => onNavigate('my-cases')}>View all</button></div>
					<ul className="sho-case-list">{recentCases.map((caseItem) => <CaseRow key={caseItem.id} caseItem={caseItem} onOpen={openCase} />)}</ul>
				</section>

				<section className="sho-panel sho-notifications-panel" aria-labelledby="notifications-heading">
					<div className="sho-section-heading"><div><p className="sho-eyebrow">System activity</p><h2 id="notifications-heading">Recent notifications</h2></div></div>
					<ul className="sho-notification-list">{prototypeNotifications.map((notification) => <li key={notification.id}><span className={`sho-notification-marker ${notification.tone}`} /><div><p>{notification.text}</p><time>{notification.time}</time></div></li>)}</ul>
				</section>
			</div>
		</div>
	)
}
