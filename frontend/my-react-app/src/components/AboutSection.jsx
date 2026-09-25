import React from 'react'

/**
 * About Us Section (Exact Figma Page 1 Frame 2)
 * - Gold / Ochre #B37D2E centered header
 * - Introductory paragraph
 * - Dual High-Contrast Navy #0E3366 cards: "Our Mission" & "Built for Trust"
 */
export default function AboutSection({ copy }) {
  return (
    <section id="about-section" className="about-extended-section">
      <div className="site-container">
        {/* Section Heading in Government Ochre Gold */}
        <div className="section-header-block">
          <h2 className="section-heading-ochre">{copy.title}</h2>
          <p className="section-lead-paragraph">
            {copy.lead}
          </p>
        </div>

        {/* Dual High-Contrast Navy Feature Cards */}
        <div className="dual-navy-cards-grid">
          {/* Card 1: Our Mission */}
          <div className="navy-feature-card">
            <h3 className="navy-card-title">{copy.missionTitle}</h3>
            <p className="navy-card-body">
              {copy.mission}
            </p>
          </div>

          {/* Card 2: Built for Trust */}
          <div className="navy-feature-card">
            <h3 className="navy-card-title">{copy.trustTitle}</h3>
            <p className="navy-card-body">
              {copy.trust}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
