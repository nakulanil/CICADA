import React from 'react'

/**
 * "What we do" Section (Exact Figma Page 1 Frame 2)
 * Left-aligned #0E3366 heading with structured bullet points
 */
export default function WhatWeDoSection() {
  const bulletPoints = [
    'Maintain a complete, tamper-evident audit trail for every piece of evidence.',
    'Enable seamless collaboration between police stations, forensic labs, medical departments, and prosecution offices.',
    'Support comprehensive custody lifecycle tracking, ensuring original records are never altered.',
    'Deliver verified digital certificates and files to the judiciary, making evidence admissible in a court of law.',
  ]

  return (
    <section className="what-we-do-section">
      <div className="site-container">
        <div className="what-we-do-header">
          <h2 className="section-heading-navy">What we do</h2>
          <p className="what-we-do-lead">
            Across the country, e-SAKSHYA provides a common platform to manage and track digital evidence:
          </p>
        </div>

        <ul className="what-we-do-bullets-list">
          {bulletPoints.map((text, idx) => (
            <li key={idx} className="bullet-point-row">
              <span className="bullet-dash-mark">•</span>
              <span className="bullet-text">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
