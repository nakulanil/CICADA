import React from 'react'

/**
 * Contact Us Section (Exact Figma Page 1 Frame 2)
 * Centered #B37D2E heading with official contact details
 */
export default function ContactSection() {
  return (
    <section id="contact-section" className="contact-extended-section">
      <div className="site-container">
        <div className="section-header-block">
          <h2 className="section-heading-ochre">CONTACT US</h2>
          <p className="section-lead-paragraph">
            For any issues, queries, or technical assistance with digital evidence management, please contact our official support desk:
          </p>
        </div>

        <div className="contact-details-list-block">
          <div className="contact-line-item">
            <strong>Ministry of Home Affairs:</strong> Digital Evidence Division, North Block, Central Secretariat, New Delhi - 110001
          </div>
          <div className="contact-line-item">
            <strong>Official Support:</strong> <a href="mailto:support.esakshya@gov.in">support.esakshya@gov.in</a> | <strong>Liaison:</strong> <a href="mailto:liaison.esakshya@gov.in">liaison.esakshya@gov.in</a>
          </div>
          <div className="contact-line-item">
            <strong>National Toll-Free:</strong> 1800-11-3367 (24×7 Operational Desk)
          </div>
          <div className="contact-line-item">
            <strong>Technical Support:</strong> Monday – Friday: 9:00 AM – 6:00 PM IST
          </div>
        </div>
      </div>
    </section>
  )
}
