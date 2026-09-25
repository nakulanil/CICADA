import React from 'react'

/**
 * Ochre Advisory Strip (Exact Figma Page 1 Frame 1)
 * Background #B37D2E / #A76D24 with centered white guidance text
 */
export default function AdvisoryBar({ copy }) {
  return (
    <div className="ochre-advisory-strip">
      <div className="site-container advisory-flex-row">
        <p className="advisory-text-center">
          {copy}
        </p>
      </div>
    </div>
  )
}
