import React from 'react'

/**
 * Universal Government Footer (Figma Page 1 Specification)
 */
export default function Footer() {
  return (
    <footer className="gov-official-footer">
      <div className="site-container footer-flex-container">
        <div className="footer-left-meta">
          <strong>e-SAKSHYA</strong>
          <span className="footer-agency-sub">
            Ministry of Home Affairs • Government of India
          </span>
        </div>

        <div className="footer-right-compliance">
          <span>Compliant with Section 65B Indian Evidence Act & Bharatiya Sakshya Adhiniyam (BSA) 2023</span>
          <span className="footer-dot-sep">•</span>
          <span>© {new Date().getFullYear()} National Informatics Centre & Ministry of Home Affairs. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

