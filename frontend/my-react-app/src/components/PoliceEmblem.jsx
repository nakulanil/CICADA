import React from 'react'

/**
 * Official Indian Police Crest & Emblem Component
 * Features National Ashok Chakra motif, shield, and ribbon banner
 */
export default function PoliceEmblem({ size = 44, color = '#ffffff' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="police-crest-svg"
      aria-label="Official Police Crest"
    >
      {/* Outer Shield */}
      <path
        d="M32 3L8 12V32C8 46.5 18.2 56.8 32 61C45.8 56.8 56 46.5 56 32V12L32 3Z"
        fill="#0b2545"
        stroke="#c5a059"
        strokeWidth="2.5"
      />
      {/* Inner Ring */}
      <path
        d="M32 7L12 14.5V31C12 43.5 20.5 52.5 32 56C43.5 52.5 52 43.5 52 31V14.5L32 7Z"
        fill="#13315c"
        stroke="#c5a059"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      {/* Ashok Chakra Motif */}
      <circle cx="32" cy="28" r="10" stroke="#f1c40f" strokeWidth="2" fill="#0b2545" />
      <circle cx="32" cy="28" r="3" fill="#f1c40f" />
      <path d="M32 18V38M22 28H42M25 21L39 35M25 35L39 21" stroke="#f1c40f" strokeWidth="1.2" />
      {/* Gold Ribbon / Scroll Base */}
      <path
        d="M16 46C21 44 26 43 32 43C38 43 43 44 48 46L50 51C44 48.5 38 47.5 32 47.5C26 47.5 20 48.5 14 51L16 46Z"
        fill="#c5a059"
      />
      {/* Official Text Stamp */}
      <text
        x="32"
        y="50.5"
        textAnchor="middle"
        fill="#0b2545"
        fontSize="4.2"
        fontWeight="bold"
        letterSpacing="0.4"
      >
        POLICE
      </text>
    </svg>
  )
}

