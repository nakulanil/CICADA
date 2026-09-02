import React from 'react'

/**
 * Clean Early 2010s Official Footer
 */
export default function CDACFooter() {
  return (
    <footer className="gov-main-footer">
      <div className="site-container footer-content">
        <div className="footer-left">
          <strong>Digital Evidence Management System (DEMS)</strong>
          <span className="footer-sub">Official Portal for Police, Forensics, Prosecution, and Judiciary</span>
        </div>
        <div className="footer-right">
          <span>Compliant with Section 65B IEA & BSA 2023</span>
          <span className="footer-divider">•</span>
          <span>© {new Date().getFullYear()} Government of India. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
