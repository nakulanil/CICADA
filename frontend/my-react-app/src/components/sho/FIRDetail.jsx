import React, { useEffect, useRef, useState } from 'react'

const assignmentRoles = [
	'Primary Investigating Officer',
	'Investigation Team Member',
	'Evidence / Custody Officer',
	'Field / Witness Support',
]

export default function FIRDetail({ fir, team, officerOptions, onAddOfficer, onRemoveOfficer, onBack }) {
	const [officerId, setOfficerId] = useState('')
	const [assignmentRole, setAssignmentRole] = useState(assignmentRoles[0])
	const [isAddingOfficer, setIsAddingOfficer] = useState(false)
	const [memberToRemove, setMemberToRemove] = useState(null)
	const lastFocusedElement = useRef(null)

	useEffect(() => {
		setOfficerId('')
		setAssignmentRole(assignmentRoles[0])
		setIsAddingOfficer(false)
		setMemberToRemove(null)
	}, [fir.id])

	const selectedOfficer = officerOptions.find((officer) => officer.id === officerId)
	const existingPrimary = team.find((teamMember) => teamMember.assignmentRole === 'Primary Investigating Officer')
	const assignedOfficerIds = new Set(team.map((teamMember) => teamMember.officerId))
	const availableOfficers = officerOptions.filter((officer) => !assignedOfficerIds.has(officer.id))
	const canAddPrimary = !existingPrimary

	const openRemovalDialog = (member) => {
		lastFocusedElement.current = document.activeElement
		setMemberToRemove(member)
	}

	const closeRemovalDialog = () => {
		setMemberToRemove(null)
		window.setTimeout(() => lastFocusedElement.current?.focus(), 0)
	}

	const confirmRemoval = () => {
		if (!memberToRemove) return
		onRemoveOfficer(fir.id, memberToRemove.officerId)
		closeRemovalDialog()
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		if (!selectedOfficer) return
		if (assignmentRole === 'Primary Investigating Officer' && !canAddPrimary) return
		onAddOfficer(fir.id, {
			officerId: selectedOfficer.id,
			designation: selectedOfficer.designation,
			assignmentRole,
		})
		setOfficerId('')
		setAssignmentRole(assignmentRoles[0])
		setIsAddingOfficer(false)
	}

	return (
		<section className="sho-workspace-view sho-fir-detail" aria-labelledby="fir-detail-title">
			<header className="sho-detail-heading sho-fir-detail-heading">
				<div className="sho-fir-detail-heading-copy"><button type="button" className="sho-back-link" onClick={onBack}>← Back to FIR Inbox</button><p className="sho-eyebrow">FIR review record</p><h1 id="fir-detail-title">{fir.firNumber}</h1><p className="sho-fir-detail-title">{fir.title}</p></div>
				<span className={`sho-inbox-status ${fir.inboxStatus.toLowerCase().replace(' ', '-')}`}>{fir.inboxStatus}</span>
			</header>

			<div className="sho-fir-detail-grid">
				<section className="sho-detail-panel" aria-labelledby="fir-information-title">
					<div className="sho-detail-panel-heading"><div><p className="sho-eyebrow">Record information</p><h2 id="fir-information-title">FIR details</h2></div></div>
					<dl className="sho-detail-fields">
						<div><dt>Date</dt><dd>{fir.date}</dd></div><div><dt>Police station</dt><dd>{fir.policeStation}</dd></div><div><dt>Complainant</dt><dd>{fir.complainant || 'Recorded in station file'}</dd></div><div><dt>Current case progress</dt><dd>{fir.progressStatus}</dd></div><div className="sho-detail-field-wide"><dt>Offence / title</dt><dd>{fir.title}</dd></div><div className="sho-detail-field-wide"><dt>Legal sections</dt><dd>{fir.sections}</dd></div>
					</dl>
					<div className="sho-summary-block"><h3>Summary / occurrence description</h3><p>{fir.summary || fir.directive || 'Occurrence description is available in the station record.'}</p></div>
				</section>

				<section className="sho-detail-panel sho-assignment-panel" aria-labelledby="assignment-title">
					<div className="sho-detail-panel-heading"><div><p className="sho-eyebrow">Station command</p><h2 id="assignment-title">Investigation Assignment</h2><span className="sho-team-count">{team.length} officer{team.length === 1 ? '' : 's'}</span></div><button type="button" className="sho-add-officer-button" onClick={() => setIsAddingOfficer(true)} disabled={isAddingOfficer || availableOfficers.length === 0}>+ Add Officer</button></div>
					{team.length > 0 ? (
						<div className="sho-team-list">
							{team.map((teamMember) => (
									<div className="sho-team-member" key={teamMember.officerId}>
									<div className="sho-team-member-copy"><span className="sho-team-role">{teamMember.assignmentRole}</span><strong>{officerOptions.find((officer) => officer.id === teamMember.officerId)?.name || teamMember.officerId}</strong><small>{teamMember.designation}</small></div>
										<button type="button" className="sho-remove-officer" onClick={() => openRemovalDialog(teamMember)}>Remove</button>
								</div>
							))}
						</div>
					) : <p className="sho-empty-team">No officers assigned. Add an officer to start the investigation team.</p>}
					{isAddingOfficer && (
						<form className="sho-assignment-form" onSubmit={handleSubmit}>
							<label>Officer<select value={officerId} onChange={(event) => setOfficerId(event.target.value)} required><option value="">Select officer</option>{availableOfficers.map((officer) => <option key={officer.id} value={officer.id}>{officer.name}</option>)}</select></label>
							<label>Designation<input type="text" value={selectedOfficer?.designation || ''} placeholder="Automatically populated" readOnly /></label>
							<label>Assignment Role<select value={assignmentRole} onChange={(event) => setAssignmentRole(event.target.value)}>{assignmentRoles.map((role) => <option key={role} value={role} disabled={role === 'Primary Investigating Officer' && !canAddPrimary}>{role}{role === 'Primary Investigating Officer' && !canAddPrimary ? ' (already assigned)' : ''}</option>)}</select></label>
							<div className="sho-assignment-actions"><button type="button" className="sho-cancel-button" onClick={() => setIsAddingOfficer(false)}>Cancel</button><button type="submit" className="sho-primary-button">Add to Team</button></div>
						</form>
					)}
				</section>
			</div>
			{memberToRemove && <RemovalConfirmationDialog member={memberToRemove} officer={officerOptions.find((officer) => officer.id === memberToRemove.officerId)} onCancel={closeRemovalDialog} onConfirm={confirmRemoval} />}
		</section>
	)
}

