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
  return (
    <button type="button" className="sho-attention-item" onClick={onClick}>
      <span className={`sho-attention-icon sho-attention-${type}`}>{type === 'fir' ? 'F' : type === 'assignment' ? 'A' : type === 'review' ? 'R' : '!'}</span>
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
        {caseItem.progressStatus}
      </span>
      <span className="sho-case-arrow">→</span>
    </button>
  )
}

export default function SHOWorkspace({ cases = [], onSelectCase }) {
  const ownCases = cases.filter((item) => item.caseType === 'own')
  const activeCases = cases.filter((item) => ['Active', 'Under Investigation'].includes(item.progressStatus))
  const inCourt = cases.filter((item) => item.progressStatus === 'In Court')
  const attentionCases = cases.filter((item) => item.priority === 'Critical' || item.priority === 'Urgent')

  return (
    <section className="sho-workspace">
      <div className="sho-page-heading">
        <div>
          <p className="sho-eyebrow">STATION COMMAND</p>
          <h1>Good morning, Inspector.</h1>
          <p>Here’s what needs your attention at the station.</p>
        </div>
        <div className="sho-date">Today · Station overview</div>
      </div>

      <div className="sho-metrics">
        <Metric label="Active cases" value={activeCases.length} detail="Across this station" />
        <Metric label="FIRs to review" value={Math.min(3, cases.length)} detail="Require your attention" />
        <Metric label="IO assignments" value={Math.min(2, cases.length)} detail="Awaiting assignment" />
        <Metric label="Priority cases" value={attentionCases.length} detail="Critical / urgent" />
      </div>

      <div className="sho-primary-grid">
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
              meta="Newly registered case · review before assignment"
              action="Review"
            />
            <AttentionItem
              type="assignment"
              title="Case awaiting IO assignment"
              meta="Assignment required from station command"
              action="Assign IO"
            />
            <AttentionItem
              type="review"
              title="Investigation requires review"
              meta={`${attentionCases[0]?.firNumber || 'Station case'} · priority investigation`}
              action="Review"
            />
          </div>
        </section>

        <section className="sho-panel sho-actions-panel">
          <div className="sho-panel-heading">
            <div>
              <p className="sho-section-kicker">SHORTCUTS</p>
              <h2>Quick actions</h2>
            </div>
          </div>
          <div className="sho-actions">
            <button type="button" onClick={() => alert('FIR review workflow will be connected here.')}>Review FIRs <span>→</span></button>
            <button type="button" onClick={() => alert('IO assignment workflow will be connected here.')}>Assign IO <span>→</span></button>
            <button type="button" onClick={() => alert('Case creation workflow will be connected here.')}>Register FIR <span>→</span></button>
            <button type="button" onClick={() => alert('Station reports will be connected here.')}>Station reports <span>→</span></button>
          </div>
        </section>
      </div>

      <div className="sho-secondary-grid">
        <section className="sho-panel">
          <div className="sho-panel-heading">
            <div>
              <p className="sho-section-kicker">PERSONAL</p>
              <h2>My cases</h2>
            </div>
            <button type="button" className="sho-text-button">View all →</button>
          </div>
          <div className="sho-case-list">
            {ownCases.slice(0, 4).map((item) => (
              <CaseRow key={item.id} caseItem={item} onSelect={onSelectCase} />
            ))}
            {!ownCases.length && <p className="sho-empty">No cases are currently assigned to you.</p>}
          </div>
        </section>

        <section className="sho-panel">
          <div className="sho-panel-heading">
            <div>
              <p className="sho-section-kicker">STATION</p>
              <h2>Investigation overview</h2>
            </div>
            <button type="button" className="sho-text-button">View all →</button>
          </div>
          <div className="sho-overview-list">
            <div><span>Active / investigation</span><strong>{activeCases.length}</strong></div>
            <div><span>In court</span><strong>{inCourt.length}</strong></div>
            <div><span>Priority cases</span><strong>{attentionCases.length}</strong></div>
          </div>
          <div className="sho-overview-note">Use the investigation view for case-level supervision instead of displaying every case here.</div>
        </section>
      </div>
    </section>
  )
}
