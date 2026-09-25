import React from 'react'

/**
 * Universal Government Footer (Figma Page 1 Specification)
 */
const DEFAULT_FOOTER_COPY = {
  agency: 'Ministry of Home Affairs • Government of India',
  compliance: 'Compliant with Section 65B Indian Evidence Act & Bharatiya Sakshya Adhiniyam (BSA) 2023',
  rights: 'National Informatics Centre & Ministry of Home Affairs. All rights reserved.',
}

export default function Footer({ copy }) {
  const footerCopy = copy ?? DEFAULT_FOOTER_COPY

  return (
    <footer className="gov-official-footer">
      <div className="site-container footer-flex-container">
        <div className="footer-left-meta">
          <strong>e-SAKSHYA</strong>
          <span className="footer-agency-sub">
            {footerCopy.agency}
          </span>
        </div>

        <div className="footer-right-compliance">
          <span>{footerCopy.compliance}</span>
          <span className="footer-dot-sep">•</span>
          <span>© {new Date().getFullYear()} {footerCopy.rights}</span>
        </div>
      </div>
    </footer>
  )
}

