import React from 'react'

/**
 * Floating 4-Feature Ribbon Card (Exact Figma Page 1 Frame 1)
 * White elevated card with blue icons and exact labels
 */
export default function FeatureRibbon({ copy }) {
  const features = [
    {
      id: 'coc',
      title: copy[0][0],
      desc: copy[0][1],
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0e3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="20" x2="22" y2="20"></line>
          <line x1="4" y1="20" x2="4" y2="10"></line>
          <line x1="8" y1="20" x2="8" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="16" y1="20" x2="16" y2="10"></line>
          <line x1="20" y1="20" x2="20" y2="10"></line>
          <path d="M12 2L2 9h20L12 2z"></path>
        </svg>
      ),
    },
    {
      id: 'logs',
      title: copy[1][0],
      desc: copy[1][1],
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0e3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <path d="M9 12l2 2 4-4"></path>
          <path d="M9 17h6"></path>
        </svg>
      ),
    },
    {
      id: 'tracking',
      title: copy[2][0],
      desc: copy[2][1],
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0e3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <path d="M11 8v6"></path>
          <path d="M8 11h6"></path>
        </svg>
      ),
    },
    {
      id: 'rbac',
      title: copy[3][0],
      desc: copy[3][1],
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0e3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
  ]

  return (
    <section className="feature-ribbon-wrapper">
      <div className="site-container">
        <div className="feature-ribbon-card">
          {features.map((f) => (
            <div key={f.id} className="feature-pillar-item">
              <div className="pillar-icon-box">{f.svgIcon}</div>
              <h3 className="pillar-title">{f.title}</h3>
              <p className="pillar-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
