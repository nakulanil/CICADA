import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import CaseActivity from './CaseActivity'
import CaseDocuments from './CaseDocuments'
import CaseEvidence from './CaseEvidence'
import CaseFSL from './CaseFSL'
import CaseMore from './CaseMore'
import CaseOverview from './CaseOverview'
import CaseTeam from './CaseTeam'

const tabs = [
	{ id: 'overview', label: 'Overview' },
	{ id: 'documents', label: 'Documents' },
	{ id: 'evidence', label: 'Evidence' },
	{ id: 'team', label: 'Team' },
	{ id: 'fsl', label: 'FSL' },
	{ id: 'activity', label: 'Activity & Audit' },
	{ id: 'more', label: 'More' },
]

const tabComponents = { documents: CaseDocuments, evidence: CaseEvidence, team: CaseTeam, fsl: CaseFSL, activity: CaseActivity, more: CaseMore }

export default function CaseWorkspace({ currentUser, caseTeams, myCases = [] }) {
	const { caseId } = useParams()
	const navigate = useNavigate()
	const location = useLocation()
	const origin = location.state?.from === 'station-cases' ? 'station-cases' : 'my-cases'
	const caseItem = myCases.find((item) => item.id === caseId)
	const team = caseTeams?.[caseId] || []
	const [activeTab, setActiveTab] = useState('overview')

	if (!caseItem) {
		return (
			<section className="sho-workspace-view sho-empty-state" aria-labelledby="case-not-found-title">
				<h1 id="case-not-found-title">Case not found</h1>
				<p>The requested case could not be found in your assigned casework.</p>
				<Link className="sho-primary-button" to={origin === 'station-cases' ? '/dashboard/station-cases' : '/dashboard/my-cases'}>{origin === 'station-cases' ? 'Back to Cases' : 'Back to My Cases'}</Link>
			</section>
		)
	}
	const TabContent = tabComponents[activeTab]
	const station = caseItem.policeStation || currentUser?.station || 'Central Police Station, Division I'
	const backPath = origin === 'station-cases' ? '/dashboard/station-cases' : '/dashboard/my-cases'
	const backLabel = origin === 'station-cases' ? '← Back to Cases' : '← Back to My Cases'

	return (
		<section className="sho-case-workspace" aria-labelledby="case-workspace-title">
			<header className="sho-case-workspace-header">
				<button type="button" className="sho-back-link" onClick={() => navigate(backPath)}>{backLabel}</button>
				<div className="sho-case-workspace-identity">
					<div><p className="sho-eyebrow">Case workspace</p><h1 id="case-workspace-title">{caseItem.firNumber}</h1><h2>{caseItem.title}</h2></div>
					<div className="sho-case-workspace-context"><span className={`sho-case-progress ${caseItem.progressStatus.toLowerCase().replaceAll(' ', '-')}`}>{caseItem.progressStatus}</span><span>{station}</span><span>Primary IO: {caseItem.ioName || 'Not assigned'}</span></div>
				</div>
			</header>
			<nav className="sho-case-tabs" aria-label="Case workspace sections">
				{tabs.map((tab) => <button type="button" key={tab.id} className={activeTab === tab.id ? 'is-active' : ''} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}
			</nav>
			<div className="sho-case-workspace-content">
				{activeTab === 'overview' ? <CaseOverview caseItem={caseItem} /> : <TabContent caseItem={caseItem} team={team} />}
			</div>
		</section>
	)
}
