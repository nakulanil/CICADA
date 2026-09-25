import React from 'react'

/**
 * "What we do" Section (Exact Figma Page 1 Frame 2)
 * Left-aligned #0E3366 heading with structured bullet points
 */
export default function WhatWeDoSection({ copy }) {

  return (
    <section className="what-we-do-section">
      <div className="site-container">
        <div className="what-we-do-header">
          <h2 className="section-heading-navy">{copy.title}</h2>
          <p className="what-we-do-lead">
            {copy.lead}
          </p>
        </div>

        <ul className="what-we-do-bullets-list">
          {copy.bullets.map((text, idx) => (
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
