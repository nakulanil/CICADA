import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const navigationItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
	{ id: 'fir-inbox', label: 'FIR Inbox', icon: 'inbox' },
	{ id: 'my-cases', label: 'My Cases', icon: 'folder' },
	{ id: 'station-cases', label: 'Station Cases', icon: 'building' },
	{ id: 'search', label: 'Search', icon: 'search' },
]

function NavigationIcon({ name }) {
	const paths = {
		dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
		inbox: <><path d="M4 5h16v13H4z" /><path d="M4 13h4l2 3h4l2-3h4" /></>,
		folder: <><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" /><path d="M3 9h18" /></>,
		building: <><path d="M4 21V5l8-2 8 2v16" /><path d="M8 8h1M15 8h1M8 12h1M15 12h1M8 16h1M15 16h1M11 21v-4h2v4" /></>,
		search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
		profile: <><circle cx="12" cy="8" r="3" /><path d="M5 20c.8-3.2 3.1-5 7-5s6.2 1.8 7 5" /></>,
		logout: <><path d="M14 5h5v14h-5" /><path d="M3 12h10M9 8l4 4-4 4" /></>,
	}

	return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

export default function SHOSidebar({ currentUser, onOpenProfile }) {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const activeSection = pathname === '/dashboard'
		? 'dashboard'
		: pathname.startsWith('/dashboard/fir-inbox')
			? 'fir-inbox'
			: pathname.startsWith('/dashboard/my-cases')
				? 'my-cases'
				: pathname.startsWith('/dashboard/station-cases')
					? 'station-cases'
					: pathname.startsWith('/dashboard/search') ? 'search' : 'dashboard'
	const sectionPaths = {
		dashboard: '/dashboard',
		'fir-inbox': '/dashboard/fir-inbox',
		'my-cases': '/dashboard/my-cases',
		'station-cases': '/dashboard/station-cases',
		search: '/dashboard/search',
	}

	return (
		<aside className="sho-sidebar" aria-label="SHO workspace navigation">
			<nav className="sho-sidebar-nav">
				<p className="sho-nav-label">STATION WORKSPACE</p>
				{navigationItems.map((item) => (
					<button
						type="button"
						key={item.id}
						className={`sho-nav-item ${activeSection === item.id ? 'is-active' : ''}`}
						onClick={() => navigate(sectionPaths[item.id])}
						aria-current={activeSection === item.id ? 'page' : undefined}
					>
						<span className="sho-nav-icon"><NavigationIcon name={item.icon} /></span>
						<span>{item.label}</span>
					</button>
				))}
			</nav>

			<div className="sho-sidebar-account">
				<p className="sho-account-label">ACCOUNT</p>
				<div className="sho-account-actions" aria-label="Account actions">
					<button type="button" className="sho-account-action" onClick={onOpenProfile}>
						<span className="sho-account-icon" aria-hidden="true"><NavigationIcon name="profile" /></span>
						<span>My Profile</span>
					</button>
					<button type="button" className="sho-account-action sho-account-logout" onClick={() => window.dispatchEvent(new Event('sho:logout'))}>
						<span className="sho-account-icon" aria-hidden="true"><NavigationIcon name="logout" /></span>
						<span>Logout</span>
					</button>
				</div>
			</div>
		</aside>
	)
}
