import React from 'react'

/**
 * Contact Us Section (Exact Figma Page 1 Frame 2)
 * Centered #B37D2E heading with official contact details
 */
export default function ContactSection({ copy }) {
  return (
    <section id="contact-section" className="contact-extended-section">
      <div className="site-container">
        <div className="section-header-block">
          <h2 className="section-heading-ochre">{copy.title}</h2>
          <p className="section-lead-paragraph">
            {copy.lead}
          </p>
        </div>

        <div className="contact-details-list-block">
          <div className="contact-line-item">
            <strong>{copy.email}</strong> <a href="mailto:esakshya.co@gmail.com">esakshya.co@gmail.com</a>
          </div>
          <div className="contact-line-item">
            <strong>{copy.project}</strong> {copy.projectValue}
          </div>
          <div className="contact-line-item">
            <strong>{copy.prototype}</strong> {copy.prototypeValue}
          </div>
        </div>
      </div>
    </section>
  )
}
