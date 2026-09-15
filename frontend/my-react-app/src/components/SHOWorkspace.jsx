import React from 'react'

function Metric({ label, value, detail }) {
  return (
    <div className="sho-metric">
      <span className="sho-metric-value">{value}</span>
      <span className="sho-metric-label">{label}</span>
      {detail && <span className="sho-metric-detail">{detail}</span>}
    </div>
  )
}

function AttentionItem({ type, title, meta, action, onClick }) {
  const icon = type === 'fir' ? 'F' : type === 'review' ? 'R' : '!'

  return (
    <button type="button" className="sho-attention-item" onClick={onClick}>
      <span className={`sho-attention-icon sho-attention-${type}`}>{icon}</span>
      <span className="sho-attention-copy">
        <strong>{title}</strong>
        <span>{meta}</span>
      </span>
      <span className="sho-attention-action">{action} →</span>
    </button>
  )
}

function CaseRow({ caseItem, onSelect }) {
  return (
    <button type="button" className="sho-case-row" onClick={() => onSelect(caseItem)}>
      <span>
        <strong>{caseItem.firNumber}</strong>
        <small>{caseItem.title}</small>
      </span>
      <span className={`sho-status sho-status-${(caseItem.progressStatus || '').toLowerCase().replace(/\s+/g, '-')}`}>
        {caseItem.progressStatus || 'Open'}
      </span>
      <span className="sho-case-arrow">→</span>
    </button>
  )
}

function QuickAction({ title, description, icon, onClick, primary = false }) {
  return (
    <button type="button" className={`sho-action-card ${primary ? 'sho-action-primary' : ''}`} onClick={onClick}>
      <span className="sho-action-icon">{icon}</span>
      <span className="sho-action-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className="sho-action-arrow">→</span>
    </button>
  )
}

export default function SHOWorkspace({ cases = [], onSelectCase }) {
  const ownCases = cases.filter((item) => item.caseType === 'own')
  const activeCases = cases.filter((item) => ['Active', 'Under Investigation'].includes(item.progressStatus))
  const inCourt = cases.filter((item) => item.progressStatus === 'In Court')
  const priorityCases = cases.filter((item) => item.priority === 'Critical' || item.priority === 'Urgent')

  return (
    <section className="sho-workspace">
      <div className="sho-page-heading">
        <div>
          <p className="sho-eyebrow">STATION COMMAND</p>
          <h1>Good morning, Inspector.</h1>
          <p>Here’s the current picture of your station.</p>
        </div>
        <div className="sho-date">Today · Station overview</div>
      </div>

      <div className="sho-metrics">
        <Metric label="Active cases" value={activeCases.length} detail="Across this station" />
        <Metric label="FIRs to review" value={Math.min(3, cases.length)} detail="Require your attention" />
        <Metric label="Priority cases" value={priorityCases.length} detail="Critical / urgent" />
        <Metric label="In court" value={inCourt.length} detail="Current station cases" />
      </div>

      <div className="sho-command-grid">
        <section className="sho-panel sho-attention-panel">
          <div className="sho-panel-heading">
            <div>
              <p className="sho-section-kicker">ACTION QUEUE</p>
              <h2>Needs your attention</h2>
            </div>
            <button type="button" className="sho-text-button">View all →</button>
          </div>

          <div className="sho-attention-list">
            <AttentionItem
              type="fir"
              title="FIR awaiting review"
              meta="Newly registered case · review before proceeding"
              action="Review"
            />
            <AttentionItem
              type="review"
              title="Investigation requires review"
              meta={`${priorityCases[0]?.firNumber || 'Station case'} · priority investigation`}
              action="Review"
            />
            <AttentionItem
              type="alert"
              title="Investigation delayed"
              meta="A station investigation has not been updated recently"
              action="Open case"
            />
          </div>
        </section>

        <section className="sho-panel sho-actions-panel">
          <div className="sho-panel-heading">
            <div>
              <p className="sho-section-kicker">START WORK</p>
              <h2>Quick actions</h2>
            </div>
          </div>

          <div className="sho-actions">
            <QuickAction
              primary
              icon="＋"
              title="Register FIR"
              description="Record a new cognizable offence"
            />
            <QuickAction
              icon="□"
              title="Open Case"
              description="Open an existing case dossier"
            />
            <QuickAction
              icon="▣"
              title="Station Reports"
              description="View station and investigation reports"
            />
            <QuickAction
              icon="⌕"
              title="Search Records"
              description="Find FIRs, cases and evidence"
            />
          </div>

          <p className="sho-action-note">IO assignment belongs to the FIR / case-opening flow, so it appears there when required rather than as a separate dashboard task.</p>
        </section>
      </div>

      <div className="sho-cases-header">
        <div>
          <p className="sho-section-kicker">CASE WORKSPACE</p>
          <h2>Cases</h2>
        </div>
        <p>Keep your personal workload separate from the station-wide case list.</p>
      </div>

      <div className="sho-cases-grid">
        <section className="sho-panel sho-case-panel">
          <div className="sho-panel-heading">
            <div>
              <p className="sho-section-kicker">PERSONAL</p>
              <h2>My cases <span>{ownCases.length}</span></h2>
            </div>
            <button type="button" className="sho-text-button">View all →</button>
          </div>
          <div className="sho-case-list">
            {ownCases.slice(0, 5).map((item) => (
              <CaseRow key={item.id} caseItem={item} onSelect={onSelectCase} />
            ))}
            {!ownCases.length && <p className="sho-empty">No cases are currently assigned to you.</p>}
          </div>
        </section>

        <section className="sho-panel sho-case-panel">
          <div className="sho-panel-heading">
            <div>
              <p className="sho-section-kicker">STATION</p>
              <h2>Station cases <span>{cases.length}</span></h2>
            </div>
            <button type="button" className="sho-text-button">View all →</button>
          </div>
          <div className="sho-case-list">
            {cases.slice(0, 5).map((item) => (
              <CaseRow key={item.id} caseItem={item} onSelect={onSelectCase} />
            ))}
            {!cases.length && <p className="sho-empty">No station cases are available.</p>}
          </div>
        </section>
      </div>

      <section className="sho-panel sho-station-summary">
        <div className="sho-panel-heading">
          <div>
            <p className="sho-section-kicker">STATION SNAPSHOT</p>
            <h2>Investigation overview</h2>
          </div>
        </div>
        <div className="sho-overview-list">
          <div><span>Active / investigation</span><strong>{activeCases.length}</strong></div>
          <div><span>In court</span><strong>{inCourt.length}</strong></div>
          <div><span>Priority cases</span><strong>{priorityCases.length}</strong></div>
        </div>
      </section>
    </section>
  )
}
