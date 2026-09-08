import React from 'react'

/**
 * Official Digital Evidence Management System (DEMS) Logos
 */

export function DEMSBadge({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="dems-badge-svg">
      {/* Outer Shield */}
      <path
        d="M32 3L8 12V32C8 46.5 18.2 56.8 32 61C45.8 56.8 56 46.5 56 32V12L32 3Z"
        fill="#003366"
        stroke="#c5a059"
        strokeWidth="2.5"
      />
      {/* Inner Shield */}
      <path
        d="M32 7L12 14.5V31C12 43.5 20.5 52.5 32 56C43.5 52.5 52 43.5 52 31V14.5L32 7Z"
        fill="#005baa"
        stroke="#ffd700"
        strokeWidth="1.2"
      />
      {/* Key / Shield Motif */}
      <circle cx="32" cy="27" r="8" stroke="#ffffff" strokeWidth="2" fill="#002244" />
      <path d="M32 23V29M29 26H35" stroke="#ffd700" strokeWidth="2" />
      <path d="M25 36H39L41 45H23L25 36Z" fill="#c5a059" stroke="#ffffff" strokeWidth="1" />
      <text x="32" y="42.5" textAnchor="middle" fill="#002244" fontSize="4.5" fontWeight="bold">
        e-SAKSHYA
      </text>
    </svg>
  )
}

export function NationalEmblemMotif({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#002244" stroke="#c5a059" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="8" stroke="#ff9933" strokeWidth="1.5" />
      <path d="M20 12V28M12 20H28M14.5 14.5L25.5 25.5M14.5 25.5L25.5 14.5" stroke="#ff9933" strokeWidth="1" />
    </svg>
  )
}
