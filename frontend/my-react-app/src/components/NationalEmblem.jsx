import React from 'react'
import logoImage from '../assets/image-1.png'

/**
 * National Emblem of India Vector Component
 * Matches Figma Page 1 Emblem specification
 */
export default function NationalEmblem({ size = 38 }) {
  return (
    <img
      width={size}
      height={size}
      src={logoImage}
      className="national-emblem-svg"
      alt="CICADA logo"
    />
  )
}
