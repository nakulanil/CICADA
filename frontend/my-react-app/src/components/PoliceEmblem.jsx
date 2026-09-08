import React from 'react'
import logoImage from '../assets/image-1.png'

/**
 * Official Indian Police Crest & Emblem Component
 * Features National Ashok Chakra motif, shield, and ribbon banner
 */
export default function PoliceEmblem({ size = 44 }) {
  return (
    <img
      width={size}
      height={size}
      src={logoImage}
      className="police-crest-svg"
      alt="CICADA logo"
    />
  )
}

