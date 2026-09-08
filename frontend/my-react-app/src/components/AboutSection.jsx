import React from 'react'

/**
 * About Us Section (Exact Figma Page 1 Frame 2)
 * - Gold / Ochre #B37D2E centered header
 * - Introductory paragraph
 * - Dual High-Contrast Navy #0E3366 cards: "Our Mission" & "Built for Trust"
 */
export default function AboutSection() {
  return (
    <section id="about-section" className="about-extended-section">
      <div className="site-container">
        {/* Section Heading in Government Ochre Gold */}
        <div className="section-header-block">
          <h2 className="section-heading-ochre">ABOUT US</h2>
          <p className="section-lead-paragraph">
            e-SAKSHYA serves as a secure, tamper-evident digital repository for law enforcement, forensics, prosecution, and courts to share, collaborate, authenticate, and manage digital and physical evidence.
          </p>
        </div>

        {/* Dual High-Contrast Navy Feature Cards */}
        <div className="dual-navy-cards-grid">
          {/* Card 1: Our Mission */}
          <div className="navy-feature-card">
            <h3 className="navy-card-title">Our Mission</h3>
            <p className="navy-card-body">
              Empower police investigating officers, forensic examiners, prosecutors, and judges with a unified, tamper-evident digital custody ecosystem that accelerates case disposal, eliminates evidence tampering, and upholds constitutional due process.
            </p>
          </div>

          {/* Card 2: Built for Trust */}
          <div className="navy-feature-card">
            <h3 className="navy-card-title">Built for Trust</h3>
            <p className="navy-card-body">
              Engineered with zero-trust role-based access, SHA-256 bit-stream integrity verification, automated digital seal certificates, and permanent tamper-proof ledger logging compliant with statutory evidence admissibility standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
