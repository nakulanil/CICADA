import React from 'react'
import { policeRoles } from '../../../data/policeData'

const officerOptions = policeRoles.map((role) => ({
	id: role.id,
	name: role.defaultOfficer.name,
	designation: role.shortTitle,
}))

export default function CaseTeam({ caseItem, team = [] }) {
	return (
		<section className="sho-team-workspace" aria-labelledby="case-team-title">
			<header className="sho-team-heading">
				<div><p className="sho-eyebrow">{caseItem.firNumber}</p><h2 id="case-team-title">Investigation Team</h2><span className="sho-team-count">{team.length} officer{team.length === 1 ? '' : 's'} assigned</span></div>
			</header>

			{team.length > 0 ? (
				<div className="sho-team-list" aria-label="Assigned investigation team">
					{team.map((teamMember) => {
						const officer = officerOptions.find((option) => option.id === teamMember.officerId)
						const isPrimary = teamMember.assignmentRole === 'Primary Investigating Officer'
						return <div className={`sho-team-member${isPrimary ? ' is-primary' : ''}`} key={teamMember.officerId}><div className="sho-team-member-copy"><span className="sho-team-role">{teamMember.assignmentRole}</span><strong>{officer?.name || teamMember.officerId}</strong><small>{officer?.designation || teamMember.designation}</small></div></div>
					})}
				</div>
			) : (
				<div className="sho-empty-team"><strong>No officers assigned</strong><p>No investigation team members have been assigned to this case yet.</p></div>
			)}

			<p className="sho-team-read-only-note">Team assignments are managed from FIR Inbox.</p>
		</section>
	)
}
