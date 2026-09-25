import React, { useEffect } from 'react'
import NationalEmblem from '../NationalEmblem'

function NotificationIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
		</svg>
	)
}

export default function SHOTopbar({ currentUser, onOpenProfile, onLogout }) {
	const officerName = currentUser?.name || 'Rajesh Kumar Sharma'
	const officerRole = currentUser?.roleName || 'Station House Officer (SHO) / Inspector'

	useEffect(() => {
		const handleShellLogout = () => onLogout()
		window.addEventListener('sho:logout', handleShellLogout)
		return () => window.removeEventListener('sho:logout', handleShellLogout)
	}, [onLogout])

	return (
		<header className="sho-topbar">
			<div className="sho-topbar-brand" aria-label="e-SAKSHYA Ministry of Home Affairs">
				<NationalEmblem size={68} />
				<div className="sho-brand-copy">
					<span className="sho-brand-primary">e-SAKSHYA</span>
					<span className="sho-brand-secondary">MINISTRY OF HOME AFFAIRS</span>
				</div>
			</div>

			<div className="sho-topbar-actions">
				<button type="button" className="sho-icon-button" title="Notifications" aria-label="Notifications">
					<NotificationIcon />
					<span className="sho-notification-dot" aria-hidden="true" />
				</button>

				<button type="button" className="sho-user-summary" onClick={onOpenProfile}>
					<span className="sho-user-summary-copy">
						<span className="sho-user-summary-name">{officerName}</span>
						<span className="sho-user-summary-role">{officerRole}</span>
					</span>
				</button>
			</div>
		</header>
	)
}
