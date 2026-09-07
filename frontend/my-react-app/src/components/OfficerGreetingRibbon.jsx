import React from 'react'

/**
 * Officer Greeting Sub-Header Ribbon (Figma Page 1 Frame 5)
 * Slate Blue #17375E banner: "Welcome! [Officer Name]", designation, and profile trigger
 */
export default function OfficerGreetingRibbon({
  currentUser,
  greeting,
  onOpenProfile,
  onLogout,
}) {
  return (
    <section className="officer-greeting-ribbon-strip">
      <div className="dash-full-container ribbon-flex-wrapper">
        {/* Left: Avatar, Welcome Headline & Designation */}
        <div className="ribbon-officer-left">
          <button
            type="button"
            className="btn-animated ribbon-avatar-box"
            onClick={onOpenProfile}
            title="Click to view & edit your profile"
          >
            {currentUser?.name
              ? currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              : 'OF'}
          </button>

          <div className="ribbon-details-text">
            <div className="ribbon-headline-row">
              <h1 className="ribbon-welcome-title">
                Welcome! <span className="officer-highlight-name">{currentUser?.name || 'Jane Doe'}</span>
              </h1>
            </div>

            <div className="ribbon-sub-designation">
              <span className="role-text">{currentUser?.roleName || 'Investigating Officer'}</span>
              <span className="cadre-sep">•</span>
              <span className="cadre-text">{currentUser?.cadre || 'Primary IO'}</span>
              {currentUser?.pno && (
                <>
                  <span className="cadre-sep">•</span>
                  <span className="pno-badge-tag">ID: {currentUser.pno}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Dynamic Time Greeting & Date Tag */}
        <div className="ribbon-meta-right">
          <div className="ribbon-time-greeting">
            <span className="greeting-pre">Hello, </span>
            <strong className="greeting-highlight">{greeting}!</strong>
          </div>
          <div className="ribbon-date-tag">
            📅{' '}
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