function RemovalConfirmationDialog({ member, officer, onCancel, onConfirm }) {
	const cancelButtonRef = useRef(null)
	const dialogRef = useRef(null)
	const isPrimary = member.assignmentRole === 'Primary Investigating Officer'

	useEffect(() => {
		cancelButtonRef.current?.focus()
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				event.preventDefault()
				onCancel()
				return
			}
			if (event.key !== 'Tab') return
			const focusable = dialogRef.current?.querySelectorAll('button:not([disabled])') || []
			if (focusable.length === 0) return
			const first = focusable[0]
			const last = focusable[focusable.length - 1]
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault()
				last.focus()
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault()
				first.focus()
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [onCancel])

	return (
		<div className="sho-team-modal-backdrop" role="presentation">
			<section className="sho-team-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="remove-officer-title">
				<p className="sho-eyebrow">Case action</p>
				<h2 id="remove-officer-title">{isPrimary ? 'Remove Primary Investigating Officer' : 'Remove Officer'}</h2>
				<p>Are you sure you want to remove</p>
				<div className="sho-team-modal-officer"><strong>{officer?.name || member.officerId}</strong><span>{officer?.designation || member.designation}</span><span>{member.assignmentRole}</span></div>
				<p>from this case{isPrimary ? ' as the Primary Investigating Officer' : ''}?</p>
				<p className="sho-team-modal-warning">{isPrimary ? 'The case will have no Primary Investigating Officer after this action.' : 'This officer will be removed from the current investigation team.'}</p>
				<div className="sho-team-modal-actions"><button type="button" className="sho-cancel-button" ref={cancelButtonRef} onClick={onCancel}>Cancel</button><button type="button" className="sho-danger-button" onClick={onConfirm}>Remove Officer</button></div>
			</section>
		</div>
	)
}
